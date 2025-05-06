import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/slices/productsSlice';
import Loader from '../components/Common/Loader';
import { RiDeleteBin3Line } from 'react-icons/ri';

const DevisFormPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [devisData, setDevisData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    description: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    date: '',
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleAddProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, quantity } : p))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...devisData,
      products: selectedProducts,
    };
    console.log(dataToSubmit);
    setSubmitted(true);
  };
  if (loading) return <Loader color="#cca78a" />;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl uppercase mb-6 text-center">Demander un devis</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
            {/* Prénom */}
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Prénom</label>
              <input
                type="text"
                value={devisData.firstName}
                onChange={(e) =>
                  setDevisData({ ...devisData, firstName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Nom */}
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Nom</label>
              <input
                type="text"
                value={devisData.lastName}
                onChange={(e) =>
                  setDevisData({ ...devisData, lastName: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            </div>

            {/* Email */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={devisData.email}
                onChange={(e) =>
                  setDevisData({ ...devisData, email: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Téléphone */}
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Téléphone</label>
              <input
                type="text"
                value={devisData.phone}
                onChange={(e) =>
                  setDevisData({ ...devisData, phone: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            </div>

            {/* Entreprise */}
            <div className="mb-4">
              <label className="block text-gray-700">Entreprise</label>
              <input
                type="text"
                value={devisData.company}
                onChange={(e) =>
                  setDevisData({ ...devisData, company: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Product selection */}
            <div className="mb-4">
              <label className="block text-gray-700">Sélectionner un produit</label>
              <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto border p-2 rounded">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 border rounded"
                    onClick={() => handleAddProduct(product)}
                  >
                    <img src={product.images[0]?.url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected products */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Produits sélectionnés</label>
              {selectedProducts.length === 0 && (
                <p className="text-sm text-gray-500">Aucun produit sélectionné.</p>
              )}
              {selectedProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-4 mb-2 border-b pb-2">
                  <img src={product.images[0]?.url} alt={product.name} className="w-14 h-14 object-cover rounded" />
                  <span className="flex-1">{product.name}</span>
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                    className="w-20 p-1 border rounded"
                  />
                  <button
                  type="button"
                  onClick={() =>
                    setSelectedProducts(selectedProducts.filter((_, i) => i !== index))
                  }>
                  <RiDeleteBin3Line className="h-6 w-6 text-red-600 hover:text-red-800" />
                </button>
                </div>
              ))}
            </div>

            {/* description */}
            <div className="mb-4">
              <label className="block text-gray-700">Description (optionnel)</label>
              <textarea
                value={devisData.description}
                onChange={(e) => setDevisData({ ...devisData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
            
            {/* Pays */}
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Pays</label>
              <input
                type="text"
                value={devisData.country}
                onChange={(e) =>
                  setDevisData({ ...devisData, country: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* ville */}
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Ville</label>
              <input
                type="text"
                value={devisData.city}
                onChange={(e) =>
                  setDevisData({ ...devisData, city: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            </div>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
            
            {/* Adresse */}
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Adresse</label>
              <input
                type="text"
                value={devisData.address}
                onChange={(e) =>
                  setDevisData({ ...devisData, address: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Code Postal */}
            <div className="w-full md:w-1/2">
              <label className="block text-gray-700">Code Postal</label>
              <input
                type="text"
                value={devisData.postalCode}
                onChange={(e) =>
                  setDevisData({ ...devisData, postalCode: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            </div>

            {/* date */}
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={devisData.date}
                onChange={(e) =>
                  setDevisData({ ...devisData, date: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <button type="submit" className="w-full bg-black text-white py-3 rounded">
              Envoyer
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-lg mb-2">Merci pour votre message !</h3>
            <p>Nous vous contacterons bientôt.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevisFormPage;
