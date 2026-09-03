import { FormEvent, useState } from "react";
import { BsMessenger } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiArrowRight,
  FiLoader,
  FiUser,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router";

const DEMO_ACCOUNTS = [
  { username: "user2", name: "User2", password: "1" },
  { username: "user3", name: "User3", password: "1" },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectPath = location.state?.from?.pathname || "/";

  const clearError = () => setError("");
  const clearFieldError = (field: "username" | "password") => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) errors.username = "Vui lòng nhập tên đăng nhập";
    if (!password) errors.password = "Vui lòng nhập mật khẩu";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(username, password);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demo: { username: string; password: string }) => {
    setUsername(demo.username);
    setPassword(demo.password);
    setFieldErrors({});
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 font-sans antialiased" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif' }}>
      {/* Left panel – branding */}
      <div className="hidden lg:flex flex-col justify-center items-start flex-1 px-20 text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
            <BsMessenger className="text-white text-4xl" />
          </div>
          <span className="text-4xl font-bold tracking-tight">Messenger</span>
        </div>
        <h2 className="text-5xl font-extrabold leading-tight mb-4">
          Kết nối với<br />
          <span className="text-yellow-300">mọi người</span><br />
          yêu thương.
        </h2>
        <p className="text-blue-200 text-lg max-w-sm">
          Nhắn tin tức thời, gọi video, chia sẻ khoảnh khắc — tất cả trong một ứng dụng.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 mt-8">
          {["💬 Chat realtime", "😄 Emoji & Reactions", "↩️ Reply tin nhắn", "🗑️ Thu hồi tin nhắn"].map((f) => (
            <span key={f} className="px-4 py-2 bg-white/15 rounded-full text-sm font-medium backdrop-blur">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-200">
          {/* Logo (mobile) */}
          <div className="flex lg:hidden items-center gap-3 mb-6 justify-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BsMessenger className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Messenger</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Đăng nhập</h1>
          <p className="text-sm text-gray-500 mb-6">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>

          {/* Global error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
              <FiAlertCircle className="flex-shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearFieldError("username");
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                    fieldErrors.username ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium transition"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                    clearError();
                  }}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                    fieldErrors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider + demo accounts */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">hoặc dùng tài khoản demo</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => fillDemoAccount(acc)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {acc.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(-2)
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{acc.name}</p>
                  <p className="text-xs text-gray-400">{acc.username}</p>
                </div>
                <FiArrowRight size={14} className="text-gray-300 group-hover:text-blue-400 transition" />
              </button>
            ))}
          </div>

          {/* Switch to register */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
