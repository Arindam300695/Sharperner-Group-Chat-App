const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const signupController = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // chicking if user already exists in our database or not
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.json({ error: "User already exists" });
        }
        const newUser = new User({
            name,
            email,
            phone,
            password: await bcrypt.hash(password, 10),
        });
        await newUser.save();
        const createdUser = {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
        };
        res.json({ message: "User created successfully", createdUser });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

const loginController = async (req, res) => {};

module.exports = { signupController, loginController };
