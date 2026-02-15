import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../styles/ChatRoom.css";

function Chatroom() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatAreaRef = useRef();
  const socketRef = useRef(null); // ✅ store socket in ref

  // Fetch current user
  useEffect(() => {
    axios.get("http://localhost:7000/user/me", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.error("User fetch failed:", err));
  }, []);

  // Initialize Socket.IO
  useEffect(() => {
    socketRef.current = io("http://localhost:7000", { withCredentials: true });

    socketRef.current.on("message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    
    if (!input.trim() || !user){
      return;
    }
    

    const msg = {
      sender: user.fullName,
      content: input,
      createdAt: Date.now()
    };
    console.log("📤 Sending message:", msg); // Keep this
    socketRef.current.emit("user-message", msg); // emit via ref
    setInput("");
  };




  return (
    <div className="chatroom-page">
      <h1 className="chatroom-title">Chatroom</h1>
      <div className="chat-container">
        <div id="chat-area" ref={chatAreaRef}>
          {messages.map((msg, idx) => {
            const isSelf = user && msg.sender === user.fullName;
            return (
              <div key={idx} className={`chat-wrapper ${isSelf ? "chat-right" : "chat-left"}`}>
                <div className={`chat-bubble ${isSelf ? "bubble-self" : "bubble-other"}`}>
                  <div><strong>{isSelf ? "You" : msg.sender}</strong></div>
                  <div>{msg.content}</div>
                  <div className="chat-meta">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form id="message-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chatroom;
