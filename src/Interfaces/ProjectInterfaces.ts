export interface IAccount {
    id: number;
    username: string;
    email: string;
    password?: string; 
    role: 'user' | 'manager' | 'admin';
    status : string;
  }
  
  export interface IReview {
    id: number;
    userId: number;
    rating: number; 
    comment: string;
    date: string; 
  }
  
  export interface IProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl?: string; 
    reviews?: IReview[]; 
  }
  
  export interface IPaymentHistory {
    id: number;
    userId: number;
    products: IProduct[]; 
    total: number;
    date: string; 
  }
  
  // Interface mới cho cấu trúc carts
export interface ICartItem {
  productId: number; // Thay vì product, dùng productId để khớp với db.json
  quantity: number;
}

export interface ICart {
  user: number;
  items: ICartItem[];
  total: number;
}