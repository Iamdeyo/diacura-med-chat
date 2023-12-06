import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Chat = ({ chat, user }) => {
  const [otherUser, setOtherUser] = useState(null);
  useEffect(() => {
    // get other users data
    const otherUserId =
      user.id === chat.doctor_id ? chat.patient_id : chat.doctor_id;
    const getUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/user/${otherUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + user?.token,
            },
          }
        );
        const data = await res.json();
        setOtherUser(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);
  return (
    <Link to={`/chat/${chat.id}`}>
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
          <p className="last-mgs">Lorem ips</p>
          <span className="unread-mgs-count">03</span>
        </div>
      </div>
    </Link>
  );
};

export default Chat;
