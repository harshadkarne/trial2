import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Star, Trophy } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error' | 'xp' | 'achievement';
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 4000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'xp':
        return <Star className="w-6 h-6 text-yellow-500" />;
      case 'achievement':
        return <Trophy className="w-6 h-6 text-purple-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'xp':
        return 'bg-yellow-50 border-yellow-200';
      case 'achievement':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${getBackgroundColor()}
          border rounded-xl shadow-lg p-4 max-w-sm w-full
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </h4>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all ease-linear ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'xp' ? 'bg-yellow-500' :
              type === 'achievement' ? 'bg-purple-500' : 'bg-blue-500'
            }`}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear`
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;