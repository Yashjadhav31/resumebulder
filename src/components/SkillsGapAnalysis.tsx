import { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle, BookOpen, Loader2 } from 'lucide-react';


interface SkillsGapAnalysisProps {
  resumeId: string;
  jobId: string | null;
}

export function SkillsGapAnalysis({ resumeId, jobId }: SkillsGapAnalysisProps) {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<{
    matchingSkills: string[];
    missingSkills: string[];
    jobTitle: string;
    company: string;
  } | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchAnalysis();
    } else {
      setLoading(false);
      setAnalysisData(null);
    }
  }, [jobId, resumeId]);

  const fetchAnalysis = async () => {
    if (!jobId) return;

    try {
      setLoading(true);

      // Fetch analysis from backend API
      const [analysisRes, jobsRes] = await Promise.all([
        fetch(`/api/analysis/${resumeId}/${jobId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }),
        fetch(`/api/jobs/recommendations/${resumeId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
      ]);

      if (!analysisRes.ok) throw new Error('Analysis request failed');

      const analysisJson = await analysisRes.json();

      // Try to get job title/company from the jobs endpoint if available
      let jobTitle = '';
      let company = '';
      if (jobsRes.ok) {
        const jobsJson = await jobsRes.json();
        const match = Array.isArray(jobsJson) ? jobsJson.find((j: any) => String(j._id) === String(jobId)) : null;
        if (match) {
          jobTitle = match.title || '';
          company = match.company || '';
        }
      }

      setAnalysisData({
        matchingSkills: analysisJson.matchingSkills || analysisJson.matching_skills || [],
        missingSkills: analysisJson.missingSkills || analysisJson.missing_skills || [],
        jobTitle,
        company,
      });
    } catch (error) {
      console.error('Error fetching skills gap analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!jobId) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
        <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Job to Analyze</h3>
        <p className="text-gray-600">
          Click on any job recommendation above to see a detailed skills gap analysis
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Analyzing skills gap...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }

  const completionPercentage = analysisData.matchingSkills.length + analysisData.missingSkills.length > 0
    ? Math.round((analysisData.matchingSkills.length / (analysisData.matchingSkills.length + analysisData.missingSkills.length)) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Skills Gap Analysis</h2>
        <p className="text-blue-100">
          {analysisData.jobTitle} at {analysisData.company}
        </p>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Skills Readiness</span>
            <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You have {analysisData.matchingSkills.length} out of {analysisData.matchingSkills.length + analysisData.missingSkills.length} required skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Your Strengths ({analysisData.matchingSkills.length})
              </h3>
            </div>

            {analysisData.matchingSkills.length > 0 ? (
              <div className="space-y-2">
                {analysisData.matchingSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200 transform transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No matching skills found</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Skills to Develop ({analysisData.missingSkills.length})
              </h3>
            </div>

            {analysisData.missingSkills.length > 0 ? (
              <div className="space-y-2">
                {analysisData.missingSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{skill}</span>
                    </div>
                    <button
                      onClick={() => window.open(`https://www.google.com/search?q=learn+${encodeURIComponent(skill)}+tutorial`, '_blank')}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">Learn</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">You have all required skills!</p>
              </div>
            )}
          </div>
        </div>

        {analysisData.missingSkills.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Recommended Learning Path
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                <div>
                  <p className="font-medium text-gray-900">Start with fundamentals</p>
                  <p className="text-sm text-gray-600">Focus on {analysisData.missingSkills[0]} first as it's commonly required</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                <div>
                  <p className="font-medium text-gray-900">Build practical projects</p>
                  <p className="text-sm text-gray-600">Apply your learning through hands-on experience</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                <div>
                  <p className="font-medium text-gray-900">Update your resume</p>
                  <p className="text-sm text-gray-600">Add newly acquired skills to improve your match score</p>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
