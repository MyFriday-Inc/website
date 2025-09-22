'use client';

import React from 'react';
import { motion } from 'framer-motion';

type EmailReplyAnimationProps = {
  from: string;
  avatar: string;
  content: string;
  onComplete: () => void;
};

export default function EmailReplyAnimation({ from, avatar, content, onComplete }: EmailReplyAnimationProps) {
  const [typedContent, setTypedContent] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);
  
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < content.length) {
        setTypedContent(content.substring(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeNextChar, Math.random() * 20 + 15); // Random typing speed
      } else {
        setIsComplete(true);
        setTimeout(onComplete, 800);
      }
    };
    
    // Start typing after a delay
    timeout = setTimeout(typeNextChar, 300);
    
    return () => clearTimeout(timeout);
  }, [content, onComplete]);
  
  const firstInitial = from.charAt(0);
  
  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-2 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={from} className="w-full h-full object-cover" />
            ) : (
              <span>{firstInitial}</span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="text-sm font-medium mb-1.5">{from} is typing...</div>
            
            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
              <p className="text-sm text-gray-800">
                {typedContent}
                {!isComplete && (
                  <motion.span
                    className="inline-block w-1.5 h-3.5 bg-gray-400 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                )}
              </p>
            </div>
            
            {isComplete && (
              <motion.div 
                className="flex justify-end mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs text-gray-500">Just sent</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}