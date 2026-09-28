from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = [ 'title', 'description', 'completed',  ]
        read_only_fields = [ 'created_at']