import React, { useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const Chatform = ({ onSend, disabled }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const question = inputRef.current.value.trim();
    if (!question) return;
    inputRef.current.value = '';
    onSend(question);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-center bg-white rounded-full shadow-md px-2 py-1 border border-gray-300 w-full max-w-4xl"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="flex-1 px-4 py-2 outline-none bg-transparent text-sm placeholder-gray-500"
        required
        disabled={disabled}
      />
      <button
        type="submit"
        className="w-8 h-8 bg-[#cca78a] text-white rounded-full flex items-center justify-center"
        disabled={disabled}
      >
        <FaArrowUp className="text-lg" />
      </button>
    </form>
  );
};

export default Chatform;
