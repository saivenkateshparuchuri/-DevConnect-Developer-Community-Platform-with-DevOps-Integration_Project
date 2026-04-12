const Message = require('../models/Message');
const User = require('../models/User');

// GET /api/messages/conversations - Get latest message per conversation for sidebar sorting
const getConversations = async (req, res) => {
  try {
    const myId = req.user.id;

    // Find all messages where current user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }]
    }).sort({ createdAt: -1 }); // newest first

    // Build a map: otherUserId -> latest message
    const conversationMap = {};
    messages.forEach(msg => {
      const otherId = String(msg.sender) === String(myId)
        ? String(msg.receiver)
        : String(msg.sender);
      if (!conversationMap[otherId]) {
        conversationMap[otherId] = msg;
      }
    });

    res.json(conversationMap);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/messages/:userId - Get chat history between logged-in user and another user
const getMessages = async (req, res) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId }
      ]
    }).sort({ createdAt: 1 }); // oldest first

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/messages - Send a message to another user
const sendMessage = async (req, res) => {
  try {
    const myId = req.user.id;
    const { receiverId, text } = req.body;

    if (!receiverId || !text || !text.trim()) {
      return res.status(400).json({ message: 'Receiver and text are required' });
    }

    const message = await Message.create({
      sender: myId,
      receiver: receiverId,
      text: text.trim()
    });

    await User.findByIdAndUpdate(myId, { $set: { lastActivityAt: new Date() } });

    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages, sendMessage, getConversations };
