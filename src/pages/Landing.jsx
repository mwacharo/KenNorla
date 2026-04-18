import React, { useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Menu, X, ChevronRight, Award, Users, TrendingUp, Heart } from 'lucide-react';
import { useEffect } from "react";
import { fetchVendorProducts } from "../api/products"; // ✅ from the api folder we made earlier

import { Link } from "react-router-dom";

import { useNavigate } from 'react-router-dom';

import { FloatingWhatsApp } from 'react-floating-whatsapp';

// 
// cart context
import { useCart } from "../context/CartContext";




// Shared Footer Component
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">AHB</span>
                            </div>
                            <span className="text-xl font-bold">AlphaHerb</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Premium quality syrups crafted with care for your beverages and culinary creations.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><button className="hover:text-amber-500 transition-colors">Products</button></li>
                            {/* add privacy policy  */}
                            <li><Link to="/privacy-policy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions" className="hover:text-amber-500 transition-colors">Terms & Conditions</Link></li>

                            {/* <li><button className="hover:text-amber-500 transition-colors">Home</button></li>
                            <li><button className="hover:text-amber-500 transition-colors">About Us</button></li>
                            <li><button className="hover:text-amber-500 transition-colors">Gallery</button></li> */}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-center space-x-2">
                                <Phone size={16} className="text-amber-500" />
                                <span>+254110771426</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail size={16} className="text-amber-500" />
                                {/* <span>sales@alphaherbherbscom</span> */}
                                <span>sales.alphaherb@gmail.com
</span>

                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin size={16} className="text-amber-500" />
                                <span>Nairobi, Kenya</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <Facebook size={20} />
                            </button>
                            {/* <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <TikTok size={20} />
                            </button> */}
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <Twitter size={20} />
                            </button>
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <Instagram size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2025 AlphaHerb Herbs. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// Home Page Component
const HomePage = ({ onNavigate }) => {
    const features = [
        { icon: Award, title: 'Premium Quality', desc: 'Highest quality ingredients' },
        { icon: Users, title: 'Trusted by Many', desc: 'Thousands of satisfied customers' },
        { icon: TrendingUp, title: 'Growing Brand', desc: 'Expanding across East Africa' },
        { icon: Heart, title: 'Made with Love', desc: 'Crafted with passion' }
    ];

    return (
        <div>
            <section className="relative bg-gradient-to-r from-amber-600 to-orange-500 text-white py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Premium Syrups for Every Occasion
                        </h1>
                        <p className="text-xl mb-8 text-amber-100">
                            Experience the perfect blend of flavor and quality with Strongman Syrup. Made in Kenya, loved by all.
                        </p>
                        <button
                            onClick={() => onNavigate('products')}
                            className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                        >
                            <span>Explore Products</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-center">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="text-amber-600" size={32} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Ready to Experience Strongman?</h2>
                    <p className="text-gray-600 mb-8 text-lg">Get in touch with us today and discover our full range of products</p>
                    <button
                        onClick={() => onNavigate('contact')}
                        className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        Contact Us Today
                    </button>
                </div>
            </section>
        </div>
    );
};

