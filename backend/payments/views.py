from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from .models import Payment
from .serializers import PaymentSerializer, CreatePaymentSerializer
from orders.models import Order
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):
    """Create a payment record"""
    serializer = CreatePaymentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        order = Order.objects.get(id=serializer.validated_data['order_id'], user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # For COD, approve immediately
    payment_method = serializer.validated_data['payment_method']
    status_ = 'pending'
    
    if payment_method == 'cod':
        status_ = 'success'
        order.payment_status = 'paid'
        order.save()
    
    payment = Payment.objects.create(
        order=order,
        user=request.user,
        amount=order.total_amount,
        payment_method=payment_method,
        status=status_,
        transaction_id=f"TXN-{uuid.uuid4().hex[:8].upper()}"
    )
    
    payment_serializer = PaymentSerializer(payment)
    return Response(payment_serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_status(request, payment_id):
    """Get payment status"""
    try:
        payment = Payment.objects.get(id=payment_id, user=request.user)
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PaymentSerializer(payment)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_payments(request, order_id):
    """Get payments for an order"""
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    payments = Payment.objects.filter(order=order)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simulate_payment(request, payment_id):
    """Simulate successful payment (for testing)"""
    if not settings.DEBUG and not request.user.is_staff:
        return Response({'error': 'Payment simulation is disabled.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        payment = Payment.objects.get(id=payment_id, user=request.user)
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if payment.status != 'pending':
        return Response({'error': 'Payment already processed'}, status=status.HTTP_400_BAD_REQUEST)
    
    payment.status = 'success'
    payment.save()
    
    order = payment.order
    order.payment_status = 'paid'
    order.save()
    
    serializer = PaymentSerializer(payment)
    return Response(serializer.data)
