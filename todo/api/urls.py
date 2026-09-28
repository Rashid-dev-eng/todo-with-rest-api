from django.urls import path
from .views import TodoListCreateView, TodoRetrieveUpdateDestroyView,RootAPIView,RegisterAPIView, LoginAPIView,LogoutAPIView

urlpatterns = [
    path('',RootAPIView.as_view(), name='root-api'),
    path('todos/', TodoListCreateView.as_view(), name='todo-list-create'),
    path('todo/<int:pk>/', TodoRetrieveUpdateDestroyView.as_view(), name='todo-retrieve-update-destroy'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
]
