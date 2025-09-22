'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type Stage1Props = {
  onComplete: () => void;
};

export default function Stage1_Drafting({ onComplete }: Stage1Props) {
  const { friends, meetingOptions } = useEmailDemo();
  const [stage, setStage] = useState<'recipients' | 'subject' | 'content' | 'options' | 'sending' | 'complete'>('recipients');
  // Reset recipients on every mount to avoid duplication
  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  const emailSubject = "Let's catch up soon!";
  const emailContent = "Hey everyone! It's been a while since we all caught up. I noticed the group hasn't connected in some time. Let's fix that!";
  
  // Animation sequence
  useEffect(() => {
    // First, explicitly clear the recipients
    setRecipients([]);
    
    const sequence = async () => {
      // Ensure we start fresh
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Add recipients one by one (only the 5 friends)
      const uniqueFriends = Array.from(new Set(friends.map(f => f.name))); // Ensure uniqueness
      for (const friendName of uniqueFriends) {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Use function form to avoid closure issues
        setRecipients(currentRecipients => {
          // Double check we're not adding duplicates
          if (currentRecipients.includes(friendName)) {
            return currentRecipients;
          }
          return [...currentRecipients, friendName];
        });
      }
      
      // Move to subject
      await new Promise(resolve => setTimeout(resolve, 600));
      setStage('subject');
      
      // Type subject
      for (let i = 1; i <= emailSubject.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 40));
        setSubject(emailSubject.substring(0, i));
      }
      
      // Move to content
      await new Promise(resolve => setTimeout(resolve, 600));
      setStage('content');
      
      // Type content (faster)
      for (let i = 1; i <= emailContent.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 8));
        setContent(emailContent.substring(0, i));
      }
      
      // Show options
      await new Promise(resolve => setTimeout(resolve, 600));
      setStage('options');
      setShowOptions(true);
      
      // Send email
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStage('sending');
      
      // Complete
      await new Promise(resolve => setTimeout(resolve, 800));
      setStage('complete');
      
      // Notify parent component
      await new Promise(resolve => setTimeout(resolve, 200));
      onComplete();
    };
    
    // Start the sequence
    let isMounted = true;
    sequence().catch(err => {
      console.error("Animation sequence error:", err);
    });
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [onComplete, friends]);
  
  return (
    <div className="flex flex-col">
      <div className="space-y-2 flex-1">
        {/* From field - more compact */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-0.5">From:</div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-[#11d0be] text-white flex items-center justify-center text-xs font-bold mr-1.5">
              F
            </div>
            <span className="text-xs text-gray-800">Friday <span className="text-gray-500 text-[10px]">&lt;friday@myfriday.app&gt;</span></span>
          </div>
        </div>
        
        {/* To field */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-0.5">To:</div>
          <div className="min-h-[28px] border border-gray-200 rounded-md p-1 flex flex-wrap gap-1">
            <AnimatePresence>
              {recipients.map((recipient, index) => {
                const friend = friends.find(f => f.name === recipient);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-${friend?.color || 'gray'}-100 text-${friend?.color || 'gray'}-800 text-[10px] px-1.5 py-0.5 rounded-md flex items-center`}
                  >
                    {recipient}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <motion.div 
              className="w-1 h-4 bg-gray-800 ml-1"
              animate={{ opacity: stage === 'recipients' ? [1, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </div>
        </div>
        
        {/* Subject field */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-0.5">Subject:</div>
          <div className="min-h-[26px] border border-gray-200 rounded-md p-1 flex items-center">
            <span className="text-xs">{subject}</span>
            <motion.div 
              className="w-1 h-3 bg-gray-800 ml-1"
              animate={{ opacity: stage === 'subject' ? [1, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </div>
        </div>
        
        {/* Content field */}
        <div>
          <div className="min-h-[60px] border border-gray-200 rounded-md p-1.5 whitespace-pre-line text-xs overflow-y-auto">
            {content}
            <motion.div 
              className="inline-block w-1 h-3 bg-gray-800 ml-1"
              animate={{ opacity: stage === 'content' ? [1, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </div>
        </div>
        
        {/* Meeting options */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-[#11d0be]/30 rounded-md bg-[#11d0be]/5 p-1.5"
            >
              <div className="flex flex-wrap gap-1">
                {meetingOptions.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-20">
                    <div className="bg-gray-50 px-1 py-0.5 text-center border-b border-gray-200">
                      <div className="font-medium text-[8px]">{option.day}</div>
                      <div className="text-[8px] text-gray-500">{option.date}</div>
                    </div>
                    <div className="p-0.5 text-center text-[8px] bg-white">
                      <div className="font-medium">{option.location}</div>
                      <div className="text-gray-500">{option.time}</div>
                      <div className={`bg-${option.tagColor}-100 text-${option.tagColor}-800 text-[6px] rounded px-1 inline-block mt-0.5`}>
                        {option.tag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Send button */}
      <div className="mt-2 flex justify-end">
        <motion.button
          className={`px-3 py-1 rounded-md text-sm ${stage === 'sending' ? 'bg-gray-300' : 'bg-[#11d0be]'} text-white font-medium`}
          whileHover={stage !== 'sending' ? { scale: 1.03 } : {}}
          animate={stage === 'sending' ? { scale: [1, 0.95, 1] } : {}}
          transition={stage === 'sending' ? { repeat: 2, duration: 0.3 } : {}}
        >
          {stage === 'sending' ? 'Sending...' : 'Send'}
        </motion.button>
      </div>
    </div>
  );
}