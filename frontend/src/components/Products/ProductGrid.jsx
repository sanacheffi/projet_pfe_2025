import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Common/Loader';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <Loader color="#cca78a" />;
  if (error) return <p>Error: {error}</p>;

  if (!loading && products.length === 0) {
    return (
      <div className="text-lg mt-10">
        Aucun produit trouvé .
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-96 mb-4">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">
              {product.price} DT
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
