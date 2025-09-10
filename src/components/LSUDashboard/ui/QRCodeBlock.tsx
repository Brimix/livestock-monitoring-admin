import React from 'react';

interface QRCodeBlockProps {
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  imageSrc?: string;
  imageAlt?: string;
}

const QRCodeBlock: React.FC<QRCodeBlockProps> = ({ 
  title, 
  description, 
  size = 'md',
  imageSrc,
  imageAlt
}) => {
  const sizeClasses = {
    sm: 'w-40 h-40',    // was w-32 h-32
    md: 'w-52 h-52',    // was w-40 h-40
    lg: 'w-64 h-64'     // was w-48 h-48
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col items-center space-y-3">
      <h3 className="text-lg font-semibold text-gray-50 text-center">
        {title}
      </h3>
      
      {/* QR Code Image or Placeholder */}
      <div className={`
        ${sizeClasses[size]} 
        bg-gray-800 
        border-2 
        border-gray-600 
        rounded-lg 
        flex 
        items-center 
        justify-center
        overflow-hidden
      `}>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={imageAlt || title}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-1">📱</div>
            <div className="text-xs">QR Code</div>
            <div className="text-xs">Placeholder</div>
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-gray-400 text-center max-w-full">
          {description}
        </p>
      )}
    </div>
  );
};

export default QRCodeBlock; 