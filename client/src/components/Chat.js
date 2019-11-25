import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import styled from 'styled-components';

import InfoBar from './InfoBar';
import Input from './Input';
import Messages from './Messages';
import UserList from './UserList';

let socket;

const ChatContainer = styled.div`

  border: 1px solid black;


  border-radius: 0.5rem;
  background: #444753;
  display: flex;
  flex-direction: row;
  width: 80vw;
  height: 80vh;
`;

const MessagesContainer = styled.div`

  border: 1px solid green;


  background: #F2F5F8;
  display: flex;
  flex-direction: column;
  width: 75%;
`;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState('');
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (error) => {
      if (error) alert(error);
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) socket.emit('sendMessage', message, () => setMessage(''));
  };

  return (
    <ChatContainer>
      <UserList users={users} />
      <MessagesContainer>
        <div>{room}</div>
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </MessagesContainer>
    </ChatContainer>
  );
};

export default Chat;
