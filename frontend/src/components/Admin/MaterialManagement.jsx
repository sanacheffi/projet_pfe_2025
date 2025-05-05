import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteMaterial, fetchMaterials } from '../../redux/slices/materialSlice';
import { Link } from 'react-router-dom';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import Loader from '../Common/Loader';
import { IoMdAddCircle } from 'react-icons/io';

const MaterialManagement = () => {
    const dispatch = useDispatch();
  const { materials, loading, error } = useSelector(state => state.materials);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleDelete = (id) => {
          if(window.confirm("Confirmez-vous la suppression de cette matière ?")){
          dispatch(deleteMaterial(id));
          }
    };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;  
  return (
    <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Gestion des matières premières</h2>
                    <Link to="/admin/materials/add" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white flex items-center gap-2 whitespace-nowrap">
                    <IoMdAddCircle />
                    <span>Ajouter une matière</span>
                    </Link>
                </div>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Nom</th>
                        <th className="py-3 px-4">Fournisseur</th>
                        <th className="py-3 px-4">Prix</th>
                        <th className="py-3 px-4">Quantité</th>
                        <th className="py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {materials.length > 0 ? materials.map((material) =>(
                        <tr key={material._id} className="border-b hover:bg-gray-50 cursor-pointer">
                             <td className="py-2 px-2 sm:py-4 sm:px-4">
                             <img src={material.images[0]?.url} alt={material.images[0]?.altText || material.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" />
                            </td>
                            <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{material.name}</td>
                            <td className="p-4">{material.supplier}</td>
                            <td className="p-4">{material.price}</td>
                            <td className="p-4">{material.quantity}</td>
                            <td className="text-center">
                                <div className="flex flex-row  items-center justify-center gap-2">
                                    <Link 
                                    to={`/admin/materials/${material._id}/edit`}
                                    className="bg-yellow-500 text-white px-2 py-2 rounded hover:bg-yellow-600">
                                        <MdOutlineModeEditOutline />
                                    </Link>
                                    <button onClick={() => handleDelete(material._id)} className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600">
                                        <FaTrashAlt/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (<tr>
                        <td colSpan={6} className="p-4 text-center text-gray-500">
                        Aucune matière trouvée.
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
  )

}

export default MaterialManagement
