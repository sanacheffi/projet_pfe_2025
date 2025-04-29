import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { fetchOrderDetails } from "../redux/slices/orderSlice";


const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.orders.orderDetails);


  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
      dispatch(clearCart());
    } else {
      navigate("/my-orders");
    }
  }, [dispatch, searchParams]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Merci pour votre commande !
      </h1>
      {order && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-8">
            {/* Order Id and Date */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                N° de la commande : {order._id}
              </h2>
              <p className="text-gray-500">
                Passée le : {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Livraison estimée :{" "}
                {calculateEstimatedDelivery(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Payment Info */}
            {/* <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">PayPal</p>
            </div> */}
            {/* Delivery Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Informations de livraison</h4>
              <p className="text-gray-600">
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.country}
              </p>
              <p className="text-gray-600">{order.shippingAddress?.address}</p>
                <p className="text-gray-600">{order.shippingAddress?.postalCode}</p>
                <p className="text-gray-600">{order.shippingAddress?.phone}</p>
            </div>
          </div>
          {/* Ordered Items */}
          <div className="mb-20">
            {order.orderItems?.map((item) => (
              <div
                key={item.productId}
                className="flex items-center mb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md mb-2">{item.price} DT</p>
                  <p className="text-sm text-gray-500">
                    Quantité : {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
