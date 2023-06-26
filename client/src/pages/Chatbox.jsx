/** @format */

import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineEllipsis } from "react-icons/ai";
import moment from "moment";

const baseUrl = "http://localhost:8080";

const Chatbox = () => {
    const navigate = useNavigate();
    // setting state to change the chat data
    const [userData, setUserData] = useState([]);
    const [userList, setUserList] = useState([]);
    const [user, setUser] = useState();
    const [clickedToLogout, setClickedToLogout] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [groupName, setGroupName] = useState(undefined);
    const [groupsData, setGroupsData] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
    const [userIdListToBeAddedToGroup, setUserIdListToBeAddedToGroup] =
        useState([]);
    const [groupId, setGroupId] = useState("");

    // console.log(
    //     currentTime,
    //     typeof currentTime,
    //     currentTime?.length,
    //     currentTime?.substring(9, 11)
    // );

    // add group modal opening section and closing section starts here
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    // add group modal opening and closing section ends here

    // add member modal opening section and closing section starts here
    const openAddMemberModal = () => {
        setIsAddMembersModalOpen(true);
    };

    const closeAddMemberModal = () => {
        setIsAddMembersModalOpen(false);
    };
    // add member modal opening and closing section ends here

    useEffect(() => {
        // setting current time based on current time and switching the theme accordingly between dark and light
        const timeNow = new Date();
        const ISOtimeNow = timeNow.toISOString();
        setCurrentTime(moment(ISOtimeNow).format("hh:mm:ss A"));
        // using axios.get and await async and try catch to getting the suer data
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(
                    `${baseUrl}/message/getUsers`,
                    {
                        withCredentials: true,
                    }
                );
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

        // fetching user specific groups data
        fetchGroupsData();

        // getting random videos
        const fetchVideos = async () => {};
        fetchVideos();
    }, [navigate]);

    // fetching all the groups which contains this logged in user as one of it's member
    const fetchGroupsData = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/group/getGroup`, {
                withCredentials: true,
            });
            if (data.error) {
                navigate("/error");
                return toast.error(data.error);
            } else {
                setGroupsData(data);
            }
        } catch (error) {
            return toast.error(error.message);
        }
    };

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

    // createGroupHandler function
    const createGroupHandler = async () => {
        if (groupName === undefined)
            return toast.error("Choose a group name to create a new group");
        try {
            const { data } = await axios.post(
                `${baseUrl}/group/createGroup`,
                { groupName },
                {
                    withCredentials: true,
                }
            );
            if (data.error) return toast.error(data.error);
            else {
                toast.success(data.message);
                setGroupName("");
                return setGroupsData([
                    ...groupsData,
                    {
                        groupName,
                        id: data?.group.id,
                        admin: user?.id,
                    },
                ]);
            }
        } catch (error) {
            return toast.error(error.message);
        }
    };

    // addMemberHandler function
    const addMemberHandler = (userId) => {
        setUserList(userList?.filter((member) => member.id !== userId));
    };

    // addMemeberToGroupHandler function
    const addmemberToGroupHandler = async () => {
        if (userIdListToBeAddedToGroup.length === 0)
            return toast.error(
                "Please add at least one member to add them to the group you wish to"
            );
        try {
            const { data } = await axios.post(
                `${baseUrl}/group/addMembersToGroup`,
                { groupId, userList: userIdListToBeAddedToGroup },
                {
                    withCredentials: true,
                }
            );
            if (data.error) return toast.error(data.error);
            setUserIdListToBeAddedToGroup([]);
            return toast.success(data.message);
        } catch (error) {
            return toast.error(error.message);
        }
    };

    // messageHandler funtion
    const messageHandler = (groupId) => {
        navigate(`/messages/${groupId}`);
    };

    return (
        <div
            className={`h-screen overflow-hidden overflow-y-scroll container-md mx-auto ${
                currentTime?.substring(9, 11) === "PM"
                    ? "bg-[#2B2A4C] text-white"
                    : "text-black bg-white"
            }`}
        >
            {/* nav section starts here */}
            <nav
                className={`flex items-center justify-between px-8 py-4 bg-inherit border-b-2 ${
                    currentTime?.substring(9, 11) === "PM"
                        ? "border-white"
                        : "border-black"
                }`}
            >
                {/* left section logged in user's profile portion starts here  */}
                <div className="flex items-center justify-center gap-5 ">
                    <img
                        src={user?.profile}
                        alt="User Profile"
                        className="rounded-[50%] w-10 h-10"
                    />
                    <h1 className="grid grid-cols-1 md:grid-cols-2">
                        Welcome
                        <p className="text-2xl font-semibold"> {user?.name}</p>
                    </h1>
                </div>
                {/* left section user profile portion ends here */}

                {/* middle section creating group portion starts here */}
                <div>
                    <button
                        className="p-4 font-bold bg-purple-700 rounded-lg active:scale-[0.75] transition-all duration-300"
                        onClick={openModal}
                    >
                        Create Group
                    </button>
                </div>
                {/* middle section creating group portion ends here */}

                {/* right section three dots portion starts here */}
                <div>
                    {!clickedToLogout && (
                        <AiOutlineEllipsis
                            className="cursor-pointer  active:scale-[0.75] transition-all duration-300"
                            onClick={clickedToLogoutHandler}
                            size={50}
                        />
                    )}
                    {clickedToLogout && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <h1
                                onClick={logoutHandler}
                                className="cursor-pointer  active:scale-[0.75] transition-all duration-300"
                            >
                                Logout
                            </h1>
                            <h1
                                onClick={() => {
                                    setClickedToLogout(!clickedToLogout);
                                }}
                                className="cursor-pointer active:scale-[0.75] transition-all duration-300"
                            >
                                Cancel
                            </h1>
                        </div>
                    )}
                </div>
                {/* right section three dot property ends here */}
            </nav>
            {/* nav section ends here */}

            {/* chatbox starts here */}
            <div className="grid gap-4 sm:grid-cols-2">
                {/* left section of users and groups portion starts here */}
                <div className="flex flex-col h-screen overflow-hidden overflow-y-scroll">
                    {/* user section starts here */}
                    <div
                        className={`h-[40%] overflow-hidden overflow-y-scroll border-b-2 ${
                            currentTime?.substring(9, 11) === "PM"
                                ? "border-white"
                                : "border-black"
                        }`}
                    >
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

                    {/* group section starts here */}
                    <div className="overflow-hidden mt-4 h-[50%] overflow-y-scroll">
                        {groupsData?.length === 0 ? (
                            <div className="grid w-1/2 grid-cols-2 gap-10 m-auto mt-20 text-2xl font-bold uppercase">
                                <img
                                    src="https://media.tenor.com/hylEE2LtVtcAAAAM/sad.gif"
                                    alt="sad emoji"
                                    className="w-[600px] h-[160px]"
                                />
                                <h1>
                                    you are not added in any group till now....
                                </h1>
                            </div>
                        ) : (
                            <div className="">
                                {groupsData?.map((eachGroup, index) => (
                                    <div key={index} className="m-10">
                                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                                            <h1
                                                className="bg-[#FF55BB] sm:w-full p-3 rounded-lg text-center m-2 w-auto font-bold text-xl uppercase shadow-md shadow-[#FFD3A3] border border-[#00DFA2] active:scale-[0.75] translate-all duration-300 cursor-pointer"
                                                onClick={() => {
                                                    messageHandler(
                                                        eachGroup?.id
                                                    );
                                                }}
                                            >
                                                {eachGroup?.groupName}
                                            </h1>
                                            {eachGroup?.admin === user?.id && (
                                                <button
                                                    className="border border-[#FF55BB] p-3 rounded-md shadow-md shadow-[#00DFA2] active:scale-[0.75] transition-all duration-300"
                                                    onClick={async () => {
                                                        openAddMemberModal();
                                                        setGroupId(
                                                            eachGroup?.id
                                                        );
                                                        const { data } =
                                                            await axios.post(
                                                                `${baseUrl}/group/getCompleteGroupDetails/${eachGroup?.id}`,
                                                                { userData },
                                                                {
                                                                    withCredentials: true,
                                                                }
                                                            );
                                                        if (data.error)
                                                            return toast.error(
                                                                data.error
                                                            );

                                                        setUserList(data);
                                                    }}
                                                >
                                                    Add Members
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* group section ends here */}
                </div>
                {/* left section of users and groups portion ends here */}
                {/* right secion of random portion starts here */}
                <div className="border border-white">I am a random section</div>
                {/* right secion of random portion ends here */}
            </div>
            {/* cahtbox ends here */}

            {/* add group moodal starts here */}
            {isOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center">
                    <div className="p-4 bg-[#40128B] rounded shadow-lg">
                        <div className="flex items-center justify-between gap-10 mb-4">
                            <h2 className="text-xl font-bold">
                                Choose your group name
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-600 transition-all duration-300 hover:text-white hover:scale-y-150  active:scale-[0.75]"
                            >
                                <AiOutlineClose className="w-6 h-6" />
                            </button>
                        </div>
                        <input
                            required
                            type="text"
                            className="mr-4 border-b-2 border-white outline-none bg-inherit"
                            value={groupName}
                            onChange={(e) => {
                                setGroupName(e.target.value);
                            }}
                        />
                        <button
                            className="border-2 font-semibold uppercase hover:translate-x-4 transition-all duration-300 border-[#FF55BB] p-3 rounded-lg m-2  active:scale-[0.75]"
                            onClick={createGroupHandler}
                        >
                            confirm
                        </button>
                    </div>
                </div>
            )}
            {/* add group moodal ends here */}

            {/* add group memebrs modal starts here */}
            {isAddMembersModalOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center">
                    <div className="p-4 bg-[#40128B] rounded shadow-lg text-center">
                        <div className="flex items-center justify-between gap-10 mb-4">
                            <h1 className="font-semibold text-gray-200">
                                Choose members you wanna add to your group
                            </h1>
                            <button
                                onClick={closeAddMemberModal}
                                className="text-gray-600 transition-all duration-300 hover:text-white hover:scale-y-150  active:scale-[0.75]"
                            >
                                <AiOutlineClose className="w-6 h-6" />
                            </button>
                        </div>
                        {userList?.map((item) => (
                            <div
                                key={item?.id}
                                className="flex items-center justify-center gap-5"
                            >
                                <h2 className="font-bold text-white">
                                    {item?.name}
                                </h2>
                                <button
                                    className="font-semibold text-white border border-[#FF0060] p-3 m-2 rounded-md shadow-md shadow-[#F6FA70] active:scale-[0.75] transition-all duration-300"
                                    onClick={() => {
                                        addMemberHandler(item?.id);
                                        setUserIdListToBeAddedToGroup([
                                            ...userIdListToBeAddedToGroup,
                                            item?.id,
                                        ]);
                                    }}
                                >
                                    Add me
                                </button>
                            </div>
                        ))}
                        <button
                            className="border-2 font-semibold uppercase hover:translate-x-4 transition-all duration-300 border-[#FF55BB] p-3 rounded-lg m-2  active:scale-[0.75]"
                            onClick={addmemberToGroupHandler}
                        >
                            confirm
                        </button>
                    </div>
                </div>
            )}
            {/* add grouop members modal ends here */}

            <ToastContainer />
        </div>
    );
};

export default Chatbox;
