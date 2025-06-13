import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; 
import { fetchMaterialById, updateMaterial } from '../../redux/slices/materialSlice';
import Loader from '../Common/Loader';


const EditMaterial = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentMaterial, loading, error } = useSelector((state) => state.materials);

  const [materialData, setMaterialData] = useState({
    name: '',
    supplier: '',
    price: 0,
    quantity: 0,
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchMaterialById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentMaterial) {
      setMaterialData(currentMaterial);
    }
  }, [currentMaterial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prevData) => ({ ...prevData, [name]: value }));
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
    dispatch(updateMaterial({ id, materialData }));
    navigate('/admin/materials');
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Modifier une matière</h2>
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
          Mettre à jour 
        </button>
      </form>
    </div>
  );
};

export default EditMaterial;
