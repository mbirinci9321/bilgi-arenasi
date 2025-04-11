import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChat } from '../contexts/ChatContext';
import { auth } from '../firebase';

const ChatContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 400px;
  width: 100%;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div<{ isOwnMessage: boolean }>`
  background: ${props => props.isOwnMessage ? '#4CAF50' : '#f1f1f1'};
  color: ${props => props.isOwnMessage ? 'white' : '#333'};
  padding: 0.5rem 1rem;
  border-radius: 16px;
  max-width: 70%;
  align-self: ${props => props.isOwnMessage ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
`;

const MessageInfo = styled.div<{ isOwnMessage: boolean }>`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
  text-align: ${props => props.isOwnMessage ? 'right' : 'left'};
`;

const InputContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: #666;
`;

const Chat: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      setNewMessage('');
    }
  };

  if (isLoading) {
    return (
      <ChatContainer>
        <LoadingMessage>Mesajlar yükleniyor...</LoadingMessage>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message) => {
          const isOwnMessage = message.userId === auth.currentUser?.uid;
          return (
            <div key={message.id}>
              <MessageInfo isOwnMessage={isOwnMessage}>
                {isOwnMessage ? 'Sen' : message.userName}
              </MessageInfo>
              <MessageBubble isOwnMessage={isOwnMessage}>
                {message.content}
              </MessageBubble>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <SendButton type="submit" disabled={!newMessage.trim()}>
          Gönder
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat; 