import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
interface ResumeUploadProps {
  onUploadComplete: (resumeId: string, initialAnalysis?: any) => void;
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
      alert('Please upload a valid resume file (txt, pdf, doc, docx)');
      return;
    }

    setFileName(file.name);
    setUploading(true);

    try {
      const resumeText = await extractTextFromFile(file);

      const form = new FormData();
      form.append('file', file);
      form.append('text', resumeText);

      const token = localStorage.getItem('authToken');

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to upload resume');
      }

      const data = await response.json();
      const resumeId = data.resumeId || data.id || data._id;

      setUploading(false);
      
      // Show analysis results if available
      if (data.initialAnalysis) {
        console.log('Initial analysis received:', data.initialAnalysis);
      }
      
      onUploadComplete(resumeId, data.initialAnalysis);
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume. Please try again.');
      setUploading(false);
      setParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleChange}
          disabled={uploading || parsing}
        />

        <label
          htmlFor="resume-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="mb-4">
            {uploading || parsing ? (
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            ) : fileName ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <div className="relative">
                <FileText className="w-16 h-16 text-gray-400" />
                <Upload className="w-8 h-8 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {uploading
              ? 'Uploading...'
              : parsing
              ? 'Analyzing Resume...'
              : fileName
              ? 'Resume Uploaded Successfully!'
              : 'Upload Your Resume'}
          </h3>

          <p className="text-gray-600 text-center mb-4">
            {uploading || parsing
              ? 'Please wait while we process your resume'
              : fileName
              ? 'Ready to find your perfect job match'
              : 'Drag and drop your resume here, or click to browse'}
          </p>

          {!uploading && !parsing && !fileName && (
            <p className="text-sm text-gray-500">
              Supported formats: TXT, PDF, DOC, DOCX
            </p>
          )}
        </label>
      </div>
    </div>
  );
}
