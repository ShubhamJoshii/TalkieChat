import React from "react";

const ChattingCollection = ({ curr }) => {
  return (
    <>
      {curr.Messages &&
        curr.Messages.slice(-1).map((lastMessage) => {
          let currentTime = new Date();
          let OnlineTime = new Date(lastMessage.time);
          if (
            currentTime.toLocaleDateString() === OnlineTime.toLocaleDateString()
          ) {
            OnlineTime = OnlineTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            });
          } else if (
            currentTime.getTime() - OnlineTime.getTime() <=
            604800000
          ) {
            OnlineTime = OnlineTime.toLocaleTimeString("en-US", {
              weekday: "long",
              hour: "numeric",
              minute: "numeric",
            }).split(",")[0];
          } else {
            OnlineTime = OnlineTime.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
            });
          }
          return (
            <>
              {lastMessage.Image && <p>Image</p>}
              {lastMessage.Message && <p>{lastMessage.Message.substr(0, 8)}</p>}
              {lastMessage.Files_Url && (
                <p>{lastMessage.FileName.substr(0, 8)}...</p>
              )}
              <p id="onlineTime">{OnlineTime}</p>
            </>
          );
        })}
    </>
  );
};

export default ChattingCollection;
