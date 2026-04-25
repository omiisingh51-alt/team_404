import React, { useState } from 'react';
import TopAppBar from './TopAppBar';
import SideNavBar from './SideNavBar';
import BottomNavBar from './BottomNavBar';
import SpeechToText from '../features/SpeechToText';

const Layout = ({ children }) => {
  const [speechOpen, setSpeechOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-surface text-on-surface">
      <TopAppBar onToggleSpeech={() => setSpeechOpen(!speechOpen)} isSpeechOpen={speechOpen} />
      <div className="flex flex-1 overflow-hidden pt-16">
        <SideNavBar />
        <main className="flex-1 overflow-y-auto lg:ml-72">
          {children}
        </main>
      </div>
      <BottomNavBar />
      {speechOpen && <SpeechToText onClose={() => setSpeechOpen(false)} />}
    </div>
  );
};

export default Layout;
