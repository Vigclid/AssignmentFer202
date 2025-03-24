// src/components/Products.tsx
import React, { useEffect, useState } from 'react';
import { IProduct } from '../Interfaces/ProjectInterfaces';
import { AddToCartButton } from './CartManagement/AddToCartButton';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const userId = 1; // Giả sử userId là 1, bạn có thể thay đổi theo logic đăng nhập

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleAddToCart = async (productId: number, userId: number) => {
    try {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemResponse = await fetch(
        `http://localhost:5000/cartItems?user=${userId}&product=${productId}`
      );
      const existingItem = await existingItemResponse.json();

      if (existingItem.length > 0) {
        // Nếu đã có, cập nhật số lượng
        await fetch(`http://localhost:5000/cartItems/${existingItem[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: existingItem[0].quantity + 1 })
        });
      } else {
        // Nếu chưa có, thêm mới
        await fetch('http://localhost:5000/cartItems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: userId, product: productId, quantity: 1 })
        });
      }
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sản phẩm</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-2" />
            <h2 className="font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-semibold">{product.price.toLocaleString()} VND</p>
            <AddToCartButton 
              product={product} 
              userId={userId} 
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
};