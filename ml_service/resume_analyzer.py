import re
import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class ResumeAnalyzer:
    def __init__(self):
        # Load pre-trained sentence transformer model
        self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize TF-IDF vectorizer
        self.tfidf = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        
        # Load spaCy model for NER
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Warning: spaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
        
        # Predefined skill categories
        self.skill_categories = {
            'programming_languages': [
                'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
                'swift', 'kotlin', 'typescript', 'scala', 'r', 'matlab', 'perl'
            ],
            'web_technologies': [
                'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
                'flask', 'spring', 'laravel', 'bootstrap', 'jquery', 'sass', 'webpack'
            ],
            'databases': [
                'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra',
                'elasticsearch', 'dynamodb', 'firebase'
            ],
            'cloud_platforms': [
                'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'vercel'
            ],
            'devops_tools': [
                'docker', 'kubernetes', 'jenkins', 'git', 'terraform', 'ansible', 'chef',
                'puppet', 'gitlab', 'github', 'bitbucket'
            ],
            'data_science': [
                'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas',
                'numpy', 'scikit-learn', 'jupyter', 'tableau', 'power bi', 'spark'
            ],
            'soft_skills': [
                'leadership', 'communication', 'teamwork', 'problem solving', 'project management',
                'time management', 'critical thinking', 'creativity', 'adaptability'
            ]
        }
    
    def extract_skills(self, text):
        """Extract skills from resume text using multiple approaches"""
        text_lower = text.lower()
        found_skills = {}
        
        # Extract skills by category
        for category, skills in self.skill_categories.items():
            found_skills[category] = []
            for skill in skills:
                if skill.lower() in text_lower:
                    found_skills[category].append(skill)
        
        # Flatten all found skills
        all_skills = []
        for category_skills in found_skills.values():
            all_skills.extend(category_skills)
        
        return {
            'skills_by_category': found_skills,
            'all_skills': list(set(all_skills))
        }
    
    def extract_experience(self, text):
        """Extract work experience information"""
        experience_info = {
            'years_of_experience': 0,
            'companies': [],
            'job_titles': [],
            'experience_sections': []
        }
        
        # Extract years of experience using regex
        year_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'(\d+)\+?\s*yrs?\s*(?:of\s*)?experience',
            r'experience\s*:?\s*(\d+)\+?\s*years?'
        ]
        
        for pattern in year_patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                experience_info['years_of_experience'] = max([int(match) for match in matches])
                break
        
        # Use spaCy for named entity recognition if available
        if self.nlp:
            doc = self.nlp(text)
            for ent in doc.ents:
                if ent.label_ == "ORG":
                    experience_info['companies'].append(ent.text)
        
        return experience_info
    
    def calculate_ats_score(self, resume_text, job_description):
        """Calculate ATS score using multiple factors"""
        
        # Text preprocessing
        resume_clean = self.preprocess_text(resume_text)
        job_clean = self.preprocess_text(job_description)
        
        # Calculate semantic similarity using sentence transformers
        resume_embedding = self.sentence_model.encode([resume_clean])
        job_embedding = self.sentence_model.encode([job_clean])
        semantic_similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
        
        # Calculate keyword matching score
        resume_skills = self.extract_skills(resume_text)['all_skills']
        job_skills = self.extract_skills(job_description)['all_skills']
        
        if job_skills:
            matching_skills = set(resume_skills) & set(job_skills)
            keyword_score = len(matching_skills) / len(job_skills)
        else:
            keyword_score = 0
        
        # Calculate structure score
        structure_score = self.calculate_structure_score(resume_text)
        
        # Weighted final score
        final_score = (
            semantic_similarity * 0.4 +
            keyword_score * 0.4 +
            structure_score * 0.2
        ) * 100
        
        return min(max(final_score, 45), 100)  # Ensure score is between 45-100
    
    def preprocess_text(self, text):
        """Preprocess text for analysis"""
        # Remove special characters and extra whitespace
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.lower().strip()
    
    def calculate_structure_score(self, resume_text):
        """Calculate score based on resume structure"""
        score = 0
        text_lower = resume_text.lower()
        
        # Check for essential sections
        sections = {
            'contact': ['email', 'phone', '@', 'contact'],
            'experience': ['experience', 'work', 'employment', 'career'],
            'education': ['education', 'degree', 'university', 'college'],
            'skills': ['skills', 'technical', 'proficient', 'expertise'],
            'projects': ['project', 'portfolio', 'github', 'developed']
        }
        
        for section, keywords in sections.items():
            if any(keyword in text_lower for keyword in keywords):
                score += 0.2
        
        return min(score, 1.0)
    
    def recommend_jobs(self, resume_text, job_listings):
        """Recommend jobs based on resume content"""
        recommendations = []
        
        for job in job_listings:
            # Calculate match score
            ats_score = self.calculate_ats_score(resume_text, job.get('description', ''))
            
            # Extract matching and missing skills
            resume_skills = set(self.extract_skills(resume_text)['all_skills'])
            required_skills = set([skill.lower() for skill in job.get('requiredSkills', [])])
            
            matching_skills = list(resume_skills & required_skills)
            missing_skills = list(required_skills - resume_skills)
            
            # Calculate overall match percentage
            if required_skills:
                match_percentage = len(matching_skills) / len(required_skills) * 100
            else:
                match_percentage = 0
            
            recommendation = {
                'job_id': job.get('_id'),
                'title': job.get('title'),
                'company': job.get('company'),
                'location': job.get('location'),
                'ats_score': round(ats_score, 2),
                'match_percentage': round(match_percentage, 2),
                'matching_skills': matching_skills,
                'missing_skills': missing_skills,
                'salary_range': job.get('salaryRange', {}),
                'job_type': job.get('jobType')
            }
            
            recommendations.append(recommendation)
        
        # Sort by ATS score and match percentage
        recommendations.sort(key=lambda x: (x['ats_score'], x['match_percentage']), reverse=True)
        
        return recommendations
    
    def analyze_resume(self, resume_text):
        """Comprehensive resume analysis"""
        
        # Extract skills
        skills_data = self.extract_skills(resume_text)
        
        # Extract experience
        experience_data = self.extract_experience(resume_text)
        
        # Calculate readability and structure scores
        structure_score = self.calculate_structure_score(resume_text)
        
        # Generate improvement suggestions
        suggestions = self.generate_suggestions(resume_text, skills_data, structure_score)
        
        return {
            'skills': skills_data,
            'experience': experience_data,
            'structure_score': round(structure_score * 100, 2),
            'suggestions': suggestions,
            'word_count': len(resume_text.split()),
            'character_count': len(resume_text)
        }
    
    def generate_suggestions(self, resume_text, skills_data, structure_score):
        """Generate improvement suggestions for resume"""
        suggestions = []
        
        # Check for contact information
        if not any(indicator in resume_text.lower() for indicator in ['@', 'email', 'phone']):
            suggestions.append("Add contact information including email and phone number")
        
        # Check for quantifiable achievements
        if not re.search(r'\d+%|\$\d+|\d+\s*(million|thousand|k\b)', resume_text):
            suggestions.append("Include quantifiable achievements with numbers and percentages")
        
        # Check skill diversity
        total_skills = len(skills_data['all_skills'])
        if total_skills < 5:
            suggestions.append("Consider adding more relevant technical skills")
        
        # Check structure
        if structure_score < 0.8:
            suggestions.append("Improve resume structure by adding clear sections for experience, education, and skills")
        
        # Check length
        word_count = len(resume_text.split())
        if word_count < 200:
            suggestions.append("Resume appears too short. Consider adding more details about your experience")
        elif word_count > 800:
            suggestions.append("Resume might be too long. Consider condensing to 1-2 pages")
        
        return suggestions

# Example usage function
def main():
    analyzer = ResumeAnalyzer()
    
    # Sample resume text
    sample_resume = """
    John Doe
    Software Engineer
    Email: john.doe@email.com
    Phone: (555) 123-4567
    
    EXPERIENCE
    Senior Software Engineer at TechCorp (2020-2023)
    - Developed web applications using React and Node.js
    - Improved system performance by 40%
    - Led a team of 5 developers
    
    SKILLS
    Programming Languages: Python, JavaScript, Java
    Web Technologies: React, Node.js, HTML, CSS
    Databases: MongoDB, PostgreSQL
    Cloud: AWS, Docker
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology (2016-2020)
    """
    
    # Analyze resume
    analysis = analyzer.analyze_resume(sample_resume)
    print("Resume Analysis:")
    print(json.dumps(analysis, indent=2))

if __name__ == "__main__":
    main()
