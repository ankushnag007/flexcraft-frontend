import { Star, Paperclip } from 'lucide-react';

const EmailListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <ul className="divide-y divide-gray-200 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="px-4 py-3">
          <div className="flex items-center mb-1">
            <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
            <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="ml-auto h-3 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="pl-9 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="flex space-x-1">
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-gray-200 mr-1"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EmailListSkeleton;