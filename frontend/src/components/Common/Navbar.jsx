import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomLeft } from "react-icons/hi2";
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-2">
        <button onClick={toggleNavDrawer} className="lg:hidden hover:text-black">
          <HiBars3BottomLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div>
          <Link to="/" className="Artisanat text-xl font-medium">
            Artisanat Cheffi
          </Link>
        </div>
        <div className="hidden lg:flex space-x-10">
          {categories?.map((category) => (
            <Link
              key={category._id}
              to={`/collections/all?category=${encodeURIComponent(category.name)}`}
              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {user && (user.role === "admin" || user.role === "artisan") && (
            <Link to="/admin" className="block bg-black px-2 rounded text-sm text-white">
              Admin
            </Link>
          )}
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button onClick={toggleCartDrawer} className="relative hover:text-black">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-[#dbb47e] text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600 hover:text-black" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            {categories?.map((category) => (
              <Link
                key={category._id}
                to={`/collections/all?category=${encodeURIComponent(category.name)}`}
                onClick={toggleNavDrawer}
                className="block text-gray-600 hover:text-black"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
