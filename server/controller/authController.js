const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// signup controller
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
        return res.json({ message: "User created successfully", createdUser });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

// login controller
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        // checking if the user is even registered with us or not
        const isRegistered = await User.findOne({ where: { email } });
        if (!isRegistered)
            return res.json({ error: "User is not registered with us" });
        // checking if the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(
            password,
            isRegistered.password
        );
        if (!isPasswordCorrect)
            return res.json({ error: "Invalid login credentials" });
        return res.json({
            message: "Login successfull",
            user: {
                name: isRegistered.name,
                email: isRegistered.email,
                phone: isRegistered.phone,
            },
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

module.exports = { signupController, loginController };
