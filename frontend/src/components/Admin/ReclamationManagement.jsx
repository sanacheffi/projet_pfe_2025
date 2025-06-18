import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchContactMessages, toggleTreated } from "../../redux/slices/contactSlice";
import Loader from "../Common/Loader";
import { FaPhoneAlt, FaEnvelope, FaRegCircle, FaCheck } from "react-icons/fa";

const ReclamationManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { contactMessages, loading, error } = useSelector(
    (state) => state.contact
  );

  // Redirige si l’utilisateur n’est pas admin 
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchContactMessages());
    }
  }, [dispatch, user, navigate]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-600">Erreur : {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gestion des réclamations</h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {contactMessages.length ? (
          contactMessages.map((msg) => (
            <article
              key={msg._id}
              className="relative flex h-full flex-col rounded-2xl border border-white/5 bg-[#1f2937]/80 p-6 shadow-lg backdrop-blur-sm transition hover:shadow-xl"
            >
              <button
                onClick={() => dispatch(toggleTreated(msg._id))}
                className={`absolute top-4 right-4 rounded-full p-1.5 text-xs transition
                  ${
                    msg.treated
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                {msg.treated ? <FaCheck /> : <FaRegCircle />}
              </button>

              {/* Infos client en haut */}
              <header className="mb-4 flex gap-3">
                {/* Avatar rond (initiale) */}
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 text-white flex items-center justify-center uppercase text-sm font-medium">
                  {msg.name?.charAt(0) || " "}
                </div>

                {/* Nom, téléphone, email */}
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{msg.name}</p>

                  <div className="mt-1 text-xs text-gray-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <FaPhoneAlt /> {msg.phone || "—"}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaEnvelope /> {msg.email}
                    </div>
                  </div>
                </div>
              </header>

              <h3 className="text-sm font-semibold text-gray-100 mb-1">
                {msg.subject || "Sujet non spécifié"}
              </h3>

              <p className="flex-1 text-sm leading-relaxed text-gray-300">
                {msg.message?.slice(0, 250) || "Aucun contenu"}
                {msg.message && msg.message.length > 250 && "…"}
              </p>

              {msg.createdAt && (
                <p className="mt-4 text-xs text-gray-400 text-right">
                  {new Date(msg.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </article>
          ))
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 text-center text-gray-400">
            Aucune réclamation trouvée.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReclamationManagement;
