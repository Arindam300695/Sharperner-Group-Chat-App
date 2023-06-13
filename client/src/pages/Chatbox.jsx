/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:8080";

const Chatbox = () => {
    // setting state to change the chat data
    const [chatData, setChatData] = useState([]);

    useEffect(() => {
        // using axios.get and await async and try catch to get the chat data
        const fetchChatData = async () => {
            try {
                const { data } = await axios.get(`${baseUrl}/chat/getChats`, {
                    withCredentials: true,
                });
                if (data.error) return toast.error(data.error);
                else {
                    toast.success(data.message);
                    console.log(data);
                    setChatData(data?.chat);
                }
            } catch (error) {
                // toast.error(error.message);
            }
        };
        fetchChatData();
    }, []);

    return (
        <div className="chatbox">
            {chatData?.map((chat) => (
                <div className="chat-item" key={chat.id}>
                    <div className="chat-item-header">
                        <div className="chat-item-name">{chat.name}</div>
                        <div className="chat-item-time">{chat.time}</div>
                    </div>
                    <div className="chat-item-body">{chat.body}</div>
                </div>
            ))}
        </div>
    );
};

export default Chatbox;
