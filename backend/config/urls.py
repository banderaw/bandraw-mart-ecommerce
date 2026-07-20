from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

# ===== ROOT VIEW =====
def home(request):
    return HttpResponse("""
    <h1>🚀 Bandraw Mart API</h1>
    <p>Welcome to Bandraw Mart Backend!</p>
    <hr>
    <h3>📋 Available Endpoints:</h3>
    <ul>
        <li><a href="/admin/">/admin/</a> - Admin Panel</li>
        <li><a href="/api/products/">/api/products/</a> - Products List</li>
        <li><a href="/api/products/categories/">/api/products/categories/</a> - Categories</li>
        <li><a href="/api/auth/login/">/api/auth/login/</a> - Login</li>
        <li><a href="/api/auth/register/">/api/auth/register/</a> - Register</li>
    </ul>
    <p style="color: gray; font-size: 12px;">Bandraw Mart E-Commerce API</p>
    """)

# ===== URL PATTERNS =====
urlpatterns = [
    path('', home),  # ← ROOT ROUTE - FIXES 400 ERROR
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/cart/', include('carts.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
]

# ===== MEDIA FILES (Development) =====
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)