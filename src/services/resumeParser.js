    import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { extractEmailFromText, extractPhoneFromText, extractNameFromText } from '../utils/validators';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const extractTextFromDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

export const parseResume = async (file) => {
  try {
    let text = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      text = await extractTextFromPDF(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      text = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file format');
    }

    const name = extractNameFromText(text);
    const email = extractEmailFromText(text);
    const phone = extractPhoneFromText(text);

    return {
      name: name || '',
      email: email || '',
      phone: phone || '',
      rawText: text,
      success: true
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    return {
      name: '',
      email: '',
      phone: '',
      rawText: '',
      success: false,
      error: error.message
    };
  }
};

export const getMissingFields = (candidateData) => {
  const missing = [];
  if (!candidateData.name || candidateData.name.trim() === '') missing.push('name');
  if (!candidateData.email || candidateData.email.trim() === '') missing.push('email');
  if (!candidateData.phone || candidateData.phone.trim() === '') missing.push('phone');
  return missing;
};