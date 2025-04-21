import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { orders, loading, error } = useSelector((state) => state.adminOrders);

    useEffect(() => {
        if (!user || user.role !== "admin") {
          navigate("/");
        } else {
          dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);      

      
    const handleStatusChange = (orderId, status) => {
        dispatch(updateOrderStatus({ id: orderId, status }));
    };
      
    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error: {error}</p>;      
  return (
    <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Gestion des commandes</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">N° de la commande</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Prix total</th>
                        <th className="py-3 px-4">État</th>
                        <th className="py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? orders.map((order) =>(
                        <tr key={order._id} className="border-b hover:bg-gray-50 cursor-pointer">
                            <td className="p-4 px-4 font-medium text-gray-900 whitespace-nowrap">#{order._id}</td>
                            <td className="p-4">{order.user.firstName} {order.user.lastName}</td>
                            <td className="p-4">{order.totalPrice.toFixed(2)}</td>
                            <td className="p-4">
                                <select 
                                value={order.status} 
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
                                    <option value="En cours de traitement">En cours de traitement</option>
                                    <option value="Expédiée">Expédiée</option>
                                    <option value="Livrée">Livrée</option>
                                    <option value="Annulée">Annulée</option>
                                </select>
                            </td>
                            <td className="p-4">
                                <button 
                                onClick={() => handleStatusChange(order._id, "Livrée")} 
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    Marquer comme livrée
                                </button>
                            </td>
                        </tr>
                    )) : (<tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                        Aucune commande trouvée.
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default OrderManagement
