'use client';

import React, { useState, useEffect } from 'react';
import { EmailDemoProvider, useEmailDemo } from './EmailDemoContext';
import { motion, AnimatePresence } from 'framer-motion';

// Import stages
import Stage1_Drafting from './stages/Stage1_Drafting';
import Stage1_SentEmail from './stages/Stage1_SentEmail';
import Stage2_InitialReplies from './stages/Stage2_InitialReplies';
import Stage3_SentNudge from './stages/Stage3_SentNudge';
import Stage4_MoreReplies from './stages/Stage4_MoreReplies';
import Stage5_SentFinal from './stages/Stage5_SentFinal';

type EmailDemoProps = {
  className?: string;
};

function EmailDemoContent({ className = '' }: EmailDemoProps) {
  const { currentStage, moveToNextStage, resetDemo } = useEmailDemo();
  const [contentHeight, setContentHeight] = useState<number>(380);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Reset demo on mount
  useEffect(() => {
    resetDemo();
  }, [resetDemo]);
  
  // Update height based on content
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          // Get the height of the content
          const contentHeight = entry.contentRect.height;
          // Set a minimum height of 380px, but allow it to grow if content is larger
          setContentHeight(Math.max(380, contentHeight + 32)); // Add padding
        }
      });
      
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [currentStage]);

  // Render the current stage
  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <Stage1_Drafting key={`drafting-stage-${Date.now()}`} onComplete={moveToNextStage} />;
      case 2:
        return <Stage1_SentEmail onComplete={moveToNextStage} />;
      case 3:
        return <Stage2_InitialReplies onComplete={moveToNextStage} />;
      case 4:
      case 5:
        return <Stage3_SentNudge onComplete={moveToNextStage} />;
      case 6:
        return <Stage4_MoreReplies onComplete={moveToNextStage} />;
      case 7:
      case 8:
        return <Stage5_SentFinal onComplete={resetDemo} />;
      default:
        return <Stage1_Drafting onComplete={moveToNextStage} />;
    }
  };

  // Use a layout animation instead of AnimatePresence for smoother transitions
  return (
    <div className={`relative w-full mx-auto ${className}`}>
      <motion.div
        layout
        style={{ height: `${contentHeight}px` }}
        className="p-4 overflow-hidden"
        transition={{ 
          type: "spring",
          stiffness: 100, 
          damping: 20,
          duration: 0.5
        }}
      >
        <div ref={containerRef}>
          <motion.div
            key={currentStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStage()}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function EmailDemo(props: EmailDemoProps) {
  return (
    <EmailDemoProvider>
      <EmailDemoContent {...props} />
    </EmailDemoProvider>
  );
}