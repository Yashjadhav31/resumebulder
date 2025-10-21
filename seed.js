import { connectDB } from './dist/lib/db.js';
import { Job } from './dist/Models/Job.js';

const sampleJobs = [
  {
    title: 'Frontend Developer',
    company: 'TechCorp Inc',
    location: 'San Francisco, CA',
    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces using React, TypeScript, and modern CSS frameworks.',
    requirements: [
      '3+ years of experience with React',
      'Strong knowledge of TypeScript',
      'Experience with CSS frameworks like Tailwind',
      'Knowledge of modern build tools'
    ],
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Git'],
    preferredSkills: ['Next.js', 'Tailwind CSS', 'GraphQL', 'Jest'],
    salaryRange: {
      min: 80000,
      max: 120000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    description: 'Join our fast-growing startup as a Full Stack Developer. Work with modern technologies including Node.js, React, and MongoDB.',
    requirements: [
      '2+ years of full-stack development',
      'Experience with Node.js and Express',
      'Database experience with MongoDB',
      'RESTful API development'
    ],
    requiredSkills: ['Node.js', 'React', 'MongoDB', 'Express', 'JavaScript', 'REST APIs'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'Redis'],
    salaryRange: {
      min: 70000,
      max: 100000,
      currency: 'USD'
    },
    jobType: 'remote',
    status: 'active'
  },
  {
    title: 'Backend Developer',
    company: 'Enterprise Solutions',
    location: 'New York, NY',
    description: 'We need a Backend Developer experienced in Python and Django to build scalable web applications.',
    requirements: [
      '4+ years of Python development',
      'Strong Django framework knowledge',
      'Database design and optimization',
      'API development experience'
    ],
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'Git', 'Linux'],
    preferredSkills: ['Docker', 'Kubernetes', 'Redis', 'Celery', 'AWS'],
    salaryRange: {
      min: 90000,
      max: 130000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'Boston, MA',
    description: 'Looking for a Data Scientist to work on machine learning projects and data analysis.',
    requirements: [
      'Masters in Data Science or related field',
      'Experience with Python and R',
      'Machine learning algorithms knowledge',
      'Statistical analysis skills'
    ],
    requiredSkills: ['Python', 'R', 'Machine Learning', 'Statistics', 'Pandas', 'NumPy'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'Jupyter'],
    salaryRange: {
      min: 100000,
      max: 150000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    description: 'Join our DevOps team to manage cloud infrastructure and deployment pipelines.',
    requirements: [
      '3+ years of DevOps experience',
      'Strong AWS knowledge',
      'Container orchestration with Kubernetes',
      'CI/CD pipeline management'
    ],
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
    preferredSkills: ['Helm', 'Prometheus', 'Grafana', 'Ansible', 'Python'],
    salaryRange: {
      min: 95000,
      max: 140000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Mobile App Developer',
    company: 'MobileTech Inc',
    location: 'Austin, TX',
    description: 'Develop cross-platform mobile applications using React Native and Flutter.',
    requirements: [
      '2+ years mobile development experience',
      'Experience with React Native or Flutter',
      'Knowledge of mobile UI/UX principles',
      'App store deployment experience'
    ],
    requiredSkills: ['React Native', 'Flutter', 'JavaScript', 'Dart', 'iOS', 'Android'],
    preferredSkills: ['Redux', 'Firebase', 'GraphQL', 'TypeScript'],
    salaryRange: {
      min: 75000,
      max: 110000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'San Francisco, CA',
    description: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio of web and mobile designs',
      'Understanding of user-centered design principles'
    ],
    requiredSkills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch', 'Prototyping'],
    preferredSkills: ['After Effects', 'Principle', 'InVision', 'Zeplin'],
    salaryRange: {
      min: 80000,
      max: 120000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Product Manager',
    company: 'ProductCorp',
    location: 'New York, NY',
    description: 'Lead product development from conception to launch, working with cross-functional teams.',
    requirements: [
      '4+ years of product management experience',
      'Strong analytical and communication skills',
      'Experience with agile methodologies',
      'Technical background preferred'
    ],
    requiredSkills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'Roadmapping', 'Stakeholder Management'],
    preferredSkills: ['SQL', 'A/B Testing', 'User Research', 'Wireframing'],
    salaryRange: {
      min: 110000,
      max: 160000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'Washington, DC',
    description: 'Protect organizational systems and networks from cyber threats and vulnerabilities.',
    requirements: [
      'Bachelor\'s degree in Cybersecurity or related field',
      '2+ years of security analysis experience',
      'Knowledge of security frameworks and compliance',
      'Experience with security tools and technologies'
    ],
    requiredSkills: ['Network Security', 'Incident Response', 'Risk Assessment', 'Compliance', 'Firewalls', 'SIEM'],
    preferredSkills: ['CISSP', 'CEH', 'Penetration Testing', 'Forensics'],
    salaryRange: {
      min: 85000,
      max: 125000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AI Solutions',
    location: 'Palo Alto, CA',
    description: 'Build and deploy machine learning models to solve complex business problems.',
    requirements: [
      'MS/PhD in Computer Science or related field',
      '3+ years of ML engineering experience',
      'Strong programming skills in Python',
      'Experience with ML frameworks and cloud platforms'
    ],
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'AWS', 'Docker'],
    preferredSkills: ['Kubernetes', 'MLOps', 'Spark', 'Hadoop', 'Deep Learning'],
    salaryRange: {
      min: 130000,
      max: 180000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    description: 'Join our engineering team to build scalable systems that impact billions of users.',
    requirements: [
      'Bachelor\'s degree in Computer Science',
      '3+ years of software development experience',
      'Strong programming skills in Java, Python, or C++',
      'Experience with distributed systems'
    ],
    requiredSkills: ['Java', 'Python', 'C++', 'Algorithms', 'Data Structures', 'System Design'],
    preferredSkills: ['Go', 'Kubernetes', 'Microservices', 'Cloud Computing'],
    salaryRange: {
      min: 150000,
      max: 250000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'React Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    description: 'Build the next generation of social experiences using React and modern web technologies.',
    requirements: [
      '4+ years of React development experience',
      'Expert knowledge of JavaScript and TypeScript',
      'Experience with state management libraries',
      'Strong understanding of web performance'
    ],
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'HTML', 'CSS'],
    preferredSkills: ['Next.js', 'GraphQL', 'Webpack', 'Jest', 'React Native'],
    salaryRange: {
      min: 140000,
      max: 220000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Senior Python Developer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    description: 'Develop high-performance backend services for our streaming platform using Python.',
    requirements: [
      '5+ years of Python development experience',
      'Experience with Django or Flask',
      'Knowledge of microservices architecture',
      'Database optimization skills'
    ],
    requiredSkills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'Redis', 'API Development'],
    preferredSkills: ['Kafka', 'Elasticsearch', 'Docker', 'AWS', 'Machine Learning'],
    salaryRange: {
      min: 160000,
      max: 240000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Cloud Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    description: 'Design and implement cloud infrastructure solutions on AWS.',
    requirements: [
      'AWS certification preferred',
      '3+ years of cloud infrastructure experience',
      'Experience with Infrastructure as Code',
      'Strong scripting skills'
    ],
    requiredSkills: ['AWS', 'Terraform', 'CloudFormation', 'Docker', 'Kubernetes', 'Linux'],
    preferredSkills: ['Ansible', 'Jenkins', 'Monitoring', 'Security', 'Networking'],
    salaryRange: {
      min: 130000,
      max: 200000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'JavaScript Developer',
    company: 'Shopify',
    location: 'Ottawa, Canada',
    description: 'Build e-commerce solutions using modern JavaScript frameworks and Node.js.',
    requirements: [
      '3+ years of JavaScript development',
      'Experience with Node.js and Express',
      'Frontend framework experience (React/Vue)',
      'E-commerce platform knowledge'
    ],
    requiredSkills: ['JavaScript', 'Node.js', 'React', 'Express', 'MongoDB', 'REST APIs'],
    preferredSkills: ['GraphQL', 'TypeScript', 'Vue.js', 'E-commerce', 'Payment Systems'],
    salaryRange: {
      min: 90000,
      max: 140000,
      currency: 'CAD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'AI Research Scientist',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    description: 'Conduct cutting-edge research in artificial intelligence and machine learning.',
    requirements: [
      'PhD in Computer Science, AI, or related field',
      'Strong research background in ML/AI',
      'Experience with deep learning frameworks',
      'Published research papers'
    ],
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Research'],
    preferredSkills: ['NLP', 'Computer Vision', 'Reinforcement Learning', 'Statistics', 'Mathematics'],
    salaryRange: {
      min: 200000,
      max: 400000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Angular Developer',
    company: 'Microsoft',
    location: 'Redmond, WA',
    description: 'Develop enterprise web applications using Angular and .NET technologies.',
    requirements: [
      '4+ years of Angular development',
      'Experience with TypeScript and RxJS',
      'Knowledge of .NET ecosystem',
      'Enterprise application experience'
    ],
    requiredSkills: ['Angular', 'TypeScript', 'RxJS', 'C#', '.NET', 'Azure'],
    preferredSkills: ['ASP.NET Core', 'Entity Framework', 'SQL Server', 'DevOps'],
    salaryRange: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Vue.js Developer',
    company: 'GitLab',
    location: 'Remote',
    description: 'Build modern web interfaces using Vue.js for our DevOps platform.',
    requirements: [
      '3+ years of Vue.js experience',
      'Strong JavaScript and CSS skills',
      'Experience with Vuex and Vue Router',
      'Git and version control expertise'
    ],
    requiredSkills: ['Vue.js', 'JavaScript', 'Vuex', 'CSS', 'Git', 'HTML'],
    preferredSkills: ['Nuxt.js', 'TypeScript', 'Jest', 'Cypress', 'DevOps'],
    salaryRange: {
      min: 100000,
      max: 150000,
      currency: 'USD'
    },
    jobType: 'remote',
    status: 'active'
  },
  {
    title: 'Database Administrator',
    company: 'Oracle',
    location: 'Austin, TX',
    description: 'Manage and optimize large-scale database systems for enterprise clients.',
    requirements: [
      '5+ years of database administration',
      'Expert knowledge of SQL and database design',
      'Experience with Oracle, MySQL, or PostgreSQL',
      'Performance tuning expertise'
    ],
    requiredSkills: ['SQL', 'Oracle', 'MySQL', 'PostgreSQL', 'Database Design', 'Performance Tuning'],
    preferredSkills: ['NoSQL', 'MongoDB', 'Redis', 'Backup & Recovery', 'Security'],
    salaryRange: {
      min: 110000,
      max: 160000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'QA Engineer',
    company: 'Atlassian',
    location: 'Sydney, Australia',
    description: 'Ensure software quality through automated testing and quality assurance processes.',
    requirements: [
      '3+ years of QA/testing experience',
      'Experience with test automation frameworks',
      'Knowledge of CI/CD pipelines',
      'Bug tracking and test management'
    ],
    requiredSkills: ['Testing', 'Automation', 'Selenium', 'Java', 'Python', 'CI/CD'],
    preferredSkills: ['Cypress', 'Jest', 'TestNG', 'JIRA', 'Agile', 'API Testing'],
    salaryRange: {
      min: 80000,
      max: 120000,
      currency: 'AUD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Blockchain Developer',
    company: 'Coinbase',
    location: 'San Francisco, CA',
    description: 'Develop decentralized applications and smart contracts for cryptocurrency platforms.',
    requirements: [
      '2+ years of blockchain development',
      'Experience with Solidity and Ethereum',
      'Knowledge of cryptography and consensus algorithms',
      'Web3 development experience'
    ],
    requiredSkills: ['Solidity', 'Ethereum', 'Web3', 'JavaScript', 'Blockchain', 'Smart Contracts'],
    preferredSkills: ['DeFi', 'NFTs', 'Rust', 'Go', 'Cryptography', 'Security'],
    salaryRange: {
      min: 140000,
      max: 220000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'iOS Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    description: 'Create innovative iOS applications using Swift and the latest Apple technologies.',
    requirements: [
      '4+ years of iOS development experience',
      'Expert knowledge of Swift and Objective-C',
      'Experience with iOS SDK and Xcode',
      'App Store publishing experience'
    ],
    requiredSkills: ['Swift', 'iOS', 'Xcode', 'Objective-C', 'UIKit', 'Core Data'],
    preferredSkills: ['SwiftUI', 'Combine', 'ARKit', 'Core ML', 'Push Notifications'],
    salaryRange: {
      min: 150000,
      max: 250000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  },
  {
    title: 'Android Developer',
    company: 'Samsung',
    location: 'Seoul, South Korea',
    description: 'Develop Android applications and contribute to the Android ecosystem.',
    requirements: [
      '3+ years of Android development',
      'Strong knowledge of Java and Kotlin',
      'Experience with Android SDK and Android Studio',
      'Material Design principles'
    ],
    requiredSkills: ['Android', 'Kotlin', 'Java', 'Android Studio', 'Material Design', 'SQLite'],
    preferredSkills: ['Jetpack Compose', 'MVVM', 'Retrofit', 'Room', 'Dagger', 'RxJava'],
    salaryRange: {
      min: 70000,
      max: 120000,
      currency: 'USD'
    },
    jobType: 'full-time',
    status: 'active'
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert sample jobs
    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`Inserted ${insertedJobs.length} sample jobs`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
