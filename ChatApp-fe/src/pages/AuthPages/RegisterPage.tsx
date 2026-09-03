import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { BsMessenger } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiArrowRight,
  FiLoader,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";

// Component hiển thị độ mạnh mật khẩu (tuỳ chọn)
const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { text: "Yếu", color: "bg-red-500", width: "33%" };
    if (score <= 4) return { text: "Trung bình", color: "bg-yellow-500", width: "66%" };
    return { text: "Mạnh", color: "bg-green-500", width: "100%" };
  };
  const { text, color, width } = getStrength();
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">Độ mạnh: {text}</p>
    </div>
  );
};

export default function SignUpForm() {
  // State cho từng trường
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const navigate = useNavigate();
  const { register } = useAuth();

  // Hàm tiện ích
  const clearError = () => setError("");
  const clearSuccess = () => setSuccess("");
  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Tạo tên hiển thị từ first + last
  const displayName = `${firstName} ${lastName}`.trim();

  // Tạo avatar từ chữ cái đầu
  const makeAvatar = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Validation form
  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    if (!firstName.trim()) errors.name = "Vui lòng nhập họ";
    else if (!lastName.trim()) errors.name = "Vui lòng nhập tên";
    else if (displayName.length < 3) errors.name = "Tên hiển thị phải có ít nhất 3 ký tự";

    if (!username.trim()) errors.username = "Vui lòng nhập tên đăng nhập";
    else if (username.length < 3) errors.username = "Tên đăng nhập ít nhất 3 ký tự";

    if (!email.trim()) errors.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Email không hợp lệ";

    if (!password) errors.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6) errors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (password !== confirmPassword) errors.confirm = "Mật khẩu xác nhận không khớp";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    clearSuccess();
    if (!validateForm()) return;
    if (!agreed) {
      setError("Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật.");
      return;
    }

    setLoading(true);
    try {
      await register({
        displayName,
        username,
        email,
        password,
      });
      setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err: any) {
      console.error("Registration error:", err);
      const message = err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 font-sans antialiased">
      {/* Left branding - ẩn trên mobile */}
      <div className="hidden lg:flex flex-col justify-center items-start flex-1 px-20 text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
            <BsMessenger className="text-white text-4xl" />
          </div>
          <span className="text-4xl font-bold tracking-tight">Messenger</span>
        </div>
        <h2 className="text-5xl font-extrabold leading-tight mb-4">
          Tạo tài khoản<br />
          <span className="text-yellow-300">miễn phí</span><br />
          ngay hôm nay.
        </h2>
        <p className="text-blue-200 text-lg max-w-sm leading-relaxed">
          Chỉ mất 30 giây để đăng ký và bắt đầu trò chuyện với bạn bè.
        </p>
        <div className="mt-10 flex flex-col gap-4">
          {["✅ Hoàn toàn miễn phí mãi mãi", "✅ Không quảng cáo phiền phức", "✅ Mã hóa đầu cuối an toàn"].map((f) => (
            <span key={f} className="text-blue-100 text-base font-medium">{f}</span>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-200">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-6 justify-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <BsMessenger className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Messenger</span>
          </div>

          {/* Avatar preview */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0 transition-all">
              {makeAvatar(displayName || "?")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Đăng ký</h1>
              <p className="text-sm text-gray-500">Avatar của bạn sẽ hiển thị như bên cạnh.</p>
            </div>
          </div>

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
              <FiCheck className="flex-shrink-0" size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Global error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
              <FiAlertCircle className="flex-shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên (2 trường gộp) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                  <input
                    type="text"
                    placeholder="Họ"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      clearFieldError("name");
                      clearError();
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-purple-400 focus:border-purple-400 border-gray-200 bg-gray-50 hover:border-gray-300"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tên"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      clearFieldError("name");
                      clearError();
                    }}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-purple-400 focus:border-purple-400 border-gray-200 bg-gray-50 hover:border-gray-300"
                  />
                </div>
              </div>
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập <span className="text-red-500">*</span></label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="text"
                  placeholder="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearFieldError("username");
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-purple-400 focus:border-purple-400 ${
                    fieldErrors.username ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                />
              </div>
              {fieldErrors.username && <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                    clearError();
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-purple-400 focus:border-purple-400 ${
                    fieldErrors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu <span className="text-red-500">*</span></label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                    clearError();
                  }}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-purple-400 focus:border-purple-400 ${
                    fieldErrors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
              <PasswordStrength password={password} />
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError("confirm");
                    clearError();
                  }}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-purple-400 focus:border-purple-400 ${
                    fieldErrors.confirm
                      ? "border-red-400 bg-red-50"
                      : confirmPassword && confirmPassword === password
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
                {confirmPassword && confirmPassword === password && (
                  <FiCheck size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {fieldErrors.confirm && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirm}</p>}
            </div>

            {/* Điều khoản */}
            <label className="flex items-start gap-2.5 cursor-pointer group mt-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) clearError();
                }}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-400 cursor-pointer"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                Tôi đồng ý với{" "}
                <span className="text-purple-600 font-medium cursor-pointer hover:underline">Điều khoản sử dụng</span>{" "}
                và{" "}
                <span className="text-purple-600 font-medium cursor-pointer hover:underline">Chính sách bảo mật</span>{" "}
                của Messenger.
              </span>
            </label>

            {/* Nút submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-3"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Tạo tài khoản</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quay lại đăng nhập */}
          <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500">
            <Link
              to="/login"
              className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              <FiArrowLeft size={14} />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}