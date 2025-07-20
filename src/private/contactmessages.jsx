import axios from 'axios';
import { useEffect, useState } from 'react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const res = await axios.get('http://localhost:3000/api/contact/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setMessages(res.data.messages);
        } else {
          throw new Error(res.data.message || 'Failed to fetch messages.');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err.message || err);
        setError(err.message || 'Failed to fetch messages.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div className="text-center text-[#8B6B3E]">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-[#8B6B3E] mb-4">Contact Messages</h1>
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li key={message._id} className="border-b pb-4">
              <p className="text-lg font-semibold text-[#8B6B3E]">
                {message.name || 'Unknown User'}
              </p>
              <p className="text-sm text-gray-600">
                {message.email || 'No Email Provided'}
              </p>
              <p className="text-gray-800">{message.message || 'No Content Available'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactMessages;