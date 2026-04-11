import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
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
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callModeRef = useRef(null);
  const callPartnerRef = useRef(null);

  const [callMode, setCallMode] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callPartner, setCallPartner] = useState(null);
  const [callStatus, setCallStatus] = useState("");
  const [callError, setCallError] = useState(null);

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

  const SIGNALING_SERVER_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const cleanupCall = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setCallMode(null);
    setIncomingCall(null);
    setCallPartner(null);
    setCallStatus("");
    setCallError(null);
  };

  const startLocalStream = async () => {
    if (localStreamRef.current) return localStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  };

  const createPeerConnection = (targetUserId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice_candidate", {
          targetUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      if (event.streams && event.streams[0]) {
        remoteStreamRef.current = event.streams[0];
      } else {
        remoteStreamRef.current.addTrack(event.track);
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    peerRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    if (!activeContact || !currentUser || !socketRef.current) return;
    setCallError(null);
    setCallStatus(`Calling ${activeContact.name}...`);
    setCallPartner(activeContact);
    setCallMode("calling");

    try {
      await startLocalStream();
      const pc = createPeerConnection(activeContact.id);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit("call_user", {
        targetUserId: activeContact.id,
        callerId: currentUser._id,
        callerName: currentUser.name,
        offer,
      });
    } catch (err) {
      console.error("Unable to start call:", err);
      setCallError("Unable to start call. Please allow camera and microphone access.");
      cleanupCall();
    }
  };

  const acceptCall = async () => {
    if (!incomingCall || !socketRef.current) return;
    setCallError(null);
    setCallStatus(`Connecting with ${incomingCall.callerName}...`);

    try {
      await startLocalStream();
      const pc = createPeerConnection(incomingCall.from);
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current.emit("answer_call", {
        targetUserId: incomingCall.from,
        answer,
      });
      setCallMode("in-call");
      setIncomingCall(null);
    } catch (err) {
      console.error("Failed to accept call:", err);
      setCallError("Could not accept call. Please try again.");
      cleanupCall();
    }
  };

  const rejectCall = () => {
    if (incomingCall && socketRef.current) {
      socketRef.current.emit("end_call", { targetUserId: incomingCall.from });
    }
    cleanupCall();
  };

  const handleCallAnswered = useCallback(async ({ answer }) => {
    try {
      await peerRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
      setCallMode("in-call");
      setCallStatus(`In call with ${callPartnerRef.current?.name || "user"}`);
    } catch (err) {
      console.error("Error setting remote description:", err);
      setCallError("Call connection failed.");
      cleanupCall();
    }
  }, []);

  const handleRemoteIceCandidate = useCallback(async ({ candidate }) => {
    try {
      if (candidate && peerRef.current) {
        await peerRef.current.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error("Failed to add remote ICE candidate:", err);
    }
  }, []);

  const handleCallEnded = useCallback(() => {
    setCallStatus("Call ended");
    cleanupCall();
  }, []);

  const hangUp = () => {
    if (callPartner && socketRef.current) {
      socketRef.current.emit("end_call", { targetUserId: callPartner.id });
    }
    cleanupCall();
  };

  useEffect(() => {
    callModeRef.current = callMode;
    callPartnerRef.current = callPartner;
  }, [callMode, callPartner]);

  useEffect(() => {
    const socket = io(SIGNALING_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    socket.on("incoming_call", ({ from, callerName, offer }) => {
      if (callModeRef.current) {
        socket.emit("end_call", { targetUserId: from });
        return;
      }
      setIncomingCall({ from, callerName, offer });
      const partner = { id: from, name: callerName };
      setCallPartner(partner);
      callPartnerRef.current = partner;
      setCallMode("incoming");
      setCallStatus(`${callerName} is calling...`);
    });

    socket.on("call_answered", handleCallAnswered);
    socket.on("ice_candidate", handleRemoteIceCandidate);
    socket.on("call_ended", handleCallEnded);
    socket.on("user_unavailable", ({ targetUserId }) => {
      setCallError("The user is unavailable for calls right now.");
      cleanupCall();
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    return () => {
      cleanupCall();
      socket.disconnect();
    };
  }, [SIGNALING_SERVER_URL, handleCallAnswered, handleRemoteIceCandidate, handleCallEnded]);

  useEffect(() => {
    if (currentUser && socketRef.current) {
      socketRef.current.emit("register_user", currentUser._id);
    }
  }, [currentUser]);

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
      <div className="card shadow-2 border-0 rounded-4 overflow-hidden chat-card" style={{ height: "calc(100vh - 180px)" }}>
        <div className="row g-0 h-100">

          {/* Left: Contacts Sidebar — sorted by most recent message */}
          <div className="col-md-4 border-end chat-sidebar h-100 d-flex flex-column">
            <div className="p-3 chat-sidebar-header d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 text-white">Messages</h5>
              <span className="badge badge-soft-primary rounded-pill">{contacts.length}</span>
            </div>
            <div className="flex-grow-1 overflow-auto">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 d-flex align-items-center gap-3 border-bottom chat-contact-item ${activeContact?.id === c.id ? "active-contact" : ""}`}
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
                    <span className="text-white-50 small text-truncate" style={{ maxWidth: "180px", opacity: 0.85 }}>
                      {c.lastMessage || "Start a conversation"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat Window */}
          <div className="col-md-8 h-100 d-flex flex-column chat-window">
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-bottom chat-header d-flex align-items-center gap-3">
                  <div
                    className="chat-avatar rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "42px", height: "42px" }}
                  >
                    {activeContact.avatar}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-white">{activeContact.name}</h6>
                    <span className="status-badge small">Active now</span>
                  </div>
                  <div className="ms-auto d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={startCall}
                      disabled={!activeContact || callMode === "calling" || callMode === "in-call"}
                    >
                      Call
                    </button>
                    {(callMode === "in-call" || callMode === "calling" || callMode === "incoming") && (
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={hangUp}>
                        Hang Up
                      </button>
                    )}
                  </div>
                </div>

                {(callMode || incomingCall) && (
                  <div className="p-3 border-bottom bg-dark bg-opacity-10 call-panel">
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div>
                          <strong className="text-white">
                            {callMode === "incoming"
                              ? `${callPartner?.name || "Someone"} is calling...`
                              : callMode === "calling"
                              ? `Calling ${callPartner?.name || "user"}...`
                              : `In call with ${callPartner?.name || "user"}`}
                          </strong>
                          <div className="text-white-50 small mt-1">{callStatus}</div>
                        </div>
                        <div className="d-flex gap-2">
                          {callMode === "incoming" && (
                            <>
                              <button type="button" className="btn btn-success btn-sm" onClick={acceptCall}>
                                Accept
                              </button>
                              <button type="button" className="btn btn-danger btn-sm" onClick={rejectCall}>
                                Reject
                              </button>
                            </>
                          )}
                          {callMode === "calling" && (
                            <button type="button" className="btn btn-danger btn-sm" onClick={hangUp}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column flex-md-row gap-3">
                        <div className="video-box flex-fill">
                          <video ref={localVideoRef} autoPlay muted playsInline className="rounded-3 video-preview" />
                          <div className="text-white-50 small mt-2">Your camera</div>
                        </div>
                        <div className="video-box flex-fill">
                          <video ref={remoteVideoRef} autoPlay playsInline className="rounded-3 video-preview" />
                          <div className="text-white-50 small mt-2">
                            {callMode === "in-call" ? "Remote video" : "Waiting for connection..."}
                          </div>
                        </div>
                      </div>
                      {callError && <div className="text-danger small">{callError}</div>}
                    </div>
                  </div>
                )}

                {/* Messages Area */}
                <div className="flex-grow-1 p-4 overflow-auto chat-messages-area">
                  {messages.length === 0 ? (
                    <div className="text-center py-5">
                      <div style={{ fontSize: "2.5rem", color: "#93c5fd" }}>💬</div>
                      <p className="mt-2 small text-white-50">No messages yet. Say hello to {activeContact.name}!</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = String(m.sender) === String(currentUser?._id);
                      return (
                        <div key={m._id} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                          {!isMe && (
                            <div
                              className="chat-avatar-sm rounded-circle d-flex align-items-center justify-content-center fw-bold me-2 mt-auto"
                              style={{ width: "28px", height: "28px", fontSize: "0.75rem", flexShrink: 0 }}
                            >
                              {activeContact.avatar}
                            </div>
                          )}
                          <div
                            className={`p-3 rounded-4 chat-bubble ${isMe ? "chat-bubble-me" : "chat-bubble-other"}`}
                            style={{ maxWidth: "70%" }}
                          >
                            <div className="small lh-sm">{m.text}</div>
                            <div className="text-end mt-1 opacity-75 chat-time">{formatTime(m.createdAt)}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form className="p-3 chat-input-area d-flex gap-2" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="form-control rounded-pill chat-input px-4"
                    placeholder={`Message ${activeContact.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="btn btn-glass rounded-pill px-4 fw-bold"
                    disabled={sending || !newMessage.trim()}
                    style={{ minWidth: '110px' }}
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