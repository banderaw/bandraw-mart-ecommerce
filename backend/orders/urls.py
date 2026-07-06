from django.urls import path
from . import views

urlpatterns = [
    path('checkout/', views.checkout, name='checkout'),
    path('my-orders/', views.my_orders, name='my-orders'),
    path('<int:order_id>/', views.order_detail, name='order-detail'),
    path('<int:order_id>/cancel/', views.cancel_order, name='cancel-order'),
]