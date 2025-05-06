import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../redux/slices/adminSlice';

const AddUser = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { user } = useSelector((state) => state.auth);
    const { loading, error } = useSelector((state) => state.admin);
  
    useEffect(() => {
      if (user && user.role !== "admin") {
        navigate("/");
      }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "client", 
        });
    
        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        };
        
    
        const handleSubmit = (e) => {
            e.preventDefault();
            dispatch(addUser(formData)).unwrap()
            .then(() => {
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "client",
              });
              navigate("/admin/users");
            })
            .catch(() => {
              // error already handled in Redux
            });
          
        };
    
  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
        <h2 className="text-3xl font-bold mb-6">Ajouter un utilisateur</h2>
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
                    {error}
                </div>)}
                <div className="mb-4">
                    <label className="block text-gray-700">Prénom</label>
                    <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Nom</label>
                    <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">E-mail</label>
                    <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Mot de passe</label>
                    <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Rôle</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                        <option value="artisan">Artisan</option>
                    </select>
                </div>
                <button type="submit" 
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Ajouter</button>
            </form>
    </div>
  )
}

export default AddUser
