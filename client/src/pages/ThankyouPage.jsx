import { Link } from "react-router-dom";

const ThankYouPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-4 text-3xl font-bold">Thank You!</h1>
            <p className="mb-4 text-lg">
                Hope you have enjoyed your session, Visit us again later!
            </p>
            <Link to="/" className="text-blue-500 hover:text-blue-700">
                Go back to home
            </Link>
        </div>
    );
};

export default ThankYouPage;
