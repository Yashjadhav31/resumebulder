import express from 'express';
import { User } from '../Models/User.js';
import { Resume } from '../Models/Resume.js';
import { Job } from '../Models/Job.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MLService } from '../Services/mlService.js';
import { PythonMLService } from '../Services/pythonMLService.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/i;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// Auth middleware
const auth = async (req: any, res: any, next: any) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Register
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

// Verify token
router.get('/auth/verify', auth, async (req: any, res) => {
  try {
    res.json({ 
      success: true, 
      user: { 
        id: req.user._id, 
        email: req.user.email, 
        name: req.user.name 
      } 
    });
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error();
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Upload Resume (accepts multipart/form-data: file + text)
router.post('/resume/upload', auth, upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const file = req.file;
    const text = req.body?.text || req.body?.resumeText || '';
    
    // Create file URL (relative to server)
    const fileUrl = `/uploads/${file.filename}`;

    // Try Python ML service first, fallback to Node.js service
    let analysis;
    try {
      const isMLServiceHealthy = await PythonMLService.checkHealth();
      if (isMLServiceHealthy) {
        const mlAnalysis = await PythonMLService.analyzeResume(text);
        analysis = {
          skills: mlAnalysis.skills.all_skills,
          experience: mlAnalysis.experience,
          keywords: mlAnalysis.skills.all_skills.slice(0, 20)
        };
        console.log('🤖 ML Analysis - Skills found:', mlAnalysis.skills.all_skills.length, 'skills');
      } else {
        throw new Error('Python ML service not available');
      }
    } catch (error) {
      console.log('Using fallback Node.js ML service:', error instanceof Error ? error.message : String(error));
      analysis = await MLService.analyzeResume(text);
      console.log('🔧 Fallback Analysis - Skills found:', analysis.skills.length, 'skills:', analysis.skills.slice(0, 10));
    }
    
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: file.originalname,
      fileUrl: fileUrl,
      raw_text: text,
      skills: analysis.skills,
      experience: analysis.experience,
      analysisResults: {
        missingSkills: [],
        recommendations: [],
        keywords: analysis.keywords
      }
    });

    // Immediately analyze the resume and calculate initial scores
    let initialAnalysis = null;
    try {
      const isMLServiceHealthy = await PythonMLService.checkHealth();
      if (isMLServiceHealthy) {
        const mlAnalysis = await PythonMLService.analyzeResume(text);
        initialAnalysis = {
          skillsCount: mlAnalysis.skills.all_skills.length,
          experienceYears: mlAnalysis.experience.years_of_experience,
          structureScore: mlAnalysis.structure_score,
          suggestions: mlAnalysis.suggestions.slice(0, 3) // Top 3 suggestions
        };
      }
    } catch (error) {
      console.log('Initial analysis failed, will be done later:', error instanceof Error ? error.message : String(error));
    }

    res.status(201).json({ 
      resumeId: resume._id, 
      resume,
      initialAnalysis,
      message: 'Resume uploaded and analyzed successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Upload failed' 
    });
  }
});

