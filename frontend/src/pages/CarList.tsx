import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Car } from '../lib/types';
import { Input } from '../components/ui/Input';
import { cars } from '../lib/api';

export function CarListPage() {
  const [carList, setCarList] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await cars.list(search);
        setCarList(response.data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [search]);

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carList.map((car) => (
            <Link
              key={car.id}
              to={`/cars/${car.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{car.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{car.description}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(car.tags).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && carList.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-500">Try adjusting your search or add a new car.</p>
        </div>
      )}
    </div>
  );
}