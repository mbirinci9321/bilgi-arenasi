import React, { createContext, useContext, useState, useEffect } from 'react';

interface Message {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode; teamId: string }> = ({ 
  children, 
  teamId 
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(`messages_${teamId}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(`messages_${teamId}`, JSON.stringify(messages));
  }, [messages, teamId]);

  const sendMessage = (content: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      teamId,
      userId: user.displayName,
      userName: user.displayName,
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}; 