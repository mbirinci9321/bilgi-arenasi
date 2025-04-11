import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useChat } from '../contexts/ChatContext';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const MessageBubble = styled.div<{ isCurrentUser: boolean }>`
  background-color: ${props => props.isCurrentUser ? '#007bff' : '#e9ecef'};
  color: ${props => props.isCurrentUser ? 'white' : 'black'};
  padding: 8px 12px;
  border-radius: 12px;
  margin: 4px 0;
  max-width: 70%;
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
`;

const MessageInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  flex-grow: 1;
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.form`
  display: flex;
  gap: 8px;
`;

const MessageInfo = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-bottom: 4px;
`;

const Chat: React.FC = () => {
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message) => (
          <div key={message.id}>
            <MessageInfo>
              {message.userName} - {new Date(message.timestamp).toLocaleTimeString()}
            </MessageInfo>
            <MessageBubble isCurrentUser={message.userId === user.displayName}>
              {message.content}
            </MessageBubble>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer onSubmit={handleSubmit}>
        <MessageInput
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