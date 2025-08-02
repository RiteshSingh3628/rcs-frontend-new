import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiSettings,
  FiStar,
  FiBarChart2,
  FiArchive,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { FaSquare } from "react-icons/fa6";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/dashboard" },
    { icon: FiSettings, label: "Widget Settings", path: "/widget-settings" },
    { icon: FiStar, label: "Reviews", path: "/reviews" },
    { icon: FiBarChart2, label: "Statistics", path: "/statistics" },
    { icon: FiArchive, label: "Archive", path: "/archive" },
    { icon: FiUser, label: "Profile", path: "/profile" },
    { icon: FaSquare, label: "QR Code", path: "/qr-code" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  return (
    <>
      {/* Mobile overlay - only shown on mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-20  lg:hidden ${isOpen? "hidden" : ''}`}
          onClick={() => setIsOpen(false)}
        
        />
      )}

      {/* Sidebar - always visible on desktop */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        initial="open"
        layout
        className="fixed lg:static left-0 top-0 h-full w-64 bg-white shadow-lg z-30 lg:transform-none"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Level 4 You</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
                onClick={(e) => {
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu button - only shown on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed lg:hidden top-4 right-4 z-40 bg-white p-2 rounded-md shadow-md"
      >
        <FiMenu size={24} />
      </button>
    </>
  );
};

export default Sidebar;