# Bandraw Mart Functionality Guide

This file explains what each part of the project does, which files handle it, how data is captured in the frontend, how it is sent to the backend, how the backend validates/evaluates it, how it is stored, and how it is retrieved.

## Session and URL Protection

Private frontend URLs are protected in `frontend/src/App.js`.

Protected URLs:

- `/cart`
- `/checkout`
- `/orders`
- `/profile`
- `/wishlist`

How it works:

1. `ProtectedRoute` in `frontend/src/App.js` reads `isAuth` and `loading` from `useAuth()`.
2. `AuthProvider` in `frontend/src/contexts/AuthContext.jsx` runs `checkAuth()` when the app loads.
3. `checkAuth()` calls `getProfile()` from `frontend/src/services/authService.js`.
4. `getProfile()` sends `GET /api/auth/profile/`.
5. `frontend/src/services/api.js` adds `Authorization: Bearer <access_token>` from `localStorage`.
6. The backend `ProfileView` in `backend/accounts/views.py` requires `permissions.IsAuthenticated`.
7. If the token is valid, the page opens. If not, `ProtectedRoute` redirects the user to `/login`.

Backend session/security support:

- JWT authentication is configured in `backend/config/settings.py` under `REST_FRAMEWORK`.
- JWT refresh rotation and blacklist are configured in `SIMPLE_JWT`.
- Logout is handled by `LogoutView` in `backend/accounts/views.py`, which blacklists the refresh token.
- The logout URL is registered in `backend/accounts/urls.py` as `/api/auth/logout/`.

## Shared API Client

File: `frontend/src/services/api.js`

How it works:

1. The base API URL comes from `REACT_APP_API_URL`, with fallback `http://127.0.0.1:8000/api`.
2. Every request passes through the Axios request interceptor.
3. If `access_token` exists in `localStorage`, the interceptor adds it as a Bearer token.
4. If the backend returns `401`, the response interceptor removes stored tokens and redirects to `/login`.

This file is used by:

- `frontend/src/services/authService.js`
- `frontend/src/services/productService.js`
- `frontend/src/services/cartService.js`
- `frontend/src/services/orderService.js`

## User Registration

Frontend files:

- `frontend/src/components/auth/Register.jsx`
- `frontend/src/services/authService.js`

Backend files:

- `backend/accounts/urls.py`
- `backend/accounts/views.py`
- `backend/accounts/serializers.py`
- `backend/accounts/models.py`

Flow:

1. The register form captures username, email, password, password confirmation, name, and optional profile fields.
2. `register(userData)` in `authService.js` sends `POST /api/auth/register/`.
3. `RegisterView` in `accounts/views.py` receives the request.
4. `RegisterSerializer` in `accounts/serializers.py` validates password strength, matching passwords, and duplicate email.
5. The serializer creates a Django `User`.
6. `backend/accounts/models.py` automatically creates a related `Profile` through the `post_save` signal.
7. The serializer updates that profile with phone, address, city, and country.
8. The user is stored in Django's auth user table, and profile data is stored in the `Profile` table.

Retrieval:

- User/profile data is retrieved through `GET /api/auth/profile/`.
- `ProfileView.get()` returns `UserSerializer`, which includes nested `ProfileSerializer`.

## Login and Logout

Frontend files:

- `frontend/src/components/auth/Login.jsx`
- `frontend/src/services/authService.js`
- `frontend/src/contexts/AuthContext.jsx`

Backend files:

- `backend/accounts/urls.py`
- `backend/accounts/views.py`
- `backend/config/settings.py`

Login flow:

1. The login form captures username and password.
2. `login(credentials)` sends `POST /api/auth/login/`.
3. `TokenObtainPairView` from Simple JWT validates the credentials.
4. The backend returns `access` and `refresh` tokens.
5. `authService.js` stores both tokens in `localStorage`.
6. `AuthContext.jsx` calls `getProfile()` and marks the user as authenticated.

Logout flow:

1. `logout()` in `AuthContext.jsx` calls `logoutService()`.
2. `logoutService()` sends the refresh token to `POST /api/auth/logout/`.
3. `LogoutView` blacklists the refresh token.
4. The frontend removes `access_token` and `refresh_token` from `localStorage`.
5. Private routes become inaccessible.

## Profile

Frontend files:

- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/services/authService.js`

Backend files:

- `backend/accounts/views.py`
- `backend/accounts/serializers.py`
- `backend/accounts/models.py`

Flow:

1. The profile page loads user data through `getProfile()`.
2. `getProfile()` sends `GET /api/auth/profile/`.
3. `ProfileView.get()` creates a profile if missing and serializes the current user.
4. Profile updates are sent to `PUT /api/auth/profile/`.
5. `ProfileView.put()` updates user fields and validates profile fields with `ProfileSerializer`.
6. User data is stored in Django's auth user table.
7. Extra fields are stored in the `Profile` table.

Retrieval:

- `UserSerializer` returns `id`, `username`, `email`, `first_name`, `last_name`, and nested `profile`.

## Products and Categories

Frontend files:

- `frontend/src/pages/ProductsPage.jsx`
- `frontend/src/components/products/ProductCard.jsx`
- `frontend/src/components/products/ProductDetail.jsx`
- `frontend/src/services/productService.js`

Backend files:

- `backend/products/urls.py`
- `backend/products/views.py`
- `backend/products/serializers.py`
- `backend/products/models.py`

Product storage:

- `Product` model stores name, slug, description, price, discount price, stock, category, image, and active status.
- `Category` model stores name, slug, and description.
- Slugs are generated in each model's `save()` method.

Product list retrieval:

1. `getProducts(search)` sends `GET /api/products/` or `GET /api/products/?search=value`.
2. `ProductListView` in `products/views.py` returns active products only.
3. If `search` exists, it filters by product name, description, or category name.
4. `ProductSerializer` returns product fields and computed `final_price`.

Product detail retrieval:

1. `getProduct(id)` sends `GET /api/products/<id>/`.
2. `ProductDetailView` retrieves one active product.
3. The frontend displays the product and can add it to cart or wishlist.

Category retrieval:

1. `getCategories()` sends `GET /api/products/categories/`.
2. `CategoryListView` returns categories.
3. `CategorySerializer` adds `product_count` by counting active products in each category.

## Cart

Frontend files:

- `frontend/src/pages/CartPage.jsx`
- `frontend/src/components/cart/CartItem.jsx`
- `frontend/src/contexts/CartContext.jsx`
- `frontend/src/services/cartService.js`

Backend files:

- `backend/carts/urls.py`
- `backend/carts/views.py`
- `backend/carts/serializers.py`
- `backend/carts/models.py`

Cart storage:

- `Cart` is linked one-to-one with a user.
- `CartItem` stores cart, product, quantity, and added date.
- `Cart.total_items` and `Cart.total_price` are calculated from related cart items.

Add to cart flow:

1. Product UI calls `addItem(productId, quantity)` from `CartContext.jsx`.
2. `addItem()` calls `addToCart()` in `cartService.js`.
3. `cartService.js` sends `POST /api/cart/add/` with `product_id` and `quantity`.
4. `add_to_cart()` in `carts/views.py` requires `IsAuthenticated`.
5. `AddToCartSerializer` validates `product_id` and quantity limits.
6. The backend checks that the product exists and is active.
7. The backend checks stock before creating or updating `CartItem`.
8. The updated cart is serialized with `CartSerializer` and returned to the frontend.

Update cart flow:

1. The cart page calls `updateItem(cartItemId, quantity)`.
2. `cartService.js` sends `PUT /api/cart/update/`.
3. `UpdateCartItemSerializer` validates the cart item ID and quantity.
4. The backend only updates an item where `cart__user=request.user`.
5. If quantity is `0`, the item is deleted.
6. Otherwise stock is checked and the item quantity is saved.

Remove and clear flow:

- Remove one item: `DELETE /api/cart/remove/` with `cart_item_id`.
- Clear all items: `DELETE /api/cart/clear/`.
- Both endpoints require the logged-in user and only affect that user's cart.

Cart retrieval:

1. `CartContext.jsx` calls `fetchCart()` when `isAuth` becomes true.
2. `fetchCart()` calls `GET /api/cart/`.
3. `get_cart()` creates a cart if missing and returns `CartSerializer`.

## Checkout and Orders

Frontend files:

- `frontend/src/pages/CheckoutPage.jsx`
- `frontend/src/pages/OrderHistoryPage.jsx`
- `frontend/src/services/orderService.js`
- `frontend/src/contexts/CartContext.jsx`

Backend files:

- `backend/orders/urls.py`
- `backend/orders/views.py`
- `backend/orders/serializers.py`
- `backend/orders/models.py`

Checkout capture:

1. `CheckoutPage.jsx` captures `shipping_address`, `phone`, and optional `notes`.
2. The page checks that address and phone are not empty.
3. `checkout(orderData)` in `orderService.js` sends `POST /api/orders/checkout/`.
4. The shared API client adds the JWT token.

Checkout evaluation:

1. `checkout()` in `orders/views.py` requires `IsAuthenticated`.
2. `CreateOrderSerializer` validates address, phone, and notes length.
3. The backend gets the logged-in user's cart.
4. It rejects checkout if the cart is empty.
5. It locks cart items and product rows with `select_for_update()` inside `transaction.atomic`.
6. It checks product stock.
7. It calculates subtotal, 15% tax, shipping, and total.

Checkout storage:

1. The backend creates an `Order`.
2. The `Order.save()` method generates `order_number`.
3. For each cart item, the backend creates an `OrderItem`.
4. Product stock is reduced.
5. Cart items are deleted after the order is created.
6. The order is stored in the `Order` table, and items are stored in the `OrderItem` table.

Order retrieval:

1. `OrderHistoryPage.jsx` calls `getMyOrders()`.
2. `getMyOrders()` sends `GET /api/orders/my-orders/`.
3. `my_orders()` in `orders/views.py` filters orders by `user=request.user`.
4. `OrderSerializer` returns order details, item details, status, total, shipping address, and phone.

Order detail and cancel:

- `GET /api/orders/<order_id>/` returns one order owned by the logged-in user.
- `PUT /api/orders/<order_id>/cancel/` cancels only pending or processing orders and restores product stock.

## Payments

Frontend status:

- Backend payment APIs exist.
- The current visible checkout page creates the order but does not yet call payment creation.

Backend files:

- `backend/payments/urls.py`
- `backend/payments/views.py`
- `backend/payments/serializers.py`
- `backend/payments/models.py`

Payment create flow:

1. A client sends `POST /api/payments/create/` with `order_id` and `payment_method`.
2. `CreatePaymentSerializer` validates the order ID and payment method.
3. `create_payment()` confirms the order belongs to `request.user`.
4. The backend creates a `Payment` with amount copied from the order.
5. A transaction ID is generated with `uuid`.
6. If method is `cod`, payment is marked `success` and the order payment status becomes `paid`.

Payment retrieval:

- `GET /api/payments/<payment_id>/status/` returns one payment owned by the user.
- `GET /api/payments/order/<order_id>/` returns all payments for an order owned by the user.

Payment simulation:

- `POST /api/payments/<payment_id>/simulate/` is for testing.
- In production, `simulate_payment()` blocks non-staff users.

## Wishlist

Frontend files:

- `frontend/src/pages/WishlistPage.jsx`
- `frontend/src/contexts/WishlistContext.jsx`
- `frontend/src/components/products/ProductCard.jsx`

Storage:

- Wishlist is currently frontend-only.
- Product IDs are stored in browser `localStorage` under the `wishlist` key.

Flow:

1. `WishlistProvider` checks `isAuth` from `AuthContext`.
2. If logged in, it loads product IDs from `localStorage`.
3. `toggleWishlist(productId)` adds or removes the product ID.
4. `saveWishlist(items)` writes the updated list back to `localStorage`.
5. If the user logs out, wishlist state is cleared from React state.

Important note:

- Wishlist is not stored in the Django database yet. To make it database-backed, add a backend `Wishlist` model, serializer, views, and URLs similar to the cart feature.

## Admin and Database Management

Backend files:

- `backend/products/admin.py`
- `backend/carts/admin.py`
- `backend/orders/admin.py`
- `backend/payments/admin.py`
- `backend/accounts/admin.py`

How data is managed:

- Admin users log in at `/admin/`.
- Django admin can manage models that are registered in each app's `admin.py`.
- Database tables are defined by each app's `models.py`.
- Migrations live in each app's `migrations/` folder.

## Security Settings

File: `backend/config/settings.py`

Added security controls:

- `DJANGO_SECRET_KEY` from environment
- `DJANGO_DEBUG` from environment
- `DJANGO_ALLOWED_HOSTS` from environment
- CORS origins from environment
- JWT access token lifetime set to 30 minutes
- Refresh token rotation enabled
- Refresh token blacklist enabled
- API throttling enabled
- Secure cookie and HSTS options available for production
- `X_FRAME_OPTIONS = 'DENY'`
- `SECURE_CONTENT_TYPE_NOSNIFF = True`

Example config files:

- `backend/.env.example`
- `frontend/.env.example`

## Main API Routes

Authentication:

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `POST /api/auth/refresh/`
- `GET /api/auth/profile/`
- `PUT /api/auth/profile/`

Products:

- `GET /api/products/`
- `GET /api/products/?search=value`
- `GET /api/products/<id>/`
- `GET /api/products/categories/`
- `GET /api/products/categories/<id>/`

Cart:

- `GET /api/cart/`
- `POST /api/cart/add/`
- `PUT /api/cart/update/`
- `DELETE /api/cart/remove/`
- `DELETE /api/cart/clear/`

Orders:

- `POST /api/orders/checkout/`
- `GET /api/orders/my-orders/`
- `GET /api/orders/<order_id>/`
- `PUT /api/orders/<order_id>/cancel/`

Payments:

- `POST /api/payments/create/`
- `GET /api/payments/<payment_id>/status/`
- `POST /api/payments/<payment_id>/simulate/`
- `GET /api/payments/order/<order_id>/`
