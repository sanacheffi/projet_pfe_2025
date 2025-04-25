import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { SlArrowLeftCircle } from "react-icons/sl";

const ProfileManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Form state for editing user details
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(""); // New password field

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the update user profile action
    dispatch(
      updateUserProfile({
        id: user.id,
        firstName,
        lastName,
        email,
        password, // Include password in the update if the user wants to change it
      })
    );
    navigate("/profile");
  };
  return (
    <div className="p-6"><Link to="/profile" className="hover:underline flex items-center space-x-2">
    <SlArrowLeftCircle />
    <span>Retourner à votre compte</span>
  </Link>
    <div className="max-w-2xl mx-auto px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl uppercase mb-6 text-center">Gérez votre compte</h2>
          <form onSubmit={handleSubmit}>
            {/* prénom */}
            <div className="mb-4">
              <label className="block text-gray-700">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* nom */}
            <div className="mb-4">
              <label className="block text-gray-700">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* password */}
            <div className="mb-4">
              <label className="block text-gray-700">Mot de Passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Laisser vide pour conserver le mot de passe actuel"
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded"
            >
              Enregistrer les modifications
            </button>
          </form>
      </div>
    </div>
    </div>
  );
}

export default ProfileManagement
