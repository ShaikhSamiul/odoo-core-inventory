# 📦 Core Inventory Management System (IMS)

Core Inventory is a modern, enterprise-grade Inventory Management System built with the MERN stack. Designed to replace manual registers and spreadsheets, it digitizes stock-related operations, providing a centralized, real-time, and highly intuitive application. 

The UI/UX is heavily inspired by modern ERP systems (like Odoo), moving away from clunky pop-ups in favor of seamless **List-to-Sheet document views**, visual status pipelines, and dynamic stock ledger math.

---

## ✨ System Architecture & UI Philosophy

### The "Sheet" Layout
Instead of basic modals, Core Inventory utilizes a professional ERP Document Sheet architecture:
* **List View:** A clean, segmented data table displaying all active operations.
* **Form View (The Sheet):** Clicking an operation replaces the screen with a detailed document. This includes top-left action buttons (Validate, Draft), a top-right visual Status Pipeline (`Draft > Waiting > Ready > Done`), primary fields, and a dynamic sub-table for product line items.

### Custom Design System
* **Segmented Tabs:** Smooth, inline pill-shaped tab controls for switching between Receipts, Deliveries, and Adjustments.
* **Modern Pill Buttons:** Custom-built primary (`btnBlue`), secondary (`btnWhite`), and draft (`btnDark`) actions with smooth hover lifts and drop shadows.
* **Scoped CSS:** Built strictly using React CSS Modules (`.module.css`) to ensure styles never leak across components.

---

## 🚀 Key Features & Modules

### 1. 📊 Dashboard & KPIs
* **Real-time Metrics:** Snapshot of Total Products, Low/Out of Stock items, and scheduled movements.
* **Smart Filters:** Filter operations by Document Type, Status, Warehouse, and Category.

### 2. 🛍️ Master Product Catalog
* **Product Details:** Manage items with Name, SKU, Category, and Unit of Measure (UOM).
* **Live Stock Tracking:** Real-time stock availability tracking that updates instantly based on ledger validations.
* **Reordering Rules:** Set minimum thresholds to trigger low-stock alerts.

### 3. 🔄 Operations (The Dynamic Ledger)
The core engine of the app. It tracks where stock comes from, where it goes, and calculates the math safely on the backend.
* **Smart Sequence IDs:** The backend automatically generates and assigns readable, sequential IDs based on the operation type (e.g., `WH/IN/0001` for Receipts, `WH/OUT/0002` for Deliveries).
* **Receipts (Incoming):** Receive goods from vendors. Validating a receipt automatically *increases* product stock.
* **Delivery Orders (Outgoing):** Ship products to customers. Validating a delivery automatically *deducts* from product stock. Prevents delivery if stock is insufficient.
* **Inventory Adjustments:** Fix discrepancies between recorded stock and physical counts by hard-setting the correct quantity.
* **Demand vs. Done:** Line items track both the requested quantity (`Demand`) and the actual processed quantity (`Done`). Only the `Done` quantity affects the final stock math.

### 4. 🔐 Security & Roles
* Secure Login / Signup for Warehouse Staff and Inventory Managers.
* OTP-based password recovery flow.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router DOM, CSS Modules, Lucide React (Icons).
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **HTTP Client:** Axios
* **Otp:** NodeMailer

---
💻 Installation & Local Setup
Prerequisites
Node.js (v16+ recommended)

MongoDB (Local instance or MongoDB Atlas URI)

1. Clone the repository
```
bash
git clone https://github.com/ShaikhSamiul/odoo-core-inventory.git
```
```
cd core-inventory
```
2. Backend Setup
Open a terminal and navigate to the backend folder:
```
bash
cd backend
npm install
```
Create a .env file in the backend directory:

Code snippet
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Start the backend server:
```
bash
npm run dev
```
# Server should log: "Server running on port 5000"
3. Frontend Setup
Open a new terminal window and navigate to the frontend folder:
```
bash
cd frontend
npm install
```
Start the frontend development server:
```
bash
npm run dev
```
# App will typically run on http://localhost:5173
🔌 Core API Endpoints
Operations /api/operations
GET / - Fetches all ledger movements, populating the nested items.product data.

POST / - Creates a new document. Crucial: If status is set to Done, the backend controller automatically loops through the items array, applies the Done quantities to the Product collection, and generates the operationId.

Products /api/products
GET / - Fetches all products and their current stock levels.

POST / - Adds a new product to the master catalog.

👥 Target Audience
Inventory Managers: Oversee the ledger, manage incoming/outgoing stock, monitor low-stock KPIs, and perform manual adjustments.

Warehouse Staff: Perform day-to-day physical operations like picking, packing, receiving vendor shipments, and physical counting.


## 📂 Project Structure

```text
core-inventory/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Business logic & stock math (operationController.js)
│   ├── models/           # Mongoose schemas (Product.js, Operation.js)
│   ├── routes/           # API routes (/api/operations, /api/products)
│   ├── .env              # Backend environment variables
│   └── server.js         # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI (Sidebar, Layout)
    │   ├── pages/        # Main views (Dashboard, Products, Operations.jsx)
    │   ├── App.jsx       # Routing logic
    │   └── index.css     # Global styles & Tailwind resets
    ├── package.json
    └── vite.config.js


