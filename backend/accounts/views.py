from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer
from .models import Profile

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Get or create profile
            profile, created = Profile.objects.get_or_create(user=request.user)
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        try:
            user = request.user
            
            # Update user fields
            user.first_name = request.data.get('first_name', user.first_name)
            user.last_name = request.data.get('last_name', user.last_name)
            user.email = request.data.get('email', user.email)
            user.save()
            
            # Update profile
            profile, created = Profile.objects.get_or_create(user=user)
            profile_data = request.data.get('profile', {})
            
            if profile_data:
                profile.phone = profile_data.get('phone', profile.phone or '')
                profile.address = profile_data.get('address', profile.address or '')
                profile.city = profile_data.get('city', profile.city or '')
                profile.country = profile_data.get('country', profile.country or 'Ethiopia')
                profile.save()
            
            # Return updated user data
            serializer = UserSerializer(user)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )