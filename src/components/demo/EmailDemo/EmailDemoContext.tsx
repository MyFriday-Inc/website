'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Common types shared across all stages
export type Friend = {
  name: string;
  email: string;
  avatar: string;
  color: string;
  responds: boolean;
};

export type MeetingOption = {
  day: string;
  date: string;
  time: string;
  location: string;
  tag: string;
  tagColor: string;
};

type EmailDemoContextType = {
  // Friends data - consistent across all stages
  friends: Friend[];
  
  // Meeting options - consistent across all stages
  meetingOptions: MeetingOption[];
  
  // Email metadata - consistent across all stages
  emailSubject: string;
  emailContent: string;
  nudgeContent: string;
  finalPlanContent: string;
  
  emailTimestamps: {
    original: string;
    firstReplies: string;
    nudge: string;
    moreReplies: string;
    finalPlan: string;
    alexReply: string;
  };
  
  // Current stage tracking
  currentStage: number;
  moveToNextStage: () => void;
  resetDemo: () => void;
};

const defaultContext: EmailDemoContextType = {
  friends: [],
  meetingOptions: [],
  emailSubject: "",
  emailContent: "",
  nudgeContent: "",
  finalPlanContent: "",
  emailTimestamps: {
    original: "",
    firstReplies: "",
    nudge: "",
    moreReplies: "",
    finalPlan: "",
    alexReply: ""
  },
  currentStage: 1,
  moveToNextStage: () => {},
  resetDemo: () => {},
};

export const EmailDemoContext = createContext<EmailDemoContextType>(defaultContext);

export const useEmailDemo = () => useContext(EmailDemoContext);

export const EmailDemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(1);
  
  // Define consistent friends data - one person (Jamie) never responds
  const [friends] = useState<Friend[]>([
    { 
      name: 'Alex', 
      email: 'alex@example.com', 
      avatar: '/images/demo/alex-avatar.png',
      color: 'blue',
      responds: true
    },
    { 
      name: 'Taylor', 
      email: 'taylor@example.com', 
      avatar: '/images/demo/taylor-avatar.png',
      color: 'yellow',
      responds: true 
    },
    { 
      name: 'Jamie', 
      email: 'jamie@example.com', 
      avatar: '/images/demo/jamie-avatar.png',
      color: 'green',
      responds: false // Jamie never responds
    },
    { 
      name: 'Casey', 
      email: 'casey@example.com', 
      avatar: '/images/demo/casey-avatar.png',
      color: 'purple',
      responds: true
    },
    { 
      name: 'Morgan', 
      email: 'morgan@example.com', 
      avatar: '/images/demo/morgan-avatar.png',
      color: 'red',
      responds: true
    }
  ]);
  
  // Define consistent meeting options
  const [meetingOptions] = useState<MeetingOption[]>([
    {
      day: 'Tuesday',
      date: 'Sept 24',
      time: '6:00 PM',
      location: 'Central Coffee',
      tag: 'Casual',
      tagColor: 'blue'
    },
    {
      day: 'Thursday',
      date: 'Sept 26',
      time: '5:30 PM',
      location: 'City Park',
      tag: 'Outdoor',
      tagColor: 'green'
    }
  ]);
  
  // Define consistent email content
  const [emailSubject] = useState("Let's catch up soon!");
  const [emailContent] = useState("Hey everyone! It's been a while since we all caught up. I noticed the group hasn't connected in some time. Let's fix that!");
  
  // Define Friday's sarcastic nudge content
  const [nudgeContent] = useState("Hey there, party people! 👋\n\nAlex and Casey responded (gold stars! ⭐️), but I'm still waiting on the rest of you.\n\nNot saying you're avoiding me, but my feelings are getting hurt! 😜 Help a poor AI out - Tuesday at Central Coffee or Thursday at City Park?\n\nTick tock... I'll be here waiting... forever... (or until you reply!)");
  
  // Define Friday's final plan content
  const [finalPlanContent] = useState("Thursday at City Park (5:30 PM) is our winner! Alex, Casey, Morgan, and Taylor are on board. Jamie is ghosting us 👻.\n\nI've added this to everyone's calendar. Looking forward to seeing you all!");
  
  // Define realistic timestamps
  const [emailTimestamps] = useState({
    original: "Sep 21, 10:15 AM",
    firstReplies: "Sep 21, 2:45 PM",
    nudge: "Sep 23, 9:30 AM",
    moreReplies: "Sep 23, 11:20 AM",
    finalPlan: "Sep 23, 4:15 PM",
    alexReply: "Sep 23, 5:05 PM"
  });
  
  const moveToNextStage = useCallback(() => {
    setCurrentStage(prev => (prev < 8 ? prev + 1 : 1));
  }, []);
  
  const resetDemo = useCallback(() => {
    setCurrentStage(1); // Reset to first stage
  }, []);
  
  const contextValue: EmailDemoContextType = {
    friends,
    meetingOptions,
    emailSubject,
    emailContent,
    nudgeContent,
    finalPlanContent,
    emailTimestamps,
    currentStage,
    moveToNextStage,
    resetDemo,
  };
  
  return (
    <EmailDemoContext.Provider value={contextValue}>
      {children}
    </EmailDemoContext.Provider>
  );
};