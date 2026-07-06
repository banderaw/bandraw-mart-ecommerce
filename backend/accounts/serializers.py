from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'phone', 'address', 'city', 'country', 'profile_picture']
        read_only_fields = ['id']

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
        
        # Create profile
        Profile.objects.create(
            user=user,
            phone=profile_data.get('phone', ''),
            address=profile_data.get('address', ''),
            city=profile_data.get('city', ''),
            country=profile_data.get('country', 'Ethiopia')
        )
        
        return user