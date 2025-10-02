export const validateEmail = (email) => {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
    return { valid: false, error: 'Only PDF and DOCX files are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  return { valid: true };
};

export const extractEmailFromText = (text) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : '';
};

export const extractPhoneFromText = (text) => {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : '';
};

export const extractNameFromText = (text) => {
  // Look for name patterns at the beginning of resume
  const lines = text.split('\n').filter(line => line.trim());
  
  // Common patterns: Name is usually in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Skip if it looks like email or phone
    if (line.includes('@') || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line)) continue;
    
    // Check if it looks like a name (2-4 words, capitalized)
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const isName = words.every(word => 
        word.length > 1 && 
        word[0] === word[0].toUpperCase() &&
        /^[A-Za-z]+$/.test(word)
      );
      if (isName) return line;
    }
  }
  
  return '';
};