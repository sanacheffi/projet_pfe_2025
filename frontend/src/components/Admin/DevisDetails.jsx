import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchDevisById, updateDevisStatus } from "../../redux/slices/devisSlice";
import Loader from "../Common/Loader";

const DevisDetails = () => {
  const dispatch = useDispatch();
  const { devisId } = useParams();
  const { selectedDevis, loading, error } = useSelector((state) => state.devis);

  useEffect(() => {
    if (devisId) {
      dispatch(fetchDevisById(devisId));
    }
  }, [dispatch, devisId]);

  const handleStatusChange = (newStatus) => {
  dispatch(updateDevisStatus({ devisId, status: newStatus }));
};

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl md:text-2xl font-medium mb-6">Détails du devis</h2>
      {!selectedDevis ? (
        <p className="text-center">Aucun devis trouvé.</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border shadow-md bg-white">
          {/* Informations principales */}
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Demande n° : #{selectedDevis._id}
              </h3>
              <p className="text-gray-600 text-sm">
                {new Date(selectedDevis.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <select
              value={selectedDevis.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Non traitée">Non traitée</option>
              <option value="En cours de négociation">En cours de négociation</option>
              <option value="Traitée">Traitée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
          </div>

          {/* Infos client & entreprise */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800">Informations du client</h4>
              <p><span className="font-semibold text-gray-800">Nom :</span> {selectedDevis.firstName} {selectedDevis.lastName}</p>
              <p><span className="font-semibold text-gray-800">Email :</span> {selectedDevis.email}</p>
              <p><span className="font-semibold text-gray-800">Téléphone :</span> {selectedDevis.phone}</p>
              <p><span className="font-semibold text-gray-800">Entreprise :</span> {selectedDevis.company}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800">Description</h4>
              <p className="text-gray-700 whitespace-pre-line">{selectedDevis.description || "Description non fournie"}</p>
            </div>
          </div>

          {/* Produits demandés */}
          {selectedDevis.products?.length > 0 && (
            <div className="overflow-x-auto">
              <h4 className="text-lg font-semibold mb-4">Produits demandés</h4>
              <table className="min-w-full text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="py-2 px-4">Nom</th>
                    <th className="py-2 px-4">Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDevis.products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="py-2 px-4 flex items-center">
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.images?.[0]?.altText || product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <Link
                        to={`/product/${product._id}`}
                        className="hover:underline">
                            {product.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4">{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-between">
          {/* Lien retour */}
          <Link to="/admin/devis" className="inline-block text-blue-500 hover:underline">
            Retourner à la liste des devis
          </Link>
          {/* Lien retour */}
          <Link to={`/admin/devis/${selectedDevis._id}/convert`} className="inline-block text-green-500 hover:underline">
            Convertir en commande
          </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevisDetails;
