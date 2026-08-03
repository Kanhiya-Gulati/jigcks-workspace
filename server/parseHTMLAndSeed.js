require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const rawHtml = `
          <!-- FRONTEND SECTION HEADER -->
          <tr class="section-header-row"><td colspan="6">🎨 FRONTEND ARCHITECTURE (5 PHASES)</td></tr>

          <!-- FRONTEND PHASE 1 -->
          <tr class="phase-header-row"><td colspan="6">FRONTEND PHASE 1: CORE STOREFRONT UI & FOUNDATION (COMPLETED BY KANHIYA)</td></tr>
          <tr data-assignee="kanhiya"><td>1.1</td><td>Frontend Phase 1</td><td>Project Scaffolding & Vite Config</td><td><code>frontend/vite.config.js</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.2</td><td>Frontend Phase 1</td><td>Design Tokens & Global CSS Reset</td><td><code>src/index.css</code> (Navy & Gold)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.3</td><td>Frontend Phase 1</td><td>Typography & Google Fonts Setup</td><td>Outfit + Inter Fonts</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.4</td><td>Frontend Phase 1</td><td>Reusable Button Component</td><td><code>src/components/common/Button.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.5</td><td>Frontend Phase 1</td><td>Reusable InputField Component</td><td><code>src/components/common/InputField.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.6</td><td>Frontend Phase 1</td><td>Reusable Loader & Overlay Spinner</td><td><code>src/components/common/Loader.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.7</td><td>Frontend Phase 1</td><td>ProductCard Component & Badges</td><td><code>src/components/ProductCard</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.8</td><td>Frontend Phase 1</td><td>HeroBanner Slider & Touch Swipe</td><td><code>src/components/HeroBanner</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.9</td><td>Frontend Phase 1</td><td>Sticky Navbar & Mobile Hamburger</td><td><code>src/components/Navbar</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.10</td><td>Frontend Phase 1</td><td>Multi-column Footer & Newsletter</td><td><code>src/components/Footer</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.11</td><td>Frontend Phase 1</td><td>Homepage - Hero & Category Grid</td><td><code>src/pages/Home/Home.jsx</code> (<code>/</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.12</td><td>Frontend Phase 1</td><td>Homepage - Featured & Bestsellers</td><td><code>src/pages/Home/Home.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.13</td><td>Frontend Phase 1</td><td>Homepage - Promo Banners & New Arrivals</td><td><code>src/pages/Home/Home.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.14</td><td>Frontend Phase 1</td><td>Homepage - Trust Badges & Newsletter</td><td><code>src/pages/Home/Home.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.15</td><td>Frontend Phase 1</td><td>Product Listing Page - Grid/List View</td><td><code>src/pages/ProductListing</code> (<code>/products</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.16</td><td>Frontend Phase 1</td><td>Product Listing - Keyword Search</td><td><code>src/pages/ProductListing</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.17</td><td>Frontend Phase 1</td><td>Product Listing - Category Filters</td><td><code>src/pages/ProductListing</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.18</td><td>Frontend Phase 1</td><td>Product Listing - Price Range Filter</td><td><code>src/pages/ProductListing</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.19</td><td>Frontend Phase 1</td><td>Product Listing - Rating & Stock Filter</td><td><code>src/pages/ProductListing</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.20</td><td>Frontend Phase 1</td><td>Product Listing - Sorting & Pagination</td><td><code>src/pages/ProductListing</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.21</td><td>Frontend Phase 1</td><td>Product Detail Page - Image Gallery</td><td><code>src/pages/ProductDetail</code> (<code>/product/:slug</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.22</td><td>Frontend Phase 1</td><td>Product Detail - Price & Discount Badges</td><td><code>src/pages/ProductDetail</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.23</td><td>Frontend Phase 1</td><td>Product Detail - Variant & Quantity Picker</td><td><code>src/pages/ProductDetail</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.24</td><td>Frontend Phase 1</td><td>Product Detail - Cart/Buy/Wishlist Buttons</td><td><code>src/pages/ProductDetail</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.25</td><td>Frontend Phase 1</td><td>Product Detail - Specs & Related Carousel</td><td><code>src/pages/ProductDetail</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.26</td><td>Frontend Phase 1</td><td>Shopping Cart Page - Items & Quantities</td><td><code>src/pages/Cart/Cart.jsx</code> (<code>/cart</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.27</td><td>Frontend Phase 1</td><td>Shopping Cart - Summary & Calculations</td><td><code>src/pages/Cart/Cart.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.28</td><td>Frontend Phase 1</td><td>Shopping Cart - Coupon Input & Preview</td><td><code>src/pages/Cart/Cart.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.29</td><td>Frontend Phase 1</td><td>Wishlist Page - Custom Cards & Actions</td><td><code>src/pages/Wishlist/Wishlist.jsx</code> (<code>/wishlist</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.30</td><td>Frontend Phase 1</td><td>Login Page & Form Validation</td><td><code>src/pages/Login/Login.jsx</code> (<code>/login</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.31</td><td>Frontend Phase 1</td><td>Register Page & Password Strength</td><td><code>src/pages/Register/Register.jsx</code> (<code>/register</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.32</td><td>Frontend Phase 1</td><td>About Us Page & Stat Counters</td><td><code>src/pages/About/About.jsx</code> (<code>/about</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.33</td><td>Frontend Phase 1</td><td>Contact Us Page & FAQ Accordion</td><td><code>src/pages/Contact/Contact.jsx</code> (<code>/contact</code>)</td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.34</td><td>Frontend Phase 1</td><td>CartContext & LocalStorage Sync</td><td><code>src/context/CartContext.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.35</td><td>Frontend Phase 1</td><td>WishlistContext & LocalStorage Sync</td><td><code>src/context/WishlistContext.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>1.36</td><td>Frontend Phase 1</td><td>AuthContext & Session Persistence</td><td><code>src/context/AuthContext.jsx</code></td><td><span class="badge badge-done">DONE</span></td><td class="assignee">Kanhiya</td></tr>

          <!-- FRONTEND PHASE 2 -->
          <tr class="phase-header-row"><td colspan="6">FRONTEND PHASE 2: CUSTOMER ACCOUNT & ADMIN PAGES (12 TASKS - ASSIGNED TO AASTHA)</td></tr>
          <tr data-assignee="aastha"><td>2.1</td><td>Frontend Phase 2</td><td>Checkout Page & Order Review</td><td><code>src/pages/Checkout/Checkout.jsx</code> (<code>/checkout</code>)</td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.2</td><td>Frontend Phase 2</td><td>Checkout - Address Selector Form</td><td><code>src/pages/Checkout/Checkout.jsx</code></td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.3</td><td>Frontend Phase 2</td><td>Checkout - Payment Method Selector</td><td><code>src/pages/Checkout/Checkout.jsx</code></td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.4</td><td>Frontend Phase 2</td><td>Order Success Confirmation Page</td><td><code>src/pages/OrderSuccess</code> (<code>/order-success</code>)</td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.5</td><td>Frontend Phase 2</td><td>Customer Profile Dashboard Page</td><td><code>src/pages/Profile/Profile.jsx</code> (<code>/profile</code>)</td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.6</td><td>Frontend Phase 2</td><td>Saved Address Book Page</td><td><code>src/pages/AddressBook</code> (<code>/profile/addresses</code>)</td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.7</td><td>Frontend Phase 2</td><td>Order History & Tracking Page</td><td><code>src/pages/OrderHistory</code> (<code>/orders</code>)</td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.8</td><td>Frontend Phase 2</td><td>Legal Policy Pages (Privacy/Terms/etc)</td><td><code>src/pages/Policies</code> (<code>/privacy-policy</code> etc)</td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.9</td><td>Frontend Phase 2</td><td>Admin Dashboard Page</td><td><code>src/pages/Admin/AdminDashboard.jsx</code></td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.10</td><td>Frontend Phase 2</td><td>Admin Product Management Page</td><td><code>src/pages/Admin/AdminProducts.jsx</code></td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.11</td><td>Frontend Phase 2</td><td>Admin Order Management Page</td><td><code>src/pages/Admin/AdminOrders.jsx</code></td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>
          <tr data-assignee="aastha"><td>2.12</td><td>Frontend Phase 2</td><td>Admin Banners & Coupons Page</td><td><code>src/pages/Admin/AdminBannersCoupons.jsx</code></td><td><span class="badge badge-ready">TEMPLATE READY</span></td><td class="assignee">Aastha</td></tr>

          <!-- FRONTEND PHASE 3 -->
          <tr class="phase-header-row"><td colspan="6">FRONTEND PHASE 3: ADVANCED CUSTOMER INTERACTION & PAYMENT MODALS</td></tr>
          <tr data-assignee="unassigned"><td>3.1</td><td>Frontend Phase 3</td><td>Order Cancellation Request Modal</td><td>Cancellation Reason Popup Component</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>3.2</td><td>Frontend Phase 3</td><td>Product Rating & Review Submission Form</td><td>Star Rating & Review Form Component</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>3.3</td><td>Frontend Phase 3</td><td>Razorpay Test Payment SDK Integration</td><td>Frontend Razorpay Checkout SDK</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>3.4</td><td>Frontend Phase 3</td><td>Printable Order Invoice & PDF Download</td><td>HTML/PDF Invoice Generator</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>3.5</td><td>Frontend Phase 3</td><td>Buy Now Direct Checkout Flow</td><td>Direct Checkout Bypass Logic</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>

          <!-- FRONTEND PHASE 4 -->
          <tr class="phase-header-row"><td colspan="6">FRONTEND PHASE 4: ADVANCED ADMIN OPERATIONS & CMS MODERATION</td></tr>
          <tr data-assignee="unassigned"><td>4.1</td><td>Frontend Phase 4</td><td>Admin Dashboard Analytics Charts (Recharts)</td><td>Revenue & Sales Charts Component</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.2</td><td>Frontend Phase 4</td><td>Admin Add/Edit Product Form</td><td>Product Media & Variant Form</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.3</td><td>Frontend Phase 4</td><td>Admin Category Creation & Reorder Manager</td><td>Category Editor Component</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.4</td><td>Frontend Phase 4</td><td>Admin Inventory Audit & Low Stock Alerts</td><td>Stock Threshold Alerts Component</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.5</td><td>Frontend Phase 4</td><td>Admin Order Detail & Tracking Provider Input</td><td>Status History & Tracking Number</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.6</td><td>Frontend Phase 4</td><td>Admin Customer Detail & Block/Unblock</td><td>Customer Spending & Status Control</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.7</td><td>Frontend Phase 4</td><td>Admin Review Moderation Page</td><td><code>src/pages/Admin/AdminReviews.jsx</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.8</td><td>Frontend Phase 4</td><td>Admin Contact Queries Management Page</td><td><code>src/pages/Admin/AdminQueries.jsx</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>
          <tr data-assignee="unassigned"><td>4.9</td><td>Frontend Phase 4</td><td>Admin Website Settings CMS Page</td><td><code>src/pages/Admin/AdminSettings.jsx</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee empty">— Unassigned —</td></tr>

          <!-- FRONTEND PHASE 5 -->
          <tr class="phase-header-row"><td colspan="6">FRONTEND PHASE 5: UI POLISH, ACCESSIBILITY & PRODUCTION OPTIMIZATIONS</td></tr>
          <tr data-assignee="kanhiya"><td>5.1</td><td>Frontend Phase 5</td><td>Mobile Touch & Off-canvas Drawer Polish</td><td>Navbar Mobile Menu & Touch Polish</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>5.2</td><td>Frontend Phase 5</td><td>Skeleton Loading Screens & Global Toasts</td><td>Skeleton UI & Toast Notification System</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>5.3</td><td>Frontend Phase 5</td><td>SEO Meta Tags & Open Graph Social Sharer</td><td><code>index.html</code> & Dynamic Meta Tags</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>

          <!-- BACKEND SECTION HEADER -->
          <tr class="section-header-row"><td colspan="6">⚙️ BACKEND ARCHITECTURE & DATABASE (2 PHASES)</td></tr>

          <!-- BACKEND PHASE 1 -->
          <tr class="phase-header-row"><td colspan="6">BACKEND PHASE 1: CORE ARCHITECTURE, DATABASE & AUTHENTICATION (KANHIYA)</td></tr>
          <tr data-assignee="kanhiya"><td>6.1</td><td>Backend Phase 1</td><td>Express.js Server Setup & MVC Folder Structure</td><td><code>backend/server.js</code> & Controllers/Routes</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.2</td><td>Backend Phase 1</td><td>MongoDB Atlas Cloud Database Connection</td><td><code>config/db.js</code> (URI via <code>.env</code>)</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.3</td><td>Backend Phase 1</td><td>Environment Variable Setup (.env)</td><td><code>.env</code> & <code>.env.example</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.4</td><td>Backend Phase 1</td><td>Mongoose Schema - User Collection</td><td><code>models/User.js</code> (Roles & bcrypt)</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.5</td><td>Backend Phase 1</td><td>Mongoose Schema - Address Collection</td><td><code>models/Address.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.6</td><td>Backend Phase 1</td><td>Mongoose Schema - Category Collection</td><td><code>models/Category.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.7</td><td>Backend Phase 1</td><td>Mongoose Schema - Product Collection</td><td><code>models/Product.js</code> (SKU, Stock, Variants)</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.8</td><td>Backend Phase 1</td><td>Mongoose Schema - Cart & Wishlist Collections</td><td><code>models/Cart.js</code> & <code>Wishlist.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.9</td><td>Backend Phase 1</td><td>Mongoose Schema - Order Collection</td><td><code>models/Order.js</code> (Snapshots & History)</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.10</td><td>Backend Phase 1</td><td>Mongoose Schema - Payment Collection</td><td><code>models/Payment.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.11</td><td>Backend Phase 1</td><td>Mongoose Schema - Coupon Collection</td><td><code>models/Coupon.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.12</td><td>Backend Phase 1</td><td>Mongoose Schema - Review & Inquiry Collections</td><td><code>models/Review.js</code> & <code>ContactQuery.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.13</td><td>Backend Phase 1</td><td>Mongoose Schema - Banner & Settings Collections</td><td><code>models/Banner.js</code> & <code>Settings.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.14</td><td>Backend Phase 1</td><td>JWT Token Authentication & Cookie Handler</td><td><code>middleware/authMiddleware.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.15</td><td>Backend Phase 1</td><td>Role-Based Access Control (RBAC) Middleware</td><td>CUSTOMER & ADMIN Authorization Rules</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>6.16</td><td>Backend Phase 1</td><td>Security Middleware (CORS, Helmet, Rate Limit)</td><td>Helmet, CORS & Input Sanitizer</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>

          <!-- BACKEND PHASE 2 -->
          <tr class="phase-header-row"><td colspan="6">BACKEND PHASE 2: REST APIS, PAYMENT GATEWAY & DEPLOYMENT (KANHIYA)</td></tr>
          <tr data-assignee="kanhiya"><td>7.1</td><td>Backend Phase 2</td><td>Auth REST APIs (/auth/register, login, logout, me)</td><td><code>routes/authRoutes.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.2</td><td>Backend Phase 2</td><td>Customer Profile & Address REST APIs</td><td><code>routes/userRoutes.js</code> & <code>addressRoutes.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.3</td><td>Backend Phase 2</td><td>Product Catalog & Category REST APIs</td><td><code>GET /api/v1/products</code> & <code>/categories</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.4</td><td>Backend Phase 2</td><td>Wishlist & Cart REST APIs</td><td><code>POST /api/v1/cart</code> & <code>/wishlist</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.5</td><td>Backend Phase 2</td><td>Coupon Validation REST API</td><td><code>POST /api/v1/coupons/validate</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.6</td><td>Backend Phase 2</td><td>Order Creation API & Server Price Recalculation</td><td><code>POST /api/v1/orders/checkout</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.7</td><td>Backend Phase 2</td><td>Razorpay Order & Signature Verification API</td><td><code>POST /payments/razorpay/create-order</code> & <code>/verify</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.8</td><td>Backend Phase 2</td><td>Atomic Inventory Deduction & Stock Restore</td><td>Stock update on payment & cancellation</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.9</td><td>Backend Phase 2</td><td>Order Status Lifecycle Management APIs</td><td><code>PATCH /admin/orders/:id/status</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.10</td><td>Backend Phase 2</td><td>Order Cancellation Request APIs</td><td><code>POST /orders/:id/cancel-request</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.11</td><td>Backend Phase 2</td><td>Product Review & Moderation APIs</td><td><code>GET/POST /products/:id/reviews</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.12</td><td>Backend Phase 2</td><td>Cloudinary Image Upload API Service</td><td><code>services/cloudinaryService.js</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.13</td><td>Backend Phase 2</td><td>Admin Analytics Aggregation APIs</td><td><code>GET /admin/dashboard</code> & <code>/analytics</code></td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.14</td><td>Backend Phase 2</td><td>Production Deployment (Vercel + Render + Atlas)</td><td>Live Deployment & CORS setup</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>7.15</td><td>Backend Phase 2</td><td>Project README & Postman Collection</td><td>API Documentation & Setup Guide</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>

          <!-- TESTING SECTION HEADER -->
          <tr class="section-header-row"><td colspan="6">🧪 TESTING & QUALITY ASSURANCE (PHASE 8)</td></tr>

          <!-- TESTING PHASE -->
          <tr class="phase-header-row"><td colspan="6">TESTING PHASE 8: COMPREHENSIVE QA, ACCEPTANCE & SECURITY AUDIT (KANHIYA)</td></tr>
          <tr data-assignee="kanhiya"><td>8.1</td><td>Testing Phase</td><td>Auth & RBAC Manual Verification</td><td>Customer vs Admin Route Protection Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.2</td><td>Testing Phase</td><td>Storefront Product Search, Filter & Sort Test</td><td>Keyword Search, Filter & Pagination Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.3</td><td>Testing Phase</td><td>Wishlist & Cart Quantity Limit Test</td><td>Cart Persistence & Stock Limit Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.4</td><td>Testing Phase</td><td>Address Creation & PIN Code Format Test</td><td>Address Validation & Default Flag Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.5</td><td>Testing Phase</td><td>Razorpay Payment & COD Checkout Test</td><td>Payment Success/Failure & COD Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.6</td><td>Testing Phase</td><td>Order History & Tracking Timeline Test</td><td>Status Transitions (Placed -> Delivered)</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.7</td><td>Testing Phase</td><td>Coupon Expiry & Min Order Value Test</td><td>Coupon Calculation & Discount Cap Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.8</td><td>Testing Phase</td><td>Atomic Stock Deduction & Restore Test</td><td>Stock Deduction & Cancellation Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.9</td><td>Testing Phase</td><td>Cross-Device Responsive Testing</td><td>Mobile, Tablet, Laptop & Desktop Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.10</td><td>Testing Phase</td><td>Automated Unit & Integration Testing</td><td>Auth, Coupon & Payment Verification Tests</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.11</td><td>Testing Phase</td><td>Cloudinary Image Upload & Fallback Test</td><td>Media Upload & Missing Image Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.12</td><td>Testing Phase</td><td>End-to-End Live Deployment Order Flow Test</td><td>Full User Journey Acceptance Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.13</td><td>Testing Phase</td><td>Regression Testing & Performance Benchmarking</td><td>Lighthouse Audit & Performance Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.14</td><td>Testing Phase</td><td>Final Codebase Cleanup & Documentation</td><td>Project Handover & Client Sign-off</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
          <tr data-assignee="kanhiya"><td>8.15</td><td>Testing Phase</td><td>Security Audit & Rate Limiting Verification</td><td>Penetration & OWASP Compliance Test</td><td><span class="badge badge-pending">PENDING</span></td><td class="assignee">Kanhiya</td></tr>
`;

