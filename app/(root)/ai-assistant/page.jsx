// app/ai-health-chat/page.jsx
"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import HeaderBox from "@/components/HeaderBox";
import { ArrowLeft, Send } from 'lucide-react';

const AiHealthChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newMessage = { type: 'user', content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');

    // TODO: Implement actual AI response logic
    // For now, we'll just simulate a response
    setTimeout(() => {
      const aiResponse = { type: 'ai', content: "I'm an AI assistant. How can I help you with your health today?" };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  return (
    <section className='page '>
      <header className='px-2' >
        <Link href="/" className="back-link">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <HeaderBox
          type="aiChat"
          title="AI Assistant"
        />
      </header>

      <div className="bg-white rounded-3xl md:shadow-xl p-2 md:p-6 flex flex-col h-[calc(100vh-130px)] ">
        <div className="flex-grow scrollArea" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-xl max-w-[80%] break-words ${
                  message.type === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center pt-2 ">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2 auth-input"
          />
          <Button type="submit" className="bg-teal-500 hover:bg-teal-600 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AiHealthChatPage;
