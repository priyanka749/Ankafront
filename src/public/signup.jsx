// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useEffect, useState } from 'react';
// import logo from '../assets/images/logo.png';
// import signupDefault from '../assets/images/signup.png';
// import signup1 from '../assets/images/signup1.png';
// import signup2 from '../assets/images/signup2.jpg';

// const images = [signup1, signup2, signupDefault];

// const Signup = () => {
//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-white flex items-center justify-center min-h-screen px-10">
// <div className="bg-[#FFF9F3] shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-[70rem] max-h-[150rem] relative">

//         {/* Top Navigation and Branding */}
//         <div className="w-full flex items-center justify-between px-1 sm:px-6 pt-2 md:absolute md:top-2 md:left-0 md:right-0 z-10">
//           <div className="flex items-center gap-4">
//             <img src={logo} alt="Logo" className="h-12 w-10 rounded-full sm:h-14 sm:w-14" />
//             <h1 className="text-lg sm:text-xl font-semibold text-[#8B6B3E] whitespace-nowrap"></h1>
//           </div>
//           <div className="space-x-3 -mt-7">
//             <button className="px-5 py-1.5 rounded-md bg-gray-200 text-sm text-gray-700">Log In</button>
//             <button className="px-5 py-1.5 rounded-md bg-[#8B6B3E] text-white text-sm shadow">Sign Up</button>
//           </div>
//         </div>

//         {/* Left Form Section */}
//         <div className="w-full md:w-1/2 p-6 pt-24 space-y-5">
//           <div className="space-y-4">
//             {[{ type: "text", placeholder: "Full Name", icon: "user" },
//               { type: "email", placeholder: "Email", icon: "envelope" },
//               { type: "tel", placeholder: "Phone Number", icon: "phone" },
//               { type: "text", placeholder: "Address", icon: "map-marker-alt" },
//               { type: "password", placeholder: "Password", icon: "lock" },
//               { type: "password", placeholder: "Confirm Password", icon: "lock" }
//             ].map((field, idx) => (
//               <div className="relative" key={idx}>
//                 <input
//                   type={field.type}
//                   placeholder={field.placeholder}
//                   className="w-full px-4 py-2 border border-gray-500 text-gray-800 bg-white rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-[#8B6B3E]"
//                 />
//                 <span className="absolute left-3 top-2.5 text-gray-500">
//                   <i className={`fas fa-${field.icon}`}></i>
//                 </span>
//               </div>
//             ))}

//            <p className="text-sm text-right">
//   Already have an account?{' '}
//   <a href="#" className="font-bold text-[#8B6B3E]">Log In</a>
// </p>

// <div className="flex justify-center mt-4">
//   <button className="px-8 py-2 bg-[#8B6B3E] text-white font-semibold text-base rounded-md hover:bg-[#7a5f36] transition flex items-center justify-center gap-2">
//     <i className="fas fa-user-plus"></i>
//     Sign Up
//   </button>
// </div>



//           </div>
//         </div>

//         {/* Right Image Section */}
//         <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-5">
//           <div className="rounded-xl overflow-hidden w-[85%] h-[75%] max-w-sm">
//             <img
//               src={images[currentImage]}
//               alt="Signup Visual"
//               className="w-full h-full object-cover transition duration-1000 ease-in-out"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
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

