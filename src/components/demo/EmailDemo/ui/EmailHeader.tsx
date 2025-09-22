'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';
import AnimatedTyping from './AnimatedTyping';

type EmailHeaderProps = {
  isComposing?: boolean;
  showRecipients?: boolean;
  delay?: number;
};

export default function EmailHeader({ 
  isComposing = true, 
  showRecipients = true,
  delay = 0 
}: EmailHeaderProps) {
  const { sender, recipients } = useEmailDemo();
  
  return (
    <div className="mb-4 space-y-2">
      {/* From line */}
      <motion.div 
        className="flex space-x-2 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay }}
      >
        <span className="font-medium text-gray-600 w-16">From:</span>
        <div className="flex items-center">
          <motion.span 
            className="bg-[#11d0be] rounded-full h-8 w-8 flex items-center justify-center text-white font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
          >
            F
          </motion.span>
          <span className="ml-2 text-gray-800">{sender.email}</span>
        </div>
      </motion.div>

      {/* To line */}
      {showRecipients && (
        <motion.div 
          className="flex items-start space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          <span className="font-medium text-gray-600 w-16 mt-1">To:</span>
          <div className="flex flex-wrap gap-2">
            {recipients.length > 0 ? (
              recipients.map((recipient, index) => (
                <div 
                  key={recipient.email} 
                  className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {recipient.avatar && (
                    <img 
                      src={recipient.avatar} 
                      alt={recipient.name}
                      className="w-5 h-5 rounded-full mr-1"
                    />
                  )}
                  {recipient.name}
                </div>
              ))
            ) : isComposing ? (
              <AnimatedTyping
                text="Start typing to add recipients..."
                className="text-gray-400 italic"
                delay={delay + 0.5}
                cursorClassName="text-gray-400"
              />
            ) : null}
          </div>
        </motion.div>
      )}
      
      {/* Subject line */}
      <motion.div 
        className="flex space-x-2 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
      >
        <span className="font-medium text-gray-600 w-16">Subject:</span>
        {isComposing ? (
          <AnimatedTyping
            text="Let's catch up soon!"
            className="text-gray-900 font-medium"
            delay={delay + 0.8}
          />
        ) : (
          <span className="text-gray-900 font-medium">Let's catch up soon!</span>
        )}
      </motion.div>
    </div>
  );
}
