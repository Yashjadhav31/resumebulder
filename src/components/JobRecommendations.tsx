import { useState, useEffect } from 'react';
import { MapPin, DollarSign, TrendingUp, Loader2, ExternalLink, Target, Filter, Search } from 'lucide-react';

interface JobRecommendation {
  _id: string;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  salaryRange?: { min: number; max: number; currency: string };
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  description?: string;
  url?: string;
  platform?: string;
  locationMatch?: {
    similarity: number;
    distance: 'local' | 'regional' | 'national' | 'international' | 'remote';
    bonus: number;
  };
  resumeLocation?: string;
}

interface JobRecommendationsProps {
  resumeId: string;
  onJobSelect: (jobId: string) => void;
}

export function JobRecommendations({ resumeId, onJobSelect }: JobRecommendationsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<JobRecommendation[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!resumeId) return;
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`/api/jobs/recommendations/${resumeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch recommendations');
      }

      const data = await res.json();
      setRecommendations(data || []);
      setFilteredRecommendations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Filter recommendations based on skill and match score
  useEffect(() => {
    let filtered = recommendations;

    if (skillFilter.trim()) {
      filtered = filtered.filter(job => 
        job.matchingSkills.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        ) ||
        job.title.toLowerCase().includes(skillFilter.toLowerCase()) ||
        job.company.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }

    if (minMatchScore > 0) {
      filtered = filtered.filter(job => job.matchScore >= minMatchScore);
    }

    setFilteredRecommendations(filtered);
  }, [recommendations, skillFilter, minMatchScore]);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    onJobSelect(jobId);
  };

  const getMatchColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-blue-600 bg-blue-100';
    if (score >= 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getLocationBadgeColor = (distance: string) => {
    switch (distance) {
      case 'local': return 'bg-green-100 text-green-700';
      case 'remote': return 'bg-purple-100 text-purple-700';
      case 'regional': return 'bg-blue-100 text-blue-700';
      case 'national': return 'bg-orange-100 text-orange-700';
      case 'international': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (error) return (
    <div className="text-center p-8">
      <p className="text-red-600">{error}</p>
      <button onClick={fetchRecommendations} className="mt-4 text-blue-600">Try again</button>
    </div>
  );

  if (recommendations.length === 0) return (
    <div className="text-center p-8">
      <p className="text-gray-600">No job recommendations found.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Job Recommendations</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Skills/Company
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  placeholder="e.g., React, JavaScript, Google"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Match Score
              </label>
              <select
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>All Jobs</option>
                <option value={30}>30%+ Match</option>
                <option value={50}>50%+ Match</option>
                <option value={70}>70%+ Match</option>
                <option value={90}>90%+ Match</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredRecommendations.length}</span> of {recommendations.length} jobs
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {filteredRecommendations.map((job) => (
          <div
            key={job._id}
            className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer ${selectedJobId === job._id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleJobClick(job._id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                  {job.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                      {job.locationMatch && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getLocationBadgeColor(job.locationMatch.distance)}`}>
                          {job.locationMatch.distance === 'remote' ? '🏠 Remote' :
                           job.locationMatch.distance === 'local' ? '📍 Local' :
                           job.locationMatch.distance === 'regional' ? '🌍 Regional' :
                           job.locationMatch.distance === 'national' ? '🌎 National' : '✈️ International'}
                        </span>
                      )}
                    </div>
                  )}
                  {job.salaryRange && <div className="flex items-center"><DollarSign className="w-4 h-4 mr-1" />{job.salaryRange.min} - {job.salaryRange.max} {job.salaryRange.currency}</div>}
                  {job.resumeLocation && (
                    <div className="text-xs text-gray-500">
                      Your location: {job.resumeLocation}
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex flex-col items-center px-4 py-2 rounded-lg ${getMatchColor(job.matchScore)}`}>
                <TrendingUp className="w-5 h-5 mb-1" />
                <span className="text-2xl font-bold">{Math.round(job.matchScore)}%</span>
                <span className="text-xs">Match</span>
              </div>
            </div>

            {job.description && <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>}

            <div className="space-y-3">
              {job.matchingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center"><Target className="w-4 h-4 mr-1 text-green-600" />Your Matching Skills ({job.matchingSkills.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.matchingSkills.slice(0, 6).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {job.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills to Learn ({job.missingSkills.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.missingSkills.slice(0, 4).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {job.url && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a href={job.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                  View Full Job Posting
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            )}

            <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 mt-4">Source: {job.platform ? job.platform.charAt(0).toUpperCase() + job.platform.slice(1) : 'Unknown'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
