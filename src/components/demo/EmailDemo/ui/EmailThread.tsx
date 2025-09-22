'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmailDemo } from '../EmailDemoContext';
import AnimatedTyping from './AnimatedTyping';

type Email = {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  subject: string;
  content: string;
  timestamp: string;
  isExpanded: boolean;
  attachments?: {
    type: 'calendar' | 'image' | 'suggestion';
    content: React.ReactNode;
  }[];
};

export default function EmailThread() {
  const { resetDemo } = useEmailDemo();
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  // This will handle our sequential demo flow
  useEffect(() => {
    // Reset emails when component mounts
    setEmails([]);
    setCurrentStep(0);
    
    const steps = [
      // Friday directly creating and sending group email
      () => {
        setEmails([
          {
            id: '1',
            from: { name: 'Friday', email: 'friday@myfriday.app', avatar: '/images/demo/friday-avatar.png' },
            to: [
              { name: 'Alex', email: 'alex@example.com' },
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Casey', email: 'casey@example.com' },
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Let\'s catch up soon!',
            content: "Hey everyone!\n\nIt's been a while since you all caught up. I noticed the group hasn't connected in some time and thought I'd help coordinate.",
            timestamp: 'Aug 12',
            isExpanded: true,
            attachments: [
              {
                type: 'suggestion',
                content: (
                  <div className="border border-[#11d0be]/30 rounded-md bg-[#11d0be]/5 p-2 my-2">
                    <div className="text-xs text-gray-800">
                      <p className="mb-1.5">Here are some options that might work:</p>
                      
                      <div className="flex flex-wrap gap-2 my-2">
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
                      
                      <p className="text-xs">Let me know which works best for everyone!</p>
                    </div>
                  </div>
                )
              }
            ]
          }
        ]);
      },
      
      // Friends respond with their preferences - only 2 reply
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '2',
            from: { name: 'Alex', email: 'alex@example.com', avatar: '/images/demo/alex-avatar.png' },
            to: [
              { name: 'Friday', email: 'friday@myfriday.app' },
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Casey', email: 'casey@example.com' },
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon!',
            content: "Tuesday works great for me! Central Coffee is my favorite spot. Can't wait to see everyone!",
            timestamp: 'Aug 13',
            isExpanded: true
          }
        ]);
      },
      
      // Casey's response
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '3',
            from: { name: 'Casey', email: 'casey@example.com', avatar: '/images/demo/casey-avatar.png' },
            to: [
              { name: 'Friday', email: 'friday@myfriday.app' },
              { name: 'Alex', email: 'alex@example.com' },
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon!',
            content: "Thursday at the park sounds much better for me! I'd prefer the outdoor option.",
            timestamp: 'Aug 14',
            isExpanded: true
          }
        ]);
      },
      
      // Friday's sarcastic follow-up to the non-responders
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '4',
            from: { name: 'Friday', email: 'friday@myfriday.app', avatar: '/images/demo/friday-avatar.png' },
            to: [
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Me', email: 'me@example.com' },
              { name: 'Alex', email: 'alex@example.com' },
              { name: 'Casey', email: 'casey@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon! (Are you there? 👀)',
            content: "Hey there! Just checking if you saw my earlier email? Alex and Casey have already responded. No pressure, but your input would help us choose between Tuesday and Thursday!",
            timestamp: 'Aug 15',
            isExpanded: true
          }
        ]);
      },
      
      // Everyone responds and Friday resolves conflicts
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '5',
            from: { name: 'Morgan', email: 'morgan@example.com', avatar: '/images/demo/morgan-avatar.png' },
            to: [
              { name: 'Friday', email: 'friday@myfriday.app' },
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Casey', email: 'casey@example.com' },
              { name: 'Alex', email: 'alex@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon! (Are you there? 👀)',
            content: "Sorry for the delay! Thursday works for me. I'd love to go to the park.",
            timestamp: 'Aug 16',
            isExpanded: true
          }
        ]);
      },
      
      // Jamie replies
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '6',
            from: { name: 'Jamie', email: 'jamie@example.com', avatar: '/images/demo/jamie-avatar.png' },
            to: [
              { name: 'Friday', email: 'friday@myfriday.app' },
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Casey', email: 'casey@example.com' },
              { name: 'Alex', email: 'alex@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon! (Are you there? 👀)',
            content: "I'm in for Thursday too! Park sounds perfect.",
            timestamp: 'Aug 16',
            isExpanded: true
          }
        ]);
      },
      
      // Taylor replies
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '7',
            from: { name: 'Taylor', email: 'taylor@example.com', avatar: '/images/demo/taylor-avatar.png' },
            to: [
              { name: 'Friday', email: 'friday@myfriday.app' },
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Casey', email: 'casey@example.com' },
              { name: 'Alex', email: 'alex@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon! (Are you there? 👀)',
            content: "Either day works for me, but I'll go with the majority for Thursday!",
            timestamp: 'Aug 16',
            isExpanded: true
          }
        ]);
      },
      
      // Calendar invites sent
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '8',
            from: { name: 'Friday', email: 'friday@myfriday.app', avatar: '/images/demo/friday-avatar.png' },
            to: [
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Casey', email: 'casey@example.com' },
              { name: 'Alex', email: 'alex@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon! - FINAL PLAN',
            content: "Thanks for all your responses! The majority can make Thursday at City Park (5:30 PM), so let's lock that in.\n\nAlex, would you be able to join virtually for a few minutes? I've added the event to everyone's calendar.",
            timestamp: 'Aug 16',
            isExpanded: true,
            attachments: [
              {
                type: 'calendar',
                content: (
                  <div className="border border-gray-200 rounded-md overflow-hidden bg-white my-2 shadow-sm">
                    {/* Calendar Header */}
                    <div className="bg-[#11d0be] text-white p-1.5">
                      <h3 className="font-bold text-xs">Friend Meetup</h3>
                      <div className="text-[10px] opacity-90">Thursday, Sept 26 · 5:30 PM</div>
                    </div>
                    
                    {/* Calendar Content */}
                    <div className="p-1.5 text-xs">
                      <div className="flex items-start mb-1.5">
                        <div className="text-[10px] font-medium">City Park</div>
                        <div className="bg-green-100 text-green-800 text-[8px] rounded px-1 ml-1">Outdoor</div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="text-[10px] mr-1">5 Attendees</div>
                        <div className="flex -space-x-1">
                          <div className="w-4 h-4 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[8px] font-bold">A</div>
                          <div className="w-4 h-4 rounded-full bg-yellow-100 border border-white flex items-center justify-center text-[8px] font-bold">T</div>
                          <div className="w-4 h-4 rounded-full bg-green-100 border border-white flex items-center justify-center text-[8px] font-bold">J</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Calendar Actions */}
                    <div className="bg-gray-50 p-1 border-t border-gray-200 text-[10px]">
                      <button className="bg-[#11d0be] text-white px-2 py-0.5 rounded flex items-center justify-center">
                        <svg className="h-2 w-2 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Going
                      </button>
                    </div>
                  </div>
                )
              }
            ]
          }
        ]);
      },
      
      // Alex's final response
      () => {
        setEmails(prev => [
          ...prev,
          {
            id: '9',
            from: { name: 'Alex', email: 'alex@example.com', avatar: '/images/demo/alex-avatar.png' },
            to: [
              { name: 'Friday', email: 'friday@myfriday.app' },
              { name: 'Morgan', email: 'morgan@example.com' },
              { name: 'Taylor', email: 'taylor@example.com' },
              { name: 'Jamie', email: 'jamie@example.com' },
              { name: 'Casey', email: 'casey@example.com' },
              { name: 'Me', email: 'me@example.com' }
            ],
            subject: 'Re: Let\'s catch up soon! - FINAL PLAN',
            content: "That works for me! I'll join virtually for a bit. Thanks for coordinating everyone, Friday!",
            timestamp: 'Aug 16',
            isExpanded: true
          }
        ]);
      },
      
      // Reset after a while and loop
      () => {
        setTimeout(() => {
          resetDemo();
        }, 5000);
      }
    ];
    
    // Run the sequence with delays
    const delays = [1000, 3000, 3000, 3000, 2000, 2000, 2000, 3000, 2000];
    
    let timeouts: NodeJS.Timeout[] = [];
    
    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        step();
        setCurrentStep(index + 1);
      }, delays.slice(0, index + 1).reduce((sum, delay) => sum + delay, 0));
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [resetDemo]);
  
  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {emails.map((email) => (
        <motion.div 
          key={email.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-200 pb-4 mb-4 last:border-b-0"
        >
          {/* Email header */}
          <div className="flex items-start">
            {/* Avatar */}
            <div className="w-6 h-6 rounded-full bg-[#11d0be] text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
              {email.from.name.charAt(0)}
            </div>
            
            {/* Email content */}
            <div className="flex-1">
              {/* From line */}
              <div className="flex items-center">
                <div className="font-medium text-sm text-gray-900">{email.from.name}</div>
                <div className="text-[10px] text-gray-500 ml-auto flex-shrink-0">{email.timestamp}</div>
              </div>
              
              {/* To line */}
              <div className="text-[10px] text-gray-500 mb-1">
                to {email.to.map(recipient => recipient.name).join(', ')}
              </div>
              
              {/* Email body */}
              <div className="text-xs text-gray-800 whitespace-pre-line">
                {currentStep === parseInt(email.id) ? (
                  <AnimatedTyping
                    text={email.content}
                    className="block"
                    delay={0.2}
                    typingSpeed={20}
                  />
                ) : (
                  <p>{email.content}</p>
                )}
              </div>
              
              {/* Attachments */}
              {email.attachments && email.attachments.map((attachment, idx) => (
                <div key={idx} className="mt-2">
                  {attachment.content}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Manual controls */}
      <div className="absolute bottom-2 right-2 flex space-x-2 opacity-50 hover:opacity-100">
        <button 
          onClick={() => resetDemo()}
          className="bg-gray-200 text-gray-800 text-[10px] px-2 py-1 rounded"
        >
          Restart
        </button>
      </div>
    </div>
  );
}