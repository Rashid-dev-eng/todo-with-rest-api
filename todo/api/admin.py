from django.contrib import admin
from .models import Todo
from django.contrib.auth.models import User


# Register your models here.
@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed', 'user', 'created_at')
    list_filter = ('completed', 'user')
    search_fields = ('title', 'description', 'user__username')