// Get comprehensive resume analysis and overview
router.get('/resume/analysis/:resumeId', auth, async (req: any, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) throw new Error('Resume not found');

    if (!resume.raw_text) {
      throw new Error('Resume text not found');
    }
    
    // Get comprehensive analysis
    let comprehensiveAnalysis;
    try {
      const isMLServiceHealthy = await PythonMLService.checkHealth();
      if (isMLServiceHealthy) {
        const mlAnalysis = await PythonMLService.analyzeResume(resume.raw_text);
        comprehensiveAnalysis = {
          skills: mlAnalysis.skills.all_skills,
          skillsByCategory: mlAnalysis.skills.skills_by_category,
          experience: mlAnalysis.experience,
          structureScore: mlAnalysis.structure_score,
          suggestions: mlAnalysis.suggestions,
          wordCount: mlAnalysis.word_count || resume.raw_text.split(' ').length,
          characterCount: mlAnalysis.character_count || resume.raw_text.length
        };
      } else {
        throw new Error('Python ML service not available');
      }
    } catch (error) {
      console.log('Using fallback analysis:', error instanceof Error ? error.message : String(error));
      const fallbackAnalysis = await MLService.analyzeResume(resume.raw_text);
      comprehensiveAnalysis = {
        skills: fallbackAnalysis.skills,
        skillsByCategory: { technical: [], soft: [] },
        experience: fallbackAnalysis.experience,
        structureScore: 75,
        suggestions: ['Improve technical skills section', 'Add more quantifiable achievements'],
        wordCount: resume.raw_text.split(' ').length,
        characterCount: resume.raw_text.length
      };
    }

    // Get job recommendations for context
    const jobDocs = await Job.find({ status: 'active' }).lean();
    const jobs = jobDocs.map(job => ({
      ...job,
      _id: job._id.toString()
    }));
    const jobRecommendations = await MLService.matchJobsWithResume(resume.raw_text, jobs);
    const topJobs = jobRecommendations.slice(0, 5);

    // Calculate overall resume score
    const skillsScore = Math.min((comprehensiveAnalysis.skills.length / 15) * 100, 100);
    const experienceScore = Math.min((comprehensiveAnalysis.experience.years_of_experience || 0) * 20, 100);
    const structureScore = comprehensiveAnalysis.structureScore;
    const lengthScore = comprehensiveAnalysis.wordCount >= 200 && comprehensiveAnalysis.wordCount <= 800 ? 100 : 70;
    
    const overallScore = Math.round((skillsScore * 0.3 + experienceScore * 0.25 + structureScore * 0.25 + lengthScore * 0.2));

    // Generate comprehensive review
    const review = {
      overallScore,
      scoreBreakdown: {
        skills: Math.round(skillsScore),
        experience: Math.round(experienceScore),
        structure: Math.round(structureScore),
        length: Math.round(lengthScore)
      },
      strengths: [] as string[],
      weaknesses: [] as string[],
      recommendations: [] as string[],
      careerLevel: comprehensiveAnalysis.experience.years_of_experience >= 5 ? 'Senior' : 
                   comprehensiveAnalysis.experience.years_of_experience >= 2 ? 'Mid-level' : 'Entry-level'
    };

    // Determine strengths
    if (skillsScore >= 80) review.strengths.push('Strong technical skill set');
    if (experienceScore >= 80) review.strengths.push('Extensive professional experience');
    if (structureScore >= 80) review.strengths.push('Well-structured resume format');
    if (comprehensiveAnalysis.skills.length >= 10) review.strengths.push('Diverse skill portfolio');

    // Determine weaknesses and recommendations
    if (skillsScore < 60) {
      review.weaknesses.push('Limited technical skills mentioned');
      review.recommendations.push('Add more relevant technical skills and certifications');
    }
    if (experienceScore < 60) {
      review.weaknesses.push('Limited professional experience');
      review.recommendations.push('Highlight internships, projects, and volunteer work');
    }
    if (structureScore < 70) {
      review.weaknesses.push('Resume structure needs improvement');
      review.recommendations.push('Use clear section headers and consistent formatting');
    }
    if (comprehensiveAnalysis.wordCount < 200) {
      review.weaknesses.push('Resume content is too brief');
      review.recommendations.push('Add more details about your achievements and responsibilities');
    }

    // Add ML-based suggestions
    if (comprehensiveAnalysis.suggestions) {
      review.recommendations.push(...comprehensiveAnalysis.suggestions.slice(0, 3));
    }

    res.json({
      success: true,
      resume: {
        fileName: resume.fileName,
        uploadDate: resume.createdAt,
        wordCount: comprehensiveAnalysis.wordCount,
        characterCount: comprehensiveAnalysis.characterCount
      },
      analysis: comprehensiveAnalysis,
      review,
      jobMatching: {
        totalJobsAnalyzed: jobs.length,
        topRecommendations: topJobs.map(job => ({
          title: job.title,
          company: job.company,
          matchScore: job.matchScore,
          matchingSkills: job.matchingSkills.slice(0, 5),
          missingSkills: job.missingSkills.slice(0, 3)
        })),
        averageMatchScore: Math.round(topJobs.reduce((sum, job) => sum + job.matchScore, 0) / Math.max(topJobs.length, 1))
      },
      atsCompatibility: {
        score: resume.atsScore || Math.round(overallScore * 0.9),
        feedback: review.recommendations.slice(0, 3)
      }
    });
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    res.status(404).json({ 
      success: false, 
      message: 'Analysis failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get Job Recommendations - FIXED
router.get('/jobs/recommendations/:resumeId', auth, async (req: any, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) throw new Error('Resume not found');

    // Use .lean() to get plain JavaScript objects instead of Mongoose documents
    const jobDocs = await Job.find({ status: 'active' }).lean().exec();
    
    // Convert ObjectId to string for compatibility
    const jobs = jobDocs.map(job => ({
      ...job,
      _id: job._id.toString(),
      requiredSkills: job.requiredSkills || [],
      preferredSkills: job.preferredSkills || []
    }));
    
    // Use ML service to match jobs with resume
    if (!resume.raw_text) {
      throw new Error('Resume text not found');
    }
    
    // Try Python ML service first, fallback to Node.js service
    let recommendations;
    try {
      const isMLServiceHealthy = await PythonMLService.checkHealth();
      if (isMLServiceHealthy) {
        const mlRecommendations = await PythonMLService.recommendJobs(resume.raw_text);
        recommendations = mlRecommendations.map(rec => ({
          ...rec,
          _id: rec.job_id,
          atsScore: rec.ats_score,
          matchScore: rec.match_percentage,
          matchingSkills: rec.matching_skills,
          missingSkills: rec.missing_skills
        }));
      } else {
        throw new Error('Python ML service not available');
      }
    } catch (error) {
      console.log('Using fallback Node.js ML service:', error instanceof Error ? error.message : String(error));
      recommendations = await MLService.matchJobsWithResume(resume.raw_text, jobs);
      console.log('📊 Job matching results:', {
        totalJobs: jobs.length,
        recommendationsCount: recommendations.length,
        topMatches: recommendations.slice(0, 3).map(r => ({ title: r.title, matchScore: r.matchScore }))
      });
    }
    
    // Update resume with latest analysis
    await Resume.findByIdAndUpdate(resume._id, {
      $set: {
        atsScore: Math.max(...recommendations.map(r => r.atsScore)),
        analysisResults: {
          missingSkills: [...new Set(recommendations.flatMap(r => r.missingSkills))],
          recommendations: recommendations.slice(0, 5).map(r => r.title),
          keywords: resume.analysisResults?.keywords || []
        }
      }
    });

    const processedRecommendations = recommendations.map(job => ({
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      matchScore: job.matchScore,
      matchingSkills: job.matchingSkills,
      missingSkills: job.missingSkills,
      atsScore: job.atsScore || 0,
      description: job.description
    })).sort((a, b) => b.matchScore - a.matchScore);

    // Apply stricter filtering - only show jobs with meaningful skill matches
    const filteredRecommendations = processedRecommendations.filter(job => {
      // Must have at least 25% match score OR at least 2 matching skills
      const hasGoodMatch = job.matchScore >= 25;
      const hasSkillMatch = job.matchingSkills && job.matchingSkills.length >= 2;
      const hasOneStrongSkill = job.matchingSkills && job.matchingSkills.length >= 1 && job.matchScore >= 15;
      
      return hasGoodMatch || hasSkillMatch || hasOneStrongSkill;
    });

    // Sort by match score and limit results
    filteredRecommendations.sort((a, b) => b.matchScore - a.matchScore);
    
    // If no good matches, show only the very best matches with lower threshold
    const finalRecommendations = filteredRecommendations.length > 0 
      ? filteredRecommendations.slice(0, 15)
      : processedRecommendations
          .filter(job => job.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 5);

    console.log('🎯 Final recommendations:', {
      filtered: filteredRecommendations.length,
      returned: finalRecommendations.length,
      avgMatch: Math.round(finalRecommendations.reduce((sum, job) => sum + job.matchScore, 0) / Math.max(finalRecommendations.length, 1))
    });

    res.json(finalRecommendations);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Failed to fetch recommendations' 
    });
  }
});

