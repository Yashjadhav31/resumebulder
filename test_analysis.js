// Test script to verify analysis functionality
import { connectDB } from './dist/lib/db.js';
import { Resume } from './dist/Models/Resume.js';
import { User } from './dist/Models/User.js';

async function testAnalysis() {
  try {
    console.log('🔍 Testing Analysis Functionality...\n');
    
    await connectDB();
    console.log('✅ Database connected\n');
    
    // Check if there are any resumes
    const resumeCount = await Resume.countDocuments();
    console.log(`📄 Found ${resumeCount} resumes in database`);
    
    if (resumeCount === 0) {
      console.log('❌ No resumes found!');
      console.log('📋 To test analysis:');
      console.log('1. Start the server: npm run server');
      console.log('2. Start the frontend: npm run dev');
      console.log('3. Sign up and upload a resume');
      console.log('4. Then try the Analysis tab\n');
    } else {
      const resumes = await Resume.find().limit(3);
      console.log('✅ Sample resumes found:');
      
      for (const resume of resumes) {
        console.log(`\n📋 Resume: ${resume.fileName}`);
        console.log(`   - Skills: ${resume.skills?.length || 0}`);
        console.log(`   - Raw text length: ${resume.raw_text?.length || 0} characters`);
        console.log(`   - User ID: ${resume.userId}`);
        
        // Check if user exists
        const user = await User.findById(resume.userId);
        console.log(`   - User exists: ${user ? '✅' : '❌'}`);
        
        if (resume.raw_text) {
          console.log('   - ✅ Has text for analysis');
        } else {
          console.log('   - ❌ Missing raw text - analysis will fail');
        }
      }
      
      console.log('\n🎯 Analysis should work for resumes with raw text');
    }
    
    console.log('\n📊 Test the analysis by:');
    console.log('1. Go to http://localhost:5173');
    console.log('2. Login with existing account');
    console.log('3. Click "Analysis" tab');
    console.log('4. Should see:');
    console.log('   - Left: "Select a Job to Analyze" message');
    console.log('   - Right: "Calculate ATS Score" button');
    console.log('5. Click "Calculate ATS Score" to see detailed analysis');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testAnalysis();
