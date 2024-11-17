export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Car {
  _id: Key | null | undefined;
  data: any;
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: {
    car_type: string;
    company: string;
    dealer: string;
    [key: string]: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}