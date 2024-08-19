// components/ConfirmationModal.js
import React from 'react';
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";  // Updated import statement

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 px-2">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="bg-gray-50 p-6 rounded-3xl shadow-xl relative z-10">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this conversation? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl" disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={onConfirm} 
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                &nbsp;Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
