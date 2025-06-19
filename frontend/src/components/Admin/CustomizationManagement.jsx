import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../Common/Loader';
import { fetchAllCustomizations } from '../../redux/slices/customizationSlice';

const CustomizationManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    customizationList,
    loading,
    error
  } = useSelector((state) => state.customization);

  // Only admins may access
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch on mount if admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      dispatch(fetchAllCustomizations());
    }
  }, [dispatch, user]);

  const handleRowClick = (id) => {
    navigate(`/admin/customization/${id}`);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        Gestion des demandes de personnalisation
      </h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Prénom</th>
              <th className="py-3 px-4">Nom</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">État</th>
            </tr>
          </thead>
          <tbody>
            {customizationList.length > 0 ? (
              customizationList.map((req) => (
                <tr
                  key={req._id}
                  onClick={() => handleRowClick(req._id)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {req.firstName}
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {req.lastName}
                  </td>
                  <td className="p-4">{req.email}</td>
                  <td className="p-4">
                    {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        req.status === 'Non traitée'
                          ? 'bg-yellow-100 text-yellow-700'
                          : req.status === 'En cours de négociation'
                          ? 'bg-orange-100 text-orange-700'
                          : req.status === 'Traitée'
                          ? 'bg-green-100 text-green-700'
                          : req.status === 'Annulée'
                          ? 'bg-red-100 text-red-700'
                          : ''
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Aucune demande de personnalisation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomizationManagement;
