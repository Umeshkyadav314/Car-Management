import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { cars } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z
    .custom<FileList>()
    .refine((files) => files.length > 0, 'At least one image is required')
    .refine((files) => files.length <= MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each file size should be less than 5MB`
    )
    .refine(
      (files) => Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Only .jpg, .jpeg, .png and .webp files are accepted'
    ),
  car_type: z.string().min(1, 'Car type is required'),
  company: z.string().min(1, 'Company is required'),
  dealer: z.string().min(1, 'Dealer is required'),
});

type FormData = z.infer<typeof schema>;

export function CarFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Watch for file changes to update previews
  const watchImages = watch('images');
  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const newPreviews = Array.from(watchImages).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews((current) => {
        // Revoke old preview URLs to prevent memory leaks
        current.forEach((url) => URL.revokeObjectURL(url));
        return newPreviews;
      });
    }
  }, [watchImages]);

  // Fetch car data if editing
  useEffect(() => {
    if (id) {
      const fetchCar = async () => {
        try {
          const response = await cars.get(id);
          const car = response.data;
          setValue('title', car.title);
          setValue('description', car.description);
          setValue('car_type', car.tags.car_type);
          setValue('company', car.tags.company);
          setValue('dealer', car.tags.dealer);
          setPreviews(car.images);
        } catch (error) {
          toast.error('Failed to load car details');
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      fetchCar();
    }
  }, [id, navigate, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('car_type', data.car_type);
      formData.append('company', data.company);
      formData.append('dealer', data.dealer);
      
      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });
  
      if (id) {
        await cars.update(id, formData); // Update car with images
        toast.success('Car updated successfully');
      } else {
        await cars.create(formData); // Create new car with images
        toast.success('Car created successfully');
      }
      
      navigate('/');
    } catch (error) {
      toast.error(id ? 'Failed to update car' : 'Failed to create car');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? 'Edit Car' : 'Add New Car'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Title"
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              {...register('description')}
              rows={4}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.description?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <div className="mt-1">
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              multiple
              {...register('images')}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {errors.images?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
            )}
          </div>
          {previews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-w-1 aspect-h-1">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviews((current) =>
                        current.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Car Type"
            error={errors.car_type?.message}
            {...register('car_type')}
          />
          <Input
            label="Company"
            error={errors.company?.message}
            {...register('company')}
          />
          <Input
            label="Dealer"
            error={errors.dealer?.message}
            {...register('dealer')}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {id ? 'Update Car' : 'Create Car'}
          </Button>
        </div>
      </form>
    </div>
  );
}