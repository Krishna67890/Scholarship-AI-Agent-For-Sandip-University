/**
 * Form validators for document information and application fields.
 */
export const validateAadhaar = (aadhaar) => {
  return /^\d{12}$/.test(aadhaar) || /^\d{4}-\d{4}-\d{4}$/.test(aadhaar);
};

export const validateIncome = (income) => {
  const numericIncome = Number(income);
  return !isNaN(numericIncome) && numericIncome >= 0;
};

export const validateMarks = (marks) => {
  const numericMarks = Number(marks);
  return !isNaN(numericMarks) && numericMarks >= 0 && numericMarks <= 100;
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
