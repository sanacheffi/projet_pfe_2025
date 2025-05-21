import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import Loader from "../components/Common/Loader";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <Loader color="#cca78a" />;
  if (error) return <p>Error: {error}</p>;


  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl md:text-2xl font-medium mb-6">Détails de la commande</h2>
      {!orderDetails ? (
        <p>Aucun détail de commande trouvé</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border">
          {/* Informations sur la commande */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                N° de la commande : #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                {orderDetails.isPaid ? "Payée" : "Paiement à la livraison"}
              </span>
              <span
              className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                orderDetails.status === "En cours de traitement"
                ? "bg-yellow-100 text-yellow-700"
                : orderDetails.status === "Expédiée"
                ? "bg-orange-100 text-orange-700"
                : orderDetails.status === "Livrée"
                ? "bg-green-100 text-green-700"
                : orderDetails.status === "Annulée"
                ? "bg-red-100 text-red-700"
                : ""
              }`}
              >
                {orderDetails.status}
              </span>
            </div>
          </div>

          {/* Infos client, paiement, livraison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
              <h4 className="text-lg font-semibold mb-2">Informations de livraison</h4>
              <p>{`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}</p>
              <p><span className="font-semibold">Adresse :</span> {`${orderDetails.shippingAddress.address}`}</p>
              <p><span className="font-semibold">Code postal :</span> {`${orderDetails.shippingAddress.postalCode}`}</p>
              <p><span className="font-semibold">Téléphone :</span> {`${orderDetails.shippingAddress.phone}`}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Informations de paiement</h4>
              <p>{orderDetails.paymentMethod}</p>
              {/* <p>Statut : {orderDetails.isPaid ? "Payée" : "Non payée"}</p> */}
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
                    <td className="py-2 px-4">{(item.price * item.quantity).toFixed(3)} DT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/my-orders" className="mt-6 inline-block text-blue-500 hover:underline">Retourner à mes commandes</Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
