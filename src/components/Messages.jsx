import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import Message from "./Message";
const BASE_URL = "https://diacura-med.onrender.com";
const Messages = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messageData, setMessageData] = useState({
    chatId: "",
    sender: "",
    text: "",
    receiver: "",
  });
  const navigate = useNavigate();
  // step 3
  // Get the chat id param from the URL and fetch messages.
  const { id: chatId } = useParams();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/chat/get-messages/${chatId}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + user?.token,
          },
        });
        if (res.ok) {
          const chat = await res.json();
          setChatInfo(chat.data);
          setMessages(chat.data.messages);
        } else {
          return navigate("/chat");
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (chatId && user) {
      getMessages();
    }
  }, [chatId, user]);

  useEffect(() => {
    const handleIncomingMessage = (message) => {
      setMessages((prev) => [message, ...prev]);
    };
    socket.on("getMessage", handleIncomingMessage);

    // Specify the cleanup function
    return () => {
      // Remove the event listener when the component is unmounted
      socket.off("getMessage", handleIncomingMessage);
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      // get other users data
      const otherUserId =
        user.id === chatInfo.doctor_id
          ? chatInfo.patient_id
          : chatInfo.doctor_id;
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
    if (chatInfo) {
      getUser();
    }
  }, [chatInfo]);

  const handleSendMessage = () => {
    socket.emit("sendMessage", chatId, messageData);
    setMessageData({
      chatId: "",
      sender: "",
      receiver: "",
      text: "",
    });
  };
  return (
    <div className="chat-messages">
      <div className="chat-messages-top" onClick={() => {}}>
        <img
          src={
            otherUser?.display_photo ? otherUser.display_photo : "/no-dp.png"
          }
          alt="user photo"
          className="user-photo"
        />
        <h2 className="username">
          {" "}
          {otherUser?.first_name} {otherUser?.last_name}
        </h2>
        <span className="icons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              d="M18.676 20.1076L12.961 14.3916C10.4187 16.1991 6.91544 15.757 4.90188 13.3746C2.88831 10.9921 3.03616 7.46422 5.242 5.25863C7.44726 3.05208 10.9755 2.90359 13.3584 4.91705C15.7413 6.9305 16.1836 10.4341 14.376 12.9766L20.091 18.6926L18.677 20.1066L18.676 20.1076ZM9.484 5.50062C7.58771 5.50019 5.95169 6.83131 5.56648 8.68807C5.18126 10.5448 6.15271 12.4169 7.89268 13.1709C9.63265 13.9248 11.6629 13.3535 12.7542 11.8027C13.8456 10.2519 13.6981 8.14795 12.401 6.76463L13.006 7.36463L12.324 6.68463L12.312 6.67263C11.5638 5.91981 10.5454 5.49776 9.484 5.50062Z"
              fill="#0D67A0"
            />
          </svg>
        </span>
        <span className="icons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              d="M13 16.5H12V12.5H11M12 8.5H12.01M21 12.5C21 17.4706 16.9706 21.5 12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5C16.9706 3.5 21 7.52944 21 12.5Z"
              stroke="#0D67A0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <ul className="message-container">
        {messages.map((mgs) => (
          <li
            className={`message ${mgs.sender_id === user.id ? "own" : ""}`}
            key={mgs.id}
          >
            <Message
              mgs={mgs}
              user={user}
              otherUserdp={otherUser?.display_photo}
            />
          </li>
        ))}
      </ul>
      <div className="chat-messages-bottom">
        <div className="input-area">
          <div className="shadow">{messageData.text}</div>
          <textarea
            name="message"
            value={messageData.text}
            onChange={(e) =>
              setMessageData({
                text: e.target.value,
                chatId: chatId,
                sender: user.id,
                receiver:
                  user.id !== chatInfo.patient_id
                    ? chatInfo.patient_id
                    : chatInfo.doctor_id,
              })
            }
            placeholder="Type Here..."
          ></textarea>
        </div>
        <div className="btns">
          <button className="send" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
