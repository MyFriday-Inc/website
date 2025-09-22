'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type Stage6_AlexReplyProps = {
  onComplete: () => void;
};

export default function Stage6_AlexReply({ onComplete }: Stage6_AlexReplyProps) {
  const { friends, emailTimestamps } = useEmailDemo();
  const [showReply, setShowReply] = useState(false);
  
  // Find Alex from friends
  const alex = friends.find(f => f.name === 'Alex');
  
  useEffect(() => {
    const sequence = async () => {
      // Show original email summary immediately
      
      // Show Alex's reply
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowReply(true);
      
      // Move to next stage
      await new Promise(resolve => setTimeout(resolve, 3200));
      onComplete();
    };
    
    sequence();
  }, [onComplete]);
  
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      className="h-full"
    >
      {/* Original email summary - KEEP CONSISTENT WITH SENT EMAIL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-gray-200 pb-3 mb-3"
        layout
      >
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-[#11d0be] text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
            F
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800 truncate">Re: Let's catch up soon! - FINAL PLAN</div>
            <div className="text-xs text-gray-500 truncate">Thanks for all your responses! The majority can make Thursday...</div>
          </div>
          <div className="text-xs text-gray-500 ml-2">{emailTimestamps.finalPlan}</div>
        </div>
      </motion.div>
      
      {/* Alex's reply */}
      <AnimatePresence>
        {showReply && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            layout
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full bg-${alex?.color || 'blue'}-100 text-${alex?.color || 'blue'}-800 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0`}>
                A
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-medium text-sm text-gray-900">Alex</div>
                  <div className="text-xs text-gray-500 ml-auto flex-shrink-0">{emailTimestamps.alexReply}</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-1">
                  to Friday, {friends.filter(f => f.name !== 'Alex').map(f => f.name).join(', ')}
                </div>
                
                <div className="text-sm text-gray-800">
                  <p>That works for me! Thanks for coordinating everyone, Friday!</p>
                </div>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}