import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchCustomizationById,
  updateCustomizationStatus,
} from "../../redux/slices/customizationSlice";
import Loader from "../Common/Loader";

const CustomizationDetails = () => {
  const dispatch = useDispatch();
  const { customizationId } = useParams();

  const {
    selectedCustomization,
    loading,
    error,
  } = useSelector((state) => state.customization);

  useEffect(() => {
    if (customizationId) {
      dispatch(fetchCustomizationById(customizationId));
    }
  }, [dispatch, customizationId]);

  const handleStatusChange = (newStatus) => {
    dispatch(updateCustomizationStatus({ customizationId, status: newStatus }));
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl md:text-2xl font-medium mb-6">
        Détails de la personnalisation
      </h2>

      {!selectedCustomization ? (
        <p className="text-center">Aucune demande trouvée.</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border shadow-md bg-white">
          {/* ── En‑tête : ID + date + statut ───────────────────────────── */}
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Demande n° : #{selectedCustomization._id}
              </h3>
              <p className="text-gray-600 text-sm">
                {new Date(selectedCustomization.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <select
                value={selectedCustomization.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Non traitée">Non traitée</option>
                <option value="En cours de négociation">
                  En cours de négociation
                </option>
                <option value="Traitée">Traitée</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>
          </div>

          {/* ── Infos client & description ─────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Informations du client
              </h4>
              <p>
                <span className="font-semibold">Nom : </span>
                {selectedCustomization.firstName}{" "}
                {selectedCustomization.lastName}
              </p>
              <p>
                <span className="font-semibold">Email : </span>
                {selectedCustomization.email}
              </p>
              <p>
                <span className="font-semibold">Téléphone : </span>
                {selectedCustomization.phone}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Description globale
              </h4>
              <p className="text-gray-700 whitespace-pre-line">
                {selectedCustomization.description || "—"}
              </p>
            </div>
          </div>

          {/* ── Tableau des produits demandés ──────────────────────────── */}
          {selectedCustomization.products?.length > 0 && (
            <div className="overflow-x-auto">
              <h4 className="text-lg font-semibold mb-4">
                Produits sélectionnés
              </h4>
              <table className="min-w-full text-left text-gray-600">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="py-2 px-4">Nom</th>
                    <th className="py-2 px-4">Quantité</th>
                    <th className="py-2 px-4">Options choisies</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomization.products.map((prod) => (
                    <tr key={prod._id} className="border-b">
                      <td className="py-2 px-4 flex items-center">
                        <img
                          src={prod.images?.[0]?.url}
                          alt={prod.images?.[0]?.altText || prod.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <Link
                          to={`/product/${prod._id}`}
                          className="hover:underline"
                        >
                          {prod.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4">{prod.quantity}</td>
                      <td className="py-2 px-4">
                        {prod.customizationTypes?.length > 0 ? (
                          prod.customizationTypes.map((opt) => (
                            <span
                              key={opt}
                              className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded mr-1 mb-1"
                            >
                              {opt}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Liens navigation bas de page ───────────────────────────── */}
          <div className="mt-6 flex justify-between">
            <Link
              to="/admin/customization"
              className="text-blue-500 hover:underline"
            >
              Retour à la liste
            </Link>

            {/* Optionnel : conversion vers commande */}
            <Link
              to={`/admin/customization/${selectedCustomization._id}/convert`}
              className="text-green-600 hover:underline"
            >
              Convertir en commande
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationDetails;
