import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaRobot } from 'react-icons/fa';
import Chatform from './Chatform';
import { clearChat, sendQuestion } from '../redux/slices/chatbotSlice';
import { SyncLoader } from 'react-spinners';
import { TbMessageChatbotFilled } from 'react-icons/tb';


const Chatbot = () => {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.chatbot);
  const [showWelcome, setShowWelcome] = useState(false);
const [isTypingWelcome, setIsTypingWelcome] = useState(true);

useEffect(() => {
  // Simulate delay before bot shows welcome message
  const timer = setTimeout(() => {
    setIsTypingWelcome(false);
    setShowWelcome(true);
  }, 1500); // 1.5 seconds

  return () => clearTimeout(timer);
}, []);


  const handleSend = (question) => {
    dispatch(sendQuestion(question));
  };

  const handleClear = () => {
    dispatch(clearChat());
  };

  return (
    <div className="max-w-4xl mx-auto my-8 rounded-xl bg-white shadow-xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-[#cca78a] text-white flex items-center justify-between px-4 py-3 text-base font-semibold rounded-t-xl">
        <div className="flex items-center">
          <TbMessageChatbotFilled className="mr-2 text-2xl" />
          Chatbot
        </div>
        <button onClick={handleClear} className="text-sm underline">
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Simulated "thinking" welcome message */}
{isTypingWelcome && (
  <div className="flex justify-start">
    <div className="px-4 py-2 bg-gray-100 rounded-2xl rounded-bl-none">
      <SyncLoader size={6} color="#555" />
    </div>
  </div>
)}

{showWelcome && (
  <div className="flex justify-start">
    <div className="max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-line text-sm leading-snug bg-gray-100 text-gray-800 rounded-bl-none">
      👋 Bonjour ! Comment puis-je vous aider aujourd’hui ? Je suis là pour répondre à vos questions concernant nos produits.
    </div>
  </div>
)}


        {history.map((entry, idx) => (
          <React.Fragment key={idx}>
            {/* User question */}
            <div className="flex justify-end">
              <div className="max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-line text-sm leading-snug bg-[#cca78a] text-white rounded-br-none">
                {entry.question}
              </div>
            </div>
            {/* Bot response */}
            {entry.response && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-line text-sm leading-snug bg-gray-100 text-gray-800 rounded-bl-none">
                  {entry.response}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-100 rounded-2xl rounded-bl-none">
      <SyncLoader size={6} color="#555" />
    </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="px-4 py-2 text-red-600">{error}</div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-gray-200">
        <Chatform onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default Chatbot;
