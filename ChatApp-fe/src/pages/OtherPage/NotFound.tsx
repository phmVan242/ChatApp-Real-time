import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="text-center">
        {/* Messenger Logo */}
        <svg className="w-20 h-20 mx-auto text-blue-300 mb-6" viewBox="0 0 88 88" fill="currentColor">
          <path d="M44 0C19.7 0 0 17.9 0 40c0 12.3 6 23.3 15.5 30.8V88l16.2-8.9C36.1 80.3 40 81 44 81c24.3 0 44-17.9 44-40S68.3 0 44 0zm4 54.4L36.2 42 14.8 54.4l23.4-24.8 11.8 12.4L71.2 29.6 48 54.4z"/>
        </svg>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-500 mb-8">
          Oops! This page doesn't exist.
        </p>
        <Link
          to="/chat"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors"
        >
          Go to Messages
        </Link>
      </div>
    </div>
  );
}
