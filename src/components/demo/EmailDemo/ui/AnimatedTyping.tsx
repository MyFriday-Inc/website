'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';

type AnimatedTypingProps = {
  text: string;
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  delay?: number;
  onComplete?: () => void;
};

export default function AnimatedTyping({
  text,
  className = '',
  cursorClassName = 'text-black',
  typingSpeed = 40,
  delay = 0,
  onComplete,
}: AnimatedTypingProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const { isPlaying } = useEmailDemo();
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isPlaying && index < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (index >= text.length && onComplete) {
      // Small delay before calling onComplete
      timeout = setTimeout(() => {
        onComplete();
      }, 500);
    }
    
    return () => clearTimeout(timeout);
  }, [index, text, typingSpeed, onComplete, isPlaying]);
  
  // Blinking cursor effect
  useEffect(() => {
    if (!isPlaying) return;
    
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, [isPlaying]);
  
  return (
    <motion.div 
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <span>{displayedText}</span>
      {index < text.length && (
        <span 
          className={`inline-block w-0.5 h-4 ml-0.5 ${cursorClassName} ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ verticalAlign: 'middle' }}
        ></span>
      )}
    </motion.div>
  );
}
