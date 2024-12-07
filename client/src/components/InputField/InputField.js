import React from "react";
import "./InputField.css";
function InputField({ message, setMessage, sendMessage }) {
  return (
    <form action="" className="form">
      <input
        type="text"
        placeholder="Type a message"
        className="input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
      />
      <button className="sendButton" onClick={(e) => sendMessage(e)}>Send</button>
    </form>
  );
}

export default InputField;
