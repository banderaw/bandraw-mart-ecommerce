

# 🛒 Bandraw Mart - E-Commerce Website

A full e-commerce website built with Django and React.

##  What This Project Does

This is a complete online store where users can:
- Create accounts and login
- Browse products
- Add items to cart
- Save products to wishlist
- Place orders
- View order history
- Update profile

## 🛠️ Technologies Used

**Backend:**
- Django
- Django REST Framework
- JWT for authentication
- SQLite database

**Frontend:**
- React
- Tailwind CSS
- React Router for navigation
- Axios for API calls

## 🚀 How to Run

### Step 1: Run Backend

Open terminal in `backend` folder:

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# OR
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend will run at: `http://127.0.0.1:8000`

### Step 2: Run Frontend

Open a new terminal in `frontend` folder:

```bash
cd frontend
npm install
npm start
```

Frontend will run at: `http://localhost:3000`

### Step 3: Admin Panel

Go to: `http://127.0.0.1:8000/admin`
Login with the superuser account you created.

## 📁 Project Structure

```
backend/
├── accounts/          # Login, Register, Profile
├── products/          # Products and Categories
├── carts/            # Shopping Cart
├── orders/           # Orders and Checkout
├── payments/         # Payment Tracking
└── config/           # Django Settings

frontend/
├── src/
│   ├── components/   # All React Components
│   ├── pages/        # Pages (Home, Products, Cart)
│   ├── contexts/     # Global State
│   └── services/     # API Calls
└── public/           # Static Files
```

## 🔑 Default Admin

After running `createsuperuser`, use:
- Username: admin
- Password: admin123

## 📱 Features

- ✅ User Registration & Login
- ✅ Product Listing with Search
- ✅ Category Filter
- ✅ Add to Cart
- ✅ Wishlist
- ✅ Checkout
- ✅ Order History
- ✅ Profile Update

## 👨‍💻 Developer

Bandraw Mart


## 💡 Note 

After cloning, they should:
1. Delete the existing `db.sqlite3` file (if any)
2. Run migrations to create their own database
3. Create their own superuser
4. Run both backend and frontend

---

*Made with  by Bandraw Mart*