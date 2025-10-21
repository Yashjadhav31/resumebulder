import { useState, useEffect } from 'react';
import { FileText, Sparkles, BarChart3, Target } from 'lucide-react';
import { ResumeUpload } from './components/ResumeUpload';
import { JobRecommendations } from './components/JobRecommendations';
import { SkillsGapAnalysis } from './components/SkillsGapAnalysis';
import { ATSScoreDashboard } from './components/ATSScoreDashboard';
import { ResumeOverview } from './components/ResumeOverview';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

type ViewMode = 'upload' | 'overview' | 'recommendations' | 'analysis';
type PageMode = 'home' | 'analyzer' | 'about' | 'contact';

function App() {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [currentPage, setCurrentPage] = useState<PageMode>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('authToken');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setResumeId(null);
    setSelectedJobId(null);
    setViewMode('upload');
  };

  const handlePageChange = (page: PageMode) => {
    setCurrentPage(page);
    if (page === 'analyzer' && !user) {
      setShowAuthModal(true);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('analyzer');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleUploadComplete = (newResumeId: string, initialAnalysis?: any) => {
    setResumeId(newResumeId);
    
    // Show initial analysis if available
    if (initialAnalysis) {
      console.log('Resume analyzed:', {
        skills: initialAnalysis.skillsCount,
        experience: initialAnalysis.experienceYears,
        structure: initialAnalysis.structureScore,
        suggestions: initialAnalysis.suggestions
      });
    }
    
    // Go to overview after analysis
    setViewMode('overview');
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setViewMode('analysis');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                AI-Powered Resume Analyzer
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Get personalized job recommendations, skills gap analysis, and ATS scores powered by machine learning
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Get Started Free
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Resume Analysis</h3>
                <p className="text-gray-600">
                  Our ML algorithms parse and analyze your resume to extract skills, experience, and qualifications
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Job Matching</h3>
                <p className="text-gray-600">
                  Get matched with jobs from multiple platforms based on your skills and career goals
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">ATS Score</h3>
                <p className="text-gray-600">
                  See how well your resume performs against Applicant Tracking Systems with actionable feedback
                </p>
              </div>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(user) => {
            setShowAuthModal(false);
            setUser(user);
          }}
        />
      </>
    );
  }

  // Render different pages based on currentPage
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen">
        <Navigation 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
          user={user} 
          onSignOut={handleSignOut} 
        />
        <HomePage onGetStarted={handleGetStarted} />
        <Footer onPageChange={handlePageChange} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
            setCurrentPage('analyzer');
          }}
        />
      </div>
    );
  }

  if (currentPage === 'about') {
    return (
      <div className="min-h-screen">
        <Navigation 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
          user={user} 
          onSignOut={handleSignOut} 
        />
        <AboutPage />
        <Footer onPageChange={handlePageChange} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
            setCurrentPage('analyzer');
          }}
        />
      </div>
    );
  }

  if (currentPage === 'contact') {
    return (
      <div className="min-h-screen">
        <Navigation 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
          user={user} 
          onSignOut={handleSignOut} 
        />
        <ContactPage />
        <Footer onPageChange={handlePageChange} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
            setCurrentPage('analyzer');
          }}
        />
      </div>
    );
  }

  // Analyzer page (currentPage === 'analyzer')
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        user={user} 
        onSignOut={handleSignOut} 
      />

      {!user ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
            <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access the Resume Analyzer and get personalized job recommendations.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      ) : (
        <>
          <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Resume Analyzer Dashboard</h2>
                
                {resumeId && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('upload')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'upload'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setViewMode('overview')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'overview'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setViewMode('recommendations')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'recommendations'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Jobs
                    </button>
                    <button
                      onClick={() => setViewMode('analysis')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === 'analysis'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Analysis
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>

          <main className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {viewMode === 'upload' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
                    <p className="text-gray-600">
                      Let our AI analyze your resume and find the perfect job matches
                    </p>
                  </div>
                  <ResumeUpload onUploadComplete={handleUploadComplete} />
                </div>
              )}

              {viewMode === 'overview' && resumeId && (
                <div className="space-y-8">
                  <ResumeOverview resumeId={resumeId} />
                </div>
              )}

              {viewMode === 'recommendations' && resumeId && (
                <div className="space-y-8">
                  <JobRecommendations resumeId={resumeId} onJobSelect={handleJobSelect} />
                </div>
              )}

              {viewMode === 'analysis' && resumeId && (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <SkillsGapAnalysis resumeId={resumeId} jobId={selectedJobId} />
                  </div>
                  <div className="space-y-8">
                    <ATSScoreDashboard resumeId={resumeId} jobId={selectedJobId} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      <Footer onPageChange={handlePageChange} />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(userData) => {
          setUser(userData);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}

export default App;
