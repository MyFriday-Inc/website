'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type Stage5_SentFinalProps = {
  onComplete: () => void;
};

export default function Stage5_SentFinal({ onComplete }: Stage5_SentFinalProps) {
  const { friends, finalPlanContent, emailTimestamps } = useEmailDemo();
  
  // Auto-advance and restart demo after showing the sent email for a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);
    
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
            <div className="ml-auto text-xs text-gray-500">{emailTimestamps.finalPlan}</div>
          </div>
          
          <div className="text-xs text-gray-500">
            To: {friends.map(friend => friend.name).join(', ')}
          </div>
        </div>
        
        {/* Email content */}
        <div className="text-sm whitespace-pre-line overflow-y-auto max-h-[180px]">
          {finalPlanContent}
        </div>
        
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm mt-2"
        >
          {/* Calendar Header */}
          <div className="bg-[#11d0be] text-white p-2">
            <h3 className="font-bold text-sm">Friend Meetup</h3>
            <div className="text-xs opacity-90">Thursday, Sept 26 · 6:00 PM</div>
          </div>
          
          {/* Calendar Content */}
          <div className="p-2 text-sm">
            <div className="flex items-start mb-2">
              <div className="font-medium">City Park</div>
              <div className="bg-green-100 text-green-800 text-xs rounded px-1 ml-2">Outdoor</div>
            </div>
            
            <div className="flex items-center">
              <div className="text-xs mr-2">5 Attendees</div>
              <div className="flex -space-x-2">
                {friends.map((friend, index) => (
                  <div 
                    key={index} 
                    className={`w-6 h-6 rounded-full bg-${friend.color}-100 border border-white flex items-center justify-center text-xs font-bold`}
                  >
                    {friend.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Calendar Actions */}
          <div className="bg-gray-50 p-2 border-t border-gray-200">
            <button className="bg-[#11d0be] text-white px-3 py-1 rounded flex items-center justify-center text-xs">
              <svg className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Going
            </button>
          </div>
        </motion.div>
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