from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from carts.models import Cart
from decimal import Decimal 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def checkout(request):
    """Convert cart to order"""
    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    
    cart_items = cart.items.all()
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check stock
    for item in cart_items:
        if item.product.stock < item.quantity:
            return Response({
                'error': f'Not enough stock for {item.product.name}. Available: {item.product.stock}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Calculate totals
    subtotal = cart.total_price
    shipping = 0
    

    tax = subtotal * Decimal('0.15')  # 15% tax
    total = subtotal + shipping + tax
    
    # Create order
    data = serializer.validated_data
    order = Order.objects.create(
        user=request.user,
        total_amount=total,
        shipping_cost=shipping,
        tax=tax,
        shipping_address=data['shipping_address'],
        billing_address=data.get('billing_address', data['shipping_address']),
        phone=data['phone'],
        notes=data.get('notes', '')
    )
    
    # Create order items and update stock
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.final_price
        )
        # Reduce stock
        item.product.stock -= item.quantity
        item.product.save()
    
    # Clear cart
    cart_items.delete()
    
    order_serializer = OrderSerializer(order)
    return Response(order_serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    """Get user's orders"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    """Get single order detail"""
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = OrderSerializer(order)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    """Cancel an order"""
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if order.status not in ['pending', 'processing']:
        return Response({'error': 'This order cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Restore stock
    for item in order.items.all():
        item.product.stock += item.quantity
        item.product.save()
    
    order.status = 'cancelled'
    order.save()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data)