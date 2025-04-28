import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchContactMessages } from '../../redux/slices/contactSlice';
import Loader from '../Common/Loader';

const ReclamationManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { contactMessages, loading, error } = useSelector((state) => state.contact);

  useEffect(() => {
      if (!user || user.role !== "admin") {
        navigate("/");
      } else {
        dispatch(fetchContactMessages());
      }
  }, [dispatch, user, navigate]); 
  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>; 
  return (
    <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Gestion des Reclamation</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Téléphone</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Sujet</th>
                    </tr>
                </thead>
                <tbody>
                {contactMessages.length > 0 ? contactMessages.map((contactMessage) =>(
                        <tr key={contactMessage._id} className="border-b hover:bg-gray-50 cursor-pointer">
                            <td className="p-4 px-4 font-medium text-gray-900 whitespace-nowrap">{contactMessage.name}</td>
                            <td className="p-4">{contactMessage.phone}</td>
                            <td className="p-4">{contactMessage.email}</td>
                            <td className="p-4">{contactMessage.subject}</td>
                        </tr>
                    )) : (<tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                        Aucune reclamation trouvée.
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ReclamationManagement
