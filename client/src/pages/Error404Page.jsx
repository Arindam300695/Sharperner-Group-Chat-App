import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";

const Error404Page = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="p-8 bg-white rounded-lg shadow-lg bg-opacity-30">
                <RiErrorWarningLine className="mb-4 text-6xl text-red-500" />
                <h1 className="mb-2 text-3xl font-bold">Error 404</h1>
                <p className="mb-4 text-lg">Page not found</p>
                <Link to="/" className="text-blue-500 hover:text-blue-700">
                    Go back to home
                </Link>
            </div>
        </div>
    );
};

export default Error404Page;
