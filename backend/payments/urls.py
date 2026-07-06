from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_payment, name='create-payment'),
    path('<int:payment_id>/status/', views.payment_status, name='payment-status'),
    path('<int:payment_id>/simulate/', views.simulate_payment, name='simulate-payment'),
    path('order/<int:order_id>/', views.order_payments, name='order-payments'),
]