import { useState } from "react";
import background from "../assets/background.jpg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:8080";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        // Do something with the form data, such as submit it to an API
        const { data } = await axios.post(`${baseUrl}/auth/signup`, formData);
        if (data.error) return toast.error(data.error);
        else {
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            toast.success(data.message);
        }
    };

    return (
        <div className=" w-screen grid h-screen grid-cols-1 gap-10 mx-auto md:grid-cols-2 bg-[#f0f3fc]">
            <img
                src={background}
                className="mt-40 bg-inherit h-[400px] object-cover"
            />
            <div className="px-8 pt-6 pb-8 mb-4 bg-gradient-to-br lg:w-[600px] from-purple-950 to-pink-700 shadow-[#1B1464]rounded shadow-md mt-16">
                <h2 className="mb-8 text-2xl font-bold text-center text-white">
                    Signup
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* name field */}
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-bold text-white"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* email field */}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-bold text-white"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* contact field */}
                    <div className="mb-4">
                        <label
                            htmlFor="phone"
                            className="block mb-2 text-sm font-bold text-white"
                        >
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    {/* password field */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-bold text-white"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
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
                            Submit
                        </button>
                    </div>

                    {/* login link */}
                    <div className="mt-20 font-semibold text-center align-bottom text-[#dff9fb] ">
                        Already have an account?
                        <NavLink
                            to="/login"
                            className="p-3 m-2 transition-all duration-300 rounded-md cursor-pointer bg-slate-600 hover:bg-slate-900"
                        >
                            Login
                        </NavLink>
                        here
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
