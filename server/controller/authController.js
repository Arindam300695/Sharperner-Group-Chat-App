const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup controller
const signupController = async (req, res) => {
    const { name, email, phone, password, profilePicture } = req.body;

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
            profilePicture,
        });
        await newUser.save();
        const createdUser = {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            profile: newUser.profilePicture,
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
        // if the password is correct then need to create the jwt token
        const token = jwt.sign(
            {
                id: isRegistered.id,
                name: isRegistered.name,
                email: isRegistered.email,
                phone: isRegistered.phone,
                profile: isRegistered.profilePicture,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        //   setting this token as httpOnly cookie
        res.cookie("jwt_token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            secure: false,
        }).json({ message: "Login successful" });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

const logoutController = (req, res) => {
    res.clearCookie("jwt_token");
    res.json({ message: "Logged out successfully" });
};

module.exports = { signupController, loginController, logoutController };
