import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  raw_text: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    description: String,
    skills: [String]
  }],
  education: [{
    degree: String,
    institution: String,
    location: String,
    graduationDate: Date,
    gpa: Number
  }],
  atsScore: {
    type: Number,
    default: 0
  },
  analysisResults: {
    missingSkills: [String],
    recommendations: [String],
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Resume = mongoose.model('Resume', resumeSchema);