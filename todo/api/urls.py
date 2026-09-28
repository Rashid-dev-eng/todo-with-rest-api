from django.urls import path
from .views import TodoListCreateView, TodoRetrieveUpdateDestroyView,RootAPIView

urlpatterns = [
    path('',RootAPIView.as_view(), name='root-api'),
    path('todos/', TodoListCreateView.as_view(), name='todo-list-create'),
    path('todo/<int:pk>/', TodoRetrieveUpdateDestroyView.as_view(), name='todo-retrieve-update-destroy'),
]