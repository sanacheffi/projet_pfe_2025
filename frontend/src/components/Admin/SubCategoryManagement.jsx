import React, { useEffect } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { IoMdAddCircle } from 'react-icons/io'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../Common/Loader'
import { deleteSubCategory, fetchSubCategories } from '../../redux/slices/subCategorySlice'

const SubCategoryManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { subCategories, loading, error } = useSelector((state) => state.subCategory);
  
   useEffect(() => {
           if (user && user.role !== "admin") {
             navigate("/");
           }
         }, [user, navigate]);
         
         useEffect(() => {
           if (user && user.role === "admin") {
            dispatch(fetchSubCategories());
           }
         }, [dispatch, user]); 

    const handleDelete = (id) => {
        if(window.confirm("Confirmez-vous la suppression de cette sous-catégorie ?")){
        dispatch(deleteSubCategory(id));
        }
    };

    if (loading) return <Loader />;
    if (error) return <p>Error: {error}</p>; 

  return (
    <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Gestion Des Sous-catégories</h2>
                    <Link to="/admin/subcategories/add" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white flex items-center gap-2 whitespace-nowrap">
                    <IoMdAddCircle />
                    <span>Ajouter une Sous-catégorie</span>
                    </Link>
                </div>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">Nom</th>
                        <th className="py-3 px-4">catégorie</th>
                        <th className="py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {subCategories.length > 0 ? subCategories.map((subCategorie) =>(
                        <tr key={subCategorie._id} className="border-b hover:bg-gray-50 cursor-pointer">
                            <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{subCategorie.name}</td>
                            <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{subCategorie.category?.name || 'Non défini'}</td>
                            <td className="text-center p-4">
                                <div className="flex flex-row  items-center justify-center gap-2">
                                    <Link 
                                    to={`/admin/subcategories/${subCategorie._id}/edit`}
                                    className="bg-yellow-500 text-white px-2 py-2 rounded hover:bg-yellow-600">
                                        <MdOutlineModeEditOutline />
                                    </Link>
                                    <button onClick={() => handleDelete(subCategorie._id)} className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600">
                                        <FaTrashAlt/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (<tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500">
                        Aucune sous-catégorie trouvée.
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default SubCategoryManagement
