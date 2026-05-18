import express from 'express';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const USERS_FILE = path.resolve(__dirname, '..', 'users.json');

// Helper to read users
const readUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading users', e);
      return [];
    }
  }
  return [];
};

// Helper to write users
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, display_name, tagline } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readUsers();
    
    // Check if email exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const newUser = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      username,
      email,
      password, // In a real app, hash this!
      role,
      display_name: display_name || username,
      tagline: tagline || ''
    };

    users.push(newUser);
    writeUsers(users);

    const token = 'local-token-' + newUser.id;

    res.status(201).json({
      message: 'User created successfully',
      session: { access_token: token },
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        display_name: newUser.display_name,
        tagline: newUser.tagline
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = 'local-token-' + user.id;

    res.status(200).json({
      message: 'Logged in successfully',
      session: { access_token: token },
      token: token, // Keeping token for legacy client support
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
