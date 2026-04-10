import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "../components/Layout";
import { getAllUsers, getCurrentUser, getMessages, sendMessage, getConversations } from "../services/api";

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);
  const prevMsgCount = useRef(0);

  // Scroll to bottom — instant on load/contact switch, smooth on new message
  useEffect(() => {
    if (!chatEndRef.current) return;
    const isNewMessage = messages.length > prevMsgCount.current;
    chatEndRef.current.scrollIntoView({ behavior: isNewMessage ? "smooth" : "instant" });
    prevMsgCount.current = messages.length;
  }, [messages]);

  // Fetch conversation from DB when active contact changes
  const fetchConversation = useCallback(async (contactId) => {
    if (!contactId) return;
    try {
      const data = await getMessages(contactId);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, []);

  // Poll every 4 seconds for new messages
  useEffect(() => {
    if (!activeContact) return;
    prevMsgCount.current = 0;
    fetchConversation(activeContact.id);

    pollRef.current = setInterval(() => {
      fetchConversation(activeContact.id);
    }, 4000);

    return () => clearInterval(pollRef.current);
  }, [activeContact, fetchConversation]);

  // Reusable: sort contacts by most recent message
  const sortContacts = (list) =>
    [...list].sort((a, b) => {
      if (a.lastTime && b.lastTime) return new Date(b.lastTime) - new Date(a.lastTime);
      if (a.lastTime) return -1;
      if (b.lastTime) return 1;
      return a.name.localeCompare(b.name);
    });

  // Reusable: build contacts list and apply sort
  const refreshContacts = useCallback(async (usersData, me) => {
    try {
      const convoMap = await getConversations();
      const otherUsers = usersData.filter(u => u._id !== me?._id);
      const chatContacts = otherUsers.map(u => {
        const lastMsg = convoMap[u._id];
        return {
          id: u._id,
          name: u.name,
          avatar: u.name.charAt(0).toUpperCase(),
          lastMessage: lastMsg?.text || null,
          lastTime: lastMsg?.createdAt || null
        };
      });
      setContacts(sortContacts(chatContacts));
    } catch (err) {
      console.error("Error refreshing contacts:", err);
    }
  }, []);

  // Load users on mount and start sidebar polling
  useEffect(() => {
    let allUsers = [];
    let me = null;
    let sidebarPoll = null;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, meData, convoMap] = await Promise.all([
          getAllUsers(),
          getCurrentUser(),
          getConversations()
        ]);

        me = meData?.user || null;
        allUsers = usersData;
        setCurrentUser(me);

        const otherUsers = usersData.filter(u => u._id !== me?._id);
        const chatContacts = otherUsers.map(u => {
          const lastMsg = convoMap[u._id];
          return {
            id: u._id,
            name: u.name,
            avatar: u.name.charAt(0).toUpperCase(),
            lastMessage: lastMsg?.text || null,
            lastTime: lastMsg?.createdAt || null
          };
        });

        const sorted = sortContacts(chatContacts);
        setContacts(sorted);
        if (sorted.length > 0) setActiveContact(sorted[0]);
      } catch (err) {
        console.error("Error loading chat:", err);
      } finally {
        setLoading(false);
      }

      // Poll sidebar every 5 seconds so contacts re-sort when new messages arrive
      sidebarPoll = setInterval(() => {
        if (allUsers.length > 0 && me) refreshContacts(allUsers, me);
      }, 5000);
    };

    fetchData();
    return () => clearInterval(sidebarPoll);
  }, [refreshContacts]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact || sending) return;

    setSending(true);
    try {
      const saved = await sendMessage(activeContact.id, newMessage.trim());
      setMessages(prev => [...prev, saved]);
      // Update last message in contact list and re-sort
      setContacts(prev => {
        const updated = prev.map(c =>
          c.id === activeContact.id
            ? { ...c, lastMessage: saved.text, lastTime: saved.createdAt }
            : c
        );
        return updated.sort((a, b) => {
          if (a.lastTime && b.lastTime) return new Date(b.lastTime) - new Date(a.lastTime);
          if (a.lastTime) return -1;
          if (b.lastTime) return 1;
          return a.name.localeCompare(b.name);
        });
      });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading conversations...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
        <div className="row g-0 h-100">

          {/* Left: Contacts Sidebar — sorted by most recent message */}
          <div className="col-md-4 border-end bg-light h-100 d-flex flex-column">
            <div className="p-3 border-bottom bg-white d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 text-dark">Messages</h5>
              <span className="badge bg-primary rounded-pill">{contacts.length}</span>
            </div>
            <div className="flex-grow-1 overflow-auto">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 d-flex align-items-center gap-3 border-bottom ${activeContact?.id === c.id ? "bg-white border-start border-3 border-primary" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveContact(c)}
                >
                  <div className="position-relative flex-shrink-0">
                    <div
                      className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: "45px", height: "45px" }}
                    >
                      {c.avatar}
                    </div>
                    <span
                      className="position-absolute bottom-0 end-0 border border-2 border-white rounded-circle bg-success"
                      style={{ width: "12px", height: "12px" }}
                    ></span>
                  </div>
                  <div className="d-flex flex-column lh-sm overflow-hidden w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`fw-bold small ${activeContact?.id === c.id ? "text-dark" : "text-dark"}`}>{c.name}</span>
                      {c.lastTime && (
                        <span className="text-muted" style={{ fontSize: "0.65rem", flexShrink: 0 }}>
                          {formatTime(c.lastTime)}
                        </span>
                      )}
                    </div>
                    <span className="text-muted small text-truncate" style={{ maxWidth: "180px", opacity: 0.75 }}>
                      {c.lastMessage || "Start a conversation"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat Window */}
          <div className="col-md-8 h-100 d-flex flex-column bg-white">
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-bottom d-flex align-items-center gap-3">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "40px", height: "40px" }}
                  >
                    {activeContact.avatar}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{activeContact.name}</h6>
                    <span className="text-success small fw-semibold" style={{ fontSize: "0.75rem" }}>Active now</span>
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  className="flex-grow-1 p-4 overflow-auto"
                  style={{ backgroundImage: "radial-gradient(#eee 1px, transparent 1px)", backgroundSize: "20px 20px", backgroundColor: "#fafafa" }}
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <div style={{ fontSize: "2.5rem" }}>💬</div>
                      <p className="mt-2 small">No messages yet. Say hello to {activeContact.name}!</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = String(m.sender) === String(currentUser?._id);
                      return (
                        <div key={m._id} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                          {!isMe && (
                            <div
                              className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2 mt-auto"
                              style={{ width: "28px", height: "28px", fontSize: "0.7rem", flexShrink: 0 }}
                            >
                              {activeContact.avatar}
                            </div>
                          )}
                          <div
                            className={`p-3 rounded-4 shadow-sm ${isMe ? "bg-primary text-white" : "bg-white text-dark border"}`}
                            style={{ maxWidth: "70%" }}
                          >
                            <div className="small lh-sm">{m.text}</div>
                            <div className="text-end mt-1 opacity-75" style={{ fontSize: "0.65rem" }}>
                              {formatTime(m.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form className="p-3 border-top bg-white d-flex gap-2" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="form-control rounded-pill border-light bg-light px-4"
                    placeholder={`Message ${activeContact.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-bold"
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? <span className="spinner-border spinner-border-sm"></span> : "Send"}
                  </button>
                </form>
              </>
            ) : (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                <div style={{ fontSize: "3rem" }}>💬</div>
                <h5 className="mt-3">Select a user to start chatting</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Chat;