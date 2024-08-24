"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useConversations } from '@/app/context/ConversationsContext';
import ModernTabs from '@/components/ModernTabs';
import ConversationsList from '@/components/assistant/ConversationsList';
import ChatInterface from '@/components/assistant/ChatInterface';

const Assistant = () => {
  const { loading } = useConversations();
  const [activeTab, setActiveTab] = useState(0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const tabsContent = [
    {
      label: "Chat",
      content: <ChatInterface />
    },
    {
      label: "Conversations",
      content: <ConversationsList setActiveTab={setActiveTab} />
    }
  ];

  return (
    <section className='flex w-full  flex-col h-screen px-2 py-4 lg:px-6  lg:py-6 overflow-y-auto no-scrollbar'>
      <header className='px-2 pb-2'>
        <Link href="/" className="back-link">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      <div className="flex flex-col  lg:flex-row">
        <div className="hidden lg:block lg:w-1/4 bg-gray-200 rounded-l-3xl">
          <ConversationsList setActiveTab={setActiveTab} />
        </div>

        <div className="max-lg:hidden lg:w-3/4 rounded-r-3xl">
          <ChatInterface />
        </div>

        <div className="lg:hidden ">
          <ModernTabs tabs={tabsContent} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </section>
  );
};

export default React.memo(Assistant);
