from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .models import Todo
from .serializer import TodoSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.reverse import reverse


# Create your views here.
class TodoListCreateView(generics.ListCreateAPIView):
   
    serializer_class = TodoSerializer
    
    # Filter the queryset to only include todos for the currently authenticated user
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    
    #ths will automatically set the user field to the currently authenticated user when creating a new Todo instance.
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TodoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = TodoSerializer
    
      # Filter the queryset to only include todos for the currently authenticated user
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
        
        #ths will automatically set the user field to the currently authenticated user when creating a new Todo instance.
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class RootAPIView(APIView):
    def get(self, request):
        return Response({
            
         'list':reverse('todo-list-create', request=request),
             
           })