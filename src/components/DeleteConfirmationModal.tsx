import React from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  tileName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  tileName,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-spotify-white font-spotify">Delete Tile</h2>
              <p className="text-spotify-text-gray text-sm font-spotify">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-spotify-text-gray font-spotify mb-2">
            Are you sure you want to delete{' '}
            <span className="text-spotify-white font-semibold">"{tileName}"</span>?
          </p>
          <p className="text-spotify-text-gray text-sm font-spotify">
            You can always add it back later from your dashboard settings.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-spotify-light-gray/20 flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-white font-medium rounded-full transition-all font-spotify"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-all font-spotify"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;