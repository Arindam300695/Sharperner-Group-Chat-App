import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import loginBackground from "../assets/loginBackground.webp";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:8080";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Perform login logic here
            const { data } = await axios.post(
                `${baseUrl}/auth/login`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            if (data.error) return toast.error(data.error);
            else {
                // if everything is fine then need to set the token to local storage
                toast.success(data.message);
                setTimeout(() => {
                    navigate("/chat");
                }, 1500);
            }
            // Reset form fields
            setEmail("");
            setPassword("");
        } catch (error) {
            return toast.error(error.message);
        }
    };

    return (
        <div className=" h-screen grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto bg-[#FEFEFE]">
            <img
                src={loginBackground}
                alt="login backgroun image"
                className=" bg-inherit h-[450px] object-cover mt-20 mx-auto"
            />
            <div className="mx-auto lg:w-[600px] h-[550px] mt-16 px-6 py-8 bg-white rounded shadow-md bg-gradient-to-br from-purple-950 to-pink-700 shadow-[#1B1464]">
                <h2 className="mb-8 text-2xl font-bold text-center text-white">
                    Login
                </h2>
                <form onSubmit={handleSubmit} className="">
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-bold text-white"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-bold text-white"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        >
                            Login
                        </button>
                    </div>
                </form>
                {/*signup link */}
                <div className="mt-20 font-semibold text-center align-bottom text-[#dff9fb] ">
                    Dont have an account?
                    <NavLink
                        to="/"
                        className="p-3 m-2 transition-all duration-300 rounded-md cursor-pointer bg-slate-600 hover:bg-slate-900"
                    >
                        Signup
                    </NavLink>
                    here
                </div>
            </div>
        </div>
    );
};

export default Login;
