import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { convertDevisToOrder } from "../../redux/slices/devisSlice";

const ConvertDevisForm = () => {
  const { devisId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.devis);

  const [formData, setFormData] = useState({
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
    },
    paymentMethod: "Paiement à la Livraison",
    totalPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["address", "city", "postalCode", "country", "phone"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(convertDevisToOrder({ devisId, orderData: formData }))
      .unwrap()
      .then(() => {
        navigate("/admin/orders");
      })
      .catch((err) => {
        console.error("Conversion failed:", err);
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-md rounded-md">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      <h2 className="text-3xl font-bold mb-6">Convertir le devis en commande</h2>

      <form onSubmit={handleSubmit}>
        {/* Adresse de livraison */}
        <h3 className="text-lg mb-4">Adresse de livraison</h3>

        <div className="mb-4 grid grid-cols-2 gap-4">
  <div>
    <label>Pays</label>
    <input
      type="text"
      name="country"
      value={formData.shippingAddress.country}
      onChange={handleChange}
      className="w-full p-2 border rounded"
      required
    />
  </div>
  <div>
    <label>Gouvernorat</label>
    <input
      type="text"
      name="city"
      value={formData.shippingAddress.city}
      onChange={handleChange}
      className="w-full p-2 border rounded"
      required
    />
  </div>
</div>

<div className="mb-4 grid grid-cols-2 gap-4">
  <div>
    <label>Adresse</label>
    <input
      type="text"
      name="address"
      value={formData.shippingAddress.address}
      onChange={handleChange}
      className="w-full p-2 border rounded"
      required
    />
  </div>
  <div>
    <label>Code Postal</label>
    <input
      type="text"
      name="postalCode"
      value={formData.shippingAddress.postalCode}
      onChange={handleChange}
      className="w-full p-2 border rounded"
      required
    />
  </div>
</div>


        <div className="mb-4">
          <label>Téléphone</label>
          <input
            type="text"
            name="phone"
            value={formData.shippingAddress.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Méthode de paiement */}
        <div className="mb-4">
          <label>Méthode de paiement</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Paiement à la Livraison">
              Paiement à la Livraison
            </option>
          </select>
        </div>

        {/* Prix total */}
        <div className="mb-6">
          <label>Prix total (DT)</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200"
          disabled={loading}
        >
          {loading ? "Conversion en cours..." : "Convertir en commande"}
        </button>
      </form>
    </div>
  );
};

export default ConvertDevisForm;
