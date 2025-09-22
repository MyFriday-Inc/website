'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedTyping from './AnimatedTyping';

type MessageBodyProps = {
  isComposing?: boolean;
  delay?: number;
  showSuggestions?: boolean;
  onComplete?: () => void;
};

export default function MessageBody({ 
  isComposing = true, 
  delay = 0,
  showSuggestions = true,
  onComplete 
}: MessageBodyProps) {
  return (
    <div className="border border-gray-200 rounded-md p-4 min-h-[200px] focus:outline-none bg-white">
      {isComposing ? (
        <div className="space-y-4">
          <AnimatedTyping
            text="Hey everyone!"
            className="block"
            delay={delay}
            typingSpeed={30}
          />
          
          <AnimatedTyping
            text="It's been a while since we all caught up. I miss you all and would love to get together soon."
            className="block"
            delay={delay + 1}
            typingSpeed={20}
          />
          
          {showSuggestions && (
            <>
              <AnimatedTyping
                text="Here are some options that might work for everyone:"
                className="block"
                delay={delay + 3}
                typingSpeed={20}
              />
              
              <motion.div 
                className="mt-4 space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: delay + 5, duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-4">
                  {/* Tuesday Option */}
                  <motion.div 
                    className="border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-32"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: delay + 5.1, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gray-50 px-3 py-1 text-center border-b border-gray-200">
                      <div className="font-medium text-sm">Tuesday</div>
                      <div className="text-xs text-gray-500">Sept 24</div>
                    </div>
                    <div className="p-2 text-center text-xs bg-white">
                      <div className="font-medium">Central Coffee</div>
                      <div className="text-gray-500">6:00 PM</div>
                    </div>
                  </motion.div>
                  
                  {/* Wednesday Option */}
                  <motion.div 
                    className="border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-32"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: delay + 5.3, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gray-50 px-3 py-1 text-center border-b border-gray-200">
                      <div className="font-medium text-sm">Wednesday</div>
                      <div className="text-xs text-gray-500">Sept 25</div>
                    </div>
                    <div className="p-2 text-center text-xs bg-white">
                      <div className="font-medium">Pasta Palace</div>
                      <div className="text-gray-500">7:30 PM</div>
                    </div>
                  </motion.div>
                  
                  {/* Thursday Option */}
                  <motion.div 
                    className="border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col w-32"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: delay + 5.5, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gray-50 px-3 py-1 text-center border-b border-gray-200">
                      <div className="font-medium text-sm">Thursday</div>
                      <div className="text-xs text-gray-500">Sept 26</div>
                    </div>
                    <div className="p-2 text-center text-xs bg-white">
                      <div className="font-medium">City Park</div>
                      <div className="text-gray-500">5:30 PM</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              <AnimatedTyping
                text="Let me know which option works best for everyone. Looking forward to seeing you all!"
                className="block"
                delay={delay + 6}
                typingSpeed={20}
                onComplete={onComplete}
              />
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p>Hey everyone!</p>
          <p>It's been a while since we all caught up. I miss you all and would love to get together soon.</p>
          <p>Here are some options that might work for everyone:</p>
          
          <div className="flex flex-wrap gap-4">
            {/* Options */}
          </div>
          
          <p>Let me know which option works best for everyone. Looking forward to seeing you all!</p>
        </div>
      )}
    </div>
  );
}
