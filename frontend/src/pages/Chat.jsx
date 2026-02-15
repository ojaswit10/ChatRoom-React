import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

function Chatroom({ user: propUser }) {
  const [user, setUser] = useState(propUser);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatAreaRef = useRef();
  const socketRef = useRef(null);

  // Fetch current user if not provided via props
  useEffect(() => {
    if (!user) {
      axios.get("http://localhost:7000/user/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(err => console.error("User fetch failed:", err));
    }
  }, [user]);

  // Initialize Socket.IO
  useEffect(() => {
    socketRef.current = io("http://localhost:7000", { withCredentials: true });
    
    socketRef.current.on("message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    
    if (!input.trim() || !user) {
      return;
    }
    
    const msg = {
      sender: user.fullName,
      content: input,
      createdAt: Date.now()
    };
    
    console.log("📤 Sending message:", msg);
    socketRef.current.emit("user-message", msg);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold">Chatroom</h1>
        {user && <p className="text-sm text-white/80">Logged in as {user.fullName}</p>}
      </div>

      {/* Chat Area */}
      <div 
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#e5ddd5'
        }}
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation! 👋
            </p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isSelf = user && msg.sender === user.fullName;
          
          return (
            <div 
              key={idx} 
              className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 shadow ${
                  isSelf 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-800'
                }`}
              >
                {/* Sender name - only show for other users */}
                {!isSelf && (
                  <div className="text-xs font-semibold text-blue-600 mb-1">
                    {msg.sender}
                  </div>
                )}
                
                {/* Message content */}
                <div className="text-sm break-words">
                  {msg.content}
                </div>
                
                {/* Timestamp */}
                <div className={`text-xs mt-1 ${isSelf ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-150"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatroom;