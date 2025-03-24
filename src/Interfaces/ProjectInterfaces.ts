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
    id: string;
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
  
  
  
  export interface ICartItem {
    user : number;
    product: IProduct;
    quantity: number;
  }
  
  export interface ICart {
    items: ICartItem[];
    total: number;
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