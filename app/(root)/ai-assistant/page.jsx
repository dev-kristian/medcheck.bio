"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from 'lucide-react';
import ChatInput from '@/components/ChatInput'; 
import { useConversations } from '@/app/context/ConversationsContext';
import ModernTabs from '@/components/ModernTabs';

const AiHealthChatPage = () => {
  const { 
    conversations, 
    conversationId, 
    messages, 
    loading,
    handleSendMessage, 
    handleSelectConversation, 
    handleNewConversation 
  } = useConversations();

  const [activeTab, setActiveTab] = useState(0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const ConversationsList = React.memo(() => (
    <div className="h-full overflow-y-auto p-2 bg-white rounded-l-3xl">
      <Button 
        onClick={handleNewConversation}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white mb-4 lg:mt-2"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        New Conversation
      </Button>
      {conversations.map((conv) => (
        <div 
          key={conv.id} 
          className={`p-2 mb-2 cursor-pointer rounded-lg  transition-colors ${
            conv.id === conversationId 
              ? 'bg-teal-100 border-teal-300' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => {
            handleSelectConversation(conv.id);
            setActiveTab(1); // Switch to the "Chat" tab
          }}
        >
          <p className="font-semibold text-gray-800 truncate">
            {conv.messages[0]?.content.substring(0, 30)}...
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(conv.createdAt * 1000).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  ));

  const ChatInterface = React.memo(() => {
    const chatContainerRef = useRef(null);
    const scrollAnchorRef = useRef(null);
  
    useEffect(() => {
      if (scrollAnchorRef.current) {
        scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);
  
    return (
      <div className="flex flex-col h-full bg-white rounded-r-3xl">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-2 py-1 no-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={scrollAnchorRef}></div>
        </div>
        <div className="pb-4 pt-2">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    );
  });

  const tabsContent = [
    {
      label: "Conversations",
      content: <ConversationsList />
    },
    {
      label: "Chat",
      content: <ChatInterface />
    }
  ];

  return (
    <section className='flex w-full bg-gray-100 max-xl:max-h-screen flex-col overflow-y-scroll h-full no-scrollbar md:p-6'>
      <header className='px-2'>
        <Link href="/" className="back-link">
          <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-90px)] rounded-3xl lg:shadow-xl">
        <div className="hidden lg:block lg:w-1/4 border-r border-gray-100">
          <ConversationsList />
        </div>

        <div className="hidden lg:flex lg:flex-col lg:flex-1">
          <ChatInterface />
        </div>

        <div className="lg:hidden flex flex-col h-full px-2">
          <ModernTabs tabs={tabsContent} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </section>
  );
};

export default React.memo(AiHealthChatPage);
