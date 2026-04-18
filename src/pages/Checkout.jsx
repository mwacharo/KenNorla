import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, ShoppingBag, User, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';

import ReactPixel from 'react-facebook-pixel';
import { useEffect } from 'react';


const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart, getCartMetadata } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!formData.fullName || !formData.email || !formData.phone || !formData.city || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);

        const metadata = getCartMetadata();
        const subtotal = getCartTotal();
        const shippingCharges = 0; // Free shipping
        const totalPrice = subtotal + shippingCharges;

        // ✅ Generate unique order number
        const orderNo = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // ✅ Format data to match Laravel backend expectations
        const orderData = {
            // Required fields
            order_no: orderNo,
            warehouse_id: 1, // ⚠️ Replace with actual warehouse ID from your system
            status_id: 1, // ⚠️ 1 = Pending/New order status
            total_price: totalPrice,
            sub_total: subtotal,
            amount_paid: 0, // Not paid yet (COD or pending payment)
            
            // Optional fields
            shipping_charges: shippingCharges,
            paid: false,
            platform: 'web',
            source: 'ecommerce',
            customer_notes: formData.notes || null,
            
            // Customer data - matching backend format
            customer: {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                address: formData.address,
                zone_id: null, // Add if you have zone selection
                region: null,
                zipcode: null,
            },
            
            // Order items - matching backend format with sku and unit_price
            order_items: cartItems.map(item => ({
                product_id: item.id,
                sku: item.sku , // ⚠️ Ensure your products have SKU
                quantity: item.quantity,
                unit_price: parseFloat(item.price.replace('KSh ', ''))
            })),
            
            // Shipping address (optional but recommended)
            addresses: [
                {
                    type: 'shipping',
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    region: null,
                    zipcode: null,
                }
            ],
            
            // Metadata from cart context
            ...metadata,
        };

        console.log('📦 Sending order data:', orderData); // Debug log

        try {
            const response = await createOrder(orderData);
            console.log('✅ Order created:', response);
            
            setSuccess(true);
            clearCart();

            setFormData({
                fullName: '',
                email: '',
                phone: '',
                city: '',
                address: '',
                notes: ''
            });

            // Auto-redirect after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Order submission failed:', error);
            alert(`Failed to submit order: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
    if (cartItems.length > 0) {
        ReactPixel.track('InitiateCheckout', {
            value: getCartTotal(),
            currency: 'KES',
            num_items: cartItems.length,
        });
    }
}, []);


    if (cartItems.length === 0 && !success) {
        return (
            <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No items in cart</h2>
                    <p className="text-gray-600 mb-6">Please add items before checking out</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for your order. We'll contact you shortly to confirm delivery details.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Delivery Information</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                        <User size={18} className="mr-2 text-amber-600" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                            <Mail size={18} className="mr-2 text-amber-600" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                            <Phone size={18} className="mr-2 text-amber-600" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                                            placeholder="254712345678"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                        <MapPin size={18} className="mr-2 text-amber-600" />
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                                        placeholder="Nairobi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2 flex items-center">
                                        <Home size={18} className="mr-2 text-amber-600" />
                                        Delivery Address *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
                                        rows="3"
                                        placeholder="Street address, building, apartment number..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
                                        rows="2"
                                        placeholder="Any special delivery instructions..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => {
                                    const price = parseFloat(item.price.replace('KSh ', ''));
                                    const subtotal = price * item.quantity;
                                    return (
                                        <div key={item.id} className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-800">KSh {subtotal.toFixed(2)}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">KSh {getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-xl">
                                    <span className="font-bold text-gray-800">Total</span>
                                    <span className="font-bold text-amber-600">
                                        KSh {getCartTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By placing an order you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;