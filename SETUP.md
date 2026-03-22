# Ethnic Luxury Backend Setup

Follow these steps to enable product management with a real database.

## 1) Prerequisites
- Node.js 18+
- A MongoDB connection (MongoDB Atlas recommended)

## 2) Install Dependencies
From the project folder:
```
npm install
```

## 3) Configure Environment
1. Copy `.env.example` to `.env`
2. Fill the values:
   - `MONGODB_URI`: Your MongoDB connection string  
     Example: `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ethnicluxury`
   - `ADMIN_PASSWORD`: Password to log in to the admin panel
   - `ADMIN_TOKEN`: Any random secret; sent in the `x-admin-token` header for admin requests
   - `PORT`: Optional, default `3000`

## 4) Start the Server
```
npm start
```
Open:
- Site: http://localhost:3000/
- Admin: http://localhost:3000/admin

## 5) Using the Admin Panel
1. Enter your `ADMIN_PASSWORD` to log in
2. Add or edit products using the form:
   - Upload an image file or paste an `image_url`
3. All changes reflect on the site automatically

## 6) Without a Database
If `MONGODB_URI` is not set, the server uses an in-memory store (changes reset on restart).  
You can still test the full flow, including uploads and admin actions.

## 7) API Overview
- `GET /api/products?type=&region=&q=&minPrice=&maxPrice=`  
- `GET /api/products/:id`  
- `POST /api/login` `{ password }` → `{ token }`  
- `POST /api/products` (admin, multipart)  
- `PUT /api/products/:id` (admin, multipart)  
- `DELETE /api/products/:id` (admin)  
- `GET /api/faqs`  
- `POST /api/faqs` (admin), `PUT /api/faqs/:id` (admin), `DELETE /api/faqs/:id` (admin)  
- `GET /api/testimonials`  
- `POST /api/testimonials` (admin), `PUT /api/testimonials/:id` (admin), `DELETE /api/testimonials/:id` (admin)  
- `POST /api/members` (public) to subscribe with `{ email }`  
- `GET /api/members` (admin), `PUT /api/members/:id` (admin), `DELETE /api/members/:id` (admin)  
- `GET /api/members/export` (admin) → CSV

For admin routes, include header: `x-admin-token: ADMIN_TOKEN`.

## 8) Database Notes
- MongoDB collections for products, faqs, testimonials, and members are created automatically on first insert.
- If `MONGODB_URI` is empty or unreachable, the server uses an in-memory fallback for all collections so you can test quickly.
