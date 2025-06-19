import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Common/Loader';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { fetchAllProducts } from '../redux/slices/productsSlice';
import { createCustomization } from '../redux/slices/customizationSlice';

const ProductCustomization = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.products);
  const { loading: submitLoading, error: submitError,} = useSelector(
    (state) => state.customization
  );
  const { user } = useSelector((state) => state.auth);

  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [devisData, setDevisData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: '',
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchAllProducts());
    if (user) {
      setDevisData((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
    }
  }, [dispatch, user]);

  const handleAddProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, quantity: 1, customizationTypes: [] },
      ]);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, quantity } : p))
    );
  };

  const toggleProductOption = (id, option) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              customizationTypes: p.customizationTypes.includes(option)
                ? p.customizationTypes.filter((o) => o !== option)
                : [...p.customizationTypes, option],
            }
          : p
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      setErrorMessage('Veuillez sélectionner au moins un produit.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const payload = {
      ...devisData,
      products: selectedProducts,
      user: user ? user.id : null,
    };

    // Dispatch the async thunk
    const result = await dispatch(createCustomization(payload));

    if (createCustomization.fulfilled.match(result)) {
      setSubmitted(true);
    } else {
      // we can also pick up more detailed error in submitError
      setErrorMessage(result.payload?.message || 'Erreur lors de la soumission.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  if (productsLoading) return <Loader />;
  if (productsError) return <p className="text-red-600">Erreur : {productsError}</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl uppercase mb-6 text-center">
          Demander une personnalisation de produit
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {/* — Infos personnelles — */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={devisData.firstName}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700">Nom</label>
                <input
                  type="text"
                  value={devisData.lastName}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={devisData.email}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>
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

            {/* — Sélection des produits — */}
            <div className="mb-4">
              <label className="block text-gray-700">Sélectionner un produit</label>
              <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto border p-2 rounded">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 border rounded"
                    onClick={() => handleAddProduct(product)}
                  >
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* — Produits sélectionnés — */}
            <div className="space-y-6 mb-8">
              {selectedProducts.map((product) => {
                const OPTIONS = ['Dimensions', 'Forme', 'Couleur', 'Matériau', 'Autre'];
                return (
                  <article
                    key={product._id}
                    className="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <h4 className="flex-1 font-medium text-gray-900">{product.name}</h4>

                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product._id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-20 p-1 border rounded"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProducts((prev) =>
                            prev.filter((p) => p._id !== product._id)
                          )
                        }
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <RiDeleteBin3Line className="h-5 w-5" />
                      </button>
                    </div>

                    <ul className="mt-4 flex flex-wrap gap-3">
                      {OPTIONS.map((option) => {
                        const checked = product.customizationTypes.includes(option);
                        return (
                          <li key={option}>
                            <label
                              className={`
                                flex items-center gap-2 rounded-full border px-4 py-2 text-sm capitalize cursor-pointer select-none
                                ${checked
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                                transition
                              `}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleProductOption(product._id, option)
                                }
                                className="hidden"
                              />
                              {option}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                );
              })}
            </div>

            {/* — Erreurs côté front ou back — */}
            {(errorMessage || submitError) && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
                {errorMessage || submitError}
              </div>
            )}

            {/* — Description générale — */}
            <div className="mb-4">
              <label className="block text-gray-700">Description (optionnel)</label>
              <textarea
                value={devisData.description}
                onChange={(e) =>
                  setDevisData({ ...devisData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
              disabled={submitLoading}
            >
              {submitLoading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-lg mb-2">Merci pour votre message !</h3>
            <p>Nous vous contacterons bientôt.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCustomization;
