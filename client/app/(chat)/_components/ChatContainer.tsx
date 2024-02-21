"use client";

import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

import InputText from "./InputText";
import UserLogin from "./UserLogin";
import ChatList from "./ChatList";

const ChatContainer = () => {
  // ERROR: Module not found: Can't resolve 'bufferutil' in '/Users/jithoon/Documents/laugh-lab/client/node_modules/ws/lib'
  let socketio = socketIOClient("http://localhost:5001");

  const [chats, setChats] = useState<any>([]);
  const [user, setUser] = useState<any>("");
  const [avatar, setAvatar] = useState<any>("");

  useEffect(() => {
    setUser(sessionStorage.getItem("user"));
    setAvatar(sessionStorage.getItem("avatar"));
  }, [user, avatar]);

  useEffect(() => {
    socketio.on("chat", (senderChats) => {
      setChats(senderChats);
    });

    return () => {
      socketio.off("chat");
    };
  }, []);

  function sendChatToSocket(chat: any) {
    socketio.emit("chat", chat);
  }

  function addMessage(chat: any) {
    const newChat = { ...chat, user: sessionStorage.getItem("user"), avatar };
    //addToFirrebase(chat);
    setChats([...chats, newChat]);
    sendChatToSocket([...chats, newChat]);
  }

  function logout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("avatar");
    setUser("");
  }

  return (
    <>
      {user ? (
        <>
          <h4>Username: {user}</h4>
          <p
            onClick={() => logout()}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Log Out
          </p>
          <ChatList chats={chats} user={user} />
          <InputText addMessage={addMessage} />
        </>
      ) : (
        <UserLogin user={user} setUser={setUser} />
      )}
    </>
  );
};

export default ChatContainer;
