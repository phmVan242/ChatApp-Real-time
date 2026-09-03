export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Messenger-style logo */}
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-blue-500" viewBox="0 0 88 88" fill="currentColor">
            <path d="M44 0C19.7 0 0 17.9 0 40c0 12.3 6 23.3 15.5 30.8V88l16.2-8.9C36.1 80.3 40 81 44 81c24.3 0 44-17.9 44-40S68.3 0 44 0zm4 54.4L36.2 42 14.8 54.4l23.4-24.8 11.8 12.4L71.2 29.6 48 54.4z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Messages</h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-4">
          Select a conversation from the sidebar or start a new one to begin chatting
        </p>
        <button className="px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors">
          Start New Chat
        </button>
      </div>
    </div>
  );
}
