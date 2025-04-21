import { Link, useNavigate } from "react-router-dom";

const FilterSidebar = () => {
  const navigate = useNavigate();

  const collections = [
    {
      name: 'Meubles Rotin',
      categories: ['Chaises', 'Poufs', 'Fauteuils', 'Balancelles', 'Tables Basses Rotin'],
    },
    {
      name: 'Luminaires Rotin',
      categories: ['Suspension', 'Lampe de table', 'Applique murale'],
    },
    {
      name: 'Objets de Décoration',
      categories: ['Vases', 'Paniers', 'Miroirs'],
    },
    {
      name: 'Décorations Murales',
      categories: ['Tapis muraux', 'Porte Manteaux', 'Cadres'],
    },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/collections/all?category=${category}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-light mt-4 mb-8">Filtres</h2>
      <h3 className="font-normal text-xl mb-4">Catégories</h3>

      {collections.map((collection, index) => (
        <div key={index} className="pl-4 mb-4">
          <Link
            to={`/collections/all?collection=${collection.name}`}
            className="text-black font-medium hover:underline"
          >
            {collection.name}
          </Link>
          <ul className="ml-4 mt-1 space-y-1">
            {collection.categories.map((category, idx) => (
              <li
                key={idx}
                className="text-sm cursor-pointer hover:underline text-gray-800"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;
