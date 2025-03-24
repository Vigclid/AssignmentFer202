export interface IAccount {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'manager' | 'admin';
  status: string;
}

export interface IReview {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  date: string;
}

export interface IProduct {
  id: string; // id is string in db.json
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  reviews: string[]; // reviews are stored as array of review IDs (strings)
}

// src/Interfaces/ProjectInterfaces.ts
export interface IPaymentHistory {
  id: number;
  userId: number;
  products: IProduct[];
  total: number;
  date: string;
}



export interface ICartItem {
  productId: string; // matches product id type
  quantity: number;
}

export interface ICart {
  user: number;
  items: ICartItem[];
  total: number;
  id: string;
}



export interface GoogleUser {
  email: string,
  email_verified: boolean
  family_name: string
  given_name: string
  locale: string
  name: string
  picture: string
  sub: GLfloat
}
