import { useDispatch, useSelector } from "react-redux";

function formattedDate(timeStamp) {
  var result = "";
  var d = new Date(timeStamp);
  result +=
    pad(d.getDate().toString(), 2) +
    "/" +
    pad((d.getMonth() + 1).toString(), 2) +
    "/" +
    d.getFullYear() +
    " , " +
    pad(d.getHours().toString(), 2) +
    ":" +
    pad(d.getMinutes().toString(), 2) +
    ":" +
    pad(d.getSeconds().toString(), 2);
  return result;
}

function millisecondsToHuman(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = [
    pad(hours.toString(), 2),
    pad(minutes.toString(), 2),
    pad(seconds.toString(), 2),
  ].join(":");

  return humanized;
}

function pad(numberString, size) {
  let padded = numberString;
  while (padded.length < size) padded = `0${padded}`;
  return padded;
}

const Message = ({ message, timeStamp, userName, type }) => {
  const leftStyle = {
    color: "blue",
    display: "flex",
  };
  const rigthStyle = {
    color: "green",
    display: "flex",
    flexDirection: "row-reverse",
  };

  return (
    <div style={type === "left" ? leftStyle : rigthStyle}>
      <div
        style={{
          border: "solid 1px",
          borderRadius: "5px",
          margin: "5px",
        }}
      >
        <p style={{ fontSize: "20px" }}>{userName}</p>
        <p style={{ fontSize: "15px" }}>
          {timeStamp && formattedDate(timeStamp)}
          {/* {timeStamp && millisecondsToHuman(timeStamp)} */}
        </p>
        <p style={{ fontSize: "14px" }}>{message}</p>
      </div>
    </div>
  );
};

export const MessageList = ({ chat }) => {
  if (!chat) {
    return null;
  }
  const userIds =
    chat && Array.from(new Set(chat.messages.map(({ userId }) => userId)));
  const {
    userId: authUserId,
    userName,
    login,
  } = useSelector((state) => state.authReducer);

  const messageList = chat.messages.map((i) => i);
  const reversedList = messageList.reverse();
  return (
    <div
      style={{
        marginTop: "100px",
        // width: "50vw",
        height: "70vh",
        overflow: "auto",
        display: "flex",
        // messages reversed
        flexDirection: "column-reverse",
      }}
    >
      {reversedList
        // .reverse()
        .map(({ timeStamp, message, userName, userId }) => (
          <Message
            key={timeStamp}
            message={message}
            userName={userName}
            timeStamp={timeStamp}
            type={userId === authUserId ? "left" : "right"}
          />
        ))}
    </div>
  );
};
