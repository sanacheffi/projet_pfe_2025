import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from "axios";

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [newArrivals, setNewArrivals] = useState([]);
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewArrivals();
    }, []);


    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -400 : 400;
        scrollRef.current.scrollBy({left: scrollAmount, behaviour: "smooth"})
    };
    
    const updateScrollButtons = () =>{
        const container = scrollRef.current;

        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
            
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }
    };
  useEffect(() =>{
    const container = scrollRef.current;
    if (container) {
        container.addEventListener("scroll",updateScrollButtons);
        updateScrollButtons();
    }
  }, [newArrivals]);  
  return (
    <section className="py-10 px-4 lg:px-0">
        <div className="container mx-auto text-center mb-10 relative">
            <h2 className="text-2xl font-medium uppercase mb-4">
            Explorer Les Nouveaux Articles
            </h2>
            <p className="text-lg text-gray-600 mb-8">
            Découvrez les créations les plus récentes d'Artisanat Cheffi.
            </p>

            <div className="absolute right-0 bottom-[-35px] flex space-x-2">
                <button 
                onClick={() => scroll("left")} 
                disabled={!canScrollLeft}
                className={`p-2 rounded-md border ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                    <FiChevronLeft className="text-lg"/>
                </button>
                <button 
                onClick={() => scroll("right")}
                className={`p-2 rounded-md border ${canScrollRight ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                    <FiChevronRight className="text-lg"/>
                </button>
            </div>
        </div>

        <div ref={scrollRef} className="container mx-auto overflow-x-scroll flex space-x-6 relative">
            {newArrivals.map((product) => (
                <div key={product._id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative">
                    <Link to={`/product/${product._id}`} className="block">
                    <img src={product.images[0]?.url}
                    alt={product.images[0]?.altText || product.name}
                    className="w-full h-[400px] object-cover rounded-lg mb-4"/>
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                        <Link to={`/product/${product._id}`} className="block">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="mt-1">{product.price} DT</p>
                        </Link>
                    </div> */}
                    <h3 className="text-md font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-500 font-medium text-md tracking-tighter">
                    {product.price} DT</p>
                    </Link>
                </div>
            ))}
        </div>
    </section>
  )
}

export default NewArrivals
