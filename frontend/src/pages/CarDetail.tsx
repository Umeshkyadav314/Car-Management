import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cars } from '../lib/api';
import { Car } from '../lib/types';
import { Button } from '../components/ui/Button';

export function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await cars.get(id!);
        setCar(response.data);
      } catch (error) {
        toast.error('Failed to load car details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      await cars.delete(id!);
      toast.success('Car deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete car');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{car.title}</h1>
          <div className="flex space-x-2">
            <Link to={`/cars/${id}/edit`}>
              <Button variant="secondary">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="secondary" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={car.images[selectedImage]}
                alt={car.title}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.title} - ${index + 1}`}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="prose max-w-none mb-6">
              <p>{car.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(car.tags).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm text-gray-500 capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}