from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'user', 'amount', 'payment_method', 'status', 'created_at']
    list_filter = ['payment_method', 'status']
    search_fields = ['order__order_number', 'user__username', 'transaction_id']