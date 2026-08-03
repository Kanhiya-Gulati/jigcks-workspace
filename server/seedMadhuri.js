require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // 1. Ensure Admin exists
        let admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            admin = await User.create({
                name: 'Admin',
                username: 'admin',
                email: 'admin@jigcks.com',
                password: 'admin123',
                role: 'admin',
                isFirstLogin: false,
                avatar: '#6C5CE7'
            });
        }

        // 2. Ensure Kanhiya exists
        let kanhiya = await User.findOne({ username: 'kanhiya' });
        if (!kanhiya) {
            kanhiya = await User.create({
                name: 'Kanhiya',
                username: 'kanhiya',
                email: 'kanhiya@jigcks.com',
                password: 'password123',
                role: 'freelancer',
                isFirstLogin: true,
                avatar: '#00B894'
            });
            console.log('Created freelancer: Kanhiya (username: kanhiya, password: password123)');
        }

        // 3. Ensure Aastha exists
        let aastha = await User.findOne({ username: 'aastha' });
        if (!aastha) {
            aastha = await User.create({
                name: 'Aastha',
                username: 'aastha',
                email: 'aastha@jigcks.com',
                password: 'password123',
                role: 'freelancer',
                isFirstLogin: true,
                avatar: '#E84393'
            });
            console.log('Created freelancer: Aastha (username: aastha, password: password123)');
        }

        // 4. Create or Update "Madhuri Ventures" Project
        let project = await Project.findOne({ title: 'Madhuri Ventures' });
        if (project) {
            await Task.deleteMany({ project: project._id });
            await Project.findByIdAndDelete(project._id);
        }

        project = await Project.create({
            title: 'Madhuri Ventures',
            description: 'Exhaustive Master Task Checklist (110 Micro-Tasks across 5 Frontend + 2 Backend + 1 Testing Phase)',
            client: 'Madhuri Ventures',
            deadline: new Date('2026-12-31'),
            status: 'active',
            assignedTo: [kanhiya._id, aastha._id],
            createdBy: admin._id
        });

        console.log(`Project "Madhuri Ventures" created ID: ${project._id}`);

        const tasksData = [
            // FRONTEND PHASE 1: 36 tasks (Kanhiya, completed)
            { num: '1.1', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Project Scaffolding & Vite Config', file: 'frontend/vite.config.js', status: 'completed', assigned: kanhiya._id },
            { num: '1.2', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Design Tokens & Global CSS Reset', file: 'src/index.css (Navy & Gold)', status: 'completed', assigned: kanhiya._id },
            { num: '1.3', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Typography & Google Fonts Setup', file: 'Outfit + Inter Fonts', status: 'completed', assigned: kanhiya._id },
            { num: '1.4', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Reusable Button Component', file: 'src/components/common/Button.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.5', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Reusable InputField Component', file: 'src/components/common/InputField.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.6', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Reusable Loader & Overlay Spinner', file: 'src/components/common/Loader.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.7', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'ProductCard Component & Badges', file: 'src/components/ProductCard', status: 'completed', assigned: kanhiya._id },
            { num: '1.8', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'HeroBanner Slider & Touch Swipe', file: 'src/components/HeroBanner', status: 'completed', assigned: kanhiya._id },
            { num: '1.9', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Sticky Navbar & Mobile Hamburger', file: 'src/components/Navbar', status: 'completed', assigned: kanhiya._id },
            { num: '1.10', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Multi-column Footer & Newsletter', file: 'src/components/Footer', status: 'completed', assigned: kanhiya._id },
            { num: '1.11', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Homepage - Hero & Category Grid', file: 'src/pages/Home/Home.jsx (/)', status: 'completed', assigned: kanhiya._id },
            { num: '1.12', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Homepage - Featured & Bestsellers', file: 'src/pages/Home/Home.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.13', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Homepage - Promo Banners & New Arrivals', file: 'src/pages/Home/Home.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.14', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Homepage - Trust Badges & Newsletter', file: 'src/pages/Home/Home.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.15', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Listing Page - Grid/List View', file: 'src/pages/ProductListing (/products)', status: 'completed', assigned: kanhiya._id },
            { num: '1.16', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Listing - Keyword Search', file: 'src/pages/ProductListing', status: 'completed', assigned: kanhiya._id },
            { num: '1.17', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Listing - Category Filters', file: 'src/pages/ProductListing', status: 'completed', assigned: kanhiya._id },
            { num: '1.18', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Listing - Price Range Filter', file: 'src/pages/ProductListing', status: 'completed', assigned: kanhiya._id },
            { num: '1.19', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Listing - Rating & Stock Filter', file: 'src/pages/ProductListing', status: 'completed', assigned: kanhiya._id },
            { num: '1.20', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Listing - Sorting & Pagination', file: 'src/pages/ProductListing', status: 'completed', assigned: kanhiya._id },
            { num: '1.21', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Detail Page - Image Gallery', file: 'src/pages/ProductDetail (/product/:slug)', status: 'completed', assigned: kanhiya._id },
            { num: '1.22', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Detail - Price & Discount Badges', file: 'src/pages/ProductDetail', status: 'completed', assigned: kanhiya._id },
            { num: '1.23', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Detail - Variant & Quantity Picker', file: 'src/pages/ProductDetail', status: 'completed', assigned: kanhiya._id },
            { num: '1.24', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Detail - Cart/Buy/Wishlist Buttons', file: 'src/pages/ProductDetail', status: 'completed', assigned: kanhiya._id },
            { num: '1.25', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Product Detail - Specs & Related Carousel', file: 'src/pages/ProductDetail', status: 'completed', assigned: kanhiya._id },
            { num: '1.26', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Shopping Cart Page - Items & Quantities', file: 'src/pages/Cart/Cart.jsx (/cart)', status: 'completed', assigned: kanhiya._id },
            { num: '1.27', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Shopping Cart - Summary & Calculations', file: 'src/pages/Cart/Cart.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.28', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Shopping Cart - Coupon Input & Preview', file: 'src/pages/Cart/Cart.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.29', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Wishlist Page - Custom Cards & Actions', file: 'src/pages/Wishlist/Wishlist.jsx (/wishlist)', status: 'completed', assigned: kanhiya._id },
            { num: '1.30', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Login Page & Form Validation', file: 'src/pages/Login/Login.jsx (/login)', status: 'completed', assigned: kanhiya._id },
            { num: '1.31', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Register Page & Password Strength', file: 'src/pages/Register/Register.jsx (/register)', status: 'completed', assigned: kanhiya._id },
            { num: '1.32', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'About Us Page & Stat Counters', file: 'src/pages/About/About.jsx (/about)', status: 'completed', assigned: kanhiya._id },
            { num: '1.33', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'Contact Us Page & FAQ Accordion', file: 'src/pages/Contact/Contact.jsx (/contact)', status: 'completed', assigned: kanhiya._id },
            { num: '1.34', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'CartContext & LocalStorage Sync', file: 'src/context/CartContext.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.35', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'WishlistContext & LocalStorage Sync', file: 'src/context/WishlistContext.jsx', status: 'completed', assigned: kanhiya._id },
            { num: '1.36', phase: 'Frontend Phase 1: Core Storefront UI & Foundation', title: 'AuthContext & Session Persistence', file: 'src/context/AuthContext.jsx', status: 'completed', assigned: kanhiya._id },

            // FRONTEND PHASE 2: 12 tasks (Aastha, in-progress)
            { num: '2.1', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Checkout Page & Order Review', file: 'src/pages/Checkout/Checkout.jsx (/checkout)', status: 'in-progress', assigned: aastha._id },
            { num: '2.2', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Checkout - Address Selector Form', file: 'src/pages/Checkout/Checkout.jsx', status: 'in-progress', assigned: aastha._id },
            { num: '2.3', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Checkout - Payment Method Selector', file: 'src/pages/Checkout/Checkout.jsx', status: 'in-progress', assigned: aastha._id },
            { num: '2.4', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Order Success Confirmation Page', file: 'src/pages/OrderSuccess (/order-success)', status: 'in-progress', assigned: aastha._id },
            { num: '2.5', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Customer Profile Dashboard Page', file: 'src/pages/Profile/Profile.jsx (/profile)', status: 'in-progress', assigned: aastha._id },
            { num: '2.6', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Saved Address Book Page', file: 'src/pages/AddressBook (/profile/addresses)', status: 'in-progress', assigned: aastha._id },
            { num: '2.7', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Order History & Tracking Page', file: 'src/pages/OrderHistory (/orders)', status: 'in-progress', assigned: aastha._id },
            { num: '2.8', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Legal Policy Pages (Privacy/Terms/etc)', file: 'src/pages/Policies (/privacy-policy etc)', status: 'in-progress', assigned: aastha._id },
            { num: '2.9', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Admin Dashboard Page', file: 'src/pages/Admin/AdminDashboard.jsx', status: 'in-progress', assigned: aastha._id },
            { num: '2.10', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Admin Product Management Page', file: 'src/pages/Admin/AdminProducts.jsx', status: 'in-progress', assigned: aastha._id },
            { num: '2.11', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Admin Order Management Page', file: 'src/pages/Admin/AdminOrders.jsx', status: 'in-progress', assigned: aastha._id },
            { num: '2.12', phase: 'Frontend Phase 2: Customer Account & Admin Pages', title: 'Admin Banners & Coupons Page', file: 'src/pages/Admin/AdminBannersCoupons.jsx', status: 'in-progress', assigned: aastha._id },

            // FRONTEND PHASE 3: 5 tasks (Unassigned, pending)
            { num: '3.1', phase: 'Frontend Phase 3: Advanced Customer Interaction & Modals', title: 'Order Cancellation Request Modal', file: 'Cancellation Reason Popup Component', status: 'pending', assigned: null },
            { num: '3.2', phase: 'Frontend Phase 3: Advanced Customer Interaction & Modals', title: 'Product Rating & Review Submission Form', file: 'Star Rating & Review Form Component', status: 'pending', assigned: null },
            { num: '3.3', phase: 'Frontend Phase 3: Advanced Customer Interaction & Modals', title: 'Razorpay Test Payment SDK Integration', file: 'Frontend Razorpay Checkout SDK', status: 'pending', assigned: null },
            { num: '3.4', phase: 'Frontend Phase 3: Advanced Customer Interaction & Modals', title: 'Printable Order Invoice & PDF Download', file: 'HTML/PDF Invoice Generator', status: 'pending', assigned: null },
            { num: '3.5', phase: 'Frontend Phase 3: Advanced Customer Interaction & Modals', title: 'Buy Now Direct Checkout Flow', file: 'Direct Checkout Bypass Logic', status: 'pending', assigned: null },

            // FRONTEND PHASE 4: 9 tasks (Unassigned, pending)
            { num: '4.1', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Dashboard Analytics Charts (Recharts)', file: 'Revenue & Sales Charts Component', status: 'pending', assigned: null },
            { num: '4.2', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Add/Edit Product Form', file: 'Product Media & Variant Form', status: 'pending', assigned: null },
            { num: '4.3', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Category Creation & Reorder Manager', file: 'Category Editor Component', status: 'pending', assigned: null },
            { num: '4.4', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Inventory Audit & Low Stock Alerts', file: 'Stock Threshold Alerts Component', status: 'pending', assigned: null },
            { num: '4.5', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Order Detail & Tracking Provider Input', file: 'Status History & Tracking Number', status: 'pending', assigned: null },
            { num: '4.6', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Customer Detail & Block/Unblock', file: 'Customer Spending & Status Control', status: 'pending', assigned: null },
            { num: '4.7', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Review Moderation Page', file: 'src/pages/Admin/AdminReviews.jsx', status: 'pending', assigned: null },
            { num: '4.8', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Contact Queries Management Page', file: 'src/pages/Admin/AdminQueries.jsx', status: 'pending', assigned: null },
            { num: '4.9', phase: 'Frontend Phase 4: Advanced Admin Operations & CMS Moderation', title: 'Admin Website Settings CMS Page', file: 'src/pages/Admin/AdminSettings.jsx', status: 'pending', assigned: null },

            // FRONTEND PHASE 5: 3 tasks (Kanhiya, pending)
            { num: '5.1', phase: 'Frontend Phase 5: UI Polish & Production Optimizations', title: 'Mobile Touch & Off-canvas Drawer Polish', file: 'Navbar Mobile Menu & Touch Polish', status: 'pending', assigned: kanhiya._id },
            { num: '5.2', phase: 'Frontend Phase 5: UI Polish & Production Optimizations', title: 'Skeleton Loading Screens & Global Toasts', file: 'Skeleton UI & Toast Notification System', status: 'pending', assigned: kanhiya._id },
            { num: '5.3', phase: 'Frontend Phase 5: UI Polish & Production Optimizations', title: 'SEO Meta Tags & Open Graph Social Sharer', file: 'index.html & Dynamic Meta Tags', status: 'pending', assigned: kanhiya._id },

            // BACKEND PHASE 1: 16 tasks (Kanhiya, pending)
            { num: '6.1', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Express.js Server Setup & MVC Folder Structure', file: 'backend/server.js & Controllers/Routes', status: 'pending', assigned: kanhiya._id },
            { num: '6.2', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'MongoDB Atlas Cloud Database Connection', file: 'config/db.js (URI via .env)', status: 'pending', assigned: kanhiya._id },
            { num: '6.3', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Environment Variable Setup (.env)', file: '.env & .env.example', status: 'pending', assigned: kanhiya._id },
            { num: '6.4', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - User Collection', file: 'models/User.js (Roles & bcrypt)', status: 'pending', assigned: kanhiya._id },
            { num: '6.5', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Address Collection', file: 'models/Address.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.6', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Category Collection', file: 'models/Category.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.7', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Product Collection', file: 'models/Product.js (SKU, Stock, Variants)', status: 'pending', assigned: kanhiya._id },
            { num: '6.8', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Cart & Wishlist Collections', file: 'models/Cart.js & Wishlist.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.9', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Order Collection', file: 'models/Order.js (Snapshots & History)', status: 'pending', assigned: kanhiya._id },
            { num: '6.10', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Payment Collection', file: 'models/Payment.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.11', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Coupon Collection', file: 'models/Coupon.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.12', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Review & Inquiry Collections', file: 'models/Review.js & ContactQuery.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.13', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Mongoose Schema - Banner & Settings Collections', file: 'models/Banner.js & Settings.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.14', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'JWT Token Authentication & Cookie Handler', file: 'middleware/authMiddleware.js', status: 'pending', assigned: kanhiya._id },
            { num: '6.15', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Role-Based Access Control (RBAC) Middleware', file: 'CUSTOMER & ADMIN Authorization Rules', status: 'pending', assigned: kanhiya._id },
            { num: '6.16', phase: 'Backend Phase 1: Core Architecture, Database & Auth', title: 'Security Middleware (CORS, Helmet, Rate Limit)', file: 'Helmet, CORS & Input Sanitizer', status: 'pending', assigned: kanhiya._id },

            // BACKEND PHASE 2: 15 tasks (Kanhiya, pending)
            { num: '7.1', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Auth REST APIs (/auth/register, login, logout, me)', file: 'routes/authRoutes.js', status: 'pending', assigned: kanhiya._id },
            { num: '7.2', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Customer Profile & Address REST APIs', file: 'routes/userRoutes.js & addressRoutes.js', status: 'pending', assigned: kanhiya._id },
            { num: '7.3', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Product Catalog & Category REST APIs', file: 'GET /api/v1/products & /categories', status: 'pending', assigned: kanhiya._id },
            { num: '7.4', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Wishlist & Cart REST APIs', file: 'POST /api/v1/cart & /wishlist', status: 'pending', assigned: kanhiya._id },
            { num: '7.5', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Coupon Validation REST API', file: 'POST /api/v1/coupons/validate', status: 'pending', assigned: kanhiya._id },
            { num: '7.6', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Order Creation API & Server Price Recalculation', file: 'POST /api/v1/orders/checkout', status: 'pending', assigned: kanhiya._id },
            { num: '7.7', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Razorpay Order & Signature Verification API', file: 'POST /payments/razorpay/create-order & /verify', status: 'pending', assigned: kanhiya._id },
            { num: '7.8', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Atomic Inventory Deduction & Stock Restore', file: 'Stock update on payment & cancellation', status: 'pending', assigned: kanhiya._id },
            { num: '7.9', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Order Status Lifecycle Management APIs', file: 'PATCH /admin/orders/:id/status', status: 'pending', assigned: kanhiya._id },
            { num: '7.10', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Order Cancellation Request APIs', file: 'POST /orders/:id/cancel-request', status: 'pending', assigned: kanhiya._id },
            { num: '7.11', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Product Review & Moderation APIs', file: 'GET/POST /products/:id/reviews', status: 'pending', assigned: kanhiya._id },
            { num: '7.12', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Cloudinary Image Upload API Service', file: 'services/cloudinaryService.js', status: 'pending', assigned: kanhiya._id },
            { num: '7.13', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Admin Analytics Aggregation APIs', file: 'GET /admin/dashboard & /analytics', status: 'pending', assigned: kanhiya._id },
            { num: '7.14', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Production Deployment (Vercel + Render + Atlas)', file: 'Live Deployment & CORS setup', status: 'pending', assigned: kanhiya._id },
            { num: '7.15', phase: 'Backend Phase 2: REST APIs, Payment & Deployment', title: 'Project README & Postman Collection', file: 'API Documentation & Setup Guide', status: 'pending', assigned: kanhiya._id },

            // TESTING PHASE 8: 12 tasks (Kanhiya, pending)
            { num: '8.1', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Auth & RBAC Manual Verification', file: 'Customer vs Admin Route Protection Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.2', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Storefront Product Search, Filter & Sort Test', file: 'Keyword Search, Filter & Pagination Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.3', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Wishlist & Cart Quantity Limit Test', file: 'Cart Persistence & Stock Limit Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.4', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Address Creation & PIN Code Format Test', file: 'Address Validation & Default Flag Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.5', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Razorpay Payment & COD Checkout Test', file: 'Payment Success/Failure & COD Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.6', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Order History & Tracking Timeline Test', file: 'Status Transitions (Placed -> Delivered)', status: 'pending', assigned: kanhiya._id },
            { num: '8.7', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Coupon Expiry & Min Order Value Test', file: 'Coupon Calculation & Discount Cap Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.8', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Atomic Stock Deduction & Restore Test', file: 'Stock Deduction & Cancellation Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.9', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Cross-Device Responsive Testing', file: 'Mobile, Tablet, Laptop & Desktop Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.10', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Automated Unit & Integration Testing', file: 'Auth, Coupon & Payment Verification Tests', status: 'pending', assigned: kanhiya._id },
            { num: '8.11', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'Cloudinary Image Upload & Fallback Test', file: 'Media Upload & Missing Image Test', status: 'pending', assigned: kanhiya._id },
            { num: '8.12', phase: 'Testing Phase 8: Comprehensive QA & Audit', title: 'End-to-End Live Deployment Order Flow Test', file: 'Full User Journey Acceptance Test', status: 'pending', assigned: kanhiya._id }
        ];

        const taskDocuments = tasksData.map(item => ({
            taskNumber: item.num,
            phase: item.phase,
            title: item.title,
            componentFile: item.file,
            project: project._id,
            assignedTo: item.assigned,
            status: item.status,
            priority: 'medium',
            completedAt: item.status === 'completed' ? new Date() : null
        }));

        await Task.insertMany(taskDocuments);

        console.log(`Successfully seeded ALL ${taskDocuments.length} micro-tasks into MongoDB Atlas!`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
