const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

// 🔹 Signup Controller
exports.signupUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Email Verification Token
    const emailToken = crypto.randomBytes(32).toString("hex");

    // Create User
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      emailVerificationToken: emailToken,
    });

    await newUser.save();

    // Send Email Verification Link
    const verificationLink = `http://localhost:5000/api/users/verify-email?token=${emailToken}`;
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Signup successful! Please check your email for verification." });
  } catch (error) {
    res.status(500).json({ error: "Signup failed!" });
  }
};

// 🔹 Email Verification Controller
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token!" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Email verification failed!" });
  }
};
