import { useEffect, useState } from 'react';
import { FaHeart, FaSearch, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import fashionVideo from '../assets/images/new.mp4';
import FamousProducts from '../components/famousproduct';
import Footer from '../components/footer';
import Navbar from '../components/nav';

// ✅ Import images for the video mart section



import home from "../assets/images/home.png";
import homehello from "../assets/images/homehello.png";
import homes from "../assets/images/homes.png";
import homes2 from "../assets/images/homes2.png";
import homes6 from "../assets/images/homes6.png";


// Static products for the row below the video (renamed to avoid conflict)
// const staticProducts = [
//   { id: 1, image: img1, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 5 },
//   { id: 2, image: img2, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 4 },
//   { id: 3, image: img3, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 5 },
//   { id: 4, image: img4, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 5 },
//   { id: 5, image: img5, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 4 },
//   { id: 6, image: img6, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 5 },
//   { id: 7, image: img7, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 5 },
//   { id: 8, image: img8, fabric: 'Silk blend with zari embroidery', price: '5,000', rating: 3 },
// ];






const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = 'http://localhost:3000';
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Add hero images array and currentIndex state
  const heroImages = [home, homes, homes2, homes6, homehello];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error('Categories API response is not an array:', data);
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/api/products`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error('Products API response is not an array:', data);
          setProducts([]);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Update useEffect for hero image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);


  return (
    <div className="bg-[#FFFCF8] text-[#3C2A1E] font-[sans-serif] min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Search */}
      <section className="relative w-full">
        {/* Left Arrow Button */}
        <button className="hidden md:flex items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow text-3xl text-[#8B6B3E] font-bold z-20 border border-[#e2c799] opacity-30 hover:opacity-100 transition-opacity duration-200">
          &#60;
        </button>
        {/* Right Arrow Button */}
        <button className="hidden md:flex items-center justify-center absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow text-3xl text-[#8B6B3E] font-bold z-20 border border-[#e2c799] opacity-30 hover:opacity-100 transition-opacity duration-200">
          &#62;
        </button>
        <img
          src={heroImages[currentIndex]}
          alt="Hero"
          className="w-full h-[400px] md:h-[600px] lg:h-[770px] object-cover"
        />
        <div className="absolute top-10 md:top-16 left-[47%] transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[57%] bg-white/50 hover:bg-white backdrop-blur-md rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center px-4 md:px-6 py-3 md:py-4 transition-all duration-300">
          <FaSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-6 outline-none bg-transparent text-sm text-gray-800 placeholder-gray-500"
          />
        </div>

        {/* Centered Text Block */}
        <div className="absolute top-[70%] md:top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 max-w-xs md:max-w-lg">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-wider drop-shadow-xl uppercase font-playfair text-white/60">
            Anka Attire <br />
            <span className="text-xl md:text-3xl font-light tracking-normal text-white/70">
              Grace In Every Thread
            </span>
          </h1>
          <button className="mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 bg-white text-[#8B6B3E] font-semibold rounded-full shadow hover:bg-[#f3f3f3] transition duration-200 tracking-wide" onClick={() => navigate('/products')}>
            SHOP NOW
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 px-2 md:px-10 lg:px-20 bg-[#FFF9F3] w-full overflow-x-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-5 text-center text-[#8B6B3E]">Categories</h2>
        <div className="flex justify-between items-center gap-4 md:gap-6 overflow-x-auto px-2 md:px-8">
          {categories && categories.length > 0 ? (
            categories.map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center min-w-[80px] md:min-w-[100px] cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
              >
                <img
                  src={`${BASE_URL}${cat.image}`}
                  alt={cat.name}
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300 shadow-md"
                />
                <span className="text-[14px] md:text-[16px] mt-2 md:mt-3 font-bold text-[#8B6B3E]">{cat.name}</span>
              </div>
            ))
          ) : (
            <div className="text-center w-full py-8 text-[#8B6B3E]">
              {loading ? 'Loading categories...' : 'No categories available'}
            </div>
          )}
        </div>
      </section>

      {/* Famous Products Section */}
      <FamousProducts />

      {/* Elegant Fashion Video Section */}
      <section className="relative px-2 sm:px-4 md:px-10 lg:px-20 py-10 md:py-16 bg-gradient-to-br from-[#f7ede2] via-white to-[#EBDECD]/90 min-h-[500px] md:min-h-[700px] overflow-hidden">
        {/* Caption - now before video, large title and higher */}
        <div className="text-center mb-3 md:mb-5 relative z-10">
          <p className="text-4xl md:text-5xl font-extrabold text-[#8B6B3E] tracking-wide mb-1">
            Grace in Every Thread
          </p>
          <p className="text-xl md:text-2xl text-[#8B6B3E]/70 font-semibold">
            Experience the elegance of timeless fashion
          </p>
        </div>
        {/* Video Container - clean, no border, no circles, no header */}
        <div className="max-w-6xl mx-auto relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-[#8B6B3E]/10 to-[#e2c799]/10 relative overflow-hidden rounded-3xl flex items-center justify-center">
              <video
                src={fashionVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* One row of products after video, styled exactly as FamousProducts */}
      <section className="px-4 sm:px-6 py-16 bg-gradient-to-br text-[#8B6B3E] via-text-white to-[#EBDECD]">
        <h2 className="text-2xl sm:text-4xl md:text-4xl font-extrabold text-center text-[#8B6B3E] mb-10 relative">
          Featured Products
          <span className="block w-30 h-1.5 bg-[#8B6B3E] mx-auto mt-3 rounded-full animate-pulse"></span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#8B6B3E] text-xl">Loading products...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600 text-xl text-center">
              <p>{error}</p>
            </div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-8xl mx-auto">
            {products
              .filter(product => product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .slice(0, 4)
              .map((product) => (
                <div
                  key={product._id}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-xl transition-all transform group flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-[380px] overflow-hidden">
                    <img
                      src={`${BASE_URL}/uploads/${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform"
                    />
                    <button
                      className="absolute top-2 right-2 text-rose-400 hover:text-rose-600 transition-colors duration-200"
                      aria-label="Add to favorites"
                    >
                      <FaHeart size={22} />
                    </button>
                  </div>
                  {/* Description */}
                  <div className="p-4 space-y-1 bg-gradient-to-t from-amber-50/50 to-white flex flex-col justify-between">
                    <div>
                      <h3 className="text-md font-semibold text-[#8B6B3E] truncate">{product.title}</h3>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Fabric:</span> {product.fabric}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Price:</span>{' '}
                        <span className="text-emerald-600 font-semibold">Rs. {product.price}</span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm text-gray-700">Rating:</span>
                        {Array.from({ length: product.rating || 0 }).map((_, i) => (
                          <FaStar key={`filled-${i}`} className="text-yellow-400 text-base" />
                        ))}
                        {Array.from({ length: 5 - (product.rating || 0) }).map((_, i) => (
                          <FaStar key={`empty-${i}`} className="text-gray-300 text-base" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-2">
                      <button className="w-1/2 border-2 border-[#8B6B3E] text-[#8B6B3E] py-1 rounded-full font-medium hover:bg-[#8B6B3E] hover:text-white transition-colors duration-200">
                        Buy Now
                      </button>
                      <button className="w-1/2 bg-[#8B6B3E] text-white py-1 rounded-full font-medium hover:bg-[#704F2E] transition-colors duration-200">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#8B6B3E] text-xl">No products available</div>
          </div>
        )}
      </section>

      {/* Testimonials Section (after video, before footer) */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-20">
        <div className="max-w-5xl w-full mx-auto">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B6B3E] mb-8">What Our Customers Say</h2>
            <div className="relative w-full flex items-center justify-center">
              <button className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-[#8B6B3E] bg-white rounded-full shadow p-2 hover:bg-[#f7ede2] transition">&#60;</button>
              <div className="bg-[#f7ede2] rounded-2xl shadow-lg px-8 py-5 flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl mx-auto min-h-[110px]">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-lg md:text-xl font-medium text-[#3C2A1E] mb-2">"Absolutely loved the detailing on the kurti I bought! The embroidery work is just stunning and looks even better in person."</p>
                  
                </div>
                <div className="flex-shrink-0">
                  <img src="/src/assets/images/detail1.png" alt="Customer" className="w-16 h-16 rounded-full object-cover border-4 border-[#e2c799]" />
                </div>
              </div>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-[#8B6B3E] bg-white rounded-full shadow p-2 hover:bg-[#f7ede2] transition">&#62;</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
