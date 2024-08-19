import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    onSendMessage(inputMessage);
    setInputMessage('');
    inputRef.current?.focus();
  }, [inputMessage, onSendMessage]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={handleInputChange}
        className=" auth-input"
        ref={inputRef}
      />
      <Button 
        type="submit" 
        className=" bg-teal-500 hover:bg-teal-600 text-white rounded-full "
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default React.memo(ChatInput);