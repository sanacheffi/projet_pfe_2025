import React from 'react';
import { BsChatSquareTextFill } from 'react-icons/bs';
import { FaBoxOpen, FaClipboardList, FaPencilRuler, FaSignOutAlt, FaSitemap, FaStore, FaTags, FaTools, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { FaFileInvoiceDollar } from 'react-icons/fa6';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link to="/admin" className="Artisanat text-2xl font-medium">Artisanat Cheffi</Link>
      </div>
      <h2 className="text-xl mb-4 text-center">Admin Dashboard</h2>
      <nav className="flex flex-col space-y-2">

        {/* Only admin */}
        {user?.role === 'admin' && (
          <>
            <NavLink 
              to="/admin/users"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <FaUser />
              <span>Utilisateurs</span>
            </NavLink>
            <NavLink 
              to="/admin/products"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <FaBoxOpen />
              <span>Articles</span>
            </NavLink>
            <NavLink 
              to="/admin/categories"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <FaTags />
              <span>Catégories</span>
            </NavLink>
            <NavLink 
              to="/admin/subcategories"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <FaSitemap />
              <span>Sous-catégories</span>
            </NavLink>
          </>
        )}
        {/* Accessible to admin and artisan */}
        {(user?.role === 'admin' || user?.role === 'artisan') && (
          <>
            <NavLink 
              to="/admin/orders"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <FaClipboardList />
              <span>Commandes</span>
            </NavLink>
            
            <NavLink 
              to="/admin/materials"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <FaTools />
              <span>Matières premières</span>
            </NavLink>

          </>
        )}

        {/* Only admin */}
        {user?.role === 'admin' && (
          <>
          <NavLink 
              to="/admin/devis"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <FaFileInvoiceDollar />
              <span>Demande de devis</span>
          </NavLink>
          <NavLink 
  to="/admin/customization"
  className={({ isActive }) =>
    isActive
      ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
      : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
  <FaPencilRuler />
  <span>Personnalisations</span>
</NavLink>
          <NavLink 
              to="/admin/reclamation"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
              <BsChatSquareTextFill />
              <span>Réclamation</span>
            </NavLink>
          </>
        )}

        {/* All users can access Boutique */}
        <NavLink 
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
          <FaStore />
          <span>Boutique</span>
        </NavLink>
      </nav>

      <div className="mt-6">
        <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2">
          <FaSignOutAlt />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
