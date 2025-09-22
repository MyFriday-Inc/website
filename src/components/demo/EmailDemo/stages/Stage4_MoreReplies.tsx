'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type Stage4Props = {
  onComplete: () => void;
};

export default function Stage4_MoreReplies({ onComplete }: Stage4Props) {
  const { friends, emailTimestamps } = useEmailDemo();
  const [showMorgan, setShowMorgan] = useState(false);
  const [showTaylor, setShowTaylor] = useState(false);
  
  // Find friends (Jamie never responds)
  const morgan = friends.find(f => f.name === 'Morgan');
  const taylor = friends.find(f => f.name === 'Taylor');
  
  // Color mapping for Tailwind CSS
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  useEffect(() => {
    const sequence = async () => {
      // Show original email summary immediately
      
      // Show Morgan's reply
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowMorgan(true);
      
      // Show Taylor's reply
      await new Promise(resolve => setTimeout(resolve, 1800));
      setShowTaylor(true);
      
      // Move to next stage
      await new Promise(resolve => setTimeout(resolve, 2000));
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
            <div className="text-sm font-medium text-gray-800 truncate">Re: Let&apos;s catch up soon! (Are you there? 👀)</div>
            <div className="text-xs text-gray-500 truncate">Hey there, party people! 👋 Just checking if my last email got lost...</div>
          </div>
          <div className="text-xs text-gray-500 ml-2">{emailTimestamps.nudge}</div>
        </div>
      </motion.div>
      
      {/* Morgan's reply */}
      <AnimatePresence>
        {showMorgan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="border-b border-gray-100 pb-3 mb-3"
            layout
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full ${getColorClasses(morgan?.color || 'red')} flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0`}>
                M
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-medium text-sm text-gray-900">Morgan</div>
                  <div className="text-xs text-gray-500 ml-auto flex-shrink-0">{emailTimestamps.moreReplies}</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-1">
                  to Friday, {friends.filter(f => f.name !== 'Morgan').map(f => f.name).join(', ')}
                </div>
                
                <div className="text-sm text-gray-800">
                  <p>Sorry for the delay! Thursday at the park works for me. And no, I wasn&apos;t avoiding you Friday - just buried in work! 😂</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Taylor's reply */}
      <AnimatePresence>
        {showTaylor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            layout
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full ${getColorClasses(taylor?.color || 'yellow')} flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0`}>
                T
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-medium text-sm text-gray-900">Taylor</div>
                  <div className="text-xs text-gray-500 ml-auto flex-shrink-0">{emailTimestamps.moreReplies}</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-1">
                  to Friday, {friends.filter(f => f.name !== 'Taylor').map(f => f.name).join(', ')}
                </div>
                
                <div className="text-sm text-gray-800">
                  <p>Thursday works for me too! And Friday, your guilt trip worked perfectly - I&apos;m impressed by your emotional manipulation skills! 😊</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}