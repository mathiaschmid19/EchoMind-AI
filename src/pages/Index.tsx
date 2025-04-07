
import React from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import ChatContainer from '@/components/ChatContainer';

const Index: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar />
      <ChatContainer />
    </div>
  );
};

export default Index;
