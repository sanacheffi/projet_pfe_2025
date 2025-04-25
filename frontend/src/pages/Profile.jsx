import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";
import { SlSettings } from "react-icons/sl";

const Profile = () => {
const { user } = useSelector((state) => state.auth);
const navigate = useNavigate();
const dispatch = useDispatch();

useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [user, navigate]);

const handleLogout = () => {
  dispatch(logout());
  dispatch(clearCart());
  navigate("/login");
};


    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            {/* Left Section */}
            <div className="w-full md:w-1/3 lg:w-1/5 shadow-md rounded-lg p-6">
              <h1 className="text-xl font-medium mb-3">{user?.firstName} {user?.lastName}</h1>
              <p className="text-md text-gray-600 mb-4">{user?.email}</p>
              {/* Link to Profile Management */}
            <Link 
              to="/profile-management" 
              className="flex items-center text-md text-gray-600 hover:underline mb-6"
            >
              <SlSettings className="mr-2" />
              Gérez votre compte
            </Link>
              <button onClick={handleLogout} className="w-full bg-black text-white p-2 px-4 rounded hover:bg-gray-800">
              Déconnexion
              </button>
            </div>
            {/* Right Section: Orders table  */}
            <div className="w-full md:w-2/3 lg:w-4/5">
            <MyOrdersPage/>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;
  