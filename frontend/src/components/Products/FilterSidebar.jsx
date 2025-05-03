import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchSubCategories } from "../../redux/slices/subCategorySlice";

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const handleCategoryClick = (subCategory) => {
    navigate(`/collections/all?subCategory=${encodeURIComponent(subCategory.name)}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-light mt-4 mb-8">Filtres</h2>
      <h3 className="font-normal text-xl mb-4">Catégories</h3>

      {categories.map((category) => (
        <div key={category._id} className="pl-4 mb-4">
          <Link
            to={`/collections/all?category=${encodeURIComponent(category.name)}`}
            className="text-black font-medium hover:underline"
          >
            {category.name}
          </Link>
          <ul className="ml-4 mt-1 space-y-1">
          {subCategories
  .filter((sub) => sub.category._id === category._id)
  .map((subCategory) => (
    <li
      key={subCategory._id}
      className="text-sm cursor-pointer hover:underline text-gray-800"
      onClick={() => handleCategoryClick(subCategory)}
    >
      {subCategory.name}
    </li>
))}

          </ul>
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;
