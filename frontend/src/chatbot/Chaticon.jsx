import React from 'react';
import { TbMessageChatbotFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const Chaticon = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-5 right-5 z-30">
      <button
        onClick={() => navigate('/chatbot')}
        aria-label="Chat"
        className="bg-[#cca78a] hover:bg-[#b89478] text-white p-3 rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b89478]"
      >
        <TbMessageChatbotFilled className="text-2xl" />
      </button>
    </div>
  );
};

export default Chaticon;
