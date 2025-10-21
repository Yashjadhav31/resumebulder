// Simple test to check database and API functionality
import { connectDB } from './src/lib/db.js';
import { Job } from './src/Models/Job.js';
import { Resume } from './src/Models/Resume.js';

async function debugTest() {
  try {
    console.log('🔍 Starting debug test...\n');
    
    // Test 1: Database connection
    console.log('1. Testing database connection...');
    await connectDB();
    console.log('✅ Database connected successfully\n');
    
    // Test 2: Check if jobs exist
    console.log('2. Checking for jobs in database...');
    const jobCount = await Job.countDocuments();
    console.log(`📊 Found ${jobCount} jobs in database`);
    
    if (jobCount === 0) {
      console.log('❌ No jobs found! Database needs to be seeded.');
      console.log('Run: npm run seed\n');
    } else {
      const jobs = await Job.find().limit(3);
      console.log('✅ Sample jobs:');
      jobs.forEach(job => {
        console.log(`   - ${job.title} at ${job.company}`);
      });
      console.log('');
    }
    
    // Test 3: Check if resumes exist
    console.log('3. Checking for resumes in database...');
    const resumeCount = await Resume.countDocuments();
    console.log(`📄 Found ${resumeCount} resumes in database`);
    
    if (resumeCount === 0) {
      console.log('❌ No resumes found! Upload a resume first.\n');
    } else {
      const resumes = await Resume.find().limit(3);
      console.log('✅ Sample resumes:');
      resumes.forEach(resume => {
        console.log(`   - ${resume.fileName} (${resume.skills?.length || 0} skills)`);
      });
      console.log('');
    }
    
    // Test 4: Check server endpoints
    console.log('4. Server status:');
    console.log('   Make sure server is running on http://localhost:5000');
    console.log('   Test endpoints:');
    console.log('   - GET /api/jobs (should return jobs)');
    console.log('   - POST /api/resume/upload (for uploading resumes)');
    console.log('   - GET /api/jobs/recommendations/:resumeId (for recommendations)\n');
    
    // Test 5: ML Service status
    console.log('5. ML Service status:');
    console.log('   Python ML service should be running on http://localhost:5001');
    console.log('   If not running, job recommendations will use basic fallback.\n');
    
    console.log('🎯 Next steps:');
    console.log('1. Ensure database is seeded: npm run seed');
    console.log('2. Upload a resume through the UI');
    console.log('3. Check browser console for API errors');
    console.log('4. Verify server is running: npm run server');
    
  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

debugTest();
