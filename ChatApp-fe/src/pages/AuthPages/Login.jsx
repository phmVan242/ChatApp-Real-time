import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../hooks/useAuth';
import ApiService from '../../api/ApiService';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // Load remembered username nếu có
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUserName(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userName || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);

    try {
      const response = await ApiService.login(userName, password);
      console.log('Login success:', response);

      const token = response.data.token;
      if (!token) {
        setError('Đăng nhập thất bại: Không nhận được token');
        setIsLoading(false);
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
        setError('Đăng nhập thất bại: Token không hợp lệ');
        setIsLoading(false);
        return;
      }

      const role =
        decodedToken?.role ||
        decodedToken?.roles?.[0] ||
        decodedToken?.authorities?.[0]?.authority ||
        'USER';

      console.log('User role:', role);

      // (Tuỳ chọn) Kiểm tra quyền ADMIN
      // if (role !== 'ADMIN' && role !== 'ROLE_ADMIN') {
      //   setError('Access denied. Admin privileges required.');
      //   setIsLoading(false);
      //   return;
      // }

      const userInfo = {
        name: decodedToken?.name || decodedToken?.username || decodedToken?.sub || 'Admin',
        email: decodedToken?.email || '',
        role: role,
      };

      login(token, role, userInfo);

      if (rememberMe) {
        localStorage.setItem('rememberedUsername', userName);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      navigate('/');
    } catch (err) {
      console.error('Error during sign in:', err);
      const message = err.response?.data?.message || err.message || 'Sign in failed. Please check your credentials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/img.jpg')",
      }}
    >
      <div className="flex justify-end">
        <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
          <div className="w-96 p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <span className="text-sm text-gray-900">Welcome back</span>
                <h1 className="text-2xl font-bold">Login to your account</h1>
              </div>

              <div className="mt-5">
                <label className="block text-md mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none focus:border-green-400"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="username"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="my-3 relative">
                <label className="block text-md mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none focus:border-green-400 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      // Icon mắt mở (ẩn chữ)
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    ) : (
                      // Icon mắt đóng
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Remember Me</span>
                </label>

                <span className="text-sm text-blue-700 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-3 text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login now'}
                </button>

                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition duration-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </form>

            <p className="mt-8 text-center">
              Don't have an account?{' '}
              <span className="cursor-pointer text-sm text-blue-600 hover:underline">
                Join free today
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}