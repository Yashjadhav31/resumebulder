# ML Resume Analyzer Service

This Python-based machine learning service provides advanced resume analysis, job recommendations, and ATS scoring using state-of-the-art NLP models.

## Features

- **Advanced Resume Analysis**: Extract skills, experience, and provide improvement suggestions
- **Semantic Job Matching**: Use sentence transformers for better job-resume matching
- **ATS Score Calculation**: Calculate realistic ATS scores based on multiple factors
- **Skills Gap Analysis**: Detailed analysis of missing skills for specific jobs
- **Machine Learning Models**: Uses pre-trained models for better accuracy

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Download Required Models

```bash
# Download spaCy English model
python -m spacy download en_core_web_sm

# Download NLTK data (will be done automatically on first run)
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### 3. Set Environment Variables

Create a `.env` file in the ml_service directory:

```env
MONGODB_URI=mongodb://localhost:27017/resume
```

### 4. Start the ML Service

```bash
python app.py
```

The service will start on `http://localhost:5001`

## API Endpoints

### Health Check
- **GET** `/health` - Check if service is running

### Resume Analysis
- **POST** `/analyze-resume`
  ```json
  {
    "resume_text": "Your resume content here..."
  }
  ```

### ATS Score Calculation
- **POST** `/calculate-ats-score`
  ```json
  {
    "resume_text": "Your resume content...",
    "job_description": "Job description content..."
  }
  ```

### Job Recommendations
- **POST** `/recommend-jobs`
  ```json
  {
    "resume_text": "Your resume content..."
  }
  ```

### Skills Gap Analysis
- **POST** `/skills-gap-analysis`
  ```json
  {
    "resume_text": "Your resume content...",
    "job_id": "mongodb_job_id"
  }
  ```

### Skill Extraction
- **POST** `/extract-skills`
  ```json
  {
    "text": "Text to extract skills from..."
  }
  ```

## Integration with Node.js

The Node.js application automatically detects if the Python ML service is running and uses it for enhanced analysis. If the Python service is not available, it falls back to the basic Node.js implementation.

## Model Information

- **Sentence Transformer**: `all-MiniLM-L6-v2` for semantic similarity
- **TF-IDF Vectorizer**: For keyword matching and analysis
- **spaCy**: For named entity recognition and text processing
- **NLTK**: For text preprocessing and tokenization

## Performance Notes

- First startup may take longer as models are downloaded and loaded
- Subsequent requests are much faster due to model caching
- Consider using GPU acceleration for better performance with large datasets

## Troubleshooting

### Common Issues

1. **Model Download Errors**: Ensure you have internet connection and run the download commands
2. **Memory Issues**: The ML models require at least 2GB RAM
3. **Port Conflicts**: Change the port in `app.py` if 5001 is already in use
4. **MongoDB Connection**: Ensure MongoDB is running and accessible

### Logs

Check the console output for detailed error messages and debugging information.
