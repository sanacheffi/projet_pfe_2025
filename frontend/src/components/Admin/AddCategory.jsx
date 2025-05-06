import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createCategory } from "../../redux/slices/categorySlice";

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
    useEffect(() => {
      if (user && user.role !== "admin") {
        navigate("/");
      }
    }, [user, navigate]);

  const [categoryData, setCategoryData] = useState({
    name: "",
    image: [],
  });

  const [uploading, setUploading] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCategoryData((prevData) => ({
        ...prevData,
        image: [...prevData.image, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setCategoryData((prevData) => ({
      ...prevData,
      image: prevData.image.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryData.image.length === 0) {
      alert("Veuillez importer au moins une image.");
      return;
    }
    dispatch(createCategory(categoryData));
    setCategoryData({
        name: "",
        image: [],
    });
    navigate("/admin/categories");
  };


  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Ajouter une catégorie</h2>
      <form onSubmit={handleSubmit}>
        {/* Nom */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Import d'images */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Importer des images</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Importation de l’image en cours...</p>}
          <div className="flex gap-4 mt-4 flex-wrap">
            {categoryData.image.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt="Image catégorie"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
                  title="Supprimer l'image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton d'ajout */}
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

export default AddCategory;
