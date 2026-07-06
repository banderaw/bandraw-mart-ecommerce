from django.db import models
from django.contrib.auth.models import User
from orders.models import Order

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('cod', 'Cash on Delivery'),
        ('bank', 'Bank Transfer'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment {self.id} - Order {self.order.order_number}"