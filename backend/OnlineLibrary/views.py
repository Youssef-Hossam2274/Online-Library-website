from django.http import JsonResponse
from .models import Book, Author, Category, User
from .serializers import BookSerializer,AuthorSerializer, UserSerializer 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
# @api_view(['GET', 'POST']) 
def book_list(request):
    
    # if request.method == 'GET':
    books = Book.objects.all()
    serializer = BookSerializer(books, many = True)
    return JsonResponse(serializer.data, safe=False)

    # if request.method == 'POST':
    #     serializer = BookSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status = status.HTTP_201_CREATED)


def author_list(request):
    authors = Author.objects.all()
    serializer = AuthorSerializer(authors, many = True)
    # print(os.getcwd())
    return JsonResponse(serializer.data, safe=False)

def category_list(request):
    categories = Category.objects.all()
    serializer = AuthorSerializer(categories, many = True)
    return JsonResponse(serializer.data, safe=False)


def users_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many = True)
    return JsonResponse(serializer.data, safe=False)