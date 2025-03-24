export interface IProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  reviews?: string[];
}

export interface IReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ISessionUser {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface IAccount {
  id: number;
  email: string;
  username: string;
  password: string;
  role: string;
  status: string;
}
