import axios from 'axios';

/**
 * Sends bill text, a question, and a target language to the backend AI analysis engine.
 */
export const analyzeBill = async (billText, question, language, demoMode = false) => {
  try {
    const payload = {
      bill_text: billText,
      question: question,
      language: language,
      demo_mode: demoMode
    };

    const response = await axios.post('/api/analyze', payload);
    return response.data;
  } catch (error) {
    return { error: "Failed to connect to backend", details: error.message };
  }
};

/**
 * Sends two document drafts and an optional targeted question to extract chronological AI-assisted differences.
 */
export const compareBills = async (oldBillText, newBillText, question, demoMode = false) => {
  try {
    const payload = {
      old_bill: oldBillText,
      new_bill: newBillText,
      question: question,
      demo_mode: demoMode
    };

    const response = await axios.post('/api/compare', payload);
    return response.data;
  } catch (error) {
    return { error: "Failed to connect to backend for comparison", details: error.message };
  }
};
