import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { createMaterial } from '../../redux/slices/materialSlice';


const AddMaterial = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    useEffect(() => {
      if (user && user.role !== "admin" && user.role !== "artisan") {
        navigate("/");
      }
    }, [user, navigate]);
    

  const [materialData, setMaterialData] = useState({
    name: '',
    supplier: '',
    price: 0,
    quantity: 0,
    images: [],
  });

  const [uploading, setUploading] = useState(false);



  const handleChange = (e) => {
    setMaterialData({
      ...materialData,
      [e.target.name]: e.target.value,
  });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setMaterialData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: '' }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (materialData.images.length === 0) {
      alert("Veuillez importer au moins une image.");
      return;
    }
    dispatch(createMaterial(materialData));
    setMaterialData({
    name: '',
    supplier: '',
    price: 0,
    quantity: 0,
    images: [],
    });
    navigate('/admin/materials');
  };


  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Ajouter une matière</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={materialData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Supplier */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Fournisseur</label>
          <input
            type="text"
            name="supplier"
            value={materialData.supplier}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Prix</label>
          <input
            type="number"
            name="price"
            value={materialData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Quantité</label>
          <input
            type="number"
            name="quantity"
            value={materialData.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Importer des images</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Importation de l’image en cours...</p>}
          <div className="flex gap-4 mt-4">
            {materialData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt="Material"
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddMaterial;
