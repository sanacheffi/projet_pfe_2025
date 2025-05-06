import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails, updateProduct } from "../../redux/slices/productsSlice";
import axios from "axios";
import Loader from "../Common/Loader";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchSubCategories } from "../../redux/slices/subCategorySlice";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    category: "",
    subCategory: "",
    stock_status: "en_stock",
    dimensions: "",
    material: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false); // Image uploading state

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
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
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleImageRemove = (index) => {
    setProductData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
      return { ...prevData, images: updatedImages };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productData.images.length === 0) {
      alert("Veuillez importer au moins une image.");
      return;
    }
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Ajouter un nouvel article</h2>
      <form onSubmit={handleSubmit}>
        {/* Nom */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        {/* Prix */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Prix</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Quantité en stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          {/* Catégorie */}
          <div className="flex-1 min-w-[200px]">
            <label className="block font-semibold mb-2">Catégorie</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sous-catégories */}
          <div className="flex-1 min-w-[200px]">
            <label className="block font-semibold mb-2">Sous-catégories</label>
            <select
              name="subCategory"
              value={productData.subCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Disponibilité */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Disponibilité</label>
          <select
            name="stock_status"
            value={productData.stock_status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="en_stock">En stock</option>
            <option value="rupture_de_stock">Rupture de stock</option>
            <option value="sur_commande">Sur commande</option>
          </select>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          {/* Matière */}
          <div className="flex-1 min-w-[200px]">
            <label className="block font-semibold mb-2">Matière</label>
            <input
              type="text"
              name="material"
              value={productData.material}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Dimensions */}
          <div className="flex-1 min-w-[200px]">
            <label className="block font-semibold mb-2">Dimensions</label>
            <input
              type="text"
              name="dimensions"
              value={productData.dimensions}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Import d'images */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Importer des images</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Importation de l’image en cours...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt="Image produit"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
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
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
