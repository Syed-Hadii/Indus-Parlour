import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Hardcoded email and password
const hardcodedUser = {
  email: "admin@admin.com",
  userName: "Admin",
  password: "admin", // Pre-hashed password
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

const loginUser = async (req, res) => {
  const { email, userName, password } = req.body;
  // console.log(email);
  try {
    if ((!email && !userName) || !password) {
      return res
        .status(400)
        .json({ message: "Email or username and password are required" });
    }

    // Check if email or username matches
    const isEmailMatch = email === hardcodedUser.email;
    const isUserNameMatch = userName === hardcodedUser.userName;

    if (!isEmailMatch && !isUserNameMatch) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    // Check if password matches
    if (password !== hardcodedUser.password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate token using email or username (priority to email if provided)
    const token = createToken(email || userName);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default loginUser;
