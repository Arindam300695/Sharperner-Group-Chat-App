/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chatbox from "./pages/Chatbox";
import { ToastContainer } from "react-toastify";
import ThankYouPage from "./pages/ThankyouPage";
import Error404Page from "./pages/Error404Page";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chatbox />} />
                    <Route path="/logout" element={<ThankYouPage />} />
                    <Route path="/error" element={<Error404Page />} />
                    <Route path="*" element={<Error404Page />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </>
    );
};

export default App;
