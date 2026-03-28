/**
 * Simulated OCR Processor
 * In a real application, this would interface with an API like Tesseract.js,
 * Google Cloud Vision, or AWS Textract.
 */
export const extractDataFromDocument = async (file, type) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock extracted data based on document type
  switch(type) {
    case 'aadhaar':
      return {
        name: "KRISHNA KUMAR",
        dob: "15/08/2002",
        gender: "M",
        aadhaarNo: "XXXX-XXXX-1234",
        verified: true
      };
    case 'marksheet':
      return {
        marks: 85,
        percentage: 85,
        institution: "XYZ Technical University",
        year: 2023,
        verified: true
      };
    case 'income':
      return {
        annualIncome: 150000,
        validUntil: "2025-03-31",
        verified: true
      };
    default:
      return { data: "Extracted content", verified: false };
  }
};
