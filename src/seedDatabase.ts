import { connectDB } from './lib/db.js';
import { Job } from './Models/Job.js';

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
