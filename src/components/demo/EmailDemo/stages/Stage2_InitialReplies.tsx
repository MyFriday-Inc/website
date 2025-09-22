'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type Stage2Props = {
  onComplete: () => void;
};

export default function Stage2_InitialReplies({ onComplete }: Stage2Props) {
  const { friends, emailSubject, emailContent, emailTimestamps } = useEmailDemo();
  const [showFirstReply, setShowFirstReply] = useState(false);
  const [showSecondReply, setShowSecondReply] = useState(false);

  // Find Alex and Casey from friends
  const alex = friends.find(f => f.name === 'Alex');
  const casey = friends.find(f => f.name === 'Casey');

  useEffect(() => {
    const sequence = async () => {
      // Show original email summary immediately
      
      // Show first reply
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowFirstReply(true);
      
      // Show second reply
      await new Promise(resolve => setTimeout(resolve, 1800));
      setShowSecondReply(true);
      
      // Move to next stage with smoother transition
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fade out all replies before moving to next stage
      setShowFirstReply(false);
      setShowSecondReply(false);
      
      // Small delay before triggering next stage
      await new Promise(resolve => setTimeout(resolve, 300));
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
            <div className="text-sm font-medium text-gray-800">{emailSubject}</div>
            <div className="text-xs text-gray-500 truncate">{emailContent.substring(0, 50)}...</div>
          </div>
          <div className="text-xs text-gray-500 ml-auto flex-shrink-0">{emailTimestamps.original}</div>
        </div>
      </motion.div>
      
      {/* First Reply */}
      <AnimatePresence>
        {showFirstReply && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="border-b border-gray-100 pb-3 mb-3"
            layout
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full bg-${alex?.color || 'blue'}-100 text-${alex?.color || 'blue'}-800 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0`}>
                A
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-medium text-sm text-gray-900">Alex</div>
                  <div className="text-xs text-gray-500 ml-auto flex-shrink-0">{emailTimestamps.firstReplies}</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-1">
                  to Friday, {friends.filter(f => f.name !== 'Alex').map(f => f.name).join(', ')}
                </div>
                
                <div className="text-sm text-gray-800">
                  <p>Tuesday works great for me! Central Coffee is my favorite spot. Can&apos;t wait to see everyone!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Second Reply */}
      <AnimatePresence>
        {showSecondReply && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            layout
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full bg-${casey?.color || 'purple'}-100 text-${casey?.color || 'purple'}-800 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0`}>
                C
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-medium text-sm text-gray-900">Casey</div>
                  <div className="text-xs text-gray-500 ml-auto flex-shrink-0">{emailTimestamps.firstReplies}</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-1">
                  to Friday, {friends.filter(f => f.name !== 'Casey').map(f => f.name).join(', ')}
                </div>
                
                <div className="text-sm text-gray-800">
                  <p>Thursday at the park sounds much better for me! I&apos;d prefer the outdoor option.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}