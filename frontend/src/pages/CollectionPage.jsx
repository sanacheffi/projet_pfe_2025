import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

const CollectionPage = () => {
  const {category} = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
      dispatch(fetchProductsByFilters({ category, ...queryParams }));
    }, [dispatch, category, searchParams]);
    

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    
    const handleClickOutside = (e) => {
      // Close sidebar if clicked outside
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);    
    

  return (
  <div className="flex flex-col lg:flex-row">
    {/* Mobile Filter button */}
    <button onClick={toggleSidebar} className="lg:hidden border p-2 flex justify-center items-center">
      <FaFilter className="mr-2" /> Filters
      </button>
      {/* Filter Sidebar */}
      <div
  ref={sidebarRef} 
  className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
  fixed inset-y-0 z-30 left-0 w-72 lg:w-[24rem] bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>


        <FilterSidebar />
      </div>

<div className="flex-grow p-6">

  {/* Sort Options */}
  <SortOptions />

  {/* Product Grid */}
  <ProductGrid products={products} loading={loading} error={error} />
</div>

    </div>
  )
}

export default CollectionPage
