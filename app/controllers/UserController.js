const User = require("../models/User");
const bcrypt = require("bcryptjs");
const EmailService = require("../../utils/sendEmail");

class UserController {
  // Admin creates user
  static async createUser(req, res) {
    try {
      const { name, email } = req.body;

      const exist = await User.findOne({ email });
      if (exist) {
        return res.status(400).json({ message: "User already exists" });
      }

      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        password: hashedPassword,
      });

      await EmailService.send(
        email,
        "Your Login Credentials",
        `Hello ${name}
Email: ${email}
Password: ${password}
Please login and change your password`,
      );

      res.json({ message: "User created & email sent" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
