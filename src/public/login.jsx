import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../assets/images/logo.png';
import signupDefault from '../assets/images/signup.png';
import signup1 from '../assets/images/signup1.png';
import signup2 from '../assets/images/signup2.jpg';

const images = [signup1, signup2, signupDefault];

const Login = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPasswords, setShowPasswords] = useState({ password: false });

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.error('Email and Password are required');
    }

    try {
      const res = await axios.post('http://localhost:3000/api/users/login', form);

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('userId', res.data.user._id);

      toast.success('Login successful!');
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      }
      else if (res.data.user.role === 'user'){
        navigate('/home');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center min-h-screen px-4 sm:px-10">
      <ToastContainer />
      <div className="bg-[#FFF9F3] shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-[85rem] min-h-[90vh] relative">

        {/* Top Branding */}
        <div className="w-full flex items-center px-6 pt-1 md:absolute md:top-2 md:left-0 z-10">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-14 rounded-full object-contain cursor-pointer"
              onClick={() => navigate('/home')}
            />
            <h1 className="text-xl sm:text-2xl font-semibold text-[#8B6B3E]">Anka Attire</h1>
          </div>
        </div>

        {/* Left Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-7 pt-35 pb-60">
          <div className="w-full max-w-xl max-h-[900px] space-y-8">
            {/* Email & Password */}
            {[
              { type: "email", placeholder: "Email", icon: "envelope", name: "email" },
              { type: "password", placeholder: "Password", icon: "lock", id: "password", name: "password" },
            ].map((field, idx) => {
              const isPassword = field.type === "password";

              return (
                <div className="relative" key={idx}>
                  <input
                    type={
                      isPassword
                        ? showPasswords[field.id] ? "text" : "password"
                        : field.type
                    }
                    placeholder={field.placeholder}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full px-9 py-5 text-base border border-gray-400 text-gray-800 bg-white rounded-full pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#8B6B3E] transition"
                  />
                  {/* Left icon */}
                  <span className="absolute left-4 top-5 text-gray-500 text-base">
                    <i className={`fas fa-${field.icon}`}></i>
                  </span>
                  {/* Right eye toggle icon */}
                  {isPassword && (
                    <span
                      className="absolute right-4 top-5 text-gray-500 text-base cursor-pointer"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          [field.id]: !prev[field.id],
                        }))
                      }
                    >
                      <i className={`fas ${showPasswords[field.id] ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </span>
                  )}
                </div>
              );
            })}

           <div
  className="text-sm text-right text-[#8B6B3E] font-medium hover:underline cursor-pointer"
  onClick={() => navigate('/forgot-password')}
>
  Forgot Password?
</div>

            {/* Login Button */}
            <div className="flex justify-center ">
              <button
                onClick={handleLogin}
                className="px-16 py-2 bg-[#8B6B3E] text-white font-semibold text-2xl rounded-full hover:bg-[#7a5f36] transition flex items-center justify-center gap-2 shadow-lg"
              >
                Log In
              </button>
            </div>

            {/* Sign Up */}
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/signup')}
                className="font-bold text-[#8B6B3E] text-base sm:text-lg hover:underline cursor-pointer"
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="w-[530px] h-[600px] rounded-xl overflow-hidden shadow-lg relative top-[-28px]">
            <img
              src={images[currentImage]}
              alt="Login Visual"
              className="w-full h-full object-cover object-center transition duration-1000 ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
