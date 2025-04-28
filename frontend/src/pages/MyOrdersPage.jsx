import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import Loader from "../components/Common/Loader";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <Loader color="#dbb47e" />;
  if (error) return <p>Error: {error}</p>;

  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
  <h2 className="text-xl sm:text-2xl font-medium mb-6">Mes commandes</h2>
  <div className="relative shadow-md sm:rounded-lg overflow-hidden">
    <table className="min-w-full text-left text-gray-500">
      <thead className="bg-gray-100 text-xs uppercase text-gray-700">
        <tr>
          <th className="py-2 px-4 sm:py-3">Image</th>
          <th className="py-2 px-4 sm:py-3">N° de la commande</th>
          <th className="py-2 px-4 sm:py-3">Passée le</th>
          {/* <th className="py-2 px-4 sm:py-3">Adresse d'expédition</th>
          <th className="py-2 px-4 sm:py-3">Articles</th> */}
          <th className="py-2 px-4 sm:py-3">Prix</th>
          <th className="py-2 px-4 sm:py-3">État</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
          <tr key={order._id} 
          onClick={() => handleRowClick(order._id)}
          className="border-b hover:border-gray-50 cursor-pointer">
            <td className="py-2 px-2 sm:py-4 sm:px-4">
              <img src={order.orderItems[0].image} alt={order.orderItems[0].name} 
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" />
            </td>
            <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
              #{order._id}
            </td>
            <td className="py-2 px-2 sm:py-4 sm:px-4">
              {new Date(order.createdAt).toLocaleDateString()}{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </td>
            {/* <td className="py-2 px-2 sm:py-4 sm:px-4">
              {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
            </td>
            <td className="py-2 px-2 sm:py-4 sm:px-4">
              {order.orderItems.length}
            </td> */}
            <td className="py-2 px-2 sm:py-4 sm:px-4">
              {order.totalPrice.toFixed(3)}
            </td>
            <td className="py-2 px-2 sm:py-4 sm:px-4">
  <span
    className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
      order.status === "En cours de traitement"
        ? "bg-yellow-100 text-yellow-700"
        : order.status === "Expédiée"
        ? "bg-orange-100 text-orange-700"
        : order.status === "Livrée"
        ? "bg-green-100 text-green-700"
        : order.status === "Annulée"
        ? "bg-red-100 text-red-700"
        : ""
    }`}
  >
    {order.status}
  </span>
</td>

          </tr>
          ))
        ) : (
        <tr>
          <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
            Aucune commande n'a encore été passée.</td>
          </tr>
        )}
      </tbody>

    </table>
  </div>
</div>

  )
}

export default MyOrdersPage
