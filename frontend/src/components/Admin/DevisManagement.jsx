import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllDevis } from '../../redux/slices/devisSlice';
import Loader from '../Common/Loader';

const DevisManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { devisList, loading, error } = useSelector((state) => state.devis);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchAllDevis());
    }
  }, [dispatch, user]);

    const handleRowClick = (devisId) => {
        navigate(`/admin/devis/${devisId}`);
    };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gestion des demandes de devis</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Nom</th>
              <th className="py-3 px-4">Prénom</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">État</th>
            </tr>
          </thead>
          <tbody>
            {devisList.length > 0 ? (
              devisList.map((devis) =>
                  <tr key={devis._id} 
                  onClick={() => handleRowClick(devis._id)}
                  className="bdevis-b hover:bg-gray-50 cursor-pointer">
                    <td className="p-4 px-4 font-medium text-gray-900 whitespace-nowrap">{devis.firstName}</td>
                    <td className="p-4 px-4 font-medium text-gray-900 whitespace-nowrap">{devis.lastName}</td>
                    <td className="p-4">
                       {devis.email}
                    </td>
                    <td className="p-4">{new Date(devis.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="p-4">
                                <span
                                className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                    devis.status === "Non traitée"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : devis.status === "En cours de négociation"
                                    ? "bg-orange-100 text-orange-700"
                                    : devis.status === "Traitée"
                                    ? "bg-green-100 text-green-700"
                                    : devis.status === "Annulée"
                                    ? "bg-red-100 text-red-700"
                                    : ""
                                    }`}>
                                        {devis.status}
                                </span>
                            </td>

                  </tr>
              )
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Aucune demande de devis trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevisManagement;
