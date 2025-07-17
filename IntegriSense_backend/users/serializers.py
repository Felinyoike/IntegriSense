from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TherapistProfile

class TherapistRegisterSerializer(serializers.ModelSerializer):
    license_id = serializers.CharField()
    organization = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # ✅ This must be User, not TherapistProfile
        fields = ('username', 'email', 'password', 'license_id', 'organization')

    def create(self, validated_data):
        license_id = validated_data.pop('license_id')
        organization = validated_data.pop('organization', '')

        # ✅ Create the User
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # ✅ Create the TherapistProfile
        TherapistProfile.objects.create(
            user=user,
            license_id=license_id,
            organization=organization
        )

        return user  # ✅ Must return a User instance for JWT to work
