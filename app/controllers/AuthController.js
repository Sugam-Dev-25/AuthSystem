const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {

  // LOGIN
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        isFirstLogin: user.isFirstLogin
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // CHANGE PASSWORD
  static async changePassword(req, res) {
    try {
      const { newPassword } = req.body;

      const user = await User.findById(req.user.userId);

      user.password = await bcrypt.hash(newPassword, 10);
      user.isFirstLogin = false;

      await user.save();

      res.json({ message: "Password updated" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // PROFILE
  static async profile(req, res) {
    try {
      const user = await User.findById(req.user.userId).select("-password");

      res.json(user);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}

module.exports = AuthController;