import { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  MapPin, 
  Users, 
  Award, 
  ArrowRight,
  CheckCircle,
  Star,
  Briefcase,
  Globe,
  Zap
} from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced ML algorithms analyze your resume for skills, experience, and optimization opportunities.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location-Based Matching",
      description: "Smart fuzzy logic matches jobs based on your location preferences and proximity.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Recommendations",
      description: "Get tailored job suggestions based on your skills, experience, and career goals.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems with our compatibility analysis.",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Resumes Analyzed", icon: <Users className="w-6 h-6" /> },
    { number: "25K+", label: "Jobs Matched", icon: <Briefcase className="w-6 h-6" /> },
    { number: "200+", label: "Cities Covered", icon: <Globe className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      content: "This platform helped me land my dream job! The AI analysis was spot-on and the job recommendations were perfectly matched to my skills.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      company: "Meta",
      content: "The location-based matching feature is incredible. I found local opportunities I never knew existed, plus remote jobs that fit perfectly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "Amazon",
      content: "The ATS optimization suggestions increased my interview callback rate by 300%. This tool is a game-changer for job seekers.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-8 shadow-lg">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              AI-Powered Resume Analysis & Job Matching
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-6 leading-tight">
              Land Your Dream Job with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Upload your resume and get personalized job recommendations, 
              <br className="hidden md:block" />
              ATS optimization tips, and location-based matches powered by advanced ML.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center text-gray-600">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm">Join 50,000+ successful job seekers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Job Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with deep industry insights 
              to give you the competitive edge in today's job market.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-white shadow-xl scale-105'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4`}>
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
                  <p className="text-blue-100">{features[activeFeature].description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 mb-2" />
                    <div>Real-time Analysis</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 mb-2" />
                    <div>Smart Matching</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 mb-2" />
                    <div>Global Coverage</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 mb-2" />
                    <div>Expert Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how our platform has helped thousands land their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful professionals who have found their dream jobs 
              using our AI-powered platform. Start your journey today!
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
            >
              Start Your Success Story
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
