import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import socket from "../socket";
import Chats from "../components/Chats";

const patient1 = {
  id: "6566091f85e56c91bfbf60bd",
  username: "fatima",
  email: "thetopesun@gmail.com",
  verified: true,
  role: "PATIENT",
  first_name: "Wonuola",
  last_name: "Adekunle",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjYwOTFmODVlNTZjOTFiZmJmNjBiZCIsImlhdCI6MTcwMTc3NTExNCwiZXhwIjoxNzAxODYxNTE0fQ.Bw6OMwkfqyqIDhL9uLpPLlXeR9yP6gkRjaVS6i-7csg",
};

const patient2 = {
  id: "656759eb77a68eafcc1b10e9",
  username: "ransom38",
  email: "addison25@hotmail.com",
  verified: true,
  role: "PATIENT",
  first_name: "ransom",
  last_name: "addison",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Njc1OWViNzdhNjhlYWZjYzFiMTBlOSIsImlhdCI6MTcwMTc4ODM0NiwiZXhwIjoxNzAxODc0NzQ2fQ.tQhJ5xLHjSrapNmFkA7-le8bqpBaZa--AjYQP-538mg",
};
const doctor = {
  id: "6564a905ca61f3ed79aa33d9",
  username: "jonny",
  email: "dtechlord@gmail.com",
  verified: true,
  role: "DOCTOR",
  first_name: "John",
  last_name: "kings",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjRhOTA1Y2E2MWYzZWQ3OWFhMzNkOSIsImlhdCI6MTcwMTg0NTUzMiwiZXhwIjoxNzAxOTMxOTMyfQ.0BzsgTcScljth6MAE_XEN6ClhEb9OInjYcd_OQxjL8Y",
};

