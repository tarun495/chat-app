const router = require('express').Router();
const User = require('../models/User');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: 'User already exists!' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'Registered successfully!' });

  } catch (err) {
    res.json({ success: false, message: 'Something went wrong!' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found!' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Wrong password!' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.json({ success: false, message: 'Something went wrong!' });
  }
});

// GET ALL USERS (protected route)
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.json({ message: 'Something went wrong!' });
  }
});

// GET MESSAGES BETWEEN TWO USERS
router.get('/messages/:receiverId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: req.params.receiverId },
        { senderId: req.params.receiverId, receiverId: req.userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.json({ message: 'Something went wrong!' });
  }
});

// SAVE MESSAGE
router.post('/messages', verifyToken, async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const newMessage = new Message({
      senderId: req.userId,
      receiverId,
      message
    });

    await newMessage.save();
    res.json(newMessage);

  } catch (err) {
    res.json({ message: 'Something went wrong!' });
  }
});

module.exports = router;