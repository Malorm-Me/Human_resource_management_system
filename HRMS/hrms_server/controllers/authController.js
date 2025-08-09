import bcrypt from "bcrypt";
import db from "../db.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //admin check
  if (email === "admin@gmail.com" && password === "password") {
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      user: {
        id: "admin",    
        role: "Admin",
        username: "Admin User",
        mustChangePassword: false,
      },
    });
  }

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    console.log("User fetched from DB:", user);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const mustChange =
      user.mustChangePassword === 1 ||
      user.mustChangePassword === true ||
      user.mustChangePassword === "1";

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        role: user.role,
        username: user.name,
        mustChangePassword: mustChange,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
