import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen dark:bg-neutral-700 bg-gray-100">
                <h1 className="text-9xl font-bold dark:text-neutral-100 text-gray-800">404</h1>
                <h2 className="mt-4 text-2xl font-semibold dark:text-neutral-300 text-gray-600">Oops! Page not found</h2>
                <p className="mt-2 dark:text-neutral-500 text-gray-500">Sorry, the page you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-md shadow hover:bg-blue-500 transition-all">
                    Go Back Home
                </Link>
            </div>
        </>
    )
}
