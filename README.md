# Bandraw Mart - E-Commerce Website

A full e-commerce website built with Django REST Framework and React.

## What This Project Does

This is an online store where users can:

- Create accounts and log in
- Browse products
- Add items to cart
- Save products to wishlist
- Place orders
- View order history
- Update their profile

## Technologies Used

Backend:

- Django
- Django REST Framework
- Simple JWT authentication
- SQLite for local development

Frontend:

- React
- Tailwind CSS
- React Router
- Axios

## How to Run

### Step 1: Run Backend

Open a terminal in the `backend` folder:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend will run at `http://127.0.0.1:8000`.

For Mac/Linux, use:

```bash
source venv/bin/activate
cp .env.example .env
```

### Step 2: Run Frontend

Open a new terminal in the `frontend` folder:

```bash
cd frontend
npm install
copy .env.example .env
npm start
```

Frontend will run at `http://localhost:3000`.

### Step 3: Admin Panel

Go to `http://127.0.0.1:8000/admin` and log in with the superuser account you created.

## Security Added

- Django secret key, debug mode, allowed hosts, CORS, and secure cookie settings are configured with environment variables.
- CORS and allowed hosts are no longer open to every domain by default.
- JWT access tokens expire faster, refresh tokens rotate, and old refresh tokens are blacklisted.
- API throttling is enabled for anonymous and authenticated users.
- Profile, cart, checkout, and payment inputs are validated before saving.
- Checkout locks cart and product rows during stock updates to reduce overselling.
- Test payment simulation is blocked in production unless the user is staff.
- Logout blacklists refresh tokens on the server before clearing browser tokens.
- Internal exception messages are no longer returned from the profile API.

## Project Structure

```text
backend/
  accounts/      Login, register, and profile APIs
  products/      Products and categories
  carts/         Shopping cart
  orders/        Orders and checkout
  payments/      Payment tracking
  config/        Django settings and URLs

frontend/
  src/
    components/  React components
    pages/       Page views
    contexts/    Global state
    services/    API calls
  public/        Static files
```

## Deployment Notes

Before deploying:

1. Set a strong `DJANGO_SECRET_KEY`.
2. Set `DJANGO_DEBUG=False`.
3. Set `DJANGO_ALLOWED_HOSTS` to your real domain names.
4. Set `CORS_ALLOWED_ORIGINS` to your frontend domain.
5. Enable secure cookies and HTTPS settings.
6. Use a production database such as PostgreSQL.
7. Do not commit `.env`, `db.sqlite3`, uploaded media, or admin credentials.

## Developer

Bandraw Mart
