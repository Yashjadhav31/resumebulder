from flask import Flask, request, jsonify
import json
import os
from pymongo import MongoClient
from resume_analyzer import ResumeAnalyzer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize ML analyzer
analyzer = ResumeAnalyzer()

# MongoDB connection
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/resume')
client = MongoClient(MONGO_URI)
db = client.resume

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "ML Resume Analyzer"})

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    """Analyze resume text and return insights"""
    try:
        data = request.get_json()
        resume_text = data.get('resume_text', '')
        
        if not resume_text:
            return jsonify({"error": "Resume text is required"}), 400
        
        # Perform analysis
        analysis = analyzer.analyze_resume(resume_text)
        
        return jsonify({
            "success": True,
            "analysis": analysis
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/calculate-ats-score', methods=['POST'])
def calculate_ats_score():
    """Calculate ATS score for resume against job description"""
    try:
        data = request.get_json()
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')
        
        if not resume_text or not job_description:
            return jsonify({"error": "Both resume text and job description are required"}), 400
        
        # Calculate ATS score
        ats_score = analyzer.calculate_ats_score(resume_text, job_description)
        
        # Get detailed analysis
        resume_skills = analyzer.extract_skills(resume_text)
        job_skills = analyzer.extract_skills(job_description)
        
        matching_skills = list(set(resume_skills['all_skills']) & set(job_skills['all_skills']))
        missing_skills = list(set(job_skills['all_skills']) - set(resume_skills['all_skills']))
        
        return jsonify({
            "success": True,
            "ats_score": round(ats_score, 2),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "resume_skills": resume_skills['all_skills'],
            "job_skills": job_skills['all_skills']
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    """Get job recommendations based on resume"""
    try:
        data = request.get_json()
        resume_text = data.get('resume_text', '')
        
        if not resume_text:
            return jsonify({"error": "Resume text is required"}), 400
        
        # Fetch active jobs from database
        jobs_cursor = db.jobs.find({"status": "active"})
        jobs = list(jobs_cursor)
        
        # Convert ObjectId to string for JSON serialization
        for job in jobs:
            job['_id'] = str(job['_id'])
        
        if not jobs:
            return jsonify({
                "success": True,
                "recommendations": [],
                "message": "No active jobs found in database"
            })
        
        # Get recommendations
        recommendations = analyzer.recommend_jobs(resume_text, jobs)
        
        return jsonify({
            "success": True,
            "recommendations": recommendations[:10],  # Top 10 recommendations
            "total_jobs_analyzed": len(jobs)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/skills-gap-analysis', methods=['POST'])
def skills_gap_analysis():
    """Analyze skills gap between resume and specific job"""
    try:
        data = request.get_json()
        resume_text = data.get('resume_text', '')
        job_id = data.get('job_id', '')
        
        if not resume_text or not job_id:
            return jsonify({"error": "Resume text and job ID are required"}), 400
        
        # Fetch job from database
        from bson import ObjectId
        job = db.jobs.find_one({"_id": ObjectId(job_id)})
        
        if not job:
            return jsonify({"error": "Job not found"}), 404
        
        # Perform skills gap analysis
        resume_skills = set(analyzer.extract_skills(resume_text)['all_skills'])
        required_skills = set([skill.lower() for skill in job.get('requiredSkills', [])])
        preferred_skills = set([skill.lower() for skill in job.get('preferredSkills', [])])
        
        matching_required = list(resume_skills & required_skills)
        missing_required = list(required_skills - resume_skills)
        matching_preferred = list(resume_skills & preferred_skills)
        missing_preferred = list(preferred_skills - resume_skills)
        
        # Calculate match percentages
        required_match_percentage = len(matching_required) / len(required_skills) * 100 if required_skills else 0
        preferred_match_percentage = len(matching_preferred) / len(preferred_skills) * 100 if preferred_skills else 0
        
        # Calculate ATS score
        ats_score = analyzer.calculate_ats_score(resume_text, job.get('description', ''))
        
        # Generate recommendations
        recommendations = []
        if missing_required:
            recommendations.append(f"Focus on learning these required skills: {', '.join(missing_required[:5])}")
        if missing_preferred:
            recommendations.append(f"Consider learning these preferred skills: {', '.join(missing_preferred[:3])}")
        if required_match_percentage < 70:
            recommendations.append("Highlight your relevant experience more prominently in your resume")
        
        return jsonify({
            "success": True,
            "job_title": job.get('title'),
            "company": job.get('company'),
            "ats_score": round(ats_score, 2),
            "required_skills_analysis": {
                "matching": matching_required,
                "missing": missing_required,
                "match_percentage": round(required_match_percentage, 2)
            },
            "preferred_skills_analysis": {
                "matching": matching_preferred,
                "missing": missing_preferred,
                "match_percentage": round(preferred_match_percentage, 2)
            },
            "recommendations": recommendations
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/extract-skills', methods=['POST'])
def extract_skills():
    """Extract skills from text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        skills = analyzer.extract_skills(text)
        
        return jsonify({
            "success": True,
            "skills": skills
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting ML Resume Analyzer Service...")
    print("Available endpoints:")
    print("- POST /analyze-resume")
    print("- POST /calculate-ats-score")
    print("- POST /recommend-jobs")
    print("- POST /skills-gap-analysis")
    print("- POST /extract-skills")
    print("- GET /health")
    
    app.run(host='0.0.0.0', port=5001, debug=True)
