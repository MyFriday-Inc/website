'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EmailDraftingProps = {
  onComplete: () => void;
};

export default function EmailDrafting({ onComplete }: EmailDraftingProps) {
  const [stage, setStage] = useState<'recipients' | 'subject' | 'content' | 'options' | 'sending' | 'complete'>('recipients');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  // Predefined data
  const allRecipients = [
    'Alex', 'Taylor', 'Jamie', 'Casey', 'Morgan', 'Me'
  ];
  
  const emailSubject = "Let's catch up soon!";
  
  const emailContent = "Hey everyone! It's been a while since we all caught up. I noticed the group hasn't connected in some time.";
  
  // Animation sequence
  useEffect(() => {
    const sequence = async () => {
      // Add recipients one by one
      for (const recipient of allRecipients) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setRecipients(prev => [...prev, recipient]);
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
      await new Promise(resolve => setTimeout(resolve, 400));
      onComplete();
    };
    
    sequence();
  }, [onComplete]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <div className="w-6 h-6 rounded-full bg-[#11d0be] text-white flex items-center justify-center text-xs font-bold mr-2">
            F
          </div>
          <div className="font-medium text-sm">Friday is drafting an email</div>
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#11d0be]" 
            initial={{ width: "0%" }}
            animate={{ 
              width: stage === 'recipients' ? "20%" : 
                     stage === 'subject' ? "40%" :
                     stage === 'content' ? "60%" :
                     stage === 'options' ? "80%" :
                     "100%" 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      <div className="space-y-3 flex-1">
        {/* To field */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">To:</div>
          <div className="min-h-[32px] border border-gray-200 rounded-md p-1.5 flex flex-wrap gap-1">
            <AnimatePresence>
              {recipients.map((recipient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-md flex items-center"
                >
                  {recipient}
                </motion.div>
              ))}
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
          <div className="text-xs font-medium text-gray-700 mb-1">Subject:</div>
          <div className="min-h-[32px] border border-gray-200 rounded-md p-1.5 flex items-center">
            <span className="text-sm">{subject}</span>
            <motion.div 
              className="w-1 h-4 bg-gray-800 ml-1"
              animate={{ opacity: stage === 'subject' ? [1, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </div>
        </div>
        
        {/* Content field */}
        <div>
          <div className="min-h-[80px] max-h-[80px] border border-gray-200 rounded-md p-1.5 whitespace-pre-line text-sm">
            {content}
            <motion.div 
              className="inline-block w-1 h-4 bg-gray-800 ml-1"
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
              className="border border-[#11d0be]/30 rounded-md bg-[#11d0be]/5 p-2"
            >
              <div className="text-xs mb-2">Meeting options:</div>
              <div className="flex flex-wrap gap-2">
                <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-24">
                  <div className="bg-gray-50 px-1 py-0.5 text-center border-b border-gray-200">
                    <div className="font-medium text-[10px]">Tuesday</div>
                    <div className="text-[10px] text-gray-500">Sept 24</div>
                  </div>
                  <div className="p-1 text-center text-[10px] bg-white">
                    <div className="font-medium">Central Coffee</div>
                    <div className="text-gray-500">6:00 PM</div>
                    <div className="bg-blue-100 text-blue-800 text-[8px] rounded px-1 inline-block mt-0.5">Casual</div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-24">
                  <div className="bg-gray-50 px-1 py-0.5 text-center border-b border-gray-200">
                    <div className="font-medium text-[10px]">Thursday</div>
                    <div className="text-[10px] text-gray-500">Sept 26</div>
                  </div>
                  <div className="p-1 text-center text-[10px] bg-white">
                    <div className="font-medium">City Park</div>
                    <div className="text-gray-500">5:30 PM</div>
                    <div className="bg-green-100 text-green-800 text-[8px] rounded px-1 inline-block mt-0.5">Outdoor</div>
                  </div>
                </div>
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
      
      {/* Sending overlay */}
      <AnimatePresence>
        {stage === 'complete' && (
          <motion.div 
            className="absolute inset-0 bg-white bg-opacity-80 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#11d0be] text-white p-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}