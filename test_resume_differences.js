// Test script to verify different resumes produce different results

const sampleResumes = {
  frontend: `
John Doe
Frontend Developer
Email: john@example.com
Phone: (555) 123-4567

EXPERIENCE
Senior Frontend Developer at TechCorp (2020-2023)
- Developed responsive web applications using React and TypeScript
- Implemented modern CSS frameworks like Tailwind CSS
- Built reusable components and maintained component libraries
- Worked with REST APIs and GraphQL
- 5+ years experience with JavaScript and React

SKILLS
Programming: JavaScript, TypeScript, HTML, CSS, React, Vue.js
Tools: Git, Webpack, Vite, npm, yarn
Frameworks: Next.js, Tailwind CSS, Bootstrap
Testing: Jest, Cypress, React Testing Library

EDUCATION
Bachelor of Computer Science
University of Technology (2016-2020)
  `,
  
  backend: `
Sarah Smith
Backend Developer
Email: sarah@example.com
Phone: (555) 987-6543

EXPERIENCE
Senior Backend Developer at DataCorp (2019-2023)
- Built scalable REST APIs using Python and Django
- Designed and optimized PostgreSQL databases
- Implemented microservices architecture with Docker
- Managed cloud infrastructure on AWS
- 6+ years experience with Python and backend development

SKILLS
Programming: Python, Java, SQL, Bash
Frameworks: Django, Flask, Spring Boot
Databases: PostgreSQL, MongoDB, Redis
Cloud: AWS, Docker, Kubernetes, Terraform
Tools: Git, Jenkins, Linux, Nginx

EDUCATION
Master of Computer Science
Tech University (2017-2019)
  `,
  
  dataScientist: `
Alex Chen
Data Scientist
Email: alex@example.com
Phone: (555) 456-7890

EXPERIENCE
Senior Data Scientist at AI Innovations (2020-2023)
- Developed machine learning models using Python and TensorFlow
- Performed statistical analysis and data visualization
- Built predictive models for business intelligence
- Worked with big data technologies like Spark and Hadoop
- 4+ years experience with machine learning and data science

SKILLS
Programming: Python, R, SQL, Scala
ML/AI: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy
Visualization: Tableau, Matplotlib, Seaborn, Plotly
Big Data: Spark, Hadoop, Kafka
Cloud: AWS, Google Cloud, Azure

EDUCATION
PhD in Data Science
Stanford University (2016-2020)
  `
};

async function testResumeAnalysis() {
  console.log('🧪 Testing Resume Analysis Differences\n');
  
  for (const [type, resumeText] of Object.entries(sampleResumes)) {
    console.log(`\n📋 Testing ${type.toUpperCase()} Resume:`);
    console.log('='.repeat(50));
    
    try {
      const response = await fetch('http://localhost:5000/api/debug/test-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumeText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`📊 Resume Length: ${data.resumeLength} characters`);
      
      if (data.fallbackService) {
        console.log(`🔧 Fallback Service:`);
        console.log(`   - Skills Found: ${data.fallbackService.skillsCount}`);
        console.log(`   - Top Skills: ${data.fallbackService.skills.slice(0, 8).join(', ')}`);
        console.log(`   - Keywords: ${data.fallbackService.keywords.slice(0, 6).join(', ')}`);
      }
      
      if (data.mlService) {
        console.log(`🤖 ML Service:`);
        console.log(`   - Skills Found: ${data.mlService.skillsCount}`);
        console.log(`   - Experience Years: ${data.mlService.experience}`);
        console.log(`   - Structure Score: ${data.mlService.structureScore}`);
        console.log(`   - Top Skills: ${data.mlService.skills.slice(0, 8).join(', ')}`);
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${type}: ${error.message}`);
      console.log('Make sure server is running on http://localhost:5000');
    }
  }
  
  console.log('\n🎯 Expected Results:');
  console.log('- Frontend resume should have: React, JavaScript, TypeScript, HTML, CSS');
  console.log('- Backend resume should have: Python, Django, PostgreSQL, AWS, Docker');
  console.log('- Data Scientist resume should have: Python, TensorFlow, Machine Learning, R');
  console.log('\n✅ If skills are different for each resume, the system is working correctly!');
}

// Run the test
testResumeAnalysis().catch(console.error);
