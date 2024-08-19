import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from 'lucide-react';
import { useConversations } from '@/app/context/ConversationsContext';
import ConfirmationModal from '@/components/ConfirmationModal';

const ConversationsList = ({ setActiveTab }) => {
  const { conversations, conversationId, handleSelectConversation, handleNewConversation, handleDeleteConversation } = useConversations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = (id) => {
    setConversationToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setConversationToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteConversation(conversationToDelete);
    } catch (error) {
      console.error("Error deleting conversation:", error);
      // Optionally, you can add error handling here, such as showing an error message to the user
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  return (
    <div className="h-full overflow-y-auto p-2 bg-white rounded-l-3xl relative">
      <Button 
        onClick={handleNewConversation}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white mb-4 lg:mt-2 rounded-xl"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        New Conversation
      </Button>
      {conversations.map((conv) => (
        <div 
          key={conv.id} 
          className={`p-2 mb-2 cursor-pointer rounded-xl transition-colors flex justify-between items-center ${
            conv.id === conversationId 
              ? 'bg-teal-100 border-teal-300' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => {
            handleSelectConversation(conv.id);
            setActiveTab(1);
          }}
        >
          <div className="flex-1">
            <p className="font-semibold text-gray-800 truncate">
              {conv.messages[0]?.content.substring(0, 30)}...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(conv.createdAt * 1000).toLocaleString()}
            </p>
          </div>
          <button 
            className="ml-2 p-1 text-gray-500 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              openModal(conv.id);
            }}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
      {isModalOpen && (
        <ConfirmationModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onConfirm={confirmDelete} 
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default React.memo(ConversationsList);