const parseNum = (s) => {
    if (!s) return 999;
    const parts = s.split('.');
    const major = parseInt(parts[0], 10) || 999;
    const minor = parseInt(parts[1], 10) || 0;
    return major * 1000 + minor;
};

const parseAndSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        let kanhiya = await User.findOne({ username: 'kanhiya' });
        if (!kanhiya) {
            kanhiya = await User.create({ name: 'Kanhiya', username: 'kanhiya', email: 'kanhiya@jigcks.com', password: 'password123', role: 'freelancer', isFirstLogin: true, avatar: '#00B894' });
        }
        let aastha = await User.findOne({ username: 'aastha' });
        if (!aastha) {
            aastha = await User.create({ name: 'Aastha', username: 'aastha', email: 'aastha@jigcks.com', password: 'password123', role: 'freelancer', isFirstLogin: true, avatar: '#E84393' });
        }
        let admin = await User.findOne({ username: 'admin' });

        let project = await Project.findOne({ title: 'Madhuri Ventures' });
        if (project) {
            await Task.deleteMany({ project: project._id });
            project.description = 'Exhaustive Master Task Checklist (110 Micro-Tasks)';
            project.client = 'Madhuri Ventures';
            project.assignDate = new Date('2026-08-01');
            project.deadline = new Date('2026-08-13');
            project.status = 'active';
            project.assignedTo = [kanhiya._id, aastha._id];
            await project.save();
        } else {
            project = await Project.create({
                title: 'Madhuri Ventures',
                description: 'Exhaustive Master Task Checklist (110 Micro-Tasks)',
                client: 'Madhuri Ventures',
                assignDate: new Date('2026-08-01'),
                deadline: new Date('2026-08-13'),
                status: 'active',
                assignedTo: [kanhiya._id, aastha._id],
                createdBy: admin._id
            });
        }

        // Split HTML lines
        const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let match;
        let currentSection = '🎨 FRONTEND ARCHITECTURE (5 PHASES)';
        let currentPhase = 'FRONTEND PHASE 1: CORE STOREFRONT UI & FOUNDATION (COMPLETED BY KANHIYA)';
        const taskDocs = [];

        while ((match = trRegex.exec(rawHtml)) !== null) {
            const trContent = match[1];
            const fullTr = match[0];

            if (fullTr.includes('class="section-header-row"')) {
                let tdText = trContent.replace(/<[^>]+>/g, '').trim();
                tdText = tdText.replace(/\s*\(\d+\s*PHASES?\)/gi, '').replace(/\s*\(PHASE\s*\d+\)/gi, '');
                if (tdText) currentSection = tdText;
            } else if (fullTr.includes('class="phase-header-row"')) {
                let tdText = trContent.replace(/<[^>]+>/g, '').trim();
                tdText = tdText.replace(/\s*\([^)]*\)/gi, '').trim();
                if (tdText) currentPhase = tdText;
            } else if (fullTr.includes('data-assignee=')) {
                const tdMatches = [...trContent.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
                if (tdMatches.length >= 6) {
                    const taskNumStr = tdMatches[0][1].replace(/<[^>]+>/g, '').trim();
                    const phaseStr = tdMatches[1][1].replace(/<[^>]+>/g, '').trim();
                    const titleStr = tdMatches[2][1].replace(/<[^>]+>/g, '').trim();
                    const fileStr = tdMatches[3][1].replace(/<[^>]+>/g, '').trim();
                    const statusHtml = tdMatches[4][1];
                    const assigneeStr = tdMatches[5][1].replace(/<[^>]+>/g, '').trim();

                    let status = 'pending';
                    if (statusHtml.includes('badge-done') || statusHtml.includes('DONE')) {
                        status = 'completed';
                    } else if (statusHtml.includes('badge-ready') || statusHtml.includes('TEMPLATE READY')) {
                        status = 'template-ready';
                    } else {
                        status = 'pending';
                    }

                    let assignedTo = null;
                    if (assigneeStr.toLowerCase().includes('kanhiya')) {
                        assignedTo = kanhiya._id;
                    } else if (assigneeStr.toLowerCase().includes('aastha')) {
                        assignedTo = aastha._id;
                    }

                    taskDocs.push({
                        taskNumber: taskNumStr,
                        section: currentSection,
                        phase: currentPhase,
                        title: titleStr,
                        componentFile: fileStr,
                        project: project._id,
                        assignedTo: assignedTo,
                        status: status,
                        priority: 'medium',
                        completedAt: status === 'completed' ? new Date() : null
                    });
                }
            }
        }

        if (taskDocs.length > 110) {
            taskDocs.length = 110;
        }

        await Task.insertMany(taskDocs);
        console.log(`SUCCESSFULLY PARSED & SEEDED EXACTLY ${taskDocs.length} TASKS IN ORDER!`);
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
};

parseAndSeed();
