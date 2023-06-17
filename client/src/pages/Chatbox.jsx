/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineEllipsis, AiOutlineSend } from "react-icons/ai";

const baseUrl = "http://localhost:8080";

const Chatbox = () => {
    const navigate = useNavigate();
    // setting state to change the chat data
    const [userData, setUserData] = useState([]);
    const [user, setUser] = useState();
    const [clickedToLogout, setClickedToLogout] = useState(false);
    console.log("userData: ", userData);

    useEffect(() => {
        // using axios.get and await async and try catch to get the chat data
        const fetchChatData = async () => {
            try {
                const { data } = await axios.get(`${baseUrl}/chat/getUsers`, {
                    withCredentials: true,
                });
                if (data.error) return toast.error(data.error);
                else {
                    setUserData(data.user);
                    setUser(data.decoded);
                }
            } catch (error) {
                // toast.error(error.message);
            }
        };
        fetchChatData();
    }, []);

    // clickedToLogout handler function
    const clickedToLogoutHandler = () => {
        setClickedToLogout(!clickedToLogout);
    };

    // logoutHandler function
    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/auth/logout`, {
                withCredentials: true,
            });
            if (data.error) return toast.error(data.error);
            else {
                toast.success(data.message);
                setTimeout(() => {
                    navigate("/logout");
                }, 1200);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="h-screen overflow-hidden overflow-y-scroll text-white container-md mx-auto bg-[#2B2A4C]">
            {/* nav section starts here */}
            <nav className="flex items-center justify-between w-full px-8 py-4 border-b-2 border-white bg-inherit">
                <div className="flex items-center justify-center gap-5">
                    <img
                        src={user?.profile}
                        alt="User Profile"
                        className="rounded-[50%] w-10 h-10"
                    />
                    <h1 className="grid grid-cols-1 md:grid-cols-2">
                        Welcome
                        <p className="text-xl font-semibold"> {user?.name}</p>
                    </h1>
                </div>
                <div className="ms-auto">
                    {!clickedToLogout && (
                        <AiOutlineEllipsis
                            className="text-2xl cursor-pointer"
                            onClick={clickedToLogoutHandler}
                        />
                    )}
                    {clickedToLogout && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <h1
                                onClick={logoutHandler}
                                className="cursor-pointer"
                            >
                                Logout
                            </h1>
                            <h1
                                onClick={() => {
                                    setClickedToLogout(!clickedToLogout);
                                }}
                                className="cursor-pointer"
                            >
                                Cancel
                            </h1>
                        </div>
                    )}
                </div>
            </nav>
            {/* nav section ends here */}

            {/* chatbox starts here */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* user section starts here */}
                <div className="hidden sm:inline">
                    {userData &&
                        userData.map((eachUser) => (
                            <div
                                key={eachUser?.id}
                                className="flex items-center gap-4 m-2"
                            >
                                <img
                                    src={eachUser?.profilePicture}
                                    alt="user's profile picture"
                                    className="rounded-[50%] h-14 w-14"
                                />
                                <h1> {eachUser?.name}</h1>
                            </div>
                        ))}
                </div>
                {/* user section ends here */}
                <div className="h-[26.5rem] mr-2">
                    {/* messages section starts here */}
                    <div className="h-[90%] overflow-hidden overflow-y-scroll">
                        <h1 className="text-center mt-[40%] text-xl font-semibold">
                            No Messages...
                        </h1>
                    </div>
                    {/* messages section ends here */}

                    {/* send chat section starts here */}
                    <div className="flex items-center justify-center p-2 border-2 shadow-md shadow-[#4C4C6D] border-slate-400 rounded-xl">
                        <input
                            type="text"
                            className="w-[100%] outline-none bg-inherit text-[#E8F6EF]"
                        />
                        <AiOutlineSend className="" />
                    </div>
                    {/* send chat section ends here */}
                </div>
            </div>
            {/* cahtbox ends here */}
            <ToastContainer />
        </div>
    );
};

export default Chatbox;
