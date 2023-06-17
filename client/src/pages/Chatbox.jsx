/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineEllipsis, AiOutlineSend } from "react-icons/ai";
import moment from "moment";

const baseUrl = "http://localhost:8080";

const Chatbox = () => {
    const navigate = useNavigate();
    // setting state to change the chat data
    const [userData, setUserData] = useState([]);
    const [user, setUser] = useState();
    const [clickedToLogout, setClickedToLogout] = useState(false);
    const [message, setMessage] = useState("");
    const [messagesData, setMessagesData] = useState([]);
    console.log(messagesData);
    useEffect(() => {
        // using axios.get and await async and try catch to getting the suer data
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(`${baseUrl}/chat/getUsers`, {
                    withCredentials: true,
                });
                if (data.error) {
                    navigate("/error");
                    return toast.error(data.error);
                }
                // if()
                else {
                    setUserData(data.user);
                    setUser(data.decoded);
                }
            } catch (error) {
                // toast.error(error.message);
            }
        };
        fetchUserData();
        // using axios.get and sawait async and try catch to getting the messages data
        const fetchMessagesData = async () => {
            try {
                const { data } = await axios.get(
                    `${baseUrl}/chat/getMessages`,
                    {
                        withCredentials: true,
                    }
                );
                if (data.error) {
                    navigate("/error");
                    return toast.error(data.error);
                } else {
                    setMessagesData(data);
                }
            } catch (error) {
                return toast.error(error.message);
            }
        };
        fetchMessagesData();
    }, [navigate]);

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

    // changeMessageHandler function
    const changeMessageHandler = (e) => {
        setMessage(e.target.value);
    };

    // postMessageHandler function
    const postMessageHandler = async () => {
        try {
            const { data } = await axios.post(
                `${baseUrl}/chat/createMessage`,
                { message },
                { withCredentials: true }
            );
            if (data.error) return toast.error(data.error);
            else {
                setMessage("");
                setMessagesData([
                    ...messagesData,
                    {
                        message,
                        ChatUserId: user?.id,
                        createdAt: new Date().toISOString(),
                    },
                ]);
                return toast.success(data.message);
            }
        } catch (error) {
            return toast.error(error.message);
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
                <div className="h-[38rem] mr-2">
                    {/* messages section starts here */}
                    <div className="h-[90%] overflow-hidden overflow-y-scroll p-2">
                        {messagesData.length === 0 ? (
                            <h1 className="text-center mt-[40%] text-xl font-semibold">
                                No Messages...
                            </h1>
                        ) : (
                            messagesData.map((eachMessage, index) => (
                                <div key={index}>
                                    {/* <img src={eachMessage} alt="" /> */}
                                    <div>
                                        <h1
                                            className={`w-40 font-semibold text-slate-900 p-2 m-2 rounded-xl  ${
                                                eachMessage?.ChatUserId ===
                                                user?.id
                                                    ? "mr-auto shadow-sm shadow-[#FFFFD0]"
                                                    : "ml-auto shadow-sm shadow-[#38E54D]"
                                            } ${
                                                eachMessage?.ChatUserId ===
                                                user?.id
                                                    ? "bg-[#FFEBB4]"
                                                    : "bg-[#B3FFAE]"
                                            }`}
                                        >
                                            {eachMessage.message}
                                        </h1>
                                        <p
                                            className={`w-40 ${
                                                eachMessage?.ChatUserId ===
                                                user?.id
                                                    ? "mr-auto  text-left"
                                                    : "ml-auto  text-right"
                                            }`}
                                        >
                                            {moment(
                                                eachMessage.createdAt
                                            ).fromNow()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* messages section ends here */}

                    {/* send chat section starts here */}
                    <div className="flex mt-4 gap-2 items-center justify-center p-2 border-2 shadow-md shadow-[#4C4C6D] border-slate-400 rounded-xl">
                        <input
                            required
                            type="text"
                            className="w-[100%] outline-none bg-inherit text-[#E8F6EF]"
                            value={message}
                            onChange={changeMessageHandler}
                        />
                        <AiOutlineSend
                            onClick={postMessageHandler}
                            className="cursor-pointer"
                        />
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
