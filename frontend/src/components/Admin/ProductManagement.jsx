import React, { useEffect } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { IoMdAddCircle } from 'react-icons/io'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice'

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.adminProducts);
  
    useEffect(() => {
      dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        if(window.confirm("Confirmez-vous la suppression de cette article ?")){
        dispatch(deleteProduct(id));
        }
    };

    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error: {error}</p>; 

  return (
    <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Gestion Des Articles</h2>
                    <Link to="/admin/products/add" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white flex items-center gap-2 whitespace-nowrap">
                    <IoMdAddCircle />
                    <span>Ajouter un article</span>
                    </Link>
                </div>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Nom</th>
                        <th className="py-3 px-4">Prix</th>
                        <th className="py-3 px-4">Catégorie</th>
                        <th className="py-3 px-4">Quantité</th>
                        <th className="py-3 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? products.map((product) =>(
                        <tr key={product._id} className="border-b hover:bg-gray-50 cursor-pointer">
                             <td className="py-2 px-2 sm:py-4 sm:px-4">
                             <img src={product.images[0]?.url} alt={product.images[0]?.altText || product.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" />
                            </td>
                            <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                            <td className="p-4">{product.price}</td>
                            <td className="p-4">{product.category}</td>
                            <td className="p-4">{product.countInStock}</td>
                            <td className="text-center">
                                <div className="flex flex-row  items-center justify-center gap-2">
                                    <Link 
                                    to={`/admin/products/${product._id}/edit`}
                                    className="bg-yellow-500 text-white px-2 py-2 rounded hover:bg-yellow-600">
                                        <MdOutlineModeEditOutline />
                                    </Link>
                                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600">
                                        <FaTrashAlt/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (<tr>
                        <td colSpan={6} className="p-4 text-center text-gray-500">
                        Aucun article trouvé.
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ProductManagement
