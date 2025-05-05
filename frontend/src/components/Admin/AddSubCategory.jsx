import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader";
import { createSubCategory } from "../../redux/slices/subCategorySlice";
import { fetchCategories } from "../../redux/slices/categorySlice";

const AddSubCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
      useEffect(() => {
        if (user && user.role !== "admin") {
          navigate("/");
        }
      }, [user, navigate]);

      useEffect(() => {
        dispatch(fetchCategories());
      }, [dispatch]);
      
  
    const { categories, loading, error } = useSelector((state) => state.category);
  
    const [subCategoryData, setSubCategoryData] = useState({
      name: "",
      category: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createSubCategory(subCategoryData));
        setSubCategoryData({
            name: "",
            category: "",
        });
        navigate("/admin/subcategories");
    };

      if (loading) return <Loader />;
      if (error) return <p>Error: {error}</p>;
    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
          <h2 className="text-3xl font-bold mb-6">Ajouter une sous-catégorie</h2>
          <form onSubmit={handleSubmit}>
            {/* categorie */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Catégorie</label>
              <select
              name="category"
              value={subCategoryData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
              >
                <option value="">-- Sélectionner une catégorie --</option>
                {categories.map((categorie) => (
                    <option key={categorie._id} value={categorie._id}>
                        {categorie.name}
                    </option>
                ))}
                </select>
            </div>
            {/* Nom */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Nom</label>
              <input
                type="text"
                name="name"
                value={subCategoryData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
    
    
            {/* Bouton de mise à jour */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Mettre à jour
            </button>
          </form>
        </div>
    );
}

export default AddSubCategory
