import natural from 'natural';
import nlp from 'compromise';
import { LocationService } from './locationService.js';
// Removed keyword-extractor due to API issues, using natural library instead

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  preferredSkills?: string[];
  salaryRange?: {
    min?: number | null;
    max?: number | null;
    currency: string;
  } | null;
  jobType: string;
  status: string;
}

const tokenizer = new natural.WordTokenizer();

// Simple keyword extraction function using natural library
function extractKeywords(text: string, options?: any): string[] {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
  
  if (!tokens) return [];
  
  const keywords = tokens
    .filter(token => token && token.length > 2 && !stopWords.has(token))
    .filter(token => !/^\d+$/.test(token)); // Remove pure numbers if remove_digits is true
  
  // Remove duplicates if specified
  const uniqueKeywords = options?.remove_duplicates ? [...new Set(keywords)] : keywords;
  
  return uniqueKeywords;
}

interface SkillSet {
  technical: string[];
  soft: string[];
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  requiredSkills: string[];
  description: string;
}

// Comprehensive skills database with variations
const commonSkills: SkillSet = {
  technical: [
    // Programming Languages
    'javascript', 'js', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin', 
    'go', 'rust', 'scala', 'r', 'matlab', 'perl', 'typescript', 'dart',
    
    // Web Technologies
    'react', 'reactjs', 'angular', 'vue', 'vue.js', 'svelte', 'node.js', 'nodejs', 
    'express', 'fastapi', 'django', 'flask', 'spring', 'laravel', 'html', 'css', 
    'sass', 'scss', 'bootstrap', 'tailwind', 'jquery', 'webpack', 'vite',
    
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 
    'cassandra', 'elasticsearch', 'dynamodb', 'firebase',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 
    'terraform', 'ansible', 'chef', 'puppet', 'gitlab', 'github', 'git',
    'ci/cd', 'devops', 'linux', 'unix', 'bash', 'shell scripting',
    
    // Mobile Development
    'flutter', 'react native', 'ios', 'android', 'xamarin', 'ionic',
    
    // Data Science & AI
    'machine learning', 'ml', 'ai', 'artificial intelligence', 'data science', 
    'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 
    'jupyter', 'tableau', 'power bi', 'spark', 'hadoop', 'nlp', 'computer vision',
    
    // Other Technologies
    'blockchain', 'cryptocurrency', 'api', 'rest', 'graphql', 'microservices',
    'agile', 'scrum', 'testing', 'unit testing', 'automation', 'cybersecurity'
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'time management',
    'project management', 'critical thinking', 'creativity', 'collaboration',
    'adaptability', 'organization', 'analytical', 'presentation', 'negotiation',
    'mentoring', 'coaching', 'strategic planning', 'decision making', 'innovation',
    'customer service', 'sales', 'marketing', 'research', 'writing', 'documentation'
  ]
};

export class MLService {
  private static calculateATSScore(resumeText: string, jobDescription: string): number {
    const resumeTokens = new Set(tokenizer.tokenize(resumeText.toLowerCase()));
    const jobTokens = new Set(tokenizer.tokenize(jobDescription.toLowerCase()));
    
    // Calculate matching keywords
    const matchingKeywords = [...resumeTokens].filter(token => jobTokens.has(token));
    
    // Calculate base keyword match score
    const keywordMatchScore = jobTokens.size > 0 ? (matchingKeywords.length / jobTokens.size) * 60 : 0;
    
    // Add bonus points for resume structure and content
    let bonusPoints = 0;
    
    // Check for common resume sections
    if (resumeText.toLowerCase().includes('experience') || resumeText.toLowerCase().includes('work')) bonusPoints += 10;
    if (resumeText.toLowerCase().includes('education') || resumeText.toLowerCase().includes('degree')) bonusPoints += 8;
    if (resumeText.toLowerCase().includes('skills') || resumeText.toLowerCase().includes('technical')) bonusPoints += 8;
    if (resumeText.toLowerCase().includes('project') || resumeText.toLowerCase().includes('portfolio')) bonusPoints += 6;
    
    // Check for contact information
    if (resumeText.includes('@') || resumeText.toLowerCase().includes('email')) bonusPoints += 4;
    if (resumeText.toLowerCase().includes('phone') || /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resumeText)) bonusPoints += 4;
    
