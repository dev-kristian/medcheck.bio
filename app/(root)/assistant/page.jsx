"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useConversations } from '@/app/context/ConversationsContext';
import ModernTabs from '@/components/ModernTabs';
import ConversationsList from '@/components/ConversationsList';
import ChatInterface from '@/components/ChatInterface';

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
    <section className='flex w-full  max-xl:max-h-screen flex-col overflow-y-scroll h-full no-scrollbar md:p-6'>
      <header className='px-2 pb-2'>
        <Link href="/" className="back-link">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      <div className="flex flex-col lg:flex-row  rounded-3xl lg:shadow-xl ">
        <div className="hidden lg:block lg:w-1/4 border-r border-gray-100">
          <ConversationsList setActiveTab={setActiveTab} />
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

export default React.memo(Assistant);
