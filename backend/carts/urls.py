from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_cart, name='cart'),
    path('add/', views.add_to_cart, name='add-to-cart'),
    path('update/', views.update_cart_item, name='update-cart'),
    path('remove/', views.remove_from_cart, name='remove-from-cart'),
    path('clear/', views.clear_cart, name='clear-cart'),
]