    const totalScore = Math.min(Math.round(keywordMatchScore + bonusPoints), 100);
    return Math.max(totalScore, 45); // Minimum score of 45
  }

  private static extractSkills(text: string): string[] {
    const skills = new Set<string>();
    const textLower = text.toLowerCase();
    
    // Enhanced skill detection with context awareness
    [...commonSkills.technical, ...commonSkills.soft].forEach(skill => {
      const skillLower = skill.toLowerCase();
      
      // Look for exact matches and variations with word boundaries
      const skillPattern = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (skillPattern.test(textLower)) {
        skills.add(skill);
      }
      
      // Handle special cases and variations
      if (skill === 'javascript' && (textLower.includes('js ') || textLower.includes(' js') || textLower.includes('js,'))) {
        skills.add('JavaScript');
      }
      if (skill === 'node.js' && (textLower.includes('nodejs') || textLower.includes('node js'))) {
        skills.add('Node.js');
      }
      if (skill === 'react' && (textLower.includes('reactjs') || textLower.includes('react.js'))) {
        skills.add('React');
      }
      if (skill === 'vue' && (textLower.includes('vuejs') || textLower.includes('vue.js'))) {
        skills.add('Vue');
      }
    });

    // Extract skills with experience context (e.g., "3 years of Python")
    const experiencePatterns = [
      /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience\s*(?:in|with)\s*)?([a-zA-Z\s.#+-]+)/gi,
      /(?:experienced|proficient|skilled)\s*(?:in|with)\s*([a-zA-Z\s.#+-]+)/gi,
      /(?:using|worked\s*with|knowledge\s*of)\s*([a-zA-Z\s.#+-]+)/gi
    ];

    experiencePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const technology = match[match.length - 1].trim().toLowerCase();
        // Check if it's a known skill
        const knownSkill = [...commonSkills.technical, ...commonSkills.soft].find(skill => 
          skill.toLowerCase() === technology || technology.includes(skill.toLowerCase())
        );
        if (knownSkill) {
          skills.add(knownSkill);
        }
      }
    });

    // Filter out common words that aren't skills
    const excludeWords = new Set(['experience', 'years', 'work', 'worked', 'using', 'with', 'and', 'the', 'for', 'in', 'on', 'at', 'to', 'from', 'as', 'by', 'is', 'was', 'are', 'were', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must']);
    
    const finalSkills = Array.from(skills).filter(skill => 
      skill.length > 1 && 
      !excludeWords.has(skill.toLowerCase()) &&
      !/^\d+$/.test(skill) // Remove pure numbers
    );

    console.log('🔍 Extracted skills from resume:', finalSkills);
    return finalSkills;
  }

  private static extractExperience(text: string) {
    const doc = nlp(text);
    // Use simpler date extraction
    const dateMatches = text.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})\b/gi) || [];
    const organizations = doc.match('#Organization+').text();
    const titles = doc.match('#Title+').text();

    return {
      dates: dateMatches,
      organizations: organizations.split(' '),
      titles: titles.split(' ').filter(t => t.length > 2)
    };
  }

  static async analyzeResume(resumeText: string): Promise<{
    skills: string[];
    experience: any;
    keywords: string[];
  }> {
    const skills = this.extractSkills(resumeText);
    const experience = this.extractExperience(resumeText);
    const keywords = extractKeywords(resumeText, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true
    });

    return {
      skills,
      experience,
      keywords: keywords.slice(0, 20) // Top 20 keywords
    };
  }

  static async matchJobsWithResume(resumeText: string, jobs: Job[]): Promise<any[]> {
    const resumeAnalysis = await this.analyzeResume(resumeText);
    const resumeSkills = new Set(resumeAnalysis.skills.map(s => s.toLowerCase()));
    
    // Extract location from resume using fuzzy logic
    const resumeLocation = LocationService.extractLocationFromResume(resumeText);
    console.log('📍 Resume location detected:', resumeLocation);
    
    // Extract additional context from resume
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const resumeWordSet = new Set(resumeWords);

    return jobs.map(job => {
      const requiredSkills = new Set(job.requiredSkills.map(s => s.toLowerCase()));
      const matchingSkills = [...requiredSkills].filter((skill: string) => resumeSkills.has(skill));
      const missingSkills = [...requiredSkills].filter((skill: string) => !resumeSkills.has(skill));
      
      // Enhanced matching algorithm
      let matchScore = 0;
      
      // 1. Enhanced Skills matching with stricter requirements (70% weight)
      const skillMatchRatio = requiredSkills.size > 0 ? matchingSkills.length / requiredSkills.size : 0;
      
      // Initialize preferred skills variables outside the conditional
      const preferredSkills = new Set((job.preferredSkills || []).map((s: string) => s.toLowerCase()));
      const matchingPreferredSkills = [...preferredSkills].filter((skill: string) => resumeSkills.has(skill));
      let preferredBonus = 0;
      
      // Apply stricter skill matching - require at least 30% skill match for consideration
      if (skillMatchRatio < 0.3 && matchingSkills.length < 2) {
        matchScore = 0; // Skip jobs with very low skill match
      } else {
        // Calculate preferred skills bonus
        preferredBonus = preferredSkills.size > 0 ? (matchingPreferredSkills.length / preferredSkills.size) * 8 : 0;
        
        // Skill relevance scoring (check for partial matches and synonyms)
        let skillRelevanceScore = 0;
        const resumeSkillsArray = Array.from(resumeSkills);
        const jobSkillsArray = Array.from(requiredSkills);
        
        // Check for partial matches and related skills
        for (const resumeSkill of resumeSkillsArray) {
          for (const jobSkill of jobSkillsArray) {
            if (resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill)) {
              skillRelevanceScore += 0.4; // Partial match bonus
            }
            // Check for common technology stacks
            if (this.areRelatedSkills(resumeSkill, jobSkill)) {
              skillRelevanceScore += 0.3; // Related skills bonus
            }
          }
        }
        
        // Calculate core skill match score (higher weight for exact matches)
        const exactMatchBonus = matchingSkills.length > 0 ? (matchingSkills.length * 5) : 0;
        matchScore = (skillMatchRatio * 60) + preferredBonus + Math.min(skillRelevanceScore, 8) + Math.min(exactMatchBonus, 12);
      }
      
      // Debug logging for skill matching
      if (matchingSkills.length > 0 || matchingPreferredSkills.length > 0) {
        console.log(`🎯 ${job.title}: ${matchingSkills.length}/${requiredSkills.size} required + ${matchingPreferredSkills.length}/${preferredSkills.size} preferred (${Math.round(skillMatchRatio * 100)}% + ${Math.round(preferredBonus)}% bonus)`);
      }
      
      // 2. Contextual keyword matching (25% weight)
      const jobWords = job.description.toLowerCase().split(/\s+/);
      const contextMatches = jobWords.filter(word => 
        word.length > 3 && 
        resumeWordSet.has(word)
      ).length;
      const contextScore = Math.min((contextMatches / jobWords.length) * 100, 25);
      matchScore += contextScore;
      
      // 3. Title and role matching (10% weight)
      const jobTitleWords = job.title.toLowerCase().split(/\s+/);
      const titleMatches = jobTitleWords.filter(word => 
        word.length > 3 && resumeWordSet.has(word)
      ).length;
      const titleScore = jobTitleWords.length > 0 ? (titleMatches / jobTitleWords.length) * 10 : 0;
      matchScore += titleScore;
      
      // 4. Location-based matching with fuzzy logic (15% weight)
      const locationMatch = LocationService.calculateLocationMatch(resumeLocation, job.location);
      const locationBonus = LocationService.getLocationBonus(locationMatch);
      matchScore += locationBonus;
      
      // Log location matching for debugging
      if (locationMatch.similarity > 0.3) {
        console.log(`🌍 ${job.title} at ${job.location}: ${Math.round(locationMatch.similarity * 100)}% location match (${locationMatch.distance})`);
      }
      
      // Calculate ATS score for this specific job
      const atsScore = this.calculateATSScore(resumeText, job.description);
      
      // Add bonus for high ATS compatibility
      if (atsScore > 80) matchScore += 5;
      else if (atsScore > 60) matchScore += 2;

      return {
        ...job,
        atsScore,
        matchScore: Math.min(Math.round(matchScore), 100),
        matchingSkills,
        missingSkills,
        contextMatches: contextMatches,
        titleMatches: titleMatches,
        locationMatch: {
          similarity: Math.round(locationMatch.similarity * 100),
          distance: locationMatch.distance,
          bonus: locationBonus
        },
        resumeLocation: resumeLocation.fullLocation || 'Not specified'
      };
    }).sort((a, b) => {
      // Sort by match score first, then by ATS score
      if (Math.abs(a.matchScore - b.matchScore) < 5) {
        return b.atsScore - a.atsScore;
      }
      return b.matchScore - a.matchScore;
    });
  }

  // Helper method to check if skills are related
  private static areRelatedSkills(skill1: string, skill2: string): boolean {
    const skillGroups = {
      frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'scss', 'tailwind'],
      backend: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net'],
      database: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ionic', 'xamarin'],
      languages: ['javascript', 'python', 'java', 'c#', 'c++', 'go', 'rust', 'php', 'ruby'],
      devops: ['docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions', 'terraform', 'ansible'],
      testing: ['jest', 'mocha', 'cypress', 'selenium', 'junit', 'pytest', 'testing']
    };

    // Check if both skills belong to the same group
    for (const group of Object.values(skillGroups)) {
      const hasSkill1 = group.some(s => skill1.includes(s) || s.includes(skill1));
      const hasSkill2 = group.some(s => skill2.includes(s) || s.includes(skill2));
      if (hasSkill1 && hasSkill2) {
        return true;
      }
    }

    return false;
  }
}