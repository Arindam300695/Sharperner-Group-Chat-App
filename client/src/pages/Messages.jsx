import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

const baseUrl = "http://localhost:8080";

const Messages = () => {
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState("");
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([]);

    console.log("messages: ", messages);
    console.log("userId: ", userId);

    useEffect(() => {
        const localStorageUserId = localStorage.getItem("id");
        if (localStorageUserId !== null) setUserId(localStorageUserId);
        if (localStorageUserId === null) navigate("/");

        // fetch messages from the database
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(
                    `${baseUrl}/message/getMessages/${groupId}`,
                    { withCredentials: true }
                );
                console.log("data: ", data);
                if (data.error) return toast.error(data.error);
                setMessages(data?.messages);
                setUser(data?.users);
            } catch (error) {
                return toast.error(error.message);
            }
        };
        fetchMessages();
        return () => {};
    }, [navigate, groupId]);

    // changeHandler function
    const changeHandler = (e) => {
        setMessage(e.target.value);
    };

    // sendMessageHandler function
    const sendMessageHandler = async () => {
        console.log(message);
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
            console.log(data);
            if (data.error) return toast.error(data.error);
            const userMessage = {
                message,
                ChatUserId: userId,
                ChatGroupId: groupId,
                createdAt: new Date().toISOString(),
            };
            setMessages([...messages, userMessage]);
        } catch (error) {
            return toast.error(error.message);
        }
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

    return (
        <div className="bg-[#2B2A4C] h-screen text-white flex justify-center items-center flex-col">
            <div className="container border border-white h-[90%] max-w-3xl m-auto shadow-sm rounded-md shadow-[#9336B4] overflow-hidden overflow-y-scroll p-4">
                {/* {messages} */}
                {messages.length === 0 ? (
                    <div className="mt-40 text-2xl font-bold text-center uppercase">
                        no messages.......
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
                                {console.log("user", user)}
                                <div className="flex items-center justify-center">
                                    <img
                                        src={user[index]?.profilePicture}
                                        alt="user profile picture"
                                        className="roundede-[50%] w-14 h-10"
                                    />
                                    <h1
                                        className={` ms-auto ${
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
                    </div>
                )}
            </div>
            <div className="m-2 w-[80%] flex items-center justify-center border-slate-500 border-2 shadow-md shadow-[#40128B] rounded-lg">
                <input
                    type="text"
                    value={message}
                    className="w-full p-2 outline-none focus:outline-none bg-inherit "
                    onChange={changeHandler}
                />
                <AiOutlineSend
                    size={30}
                    className="cursor-pointer text-slate-500 active:scale-[0.75] transition-all duration-100"
                    onClick={sendMessageHandler}
                />
            </div>
            <button
                className="active:scale-[0.75] border-2 border-purple-500 m-2 p-2 rounded-lg hover:bg-red-500 text-white font-semibold"
                onClick={logoutHandler}
            >
                Go Back
            </button>
        </div>
    );
};

export default Messages;
