from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
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

def get_book_cover(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if not book.cover:  
        return HttpResponse(status=404)

    with open(book.cover.path, 'rb') as f:
        cover_data = f.read()
        
    content_type = 'image/webp'  
    return HttpResponse(cover_data, content_type=content_type)