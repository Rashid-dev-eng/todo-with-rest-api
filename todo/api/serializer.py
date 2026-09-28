from rest_framework import serializers
from .models import Todo
from django.contrib.auth.models import User

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = [ 'title', 'description', 'completed',  ]
        read_only_fields = [ 'created_at']
        
        
class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        #this will make password to be only written in api not seen
        extra_kwargs = {
            'password': {'write_only': True}
        }

#we use create_user () so that password is hashed before saving to the database. This is important for security reasons, as storing passwords in plain text is a major security risk.
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        return user