// About Page Component
const AboutPage = () => {
    return (
        <div>
            <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h1 className="text-5xl font-bold mb-6 text-gray-800">About Strongman Syrup</h1>
                        <p className="text-xl text-gray-600">
                            Crafting premium syrups with passion and dedication since our inception
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Story</h2>
                            <p className="text-gray-600 mb-4">
                                Strongman Syrup was born from a passion for creating exceptional flavors that enhance everyday moments. Our journey began with a simple mission: to provide premium quality syrups that bring joy to every beverage and dish.
                            </p>
                            <p className="text-gray-600">
                                Today, we're proud to be a trusted name across Kenya and beyond, delivering consistent quality and innovative flavors that our customers love.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl h-64 flex items-center justify-center">
                            <Award size={120} className="text-amber-600" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-3 text-amber-600">Our Mission</h3>
                            <p className="text-gray-600">
                                To deliver premium quality syrups that enhance culinary experiences and bring people together.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-3 text-amber-600">Our Vision</h3>
                            <p className="text-gray-600">
                                To become East Africa's leading syrup brand, known for quality, innovation, and customer satisfaction.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold mb-3 text-amber-600">Our Values</h3>
                            <p className="text-gray-600">
                                Quality, integrity, innovation, and customer satisfaction drive everything we do.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};



const ProductsPage = () => {
    const navigate = useNavigate();

    const { addToCart } = useCart();




    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchVendorProducts()
            .then((data) => {
                // Laravel response might wrap data, e.g., { data: [...] }
                setProducts(data.data || data);
                console.log("Fetched products:", data);
            })
            .catch((err) => {
                console.error("Error loading products:", err);
            });
    }, []);





    const handleAddToCart = (product) => {

        console.log('🔍 Product from API:', product);
        console.log('🔍 Product SKU:', product.sku);
        // Transform product data to match cart format
        const cartProduct = {
            id: product.id,
            name: product.product_name,
            price: `KSh ${product.prices?.[0]?.base_price || product.base_price || 0}`,
            image: product.images?.[0]?.image_path
                ? `${import.meta.env.VITE_APP_URL || ""}${product.images[0].image_path}`
                : "https://via.placeholder.com/150x150?text=No+Image",
            sku: product.sku, // ✅ Add SKU field



        };

        addToCart(cartProduct);
        //           if (confirm(`${product.product_name} added to cart! View cart now?`)) {
        //     window.location.href = "/cart";
        //   }

        if (confirm(`${product.product_name} added to cart! View cart now?`)) {
            navigate("/cart"); // ✅ No page reload - state persists!
        }
        alert(`${product.product_name} added to cart!`);
    };

    return (




        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 text-gray-800">Our Products</h1>
                    <p className="text-xl text-gray-600">Discover our full range of premium syrups</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {products.map((product) => {
           
                        const BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL;


                        const imageUrl = product.images?.[0]?.image_path
                            ? `${BASE_URL}${product.images[0].image_path}`
                            : "https://via.placeholder.com/150x150?text=No+Image";

                        // Get price (first available price or base_price)
                        const price =
                            product.prices?.[0]?.base_price ||
                            product.base_price ||
                            "N/A";

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                     



                                <div className="relative aspect-square bg-white p-10 flex items-center justify-center overflow-hidden">
  
  <div className="absolute inset-0 bg-gradient-radial from-gray-100 via-white to-white opacity-70"></div>
<div
  onClick={() => navigate(`/product/${product.slug || product.id}`)}
  className="cursor-pointer"
>
  <img
    src={imageUrl}
    alt={product.product_name}
    className="relative max-h-full object-contain"
  />
</div>

</div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                                        {product.product_name}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        {product.description || "No description available"}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-amber-600">
                                            {price} KSH
                                        </span>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


            </div>
        </div>

    );
};


// Cart page 


// Gallery Page Component
const GalleryPage = () => {
    const galleryItems = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 text-gray-800">Gallery</h1>
                    <p className="text-xl text-gray-600">Explore our products and moments</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className="aspect-square bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-md"
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-amber-600 rounded-full mx-auto mb-2"></div>
                                    <p className="text-gray-600 font-medium">Product {item}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Contact Page Component
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <div className="py-16 bg-gradient-to-b from-amber-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 text-gray-800">Contact Us</h1>
                    <p className="text-xl text-gray-600">Get in touch with the AlphaHerb team</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                                    placeholder="254750730186"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white resize-none"
                                    rows="4"
                                    placeholder="Your message..."
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="text-amber-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Phone Number</h3>
                                        <p className="text-gray-600">+2547110771426</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="text-amber-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                        <p className="text-gray-600">sales.alphaherb@gmail.com
</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="text-amber-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Website</h3>
                                        <p className="text-gray-600">https://alphaherb.vercel.app</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg text-white">
                            <h3 className="font-bold text-lg mb-3">Business Hours</h3>
                            <p className="mb-1">Monday - Friday: 8:00 AM - 6:00 PM</p>
                            <p className="mb-1">Saturday: 9:00 AM - 4:00 PM</p>
                            <p>Sunday: Open</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};




// Main App Component with Page Routing
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: 'home' },
        // { name: 'About', path: 'about' },

        { name: 'Products', path: 'products' },
        // { name: 'Cart', path: 'cart' },  // Add this

        // { name: 'Gallery', path: 'gallery' },
        { name: 'Contact', path: 'contact' }

    ];

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (currentPage) {
            // case 'home': return <HomePage onNavigate={handleNavigate} />;
            case 'about': return <AboutPage />;
            case 'products': return <ProductsPage />;
            case 'checkout': return <CheckoutPage />;
            case 'Cart': return <CartPage />

            case 'gallery': return <GalleryPage />;
            case 'contact': return <ContactPage />;
            // default: return <HomePage onNavigate={handleNavigate} />;
            default: return <ProductsPage onNavigate={handleNavigate} />;

        }
    };

    return (
        <div className="min-h-screen flex flex-col">


              {/* WhatsApp Floating Button */}
            <FloatingWhatsApp
                phoneNumber="254110771426"
                accountName="AlphaHerb"
                chatMessage="Hello 👋 How can we help you today?"
                statusMessage="Typically replies within 3 minutes "
            />
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigate('home')}>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">SM</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">AlphaHerbs</h1>
                                <p className="text-xs text-amber-600">Premium Syrups & Herbs</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            {navItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigate(item.path)}
                                    className={`text-gray-700 hover:text-amber-600 transition-colors font-medium ${currentPage === item.path ? 'text-amber-600 border-b-2 border-amber-600' : ''
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>

                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <nav className="md:hidden py-4 border-t">
                            {navItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigate(item.path)}
                                    className={`block w-full text-left py-2 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors ${currentPage === item.path ? 'text-amber-600 bg-amber-50' : ''
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            <main className="flex-grow">
                {renderPage()}
            </main>

            <Footer />
        </div>
    );
};

export default App;