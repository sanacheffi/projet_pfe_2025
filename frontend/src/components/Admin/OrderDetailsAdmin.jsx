import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchOrderDetails, updateOrderStatus } from "../../redux/slices/adminOrderSlice";

const OrderDetailsAdmin = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { orderDetails, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const handleStatusChange = (status) => {
    if (orderId) {
      // Dispatch the update order status action
      dispatch(updateOrderStatus({ id: orderId, status }))
        .then(() => {
          // After the status update, refetch the order details to get the latest data
          dispatch(fetchOrderDetails(orderId));
        });
    }
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
    <h2 className="text-xl md:text-2xl font-medium mb-6">Détails de la commande</h2>
    {!orderDetails ? (
      <p className="text-center">Aucun détail de commande trouvé</p>
    ) : (
      <div className="p-4 sm:p-6 rounded-lg border shadow-md bg-white">
        {/* Informations sur la commande */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              N° de la commande : #{orderDetails._id}
            </h3>
            <p className="text-gray-600 text-sm">
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <select
              value={orderDetails.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="En cours de traitement">En cours de traitement</option>
              <option value="Expédiée">Expédiée</option>
              <option value="Livrée">Livrée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
        </div>
  
        {/* Infos client, paiement, livraison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Informations de client</h4>
            <p>{orderDetails.user.firstName} {orderDetails.user.lastName}</p>
            <p>{orderDetails.user.email}</p>
            <p>Tel : {orderDetails.shippingAddress.phone}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Informations de livraison</h4>
            <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}</p>
            <p>{orderDetails.shippingAddress.address}</p>
            <p>{orderDetails.shippingAddress.postalCode}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Informations de paiement</h4>
            <p>{orderDetails.paymentMethod}</p>
          </div>
        </div>
  
        {/* Liste des produits */}
        <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Produits</h4>
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-2 px-4">Nom</th>
                  <th className="py-2 px-4">Prix unitaire</th>
                  <th className="py-2 px-4">Quantité</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4 flex items-center">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg mr-4"/>
                        <Link
                        to={`/product/${item.productId}`}
                        className="hover:underline">
                            {item.name}
                        </Link>
                    </td>
                    <td className="py-2 px-4">{item.price} DT</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">{item.price * item.quantity} DT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/orders" className="mt-6 inline-block text-blue-500 hover:underline">Retourner à mes commandes</Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsAdmin;
