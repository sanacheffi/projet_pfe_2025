import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../Common/Loader';
import { fetchCategories } from '../../redux/slices/categorySlice';

const CollectionSection = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-2xl font-bold mb-4">
          Explorez Nos Collections
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Découvrir les créations artisanales récentes d'Artisanat Cheffi, mêlant tradition et modernité.
        </p>
      </div>

      {loading && <Loader color="#dbb47e" />}
      {error && <p className="text-center text-red-500">Erreur: {error}</p>}

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:grid-cols-4">
        {categories.map((categorie) => (
          <div key={categorie._id} className="relative flex-1">
            <img
              src={categorie.image[0]?.url}
              alt={categorie.name}
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {categorie.name}
              </h2>
              <Link to={`/collections/all?category=${encodeURIComponent(categorie.name)}`} className="text-gray-900 underline">
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionSection;
