import { 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Heart, 
  Zap,
  Globe,
  TrendingUp,
  Shield,
  Code,
  Brain,
  Rocket
} from 'lucide-react';

export function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former Google AI researcher with 10+ years in machine learning and career development.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder", 
      bio: "Ex-Meta engineer specializing in scalable systems and natural language processing.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    },
    {
      name: "Emily Johnson",
      role: "Head of Product",
      bio: "Former Amazon PM with expertise in user experience and career coaching.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    },
    {
      name: "David Park",
      role: "Lead Data Scientist",
      bio: "PhD in Computer Science, specializing in recommendation systems and fuzzy logic.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      linkedin: "#"
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision",
      description: "We use advanced AI to deliver accurate, personalized job matches that align with your skills and career goals.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Empathy",
      description: "We understand job searching is personal. Our platform is designed with genuine care for your career journey.",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible with AI, ML, and career technology.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust",
      description: "Your data is secure, your privacy is protected, and our recommendations are transparent and unbiased.",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "Started with a vision to revolutionize job searching using AI technology.",
      icon: <Rocket className="w-6 h-6" />
    },
    {
      year: "2022", 
      title: "AI Engine Launch",
      description: "Launched our first ML-powered resume analysis and job matching system.",
      icon: <Brain className="w-6 h-6" />
    },
    {
      year: "2023",
      title: "Location Intelligence",
      description: "Introduced fuzzy logic-based location matching for better geographic recommendations.",
      icon: <Globe className="w-6 h-6" />
    },
    {
      year: "2024",
      title: "50K+ Users",
      description: "Reached 50,000+ successful job placements with 95% user satisfaction rate.",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-8 shadow-lg">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              About Our Mission
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-6">
              Empowering Careers Through AI
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              We're on a mission to democratize career success by making advanced AI-powered 
              job matching accessible to everyone. Our platform combines cutting-edge machine learning 
              with deep industry insights to help you find the perfect job match.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To revolutionize the job search experience by leveraging artificial intelligence, 
                machine learning, and advanced algorithms to create meaningful connections between 
                talented professionals and their ideal career opportunities.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AI-First Approach</h3>
                    <p className="text-gray-600">Every feature is powered by advanced machine learning algorithms.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Global Reach</h3>
                    <p className="text-gray-600">Supporting job seekers across 200+ cities worldwide.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Proven Results</h3>
                    <p className="text-gray-600">95% success rate with over 50,000 successful placements.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  A world where every professional can easily discover and secure their dream job, 
                  where career growth is accelerated by intelligent technology, and where the job 
                  market operates with perfect information and zero friction.
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-blue-200">Jobs Matched</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-blue-200">Cities Covered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${value.color} text-white mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to transform career discovery
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                    
                    <div className="ml-20 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow w-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                        </div>
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                          {milestone.icon}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              The brilliant minds behind our AI-powered career platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-blue-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                <a
                  href={member.linkedin}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Code className="w-4 h-4 mr-1" />
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for 
              revolutionizing careers through technology. Come build the future with us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                View Open Positions
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
