import React, { useState } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleAskQuestion = async () => {
    if (!question) return;

    setLoading(true);

    try {
      // Send the question to the backend
      const response = await axios.post('https://your-backend-url/ask', {
        context: 'Extracted PDF content here', // Replace with actual extracted text
        question,
      });

      setAnswer(response.data.answer); // Set the answer from the backend
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Sorry, there was an issue processing your question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Ask a question about the report..."
      />
      <button onClick={handleAskQuestion} disabled={loading}>
        {loading ? 'Getting Answer...' : 'Ask Question'}
      </button>

      {answer && <div><strong>Answer:</strong> {answer}</div>}
    </div>
  );
};

export default ChatInterface;
