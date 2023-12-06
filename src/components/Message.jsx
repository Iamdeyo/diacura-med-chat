const Message = ({ mgs, user, otherUserdp }) => {
  function formatTimeString(dateString) {
    const dateObject = new Date(dateString);

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  }

  return (
    <>
      <div className="info">
        <img
          src={
            mgs.sender_id === user.id
              ? user?.display_photo || "/no-dp.png"
              : otherUserdp || "/no-dp.png"
          }
          alt="user photo"
          className="user-photo"
        />
        <span className="time">{formatTimeString(mgs.createAt)}</span>
      </div>
      <div className="text-container">
        <p
          className="text"
          dangerouslySetInnerHTML={{
            __html: mgs.text.replace(/\n/g, "<br/>"),
          }}
        ></p>
      </div>
    </>
  );
};

export default Message;
