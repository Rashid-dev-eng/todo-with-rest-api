from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .models import Todo
from .serializer import TodoSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate




# Create your views here.
class TodoListCreateView(generics.ListCreateAPIView):
   
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    
    # Filter the queryset to only include todos for the currently authenticated user
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    
    #ths will automatically set the user field to the currently authenticated user when creating a new Todo instance.
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TodoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
      # Filter the queryset to only include todos for the currently authenticated user
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
        
 

class RootAPIView(APIView):
    def get(self, request):
        return Response({
            
         'list':reverse('todo-list-create', request=request),
             
           })
        
        
class RegisterAPIView(generics.CreateAPIView):

    serializer_class = RegisterSerializer
    
    
class LoginAPIView(APIView):

    def post(self, request):

        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {'error': 'Invalid username or password'},
                status=400
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'message': 'Login successful',
            'token': token.key,
            'username': user.username
        })
        
        
class LogoutAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()

        return Response({
            'message': 'Logout successful'
        })