const Signup = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    lat: '',
    lon: '',
  });

  const [suggestions, setSuggestions] = useState([]);
  const [locationDenied, setLocationDenied] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            address: data.display_name || '',
            lat,
            lon
          }));
        } catch {
          toast.error("Reverse geocoding failed.");
        }
      },
      () => {
        setLocationDenied(true);
      }
    );
  }, []);

  // Suggest locations when typing manually
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (form.address.length > 2 && locationDenied) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${form.address}&format=json&limit=5`);
          const data = await res.json();
          const formatted = data.map(loc => {
            const parts = loc.display_name.split(',').map(p => p.trim());
            return {
              display: parts.slice(0, 3).join(', '),
              lat: loc.lat,
              lon: loc.lon
            };
          });
          setSuggestions(formatted);
        } catch {
          console.error("Error fetching suggestions");
        }
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [form.address, locationDenied]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSuggestionClick = (suggestion) => {
    setForm(prev => ({
      ...prev,
      address: suggestion.display,
      lat: suggestion.lat,
      lon: suggestion.lon
    }));
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    const { fullName, email, phone, address, password, confirmPassword, lat, lon } = form;

    if (!fullName || !email || !phone || !address || !password || !confirmPassword) {
      return toast.error("All fields are required.");
    }

    if (!form.lat || !form.lon) {

      const confirm = window.confirm("You haven't selected a geolocation. Are you sure you want to continue with just the typed address?");
      if (!confirm) return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) return toast.error("Invalid email format.");
    if (!phoneRegex.test(phone)) return toast.error("Phone must be 10 digits.");
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', {
        fullName, email, phone, address, password, lat, lon
      });
      toast.success("OTP sent to your email.");
      navigate('/otp', { state: { userId: response.data.userId } });
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center min-h-screen px-4 sm:px-10">
      <ToastContainer />
      <div className="bg-[#FFF9F3] shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-[85rem] min-h-[90vh] relative">

        {/* Branding */}
        <div className="w-full flex items-center px-6 pt-1 md:absolute md:top-2 md:left-0 z-10">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-14 w-14 rounded-full object-contain cursor-pointer" onClick={() => navigate('/home')} />
            <h1 className="text-xl sm:text-2xl font-semibold text-[#8B6B3E]">Anka Attire</h1>
          </div>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 pt-24 pb-12">
          <div className="w-full max-w-xl space-y-7">
            {[
              { name: "fullName", type: "text", placeholder: "Full Name", icon: "user" },
              { name: "email", type: "email", placeholder: "Email", icon: "envelope" },
              { name: "phone", type: "tel", placeholder: "Phone Number", icon: "phone" },
              { name: "address", type: "text", placeholder: "Address", icon: "map-marker-alt" },
              { name: "password", type: "password", placeholder: "Password", icon: "lock", id: "password" },
              { name: "confirmPassword", type: "password", placeholder: "Confirm Password", icon: "lock", id: "confirmPassword" }
            ].map((field, i) => {
              const isPassword = field.type === "password";
              return (
                <div className="relative" key={i}>
                  <input
                    type={isPassword ? (showPasswords[field.id] ? "text" : "password") : field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-base border border-gray-400 text-gray-800 bg-white rounded-full pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#8B6B3E] transition"
                  />
                  <span className="absolute left-4 top-4 text-gray-500">
                    <i className={`fas fa-${field.icon}`} />
                  </span>
                  {isPassword && (
                    <span className="absolute right-4 top-4 text-gray-500 cursor-pointer" onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      [field.id]: !prev[field.id]
                    }))}>
                      <i className={`fas ${showPasswords[field.id] ? "fa-eye" : "fa-eye-slash"}`} />
                    </span>
                  )}
                  {field.name === "address" && suggestions.length > 0 && (
                    <ul className="absolute z-20 bg-white border mt-2 rounded-md w-full shadow-lg max-h-40 overflow-y-auto">
                      {suggestions.map((s, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleSuggestionClick(s)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {s.display}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <div className="text-sm text-right">
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} className="font-bold text-[#8B6B3E] hover:underline cursor-pointer">Log In</span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-16 py-3 bg-[#8B6B3E] text-white font-semibold text-2xl rounded-full hover:bg-[#7a5f36] transition flex items-center justify-center gap-2 shadow-lg"
              >
                <i className="fas fa-user-plus"></i> Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="w-[530px] h-[600px] rounded-xl overflow-hidden shadow-lg relative top-[-28px]">
            <img src={images[currentImage]} alt="Signup Visual" className="w-full h-full object-cover object-center transition duration-1000 ease-in-out" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../assets/images/logo.png';
// import signupDefault from '../assets/images/signup.png';
// import signup1 from '../assets/images/signup1.png';
// import signup2 from '../assets/images/signup2.jpg';

// const images = [signup1, signup2, signupDefault];

// const Signup = () => {
//   const [currentImage, setCurrentImage] = useState(0);
//   const [showPasswords, setShowPasswords] = useState({
//     password: false,
//     confirmPassword: false,
//   });

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     const { fullName, email, phone, address, password, confirmPassword } = formData;
//     if (!fullName || !email || !phone || !address || !password || !confirmPassword) {
//       alert("Please fill all fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:3000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fullName, email, phone, address, password, role: "user" }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("OTP sent to your email.");
//         navigate('/verify-otp', { state: { userId: data.userId } });
//       } else {
//         alert(data.message || "Signup failed.");
//       }
//     } catch (error) {
//       console.error("Signup Error:", error);
//       alert("An error occurred during signup.");
//     }
//   };

//   return (
//     <div className="bg-white flex items-center justify-center min-h-screen px-4 sm:px-10">
//       <div className="bg-[#FFF9F3] shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-[85rem] min-h-[90vh] relative">

//         {/* Top Branding */}
//         <div className="w-full flex items-center px-6 pt-1 md:absolute md:top-2 md:left-0 z-10">
//           <div className="flex items-center gap-4">
//             <img src={logo} alt="Logo" className="h-14 w-14 rounded-full object-contain" />
//             <h1 className="text-xl sm:text-2xl font-semibold text-[#8B6B3E]">Anka Attire</h1>
//           </div>
//         </div>

//         {/* Left Form Section */}
//         <div className="w-full md:w-1/2 flex items-center justify-center px-6 pt-24 pb-12">
//           <div className="w-full max-w-xl space-y-7">
//             {[
//               { type: "text", name: "fullName", placeholder: "Full Name", icon: "user" },
//               { type: "email", name: "email", placeholder: "Email", icon: "envelope" },
//               { type: "tel", name: "phone", placeholder: "Phone Number", icon: "phone" },
//               { type: "text", name: "address", placeholder: "Address", icon: "map-marker-alt" },
//               { type: "password", name: "password", placeholder: "Password", icon: "lock", id: "password" },
//               { type: "password", name: "confirmPassword", placeholder: "Confirm Password", icon: "lock", id: "confirmPassword" }
//             ].map((field, idx) => {
//               const isPassword = field.type === "password";
//               return (
//                 <div className="relative" key={idx}>
//                   <input
//                     type={isPassword ? (showPasswords[field.id] ? "text" : "password") : field.type}
//                     name={field.name}
//                     value={formData[field.name]}
//                     placeholder={field.placeholder}
//                     onChange={handleChange}
//                     className="w-full px-5 py-4 text-base border border-gray-400 text-gray-800 bg-white rounded-full pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#8B6B3E] transition"
//                   />
//                   <span className="absolute left-4 top-4 text-gray-500 text-base">
//                     <i className={`fas fa-${field.icon}`}></i>
//                   </span>
//                   {isPassword && (
//                     <span
//                       className="absolute right-4 top-4 text-gray-500 text-base cursor-pointer"
//                       onClick={() =>
//                         setShowPasswords((prev) => ({
//                           ...prev,
//                           [field.id]: !prev[field.id],
//                         }))
//                       }
//                     >
//                       <i className={`fas ${showPasswords[field.id] ? 'fa-eye' : 'fa-eye-slash'}`}></i>
//                     </span>
//                   )}
//                 </div>
//               );
//             })}

//             <div className="text-sm text-right">
//               Already have an account?{' '}
//               <span
//                 onClick={() => navigate('/login')}
//                 className="font-bold text-[#8B6B3E] text-base sm:text-lg hover:underline cursor-pointer"
//               >
//                 Log In
//               </span>
//             </div>

//             <div className="flex justify-center">
//               <button
//                 onClick={handleSubmit}
                
//                 className="px-16 py-3 bg-[#8B6B3E] text-white font-semibold text-2xl rounded-full hover:bg-[#7a5f36] transition flex items-center justify-center gap-2 shadow-lg"
//               >
//                 <i className="fas fa-user-plus"></i>
                 
//                 Sign Up
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Image Section */}
//         <div className="hidden md:flex md:w-1/2 items-center justify-center">
//           <div className="w-[530px] h-[600px] rounded-xl overflow-hidden shadow-lg relative top-[-28px]">
//             <img
//               src={images[currentImage]}
//               alt="Signup Visual"
//               className="w-full h-full object-cover object-center transition duration-1000 ease-in-out"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;
