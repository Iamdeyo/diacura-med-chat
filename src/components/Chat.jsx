import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import socket from "../socket";
const BASE_URL = "https://diacura-med.onrender.com";
const Chat = ({ chat, user, onlineUsers, setTargetId }) => {
  const [otherUser, setOtherUser] = useState(null);
  const [lastMessage, setLastMessage] = useState(chat.last_message);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    // get other users data
    const otherUserId =
      user.id === chat.doctor_id ? chat.patient_id : chat.doctor_id;
    const getUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/${otherUserId}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
        });
        const data = await res.json();
        setOtherUser(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (onlineUsers.length > 0 && otherUser) {
      onlineUsers.forEach((ol) => {
        if (ol.userId === otherUser?.id) {
          setOnline(true);
        }
      });
    }
  }, [onlineUsers, otherUser]);

  useEffect(() => {
    const handleIncomingLastMessage = (message) => {
      if (message.id === chat.id) {
        setLastMessage(message.last_message);
        setTargetId(chat.id);
      }
    };
    socket.on("lastMgs", handleIncomingLastMessage);

    // Specify the cleanup function
    return () => {
      // Remove the event listener when the component is unmounted
      socket.off("lastMgs", handleIncomingLastMessage);
    };
  }, []);

  return (
    <Link to={`/chat/${chat.id}`}>
      {<span className={online ? "online-icon" : "offline-icon"}></span>}
      <img
        src={otherUser?.display_photo ? otherUser.display_photo : "/no-dp.png"}
        alt="user photo"
        className="user-photo"
      />
      <div className="text">
        <div className="text-top">
          <p className="username">
            {otherUser ? otherUser.username : "xxxxxxxxx"}
          </p>
          <span className="time"> 11:58 </span>
        </div>
        <div className="text-bottom">
          <p className="last-mgs">{lastMessage}</p>
          {lastMessageCount > 0 && (
            <span className="unread-mgs-count">{lastMessageCount}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Chat;
