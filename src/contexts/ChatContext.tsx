import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';

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
  sendMessage: (content: string) => Promise<void>;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;

    // Son 50 mesajı getir ve gerçek zamanlı dinle
    const q = query(
      collection(db, 'messages'),
      where('teamId', '==', teamId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesData.reverse()); // En eski mesaj en üstte olacak şekilde sırala
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [teamId]);

  const sendMessage = async (content: string) => {
    if (!auth.currentUser || !teamId || !content.trim()) return;

    await addDoc(collection(db, 'messages'), {
      teamId,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || 'Anonim',
      content: content.trim(),
      timestamp: new Date()
    });
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