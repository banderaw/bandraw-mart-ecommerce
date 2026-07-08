from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'phone', 'address', 'city', 'country', 'profile_picture']
        read_only_fields = ['id']
        extra_kwargs = {
            'phone': {'max_length': 15, 'allow_blank': True},
            'address': {'max_length': 500, 'allow_blank': True},
            'city': {'max_length': 100, 'allow_blank': True},
            'country': {'max_length': 100, 'allow_blank': True},
        }

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)  # Make it read-only
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id', 'username']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    profile = ProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'profile']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        email = attrs.get('email')
        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        return attrs
    
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        validated_data.pop('password2')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        
        profile, created = Profile.objects.get_or_create(user=user)
        profile.phone = profile_data.get('phone', '')
        profile.address = profile_data.get('address', '')
        profile.city = profile_data.get('city', '')
        profile.country = profile_data.get('country', 'Ethiopia')
        profile.save()
        
        return user
