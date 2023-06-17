/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chatbox from "./pages/Chatbox";
import { ToastContainer } from "react-toastify";
import ThankYouPage from "./pages/ThankyouPage";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chatbox />} />
                    <Route path="/logout" element={<ThankYouPage />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </>
    );
};

export default App;
