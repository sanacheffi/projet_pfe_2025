import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import Loader from "../components/Common/Loader";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (user) {
      dispatch(fetchAdminProducts());
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user]);
  

  return (
    <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {productsLoading || ordersLoading ? (
            <Loader />
        ) : productsError ? (
        <p className="_text-red-500">Error fetching products: {productsError}</p>
    ) : ordersError ? (
    <p className="[text-red-500">Error fetching orders: {ordersError}</p>
) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold">Revenu</h2>
                <p className="text-2xl">{totalSales.toFixed(3)} DT</p>
            </div>
            <div className="p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold">Nombre total de commandes</h2>
                <p className="text-2xl">{totalOrders}</p>
                <Link to="/admin/orders" className="text-blue-500 hover:underline">Gérer les commandes</Link>
            </div>
            <div className="p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold">Nombre total d'articles</h2>
                <p className="text-2xl">{products.length}</p>
                <Link to="/admin/products" className="text-blue-500 hover:underline">Gérer les articles</Link>
            </div>
        </div>
        )}
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Commandes Récentes</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">N° de la commande</th>
                            <th className="py-3 px-4">Utilisateur</th>
                            <th className="py-3 px-4">Prix total</th>
                            <th className="py-3 px-4">État</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50 cursor-pointer">
                                    <td className="p-4">{order._id}</td>
                                    <td className="p-4">{order.user.firstName} {order.user.lastName}</td>
                                    <td className="p-4">{order.totalPrice.toFixed(3)}</td>
                                    <td className="p-4">
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
                                    }`}>
                                        {order.status}
                                </span>
                            </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">
                                Aucune commande récente
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default AdminHomePage
