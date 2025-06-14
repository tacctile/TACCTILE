import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

interface WarningModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionText: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: React.ReactNode;
  isDangerous?: boolean;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  title,
  message,
  actionText,
  onConfirm,
  onCancel,
  icon,
  isDangerous = true
}) => {
  if (!isOpen) return null;

  // Render modal using React Portal to ensure it appears above everything
  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="w-full max-w-md bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl animate-scale-in relative" style={{ zIndex: 10000 }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDangerous ? 'bg-orange-600/20' : 'bg-spotify-green/20'
            }`}>
              {icon || <AlertTriangle className={`w-5 h-5 ${isDangerous ? 'text-orange-400' : 'text-spotify-green'}`} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-spotify-white font-spotify">{title}</h2>
              <p className="text-spotify-text-gray text-sm font-spotify">Please confirm this action</p>
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
          <p className="text-spotify-text-gray font-spotify leading-relaxed">
            {message}
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
            className={`flex-1 py-3 px-4 font-medium rounded-full transition-all font-spotify ${
              isDangerous 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-spotify-green hover:bg-spotify-green-dark text-spotify-black'
            }`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WarningModal;