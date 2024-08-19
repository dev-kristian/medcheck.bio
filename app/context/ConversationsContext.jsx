import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

const ConversationsContext = createContext();

export const ConversationsProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/chat/fetch-conversations?uid=${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.conversations);

      if (data.conversations.length > 0) {
        const latestConversation = data.conversations[0];
        setConversationId(latestConversation.id);
        setMessages(latestConversation.messages);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = useCallback(async (inputMessage) => {
    const newMessage = { role: 'user', content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          uid: user.uid, 
          message: inputMessage,
          conversationId: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const aiResponse = { role: 'assistant', content: data.content };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
        setConversations((prevConversations) => [
          { id: data.conversationId, messages: [newMessage, aiResponse], createdAt: Date.now() / 1000 },
          ...prevConversations,
        ]);
      } else {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, messages: [...conv.messages, newMessage, aiResponse] }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setIsTyping(false);
    }
  }, [user, conversationId]);

  const handleSelectConversation = useCallback((id) => {
    const selectedConversation = conversations.find(conv => conv.id === id);
    if (selectedConversation) {
      setConversationId(id);
      setMessages(selectedConversation.messages);
    }
  }, [conversations]);

  const handleNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
  }, []);

  const handleDeleteConversation = useCallback(async (id) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/chat/delete-conversation?uid=${user.uid}&conversationId=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      setConversations((prevConversations) => 
        prevConversations.filter((conv) => conv.id !== id)
      );

      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }, [user, conversationId]);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        conversationId,
        messages,
        loading,
        isTyping,
        handleSendMessage,
        handleSelectConversation,
        handleNewConversation,
        handleDeleteConversation, 
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => useContext(ConversationsContext);
