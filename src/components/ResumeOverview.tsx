import { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Star,
  BarChart3,
  Clock,
  Loader2
} from 'lucide-react';

interface ResumeOverviewProps {
  resumeId: string;
}

interface AnalysisData {
  success: boolean;
  resume: {
    fileName: string;
    uploadDate: string;
    wordCount: number;
    characterCount: number;
  };
  analysis: {
    skills: string[];
    skillsByCategory: Record<string, string[]>;
    experience: {
      years_of_experience: number;
      companies: string[];
      job_titles: string[];
    };
    structureScore: number;
    suggestions: string[];
  };
  review: {
    overallScore: number;
    scoreBreakdown: {
      skills: number;
      experience: number;
      structure: number;
      length: number;
    };
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    careerLevel: string;
  };
  jobMatching: {
    totalJobsAnalyzed: number;
    topRecommendations: Array<{
      title: string;
      company: string;
      matchScore: number;
      matchingSkills: string[];
      missingSkills: string[];
    }>;
    averageMatchScore: number;
  };
  atsCompatibility: {
    score: number;
    feedback: string[];
  };
}

export function ResumeOverview({ resumeId }: ResumeOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (resumeId) {
      fetchAnalysis();
    }
  }, [resumeId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/resume/analysis/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const analysisData = await response.json();
      setData(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-indigo-500';
    if (score >= 40) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'Failed to load analysis'}</p>
          <button 
            onClick={fetchAnalysis}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resume Analysis Overview</h1>
            <p className="text-blue-100 mb-4">{data.resume.fileName}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Uploaded: {new Date(data.resume.uploadDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                {data.resume.wordCount} words
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {data.review.careerLevel} Level
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${getScoreColor(data.review.overallScore)}`}>
              <Star className="w-6 h-6 mr-2" />
              {data.review.overallScore}/100
            </div>
            <p className="text-blue-100 mt-2">Overall Score</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            Score Breakdown
          </h2>
          
          <div className="space-y-4">
            {Object.entries(data.review.scoreBreakdown).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{category}</span>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${getScoreGradient(score)} h-3 rounded-full transition-all duration-1000`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATS Compatibility */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-green-600" />
            ATS Compatibility
          </h2>
          
          <div className="text-center mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-xl font-bold ${getScoreColor(data.atsCompatibility.score)}`}>
              {data.atsCompatibility.score}%
            </div>
            <p className="text-gray-600 mt-2">ATS Pass Rate</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Key Improvements:</h3>
            {data.atsCompatibility.feedback.map((feedback, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feedback}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
            Strengths ({data.review.strengths.length})
          </h2>
          
          <div className="space-y-3">
            {data.review.strengths.map((strength, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-800">{strength}</span>
              </div>
            ))}
            {data.review.strengths.length === 0 && (
              <p className="text-gray-500 italic">No major strengths identified. Focus on the recommendations below.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
            Areas for Improvement ({data.review.weaknesses.length})
          </h2>
          
          <div className="space-y-3">
            {data.review.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-orange-800">{weakness}</span>
              </div>
            ))}
            {data.review.weaknesses.length === 0 && (
              <p className="text-gray-500 italic">Great! No major weaknesses identified.</p>
            )}
          </div>
        </div>
      </div>

      {/* Job Matching Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-purple-600" />
          Job Market Analysis
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{data.jobMatching.totalJobsAnalyzed}</div>
            <div className="text-sm text-purple-800">Jobs Analyzed</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{data.jobMatching.averageMatchScore}%</div>
            <div className="text-sm text-blue-800">Average Match</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{data.jobMatching.topRecommendations.length}</div>
            <div className="text-sm text-green-800">Top Matches</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Best Job Matches:</h3>
          {data.jobMatching.topRecommendations.map((job, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(job.matchScore)}`}>
                  {job.matchScore}% Match
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Your Matching Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.matchingSkills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700 mb-1">Skills to Learn:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.missingSkills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
          AI-Powered Recommendations
        </h2>
        
        <div className="space-y-4">
          {data.review.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <span className="text-indigo-800">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
