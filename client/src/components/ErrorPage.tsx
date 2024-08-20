import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError() as { status?: number; statusText?: string }; // Type assertion

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-9xl font-bold text-gray-800">Oops!</h1>
            <h2 className="mt-4 text-2xl font-semibold text-gray-600">
                {error?.status === 404 ? "404 - Page Not Found" : "Something went wrong"}
            </h2>
            <p className="mt-2 text-gray-500">
                {error?.statusText || "An unexpected error has occurred."}
            </p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-md shadow hover:bg-blue-500 transition-all">
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorPage;
