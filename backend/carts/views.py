from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import AddToCartSerializer, CartSerializer, RemoveCartItemSerializer, UpdateCartItemSerializer
from products.models import Product

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    """Get user's cart"""
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """Add product to cart"""
    input_serializer = AddToCartSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)
    product_id = input_serializer.validated_data['product_id']
    quantity = input_serializer.validated_data['quantity']
    
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if product.stock < quantity:
        return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
    
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    
    if not created:
        if cart_item.quantity + quantity > product.stock:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity
    cart_item.save()
    
    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request):
    """Update quantity of cart item"""
    input_serializer = UpdateCartItemSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)
    cart_item_id = input_serializer.validated_data['cart_item_id']
    quantity = input_serializer.validated_data['quantity']
    
    try:
        cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user)
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if quantity <= 0:
        cart_item.delete()
        message = 'Item removed from cart'
    else:
        if quantity > cart_item.product.stock:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
        cart_item.quantity = quantity
        cart_item.save()
        message = 'Cart updated'
    
    cart = Cart.objects.get(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    """Remove item from cart"""
    input_serializer = RemoveCartItemSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)
    cart_item_id = input_serializer.validated_data['cart_item_id']
    
    try:
        cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user)
        cart_item.delete()
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    cart = Cart.objects.get(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    """Clear all items from cart"""
    cart = Cart.objects.get(user=request.user)
    cart.items.all().delete()
    serializer = CartSerializer(cart)
    return Response(serializer.data)
