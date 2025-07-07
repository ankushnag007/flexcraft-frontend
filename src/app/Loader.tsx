"use client"
import { useEffect, useState } from 'react';

interface LoaderProps {
  onLoadingComplete: () => void;
  loadingText?: string;
  completedText?: string;
  loaderColor?: string;
}

const Loader = ({ 
  onLoadingComplete, 
  loadingText = 'Generating your project...', 
  completedText = 'Done!',
  loaderColor = 'blue'
}: LoaderProps) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete(), 300);
          return 100;
        }
        return prev + 3.33;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  const getStatusMessage = (progress: number): string => {
    if (progress < 30) return 'Setting up files...';
    if (progress < 70) return 'Writing code...';
    return 'Finalizing project...';
  };

  const colorClasses = {
    blue: 'bg-blue-600 border-blue-500',
    indigo: 'bg-indigo-600 border-indigo-500',
    purple: 'bg-purple-600 border-purple-500',
    // Add more colors as needed
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${colorClasses[loaderColor as keyof typeof colorClasses]}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 border-4 rounded-full animate-spin ${colorClasses[loaderColor as keyof typeof colorClasses]} border-t-transparent`}></div>
        <p className="text-lg font-medium text-gray-700">
          {progress < 100 ? loadingText : completedText}
        </p>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {getStatusMessage(progress)}
      </p>
    </div>
  );
};

export default Loader;