const Chat = () => {
  const [user, setUser] = useState(doctor);
  const [messages, setMessages] = useState([]);
  const [messageData, setMessageData] = useState({
    chatId: "",
    sender: "",
    receiver: "",
    text: "",
  });

  function formatTimeString(dateString) {
    const dateObject = new Date(dateString);

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  }

  // step 3
  // Get the chat id param from the URL and fetch messages.
  const { id: chatId } = useParams();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/chat/get-messages/${chatId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + user?.token,
            },
          }
        );
        if (res.ok) {
          const messages = await res.json();
          setMessages(messages.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (chatId && user) {
      getMessages();
    }
  }, [chatId, user]);

  // step 4
  // connect to socket.io server
  useEffect(() => {
    // Connect the socket when the component mounts
    socket.connect();

    if (user) {
      socket.emit("addUser", user.id); // Replace with the actual user ID

      // Update online users list
      socket.on("updateOnlineUsers", (users) => {
        console.log(users);
      });
    }

    if (chatId) {
      // Join the room when component mounts
      socket.emit("join", chatId);
    }

    return () => {
      // Disconnect socket when component unmounts
      socket.disconnect();
    };
  }, [user, chatId]);

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
    <>
      {/* {!user && (
        <div className="select-user-container">
          <p>Sign in as a </p>
          <button onClick={() => setUser(doctor)}>Doctor</button>
          <span>or</span>
          <button onClick={() => setUser(patient1)}>Patient 1</button>
          <span>or</span>
          <button onClick={() => setUser(patient2)}>Patient 2</button>
        </div>
      )} */}
      <section>
        <div className={`chat-top ${chatId ? "hid" : ""}`}>
          <h2 className="title">Chat</h2>
          <div className="search-bar">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input type="text" placeholder="What are you looking for..." />
          </div>
          <div className="notifications">
            <span className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12.0016 2.40039C8.02515 2.40039 4.8016 5.62394 4.8016 9.60039V13.9033L3.95307 14.7519C3.60987 15.0951 3.5072 15.6112 3.69294 16.0596C3.87868 16.508 4.31624 16.8004 4.8016 16.8004H19.2016C19.687 16.8004 20.1245 16.508 20.3103 16.0596C20.496 15.6112 20.3933 15.0951 20.0501 14.7519L19.2016 13.9033V9.60039C19.2016 5.62394 15.978 2.40039 12.0016 2.40039Z"
                  fill="#0D67A0"
                />
                <path
                  d="M12.0016 21.6004C10.0133 21.6004 8.40156 19.9886 8.40156 18.0004H15.6016C15.6016 19.9886 13.9898 21.6004 12.0016 21.6004Z"
                  fill="#0D67A0"
                />
              </svg>
            </span>
            <span className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2.00001 11.9997C2.00051 9.80727 2.72149 7.67579 4.052 5.93326C5.3825 4.19074 7.24878 2.93375 9.36361 2.35574C11.4784 1.77774 13.7246 1.91076 15.7565 2.73432C17.7883 3.55789 19.4932 5.02636 20.6087 6.91374C21.7243 8.80111 22.1886 11.0028 21.9304 13.1799C21.6721 15.3571 20.7056 17.389 19.1794 18.963C17.6533 20.537 15.6521 21.5659 13.484 21.8912C11.3159 22.2166 9.10093 21.8204 7.18001 20.7637L3.29201 21.9477C3.11859 22.0005 2.93408 22.0052 2.7582 21.9612C2.58232 21.9173 2.42169 21.8264 2.29351 21.6982C2.16532 21.57 2.07439 21.4094 2.03044 21.2335C1.98649 21.0576 1.99118 20.8731 2.04401 20.6997L3.22801 16.8057C2.41992 15.3329 1.99749 13.6796 2.00001 11.9997ZM8.00001 10.9997C8.00001 11.2649 8.10537 11.5192 8.2929 11.7068C8.48044 11.8943 8.7348 11.9997 9.00001 11.9997H15C15.2652 11.9997 15.5196 11.8943 15.7071 11.7068C15.8947 11.5192 16 11.2649 16 10.9997C16 10.7345 15.8947 10.4801 15.7071 10.2926C15.5196 10.105 15.2652 9.99967 15 9.99967H9.00001C8.7348 9.99967 8.48044 10.105 8.2929 10.2926C8.10537 10.4801 8.00001 10.7345 8.00001 10.9997ZM9.00001 13.9997C8.7348 13.9997 8.48044 14.105 8.2929 14.2926C8.10537 14.4801 8.00001 14.7345 8.00001 14.9997C8.00001 15.2649 8.10537 15.5192 8.2929 15.7068C8.48044 15.8943 8.7348 15.9997 9.00001 15.9997H13C13.2652 15.9997 13.5196 15.8943 13.7071 15.7068C13.8947 15.5192 14 15.2649 14 14.9997C14 14.7345 13.8947 14.4801 13.7071 14.2926C13.5196 14.105 13.2652 13.9997 13 13.9997H9.00001Z"
                  fill="#0D67A0"
                />
              </svg>
            </span>
            <span className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.19844 2.40039C6.5357 2.40039 5.99844 2.93765 5.99844 3.60039V4.80039H4.79844C3.47295 4.80039 2.39844 5.87491 2.39844 7.20039V19.2004C2.39844 20.5259 3.47295 21.6004 4.79844 21.6004H19.1984C20.5239 21.6004 21.5984 20.5259 21.5984 19.2004V7.20039C21.5984 5.87491 20.5239 4.80039 19.1984 4.80039H17.9984V3.60039C17.9984 2.93765 17.4612 2.40039 16.7984 2.40039C16.1357 2.40039 15.5984 2.93765 15.5984 3.60039V4.80039H8.39844V3.60039C8.39844 2.93765 7.86118 2.40039 7.19844 2.40039ZM7.19844 8.40039C6.5357 8.40039 5.99844 8.93765 5.99844 9.60039C5.99844 10.2631 6.5357 10.8004 7.19844 10.8004H16.7984C17.4612 10.8004 17.9984 10.2631 17.9984 9.60039C17.9984 8.93765 17.4612 8.40039 16.7984 8.40039H7.19844Z"
                  fill="#0D67A0"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="chat-main">
          <Chats user={user} />
          {chatId && (
            <div className="chat-messages">
              <div className="chat-messages-top">
                <img
                  src="/user-img.png"
                  alt="user photo"
                  className="user-photo"
                />
                <h2 className="username"> Exa Agu</h2>
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
                  <li className="message own" key={mgs.id}>
                    <div className="info">
                      <img
                        src="/user-img.png"
                        alt="user photo"
                        className="user-photo"
                      />
                      <span className="time">
                        {formatTimeString(mgs.createAt)}
                      </span>
                    </div>
                    <div className="text-container">
                      <p
                        className="text"
                        dangerouslySetInnerHTML={{
                          __html: mgs.text.replace(/\n/g, "<br/>"),
                        }}
                      ></p>
                    </div>
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
                        receiver: "tryt",
                        text: e.target.value,
                        chatId: chatId,
                        sender: user.id,
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
          )}
        </div>
      </section>
    </>
  );
};

export default Chat;
