import React from 'react';

interface ConnectionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const ConnectionButton = ({ onClick, children }: ConnectionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="
        px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-600
        text-gray-200 font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      {children}
    </button>
  );
};

export default ConnectionButton;
