const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const signupController = async (req, res) => {
    const { name, email, phone, passwords } = req.body;
    try {
        // chicking if user already exists in our database or not
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ error: "User already exists" });
        }
        const newUser = new User({
            name,
            email,
            phone,
            password: await bcrypt.hash(passwords, 10),
        });
        await newUser.save();
        res.json({ message: "User created successfully" });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

const loginController = async (req, res) => {};

module.exports = { signupController, loginController };