// Get Skills Gap Analysis
router.get('/analysis/:resumeId/:jobId', auth, async (req: any, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    const job = await Job.findById(req.params.jobId);

    if (!resume || !job) throw new Error('Resume or job not found');

    // Try Python ML service first, fallback to basic analysis
    try {
      const isMLServiceHealthy = await PythonMLService.checkHealth();
      if (isMLServiceHealthy && resume.raw_text) {
        const mlAnalysis = await PythonMLService.analyzeSkillsGap(resume.raw_text, req.params.jobId);
        res.json({
          matchScore: mlAnalysis.required_skills_analysis.match_percentage,
          atsScore: mlAnalysis.ats_score,
          matchingSkills: mlAnalysis.required_skills_analysis.matching,
          missingSkills: mlAnalysis.required_skills_analysis.missing,
          preferredSkillsMatch: mlAnalysis.preferred_skills_analysis.match_percentage,
          recommendations: mlAnalysis.recommendations,
          jobTitle: mlAnalysis.job_title,
          company: mlAnalysis.company
        });
        return;
      }
    } catch (error) {
      console.log('Using fallback skills gap analysis:', error instanceof Error ? error.message : String(error));
    }

    // Fallback to basic analysis
    const matchingSkills = job.requiredSkills.filter(skill => 
      resume.skills.includes(skill)
    );
    const missingSkills = job.requiredSkills.filter(skill => 
      !resume.skills.includes(skill)
    );
    const matchScore = (matchingSkills.length / job.requiredSkills.length) * 100;

    res.json({
      matchScore,
      matchingSkills,
      missingSkills,
      recommendations: [
        'Consider taking online courses to learn missing skills',
        'Update your resume to highlight relevant experience',
        'Include specific examples of using matching skills'
      ]
    });
  } catch (error) {
    res.status(400).json({ message: 'Analysis failed' });
  }
});

