import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCheckout } from '../../redux/slices/checkoutSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "", lastName: "", address: "", city: "", postalCode: "", country: "", phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("Paiement à la livraison");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'payment_failed') {
      setErrorMessage('Le paiement a échoué. Veuillez réessayer ou choisir une autre méthode.');
    }
  }, [location.search]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (!cart || cart.products.length === 0) return;

    const res = await dispatch(
      createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod,
        totalPrice: cart.totalPrice,
      })
    );

    const data = res.payload;
    if (!data) return;

    if (paymentMethod === "Paiement en ligne" && data.paymentLink) {
      window.location.href = data.paymentLink;
    } else if (paymentMethod === "Paiement à la livraison" && data.order) {
      navigate(`/order-confirmation?orderId=${data.order._id}`);
    }
    
  };

  if (loading) return <p>Chargement du panier...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!cart || cart.products.length === 0) return <p>Votre panier est vide</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {errorMessage}
          </div>
        )}
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          {/* User Info */}
          <h3 className="text-lg mb-4">Vos Coordonnées</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={user?.email || ""} className="w-full p-2 border rounded" disabled />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label>Prénom</label>
              <input type="text" value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label>Nom</label>
              <input type="text" value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })} className="w-full p-2 border rounded" required />
            </div>
          </div>

          {/* Shipping Info */}
          <h3 className="text-lg mb-4">Adresse De Livraison</h3>
          <div className="mb-4">
            <label>Pays</label>
            <input type="text" value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label>Gouvernorat</label>
              <input type="text" value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label>Code Postal</label>
              <input type="text" value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} className="w-full p-2 border rounded" required />
            </div>
          </div>
          <div className="mb-4">
            <label>Adresse</label>
            <input type="text" value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
  <label>Téléphone</label>
  <input
    type="text"
    value={shippingAddress.phone}
    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
    className="w-full p-2 border rounded"
    required
  />
</div>


          {/* Payment selection and submit */}
          <div className="mt-6">
            {!showPaymentOptions ? (
              <button
                type="button"
                onClick={() => setShowPaymentOptions(true)}
                className="w-full bg-black text-white py-3 rounded"
              >
                Continuer vers le paiement
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  onClick={() => setPaymentMethod("Paiement à la livraison")}
                  className="w-full bg-gray-800 text-white py-3 rounded"
                >
                  Paiement à la livraison
                </button>
                <button
                  type="submit"
                  onClick={() => setPaymentMethod("Paiement en ligne")}
                  className="w-full bg-green-600 text-white py-3 rounded"
                >
                  Paiement en ligne
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Votre commande</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-start justify-between py-2 border-b">
              <div className="flex items-start">
                <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded-md mr-4" />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                </div>
              </div>
              <p className="text-xl">{product.price?.toLocaleString()} DT</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Sous-total</p>
          <p>{cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Expédition</p>
          <p>Gratuite</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>{cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
