'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type Stage3_SentNudgeProps = {
  onComplete: () => void;
};

export default function Stage3_SentNudge({ onComplete }: Stage3_SentNudgeProps) {
  const { friends, nudgeContent, emailTimestamps } = useEmailDemo();
  
  
  // Auto-advance after showing the sent email for a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="space-y-3 flex-1">
        {/* Email header */}
        <div className="border-b border-gray-200 pb-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full bg-[#11d0be] text-white flex items-center justify-center text-xs font-bold mr-2">
              F
            </div>
            <div>
              <div className="text-sm font-medium">Friday</div>
              <div className="text-xs text-gray-500">friday@myfriday.app</div>
            </div>
            <div className="ml-auto text-xs text-gray-500">{emailTimestamps.nudge}</div>
          </div>
          
          <div className="text-xs text-gray-500">
            To: {friends.map(friend => friend.name).join(', ')}
          </div>
        </div>
        
        {/* Email content */}
        <div className="text-sm whitespace-pre-line overflow-y-auto max-h-[220px]">
          {nudgeContent}
        </div>
      </div>
      
      {/* Delivered indicator */}
      <div className="flex items-center justify-end mt-2">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-500 flex items-center"
        >
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Delivered
        </motion.div>
      </div>
    </div>
  );
}