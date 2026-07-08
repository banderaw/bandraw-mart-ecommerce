from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'order', 'order_number', 'user', 'amount', 'payment_method', 
                 'status', 'transaction_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'order', 'order_number', 'user', 'amount', 'payment_method',
                            'status', 'transaction_id', 'created_at', 'updated_at']

class CreatePaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField(required=True)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHODS)
