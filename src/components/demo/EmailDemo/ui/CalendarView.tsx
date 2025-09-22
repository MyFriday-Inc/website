'use client';

import React from 'react';
import { motion } from 'framer-motion';

type CalendarViewProps = {
  day?: string;
  date?: string;
  time?: string;
  location?: string;
};

export default function CalendarView({ 
  day = 'Thursday', 
  date = 'Sept 26', 
  time = '5:30 PM',
  location = 'City Park'
}: CalendarViewProps) {
  const attendees = [
    { name: 'You', avatar: '/images/demo/avatar-you.jpg' },
    { name: 'Jamie Smith', avatar: '/images/demo/avatar3.jpg' },
    { name: 'Casey Johnson', avatar: '/images/demo/avatar4.jpg' },
    { name: 'Morgan Lee', avatar: '/images/demo/avatar5.jpg' },
    { name: 'Taylor Jordan', avatar: '/images/demo/avatar2.jpg' },
  ];
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Calendar Header */}
      <div className="bg-[#11d0be] text-white p-4">
        <h3 className="font-bold text-lg">Friend Meetup</h3>
        <div className="text-sm opacity-90">{day}, {date} · {time}</div>
      </div>
      
      {/* Calendar Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-start mb-4">
          <div className="bg-gray-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">{location}</div>
            <div className="text-sm text-gray-500">123 Park Avenue, City Center</div>
          </div>
        </div>
        
        {/* Time */}
        <div className="flex items-start mb-4">
          <div className="bg-gray-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">{time}</div>
            <div className="text-sm text-gray-500">Duration: 1.5 hours</div>
          </div>
        </div>
        
        {/* Attendees */}
        <div className="flex items-start">
          <div className="bg-gray-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div>
            <div className="font-medium mb-1">Attendees ({attendees.length})</div>
            <div className="flex flex-wrap -space-x-2">
              {attendees.map((attendee, index) => (
                <motion.img
                  key={attendee.name}
                  src={attendee.avatar || `/images/demo/avatar${index + 1}.jpg`}
                  alt={attendee.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  initial={{ opacity: 0, scale: 0, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.2 * index }}
                />
              ))}
              
              <motion.div 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs border-2 border-white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * attendees.length }}
              >
                +1
              </motion.div>
            </div>
            
            {/* Alex's note */}
          </div>
        </div>
      </div>
      
      {/* Calendar Actions */}
      <div className="bg-gray-50 p-3 flex space-x-3 border-t border-gray-200">
        <button className="bg-[#11d0be] text-white px-3 py-1 rounded text-sm font-medium flex-1 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Going
        </button>
        <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium flex-1 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Decline
        </button>
        <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
