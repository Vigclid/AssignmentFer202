// src/components/CartManagement/AddToCartButton.tsx
import React from 'react';
import { IProduct } from '../../Interfaces/ProjectInterfaces';

interface AddToCartButtonProps {
  product: IProduct;
  userId: number;
  onAddToCart: (productId: number, userId: number) => void;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, userId, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product.id, userId);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add to Cart
    </button>
  );
};