// Get all jobs (for testing)
router.get('/jobs', async (_req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).limit(10);
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch jobs' });
  }
});

// Get jobs by skills
router.get('/jobs/by-skills', async (req, res) => {
  try {
    const { skills, limit = 50 } = req.query;
    
    if (!skills) {
      return res.status(400).json({ 
        success: false, 
        error: 'Skills parameter is required' 
      });
    }

    const skillsArray = (skills as string).split(',').map(s => s.trim().toLowerCase());
    
    // Find jobs that match any of the skills
    const jobs = await Job.find({
      status: 'active',
      $or: [
        { requiredSkills: { $in: skillsArray.map(skill => new RegExp(skill, 'i')) } },
        { preferredSkills: { $in: skillsArray.map(skill => new RegExp(skill, 'i')) } },
        { description: { $in: skillsArray.map(skill => new RegExp(skill, 'i')) } }
      ]
    })
    .limit(parseInt(limit as string))
    .lean();

    // Calculate skill match scores for each job
    const processedJobs = jobs.map(job => {
      const jobRequiredSkills = job.requiredSkills.map(s => s.toLowerCase());
      const jobPreferredSkills = job.preferredSkills?.map(s => s.toLowerCase()) || [];
      const allJobSkills = [...jobRequiredSkills, ...jobPreferredSkills];
      
      const matchingSkills = skillsArray.filter(skill => 
        allJobSkills.some(jobSkill => 
          jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );
      
      const skillMatchPercentage = Math.round((matchingSkills.length / Math.max(skillsArray.length, 1)) * 100);
      
      return {
        ...job,
        _id: job._id.toString(),
        skillMatch: {
          percentage: skillMatchPercentage,
          matchingSkills: matchingSkills,
          totalUserSkills: skillsArray.length,
          totalJobSkills: allJobSkills.length
        }
      };
    });

    // Sort by skill match percentage
    processedJobs.sort((a, b) => b.skillMatch.percentage - a.skillMatch.percentage);

    return res.json({
      success: true,
      searchSkills: skillsArray,
      totalJobs: processedJobs.length,
      jobs: processedJobs
    });
  } catch (error) {
    console.error('Skill-based job search error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get jobs by location
router.get('/jobs/by-location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 20 } = req.query;
    
    // Find jobs that match the location (case-insensitive, partial match)
    const jobs = await Job.find({
      status: 'active',
      $or: [
        { location: { $regex: location, $options: 'i' } },
        { location: { $regex: 'remote', $options: 'i' } } // Include remote jobs
      ]
    })
    .limit(parseInt(limit as string))
    .lean();

    // Convert ObjectId to string and add location matching info
    const processedJobs = jobs.map(job => ({
      ...job,
      _id: job._id.toString(),
      locationMatch: {
        searchTerm: location,
        isRemote: job.location.toLowerCase().includes('remote'),
        isLocal: job.location.toLowerCase().includes(location.toLowerCase())
      }
    }));

    return res.json({
      success: true,
      location: location,
      totalJobs: processedJobs.length,
      jobs: processedJobs
    });
  } catch (error) {
    console.error('Location-based job search error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Debug endpoint to check system status
router.get('/debug/status', async (_req, res) => {
  try {
    const jobCount = await Job.countDocuments();
    const resumeCount = await Resume.countDocuments();
    const userCount = await User.countDocuments();
    
    return res.json({
      success: true,
      status: {
        jobs: jobCount,
        resumes: resumeCount,
        users: userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Debug endpoint to test skill extraction with sample text
router.post('/debug/test-skills', async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }
    
    // Test both ML services
    let mlResults = null;
    let fallbackResults = null;
    
    try {
      const isMLServiceHealthy = await PythonMLService.checkHealth();
      if (isMLServiceHealthy) {
        const mlAnalysis = await PythonMLService.analyzeResume(resumeText);
        mlResults = {
          skills: mlAnalysis.skills.all_skills,
          skillsCount: mlAnalysis.skills.all_skills.length,
          experience: mlAnalysis.experience.years_of_experience,
          structureScore: mlAnalysis.structure_score
        };
      }
    } catch (error) {
      console.log('ML service failed:', error instanceof Error ? error.message : String(error));
    }
    
    // Always test fallback
    const fallbackAnalysis = await MLService.analyzeResume(resumeText);
    fallbackResults = {
      skills: fallbackAnalysis.skills,
      skillsCount: fallbackAnalysis.skills.length,
      keywords: fallbackAnalysis.keywords
    };
    
    return res.json({
      success: true,
      resumeLength: resumeText.length,
      mlService: mlResults,
      fallbackService: fallbackResults,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get ATS Score
router.get('/ats-score/:resumeId', auth, async (req: any, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) throw new Error('Resume not found');

    // Try Python ML service first, fallback to basic scoring
    let atsData;
    try {
      const isMLServiceHealthy = await PythonMLService.checkHealth();
      if (isMLServiceHealthy && resume.raw_text) {
        const mlAnalysis = await PythonMLService.analyzeResume(resume.raw_text);
        
        // Calculate detailed scores based on ML analysis
        const keywordScore = Math.min((mlAnalysis.skills.all_skills.length / 10) * 100, 100);
        const structureScore = mlAnalysis.structure_score;
        const experienceScore = Math.min((mlAnalysis.experience.years_of_experience / 5) * 100, 100);
        const educationScore = resume.raw_text.toLowerCase().includes('education') || resume.raw_text.toLowerCase().includes('degree') ? 85 : 60;
        
        const overallScore = (keywordScore * 0.3 + structureScore * 0.3 + experienceScore * 0.2 + educationScore * 0.2);
        
        // Generate detailed suggestions based on analysis
        const suggestions = mlAnalysis.suggestions.map((suggestion, index) => ({
          category: index === 0 ? 'Keywords' : index === 1 ? 'Structure' : index === 2 ? 'Experience' : 'Content',
          issue: suggestion,
          recommendation: `Improve ${suggestion.toLowerCase()}`,
          priority: overallScore < 60 ? 'high' : overallScore < 80 ? 'medium' : 'low'
        }));

        atsData = {
          overall_score: Math.round(overallScore),
          keyword_score: Math.round(keywordScore),
          formatting_score: Math.round(structureScore),
          experience_score: Math.round(experienceScore),
          education_score: Math.round(educationScore),
          suggestions: suggestions
        };
      } else {
        throw new Error('Python ML service not available');
      }
    } catch (error) {
      console.log('Using fallback ATS scoring:', error instanceof Error ? error.message : String(error));
      
      // Fallback scoring logic
      const resumeText = resume.raw_text || '';
      
      // Basic scoring based on resume content
      const keywordScore = Math.min((resume.skills?.length || 0) * 10, 100);
      const structureScore = resumeText.includes('experience') && resumeText.includes('education') ? 85 : 65;
      const experienceScore = resumeText.toLowerCase().includes('years') ? 80 : 60;
      const educationScore = resumeText.toLowerCase().includes('degree') || resumeText.toLowerCase().includes('university') ? 85 : 60;
      
      const overallScore = (keywordScore * 0.3 + structureScore * 0.3 + experienceScore * 0.2 + educationScore * 0.2);
      
      // Generate basic suggestions
      const suggestions = [
        {
          category: 'Keywords',
          issue: 'Limited industry-specific keywords detected',
          recommendation: 'Include more relevant technical skills and industry buzzwords',
          priority: 'high' as const
        },
        {
          category: 'Structure',
          issue: 'Resume structure could be improved',
          recommendation: 'Use clear section headers and consistent formatting',
          priority: 'medium' as const
        },
        {
          category: 'Experience',
          issue: 'Quantifiable achievements not emphasized',
          recommendation: 'Include specific numbers, percentages, and measurable results',
          priority: 'medium' as const
        }
      ];

      atsData = {
        overall_score: Math.round(overallScore),
        keyword_score: Math.round(keywordScore),
        formatting_score: Math.round(structureScore),
        experience_score: Math.round(experienceScore),
        education_score: Math.round(educationScore),
        suggestions: suggestions
      };
    }

    return res.json(atsData);
  } catch (error) {
    console.error('ATS Score error:', error);
    return res.status(400).json({ message: 'Failed to calculate ATS score' });
  }
});

export default router;