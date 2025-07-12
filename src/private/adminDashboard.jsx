import { useState } from 'react';
import { FaBoxOpen, FaClipboardList, FaMoneyCheckAlt, FaQuestionCircle, FaSignOutAlt, FaTags } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ImageUploadWithName from './add';
import AdminAddProduct from './addproduct';
import AdminSales from './addsales';
import PaymentManagement from './paymentstatment';

const pages = [
  { key: 'products', label: 'Product Management', icon: <FaBoxOpen /> },
  { key: 'orders', label: 'Order Management', icon: <FaClipboardList /> },
  { key: 'categories', label: 'Category Management', icon: <FaTags /> },
  { key: 'payments', label: 'Payment Statement', icon: <FaMoneyCheckAlt /> },
  { key: 'Sales', label: 'Sales Management', icon: <FaTags /> },
  { key: 'queries', label: 'User Queries', icon: <FaQuestionCircle /> },
];

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('products');
  const navigate = useNavigate();

  const handleSidebarClick = (key) => {
    setActivePage(key);
    // No navigation for products or categories, render in place
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/signup');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f7ede2] via-[#fff9f3] to-[#EBDECD]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#8B6B3E] text-white flex flex-col py-10 px-6 shadow-2xl rounded-tr-3xl rounded-br-3xl justify-between">
        <div>
          <div className="flex flex-col items-center mb-10">
            <img
              src="/logo192.png"
              alt="Admin"
              className="w-20 h-20 rounded-full border-4 border-[#e2c799] shadow-lg mb-3 bg-white object-cover"
            />
            <h2 className="text-2xl font-bold mb-1">Admin Dashboard</h2>
            <span className="text-[#e2c799] font-medium text-sm">Welcome, Admin</span>
          </div>
          <nav className="flex flex-col gap-2 mt-6">
            {pages.map((page) => (
              <button
                key={page.key}
                onClick={() => handleSidebarClick(page.key)}
                className={`flex items-center gap-3 py-3 px-5 rounded-xl text-left font-semibold transition-all duration-200
                  ${activePage === page.key
                    ? 'bg-white text-[#8B6B3E] shadow'
                    : 'hover:bg-[#a88b5c]/80 hover:text-white'
                  }`}
              >
                <span className="text-lg">{page.icon}</span>
                <span>{page.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-3 px-5 rounded-xl font-semibold transition-all duration-200 bg-red-500 hover:bg-red-600 text-white mt-8"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col bg-white/80 rounded-3xl m-8 shadow-xl">
        <div className="mb-8 flex items-center gap-4">
          {pages.find((p) => p.key === activePage)?.icon}
          <h3 className="text-3xl font-extrabold text-[#8B6B3E]">
            {pages.find((p) => p.key === activePage)?.label}
          </h3>
        </div>
        <div className="flex-1 bg-[#fff9f3] rounded-2xl shadow-inner p-8 min-h-[350px] flex items-center justify-center">
          {activePage === 'products' && <div className="w-full"><AdminAddProduct /></div>}
          {activePage === 'categories' && <div className="w-full"><ImageUploadWithName /></div>}
          {activePage ==='Sales' && <div className="w-full"><AdminSales /></div>}
          {activePage === 'payments' && <div className="w-full"><PaymentManagement /></div>}
          {activePage === 'orders' && (
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2">Order Management</h4>
              <p className="text-[#8B6B3E]">Manage orders here.</p>
            </div>
          )}
          {activePage === 'payments' && (
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2">Payment Statement</h4>
              <p className="text-[#8B6B3E]">View payment statements here.</p>
            </div>
          )}

          {activePage === 'Sales' && (
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2">add sales</h4>
              <p className="text-[#8B6B3E]">View sales statements here.</p>
            </div>
          )}

          {activePage === 'queries' && (
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2">User Queries</h4>
              <p className="text-[#8B6B3E]">View and respond to user queries here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;