import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { io } from "socket.io-client";

// socket connections
const socket = io("http://localhost:8000");

const baseUrl = "http://localhost:8080";

const Messages = () => {
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const localStorageUserId = localStorage.getItem("id");
        if (!localStorageUserId) {
            navigate("/");
            return;
        }
        setUserId(localStorageUserId);
        fetchMessages();
        socket.on("message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    }, [navigate, groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get(
                `${baseUrl}/message/getMessages/${groupId}`,
                { withCredentials: true }
            );
            if (data.error) {
                toast.error(data.error);
                return;
            }
            setMessages(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeHandler = (e) => {
        setMessage(e.target.value);
    };

    const sendMessageHandler = async () => {
        if (!message) return;
        setMessage("");
        try {
            const { data } = await axios.post(
                `${baseUrl}/message/createMessage`,
                {
                    message,
                    userId,
                    groupId,
                },
                { withCredentials: true }
            );
            if (data.error) {
                toast.error(data.error);
                return;
            }
            const userMessage = {
                message,
                ChatUserId: userId,
                ChatGroupId: groupId,
                createdAt: new Date().toISOString(),
            };
            socket.emit("message", userMessage);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/auth/logout`, {
                withCredentials: true,
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                localStorage.removeItem("id");
                localStorage.removeItem("messages");
                setTimeout(() => {
                    navigate("/logout");
                }, 1200);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-[#2B2A4C] h-screen text-white flex justify-center items-center flex-col">
            <div className="container border border-white h-[90%] max-w-3xl m-auto shadow-sm rounded-md shadow-[#9336B4] overflow-hidden overflow-y-scroll p-4">
                {messages?.length === 0 ? (
                    <div className="mt-40 text-2xl font-bold text-center uppercase">
                        No messages.......
                    </div>
                ) : (
                    <div className="container mx-auto max-w-lg">
                        {messages?.map((item, index) => (
                            <div
                                key={index}
                                className={`font-semibold p-2 w-24 sm:w-48 m-1 ${
                                    Number(item?.ChatUserId) === Number(userId)
                                        ? "ms-auto"
                                        : "me-auto"
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <img
                                        src={item?.userProfilePicture}
                                        alt="user profile picture"
                                        className="rounded-[50%] w-14 h-10"
                                    />
                                    <h1
                                        className={`ms-auto ${
                                            Number(item?.ChatUserId) ===
                                            Number(userId)
                                                ? "bg-[#0079FF] w-36 p-2 rounded-lg"
                                                : "bg-[#E384FF] w-36 p-2 rounded-lg"
                                        }`}
                                    >
                                        {item?.message}
                                    </h1>
                                </div>
                                <p>{moment(item?.createdAt).fromNow()}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <div className="m-2 w-[80%] flex items-center justify-center border-slate-500 border-2 shadow-md shadow-[#40128B] rounded-lg">
                <input
                    type="text"
                    value={message}
                    className="w-full p-2 outline-none focus:outline-none bg-inherit"
                    onChange={changeHandler}
                />
                <AiOutlineSend
                    size={30}
                    className="cursor-pointer text-slate-500 active:scale-[0.75] transition-all duration-100"
                    onClick={sendMessageHandler}
                />
            </div>
            <button
                className="active:scale-[0.75] border-2 border-purple-500 m-6 p-2 rounded-lg hover:bg-red-500 text-white font-semibold"
                onClick={logoutHandler}
            >
                Go Back
            </button>
        </div>
    );
};

export default Messages;
