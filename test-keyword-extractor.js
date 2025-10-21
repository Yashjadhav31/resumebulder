// Test script to understand keyword-extractor API
import keywordExtractor from 'keyword-extractor';

console.log('keywordExtractor type:', typeof keywordExtractor);
console.log('keywordExtractor keys:', Object.keys(keywordExtractor));
console.log('keywordExtractor:', keywordExtractor);

// Test if it's a direct function
try {
  const result1 = keywordExtractor('This is a test sentence with some keywords');
  console.log('Direct function call result:', result1);
} catch (e) {
  console.log('Direct function call failed:', e.message);
}

// Test if it has extract method
try {
  const result2 = keywordExtractor.extract('This is a test sentence with some keywords');
  console.log('Extract method result:', result2);
} catch (e) {
  console.log('Extract method failed:', e.message);
}
