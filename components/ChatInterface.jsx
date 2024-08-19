import React, { useRef, useEffect } from 'react';
import { useConversations } from '@/app/context/ConversationsContext';
import ChatInput from '@/components/ChatInput';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {content}
  </ReactMarkdown>
);

const WritingIndicator = () => (
  <div className="flex items-center space-x-2 text-gray-500">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const ChatInterface = () => {
  const { messages, isTyping, handleSendMessage } = useConversations();
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-100px)] lg:bg-gray-50 rounded-r-3xl pt-2 lg:shadow-xl">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-0 lg:px-4 py-2 no-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <img src="/images/no-messages.svg" alt="No messages" className="w-32 h-32 mb-4" />
            <p className="text-lg font-semibold">No Messages Yet</p>
            <p className="text-sm">Your lab test reports are available for discussion. Feel free to ask about your biomarkers!</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl shadow-lg ${
                message.role === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
              <MarkdownRenderer content={message.content} />
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 p-3 rounded-xl shadow-md">
              <WritingIndicator />
            </div>
          </div>
        )}
        <div ref={scrollAnchorRef}></div>
      </div>
      <div className="pb-4 pt-2 lg:pb-2 lg:px-4 sticky bottom-0 lg:rounded-br-3xl">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default React.memo(ChatInterface);
