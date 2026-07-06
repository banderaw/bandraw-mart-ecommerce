from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductListView(generics.ListAPIView):
    """
    List all active products with search and category filter
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Get query parameters
        search = self.request.query_params.get('search', '')
        category = self.request.query_params.get('category', '')
        
        # Apply search filter
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )
        
        # Apply category filter
        if category:
            queryset = queryset.filter(category_id=category)
        
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    """
    Get single product by ID
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class CategoryListView(generics.ListAPIView):
    """
    List all categories with product count
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class CategoryDetailView(generics.RetrieveAPIView):
    """
    Get single category by ID
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]