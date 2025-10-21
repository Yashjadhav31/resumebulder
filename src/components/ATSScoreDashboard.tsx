import { useState, useEffect } from 'react';
import { Award, FileText, Layout, Briefcase, GraduationCap, AlertTriangle, CheckCircle, Loader2, TrendingUp } from 'lucide-react';

import { ATSScore } from '../types';

interface ATSScoreDashboardProps {
  resumeId: string;
  jobId: string | null;
}

export function ATSScoreDashboard({ resumeId, jobId }: ATSScoreDashboardProps) {
  const [calculating, setCalculating] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);

  useEffect(() => {
    if (resumeId) {
      calculateScore();
    }
  }, [resumeId, jobId]);

  const calculateScore = async () => {
    try {
      setCalculating(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/ats-score/${resumeId}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
      if (!res.ok) throw new Error('Failed to fetch ATS score');
      const json = await res.json();

      // backend returns { score, feedback }
      const overall = typeof json.score === 'number' ? json.score : (json.overall_score || 0);
      const suggestions = json.feedback || json.suggestions || [];

      setAtsScore({
        _id: '' as any,
        resume_id: '' as any,
        job_posting_id: undefined,
        overall_score: overall,
        keyword_score: json.keyword_score || 0,
        formatting_score: json.formatting_score || 0,
        experience_score: json.experience_score || 0,
        education_score: json.education_score || 0,
        suggestions: suggestions,
        created_at: new Date(),
      });
    } catch (error) {
      console.error('Error calculating ATS score:', error);
    } finally {
      setCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-indigo-500';
    if (score >= 40) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (calculating) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Calculating ATS Score</h3>
            <p className="text-gray-600">Analyzing your resume against industry standards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!atsScore) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 text-center">
        <Award className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">ATS Score Analysis</h3>
        <p className="text-gray-600 mb-4">
          Get detailed insights about your resume's ATS compatibility
        </p>
        <button 
          onClick={calculateScore}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
        >
          Calculate ATS Score
        </button>
      </div>
    );
  }

  const scoreMetrics = [
    { label: 'Keywords', score: atsScore.keyword_score, icon: FileText, color: 'blue' },
    { label: 'Formatting', score: atsScore.formatting_score, icon: Layout, color: 'indigo' },
    { label: 'Experience', score: atsScore.experience_score, icon: Briefcase, color: 'green' },
    { label: 'Education', score: atsScore.education_score, icon: GraduationCap, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">ATS Score Analysis</h2>
              <p className="text-blue-100">
                {jobId ? 'Tailored score for selected job' : 'General resume assessment'}
              </p>
            </div>
            <Award className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(atsScore.overall_score / 100) * 502.4} 502.4`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`${getScoreBackground(atsScore.overall_score)}`} />
                    <stop offset="100%" className={`${getScoreBackground(atsScore.overall_score)}`} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(atsScore.overall_score)}`}>
                    {Math.round(atsScore.overall_score)}
                  </div>
                  <div className="text-gray-600 font-medium mt-1">ATS Score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {scoreMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 transform transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                    <span className={`text-xl font-bold ${getScoreColor(metric.score)}`}>
                      {Math.round(metric.score)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${getScoreBackground(metric.score)} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {atsScore.overall_score >= 80 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Excellent Resume!</h3>
                <p className="text-green-800">
                  Your resume is well-optimized for ATS systems. It should pass most automated screenings successfully.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start space-x-4">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Room for Improvement</h3>
                <p className="text-blue-800">
                  Your resume has potential! Review the suggestions below to optimize it for ATS systems.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {atsScore.suggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
            <h3 className="text-xl font-bold flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Improvement Suggestions ({atsScore.suggestions.length})
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {atsScore.suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                        suggestion.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <h4 className="font-bold text-gray-900">{suggestion.category}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(suggestion.priority)}`}>
                      {suggestion.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="ml-11 space-y-2">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        <span className="font-medium">Issue:</span> {suggestion.issue}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        <span className="font-medium">Recommendation:</span> {suggestion.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
