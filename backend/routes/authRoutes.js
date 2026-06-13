import express from 'express';
// import { authUser, registerUser } from '../controllers/authController.js';
// We will implement controllers later, defining routes for now.

const router = express.Router();

router.post('/login', (req, res) => {
    res.json({ message: "Login Endpoint Hit" });
});

router.post('/register', (req, res) => {
    res.json({ message: "Register Endpoint Hit" });
});

export default router;
