# 🚀 Resume Builder Startup Guide

## Quick Fix for "No job recommendations found"

### Step 1: Seed the Database
```bash
npm run seed
```
This adds sample jobs to your database.

**If you get TypeScript errors, use:**
```bash
npm run seed:ts
```

### Step 2: Start the Server
```bash
npm run server
```
Server will run on http://localhost:5000

### Step 3: Start the Frontend
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### Step 4: Test the System

1. **Check if server is working:**
   - Visit: http://localhost:5000/api/debug/status
   - Should show: `{"success":true,"status":{"jobs":3,"resumes":0,"users":0}}`

2. **Check if jobs exist:**
   - Visit: http://localhost:5000/api/jobs
   - Should show array of 3 sample jobs

### Step 5: Use the Application

1. **Sign Up/Login:**
   - Click "Get Started Free"
   - Create an account or login

2. **Upload Resume:**
   - Upload a PDF/text resume
   - Wait for processing

3. **View Recommendations:**
   - After upload, you should see job recommendations
   - Click on jobs to see skills gap analysis

## Troubleshooting

### If Analysis tab shows blank screen:

1. **Make sure you have uploaded a resume:**
   - Go to Upload tab first
   - Upload a PDF/text file
   - Wait for processing to complete

2. **Check if ATS Score button appears:**
   - Click Analysis tab
   - Should see "Calculate ATS Score" button
   - Click it to generate analysis

3. **For Skills Gap Analysis:**
   - First go to Jobs tab
   - Click on any job recommendation
   - Then go to Analysis tab
   - Should see detailed skills comparison

### If you see "No job recommendations found":

1. **Check database has jobs:**
   ```bash
   node debug_test.js
   ```

2. **Check browser console:**
   - Press F12 → Console tab
   - Look for API errors (red text)

3. **Check server logs:**
   - Look at terminal where server is running
   - Check for error messages

### Common Issues:

1. **Authentication errors:**
   - Clear browser storage: F12 → Application → Storage → Clear All
   - Try logging in again

2. **Database connection:**
   - Make sure MongoDB is running
   - Check connection string in .env file

3. **No jobs in database:**
   - Run: `npm run seed`
   - Check: http://localhost:5000/api/jobs

4. **Resume not uploaded:**
   - Make sure file upload completes
   - Check network tab in browser dev tools

## API Endpoints for Testing

- `GET /api/debug/status` - System status
- `GET /api/jobs` - List all jobs
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token
- `POST /api/resume/upload` - Upload resume
- `GET /api/jobs/recommendations/:resumeId` - Get recommendations

## Success Indicators

✅ Database seeded with 3+ jobs
✅ Server running on port 5000
✅ Frontend running on port 5173
✅ Can create account and login
✅ Can upload resume
✅ Can see job recommendations
✅ Can view skills gap analysis
