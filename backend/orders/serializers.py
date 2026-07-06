from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'username', 'user_email', 'total_amount',
                 'shipping_cost', 'tax', 'status', 'payment_status', 'shipping_address',
                 'billing_address', 'phone', 'notes', 'items', 'created_at', 'updated_at']
        read_only_fields = ['user', 'order_number', 'total_amount']

class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(required=True)
    billing_address = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)