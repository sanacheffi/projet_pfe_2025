import React from 'react'
const checkout = {
    _id: "12323",
    createdAt: new Date(),
    checkoutItems: [
      {
        productId: "1",
        name: "Jacket",
        color: "black",
        size: "M",
        price: 150,
        quantity: 1,
        image: "https://picsum.photos/150?random=1"
      },
      {
        productId: "1",
        name: "Jacket",
        color: "black",
        size: "M",
        price: 150,
        quantity: 1,
        image: "https://picsum.photos/150?random=1"
      },
    ],
    shippingAddress: {
        address: "123 Fashion Street",
        city: "New York",
        country: "USA"
    },
};

const OrderConfirmationPage = () => {
    const calculateEstimatedDelivery = (createdAt) => {
      const orderDate = new Date(createdAt);
      orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
      return orderDate.toLocaleDateString();
    };
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Merci pour votre commande !
        </h1>
        {checkout && (
          <div className="p-6 rounded-lg border">
            <div className="flex justify-between mb-20">
              {/* Order Id and Date */}
              <div>
                <h2 className="text-xl font-semibold mb-2">
                N° de la commande : {checkout._id}
                </h2>
                <p className="text-gray-500">
                Passée le : {new Date(checkout.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* Estimated delivery */}
              <div>
                <p className="text-emerald-700 text-sm">
                Livraison estimée : {" "} {calculateEstimatedDelivery(checkout.createdAt)}
                </p>
              </div>
            </div>
            {/* Ordered Items */}
            <div className="mb-20">
                {checkout.checkoutItems.map((item) => (
                    <div key={item.productId} className="flex items-center mb-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                        <div>
                            <h4 className="text-md font-semibold">{item.name}</h4>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-md mb-2">${item.price}</p>
                            <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Payment and Delivery Info */}
            <div className="grid grid-cols-2 gap-8">
                {/* Payment Info */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Payment</h4>
                    <p className="text-gray-600">PayPal</p>
                </div>
                {/* Delivery Info */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                    <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                    <p className="text-gray-600">{checkout.shippingAddress.city}, {" "} {checkout.shippingAddress.country}</p>
                </div>
            </div>
          </div>
        )}
      </div>
    );
};
export default OrderConfirmationPage
