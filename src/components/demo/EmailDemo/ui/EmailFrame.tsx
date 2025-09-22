'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type EmailFrameProps = {
  children: ReactNode;
  className?: string;
};

export default function EmailFrame({ children, className = '' }: EmailFrameProps) {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 w-full max-w-3xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Email Content Area - No header, no UI elements */}
      <div className="px-4 py-3 h-[380px]">
        {children}
      </div>
    </motion.div>
  );
}