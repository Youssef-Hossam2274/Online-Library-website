from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from .models import Book, Author, Category, User
from .serializers import BookSerializer,AuthorSerializer, UserSerializer 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST']) 
def book_list(request):

    if request.method == 'GET':    
        books = Book.objects.all()
        serializer = BookSerializer(books, many = True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE']) 
def book_detail(request, id):

    book = Book.objects.get(pk = id)

    if request.method == 'GET':
        serializer = BookSerializer(book)
        return JsonResponse(serializer.data, safe=False)
        
    
    if request.method == 'PUT':
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.update(book, request.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

def author_list(request):
    authors = Author.objects.all()
    serializer = AuthorSerializer(authors, many = True)
    return JsonResponse(serializer.data, safe=False)

def category_list(request):
    categories = Category.objects.all()
    serializer = AuthorSerializer(categories, many = True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST', 'GET']) 
def users_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many = True)
        return JsonResponse(serializer.data, safe=False)
    
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)


@api_view(['GET', 'PUT']) 
def user_detail(request, id):
    
    user = User.objects.get(pk = id)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data, safe=False)
    
    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.update(user, request.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

