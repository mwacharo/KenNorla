import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartToken, setCartToken] = useState(null);
  const [vendorToken] = useState(import.meta.env.VITE_VENDOR_TOKEN || null);
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Track initialization

  // ✅ Initialize cart and token from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const savedToken =
      localStorage.getItem("cart_token") || crypto.randomUUID();

    setCartItems(savedCart);
    setCartToken(savedToken);
    localStorage.setItem("cart_token", savedToken);

    setIsInitialized(true); // ✅ Mark as initialized
  }, []);

  // ✅ Persist cart to localStorage only AFTER initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // ... rest of your code remains the same

  // const addToCart = (product) => {
  //   setCartItems((prevItems) => {
  //     const existingItem = prevItems.find((item) => item.id === product.id);

  //     if (existingItem) {
  //       return prevItems.map((item) =>
  //         item.id === product.id
  //           ? { ...item, quantity: item.quantity + 1 }
  //           : item
  //       );
  //     }

  //     return [...prevItems, { ...product, quantity: 1 }];
  //   });
  // };


  const addToCart = (product) => {
    // ✅ Validate required fields
    if (!product.id) {
      throw new Error('Cannot add product: Product ID is missing');
    }

    if (!product.sku) {
      throw new Error(`Cannot add product: SKU is missing for product "${product.name || product.id}"`);
    }

    const productWithSku = {
      ...product,
      sku: product.sku,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productWithSku.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productWithSku.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...productWithSku, quantity: 1 }];
    });

    console.log('✅ Added to cart with SKU:', productWithSku.sku);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^\d.]/g, ""))
          : item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartMetadata = () => ({
    cart_token: cartToken,
    vendor_token: vendorToken,
  });

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartMetadata,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};