// src/components/CartManagement/CartPage.tsx
import React, { useEffect, useState } from 'react';
import { ICart, ICartItem, IProduct } from '../../Interfaces/ProjectInterfaces';

export const CartPage: React.FC<{ userId: number }> = ({ userId }) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Lấy danh sách sản phẩm
        const productsResponse = await fetch('http://localhost:5000/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Lấy giỏ hàng của user
        const cartResponse = await fetch(`http://localhost:5000/carts?user=${userId}`);
        const cartData = await cartResponse.json();
        // Giả sử chỉ lấy giỏ hàng đầu tiên của user (nếu có nhiều giỏ hàng thì cần logic khác)
        setCart(cartData[0] || null);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [userId]);

  const getProductDetails = (productId: number): IProduct | undefined => {
    return products.find(product => product.id === productId);
  };

  const calculateTotal = (items: ICartItem[]) => {
    return items.reduce((total, item) => {
      const product = getProductDetails(item.productId);
      return total + ((product?.price ?? 0) * item.quantity);
    }, 0);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>
      {!cart || cart.items.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => {
              const product = getProductDetails(item.productId);
              return (
                <div key={item.productId} className="flex items-center border p-4">
                  <img
                    src={product?.imageUrl}
                    alt={product?.name}
                    className="w-20 h-20 object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{product?.name || 'Sản phẩm không tồn tại'}</h3>
                    <p>Giá: {(product?.price ?? 0).toLocaleString()} VND</p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Tổng: {((product?.price ?? 0) * item.quantity).toLocaleString()} VND</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xl font-bold">
            Tổng cộng: {calculateTotal(cart.items).toLocaleString()} VND
          </div>
        </>
      )}
    </div>
  );
};