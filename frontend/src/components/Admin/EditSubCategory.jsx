import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader";
import { fetchSubCategoryById, updateSubCategory } from "../../redux/slices/subCategorySlice";
import { fetchCategories } from "../../redux/slices/categorySlice";

const EditSubCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    
      useEffect(() => {
        if (user && user.role !== "admin") {
          navigate("/");
        }
      }, [user, navigate]);
  
    const { selectedSubCategory} = useSelector((state) => state.subCategory);
    const { categories, loading, error } = useSelector((state) => state.category);
  
    const [subCategoryData, setSubCategoryData] = useState({
      name: "",
      category: "",
    });

  useEffect(() => {
    if (id) {
      dispatch(fetchSubCategoryById(id));
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedSubCategory) {
        setSubCategoryData({
            name: selectedSubCategory.name,
            category: selectedSubCategory.category._id || selectedSubCategory.category,
          });
          
    }
  }, [selectedSubCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSubCategory({ id, subCategoryData }));
    navigate("/admin/subcategories");
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Modifier une sous-catégorie</h2>
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

export default EditSubCategory
