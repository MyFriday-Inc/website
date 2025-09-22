'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type Stage1_SentEmailProps = {
  onComplete: () => void;
};

export default function Stage1_SentEmail({ onComplete }: Stage1_SentEmailProps) {
  const { friends, meetingOptions, emailSubject, emailContent, emailTimestamps } = useEmailDemo();
  
  // Auto-advance after showing the sent email for a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="space-y-3 flex-1">
        {/* Email header - KEEP CONSISTENT WITH OTHER STAGES */}
        <div className="border-b border-gray-200 pb-3">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full bg-[#11d0be] text-white flex items-center justify-center text-xs font-bold mr-2">
              F
            </div>
            <div>
              <div className="text-sm font-medium">Friday</div>
              <div className="text-xs text-gray-500">friday@myfriday.app</div>
            </div>
            <div className="ml-auto text-xs text-gray-500">{emailTimestamps.original}</div>
          </div>
          
          <div className="text-base font-medium mb-1">{emailSubject}</div>
          
          <div className="text-xs text-gray-500">
            To: {friends.map(friend => friend.name).join(', ')}
          </div>
        </div>
        
        {/* Email content */}
        <div className="text-sm whitespace-pre-line">
          {emailContent}
        </div>
        
        {/* Meeting options */}
        <div className="border border-[#11d0be]/30 rounded-md bg-[#11d0be]/5 p-3 mt-4">
          <div className="text-sm mb-2 font-medium">Meeting options:</div>
          <div className="flex flex-wrap gap-3">
            {meetingOptions.map((option, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * (index + 1) }}
                className="border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-32"
              >
                <div className="bg-gray-50 px-2 py-1 text-center border-b border-gray-200">
                  <div className="font-medium text-xs">{option.day}</div>
                  <div className="text-xs text-gray-500">{option.date}</div>
                </div>
                <div className="p-2 text-center text-xs bg-white">
                  <div className="font-medium">{option.location}</div>
                  <div className="text-gray-500">{option.time}</div>
                  <div className={`bg-${option.tagColor}-100 text-${option.tagColor}-800 text-[10px] rounded px-1 inline-block mt-1`}>
                    {option.tag}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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