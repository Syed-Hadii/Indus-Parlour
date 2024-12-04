import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Hardcoded email and password
const hardcodedUser = {
  email: "admin@admin.com",
  password: "admin", // Pre-hashed password
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (email !== hardcodedUser.email) {
      return res.status(401).json({ message: "Invalid email " });
    }
    
    if (password !== hardcodedUser.password) {
      return res.status(401).json({ message: "Invalid password " });
    }

    // const match = await bcrypt.compare(password, hardcodedUser.password);
    // console.log(hardcodedUser.password);
    // if (!match) {
    //   return res.status(401).json({ message: "Invalid email or password" });
    // }

    const token = createToken(hardcodedUser.email); // Use email as the ID
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default loginUser;
