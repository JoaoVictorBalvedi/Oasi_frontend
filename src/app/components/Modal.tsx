import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'confirm';
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, type = 'info', onConfirm }) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'confirm':
        return 'border-blue-500';
      default:
        return 'border-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className={`relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border-t-4 ${getTypeStyles()}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-600 mb-6">{children}</div>
        {type === 'confirm' && onConfirm && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 