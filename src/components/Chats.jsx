import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Chat from "./Chat";

const Chats = ({ user }) => {
  const [usersChats, setUsersChats] = useState([]);

  // Get the chat id param from the URL and fetch messages.
  const { id: chatId } = useParams();

  // step 1
  // get all user chats
  useEffect(() => {
    const getUserChats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chat", {
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
  return (
    <aside className={`chat-sidebar ${chatId ? "hid" : ""}`}>
      <div className="user-chats-top">
        <p>All</p>
        <p>Read</p>
        <p>Unread</p>
      </div>
      <ul className="user-chats">
        {usersChats.map((chat, i) => (
          <li key={chat.id}>
            {/* step 2 */}
            {/* set the chat id as a param */}
            <Chat chat={chat} user={user} />
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Chats;
