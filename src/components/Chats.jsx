import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Chat from "./Chat";

const BASE_URL = "https://diacura-med.onrender.com";

const Chats = ({ user, onlineUsers }) => {
  const [usersChats, setUsersChats] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const { id: chatId } = useParams();
  // Declare reorderedChats at the component scope
  const [reorderedChats, setReorderedChats] = useState([]);

  useEffect(() => {
    const getUserChats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/chat`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
        });
        if (res.ok) {
          const chats = await res.json();
          setUsersChats(chats.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      getUserChats();
    }
  }, [user]);

  useEffect(() => {
    // Function to move an element to the front of the array
    function moveElementToFront(array, targetId) {
      const targetIndex = array.findIndex((item) => item.id === targetId);

      if (targetIndex !== -1) {
        return [
          array[targetIndex],
          ...array.slice(0, targetIndex),
          ...array.slice(targetIndex + 1),
        ];
      }

      return array; // If the target element is not found, return the original array
    }

    // Move the chat with the specified ID to the front
    setReorderedChats(moveElementToFront(usersChats, targetId));
  }, [targetId, usersChats]); // Include usersChats as a dependency

  return (
    <aside className={`chat-sidebar ${chatId ? "hid" : ""}`}>
      <div className="user-chats-top">
        <p>All</p>
        <p>Read</p>
        <p>Unread</p>
      </div>
      <ul className="user-chats">
        {reorderedChats.map((chat, i) => (
          <li key={chat.id} className={`${chatId === chat.id ? "active" : ""}`}>
            <Chat
              chat={chat}
              user={user}
              setTargetId={setTargetId}
              onlineUsers={onlineUsers}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Chats;
