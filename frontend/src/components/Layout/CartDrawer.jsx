import React, { useEffect, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user.id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  // Outside click to close drawer
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        toggleCartDrawer();
      }
    };

    if (drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerOpen, toggleCartDrawer]);

  return (
    <>
      {/* Optional overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleCartDrawer}
        ></div>
      )}

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-start p-4">
          <button onClick={toggleCartDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Panier</h2>
          {cart && cart?.products.length > 0 ? (
            <CartContents cart={cart} userId={userId} guestId={userId ? undefined : guestId} />
          ) : (
            <p>Votre panier est vide.</p>
          )}
        </div>
        <div className="p-4 bg-white sticky bottom-0">
          <div className="flex justify-between items-center text-base font-semibold mb-3">
            <p className="uppercase">Total</p>
            <p className="text-lg">
              {cart.totalPrice ? cart.totalPrice.toFixed(3) : "0.000"} DT
            </p>
          </div>
          {cart && cart?.products.length > 0 && (
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Commander
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
