from django.db import models
import os

print(os.getcwd())


    
class User(models.Model):
    username = models.CharField(max_length= 255)
    password = models.CharField(max_length=255)
    firstName = models.CharField(max_length=255,null=True)
    secondName = models.CharField(max_length=255,null=True)
    email = models.CharField(max_length=255)
    phoneNumber = models.CharField(max_length=11,null=True)
    photo =  models.ImageField(upload_to='photos/', null=True, blank=True)
    isAdmin = models.BooleanField()
    
    def __str__(self):
        return self.firstName + " " +self.secondName



class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Author(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

    
class Book(models.Model):
    title = models.CharField(max_length=255,null=True)
    author = models.ForeignKey(Author, related_name='books', on_delete=models.CASCADE, null=True)
    cover = models.ImageField(upload_to='covers/', null=True, blank=True)
    rating = models.IntegerField(null=True)
    category = models.ForeignKey(Category, related_name='books', on_delete=models.CASCADE, default= 1)
    publish_date = models.DateField(null=True)
    available = models.BooleanField(default=True)
    description = models.TextField(null=False)

    def __str__(self):
        return self.title

class BorrowTransaction(models.Model):
    user = models.ForeignKey(User, related_name='borrows', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='borrows', on_delete=models.CASCADE)
    borrow_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.book.title} - {self.user.username}'
    

class Favorite(models.Model):
    user = models.ForeignKey(User, related_name='favorites', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='favorites', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.book.title} - {self.user.username}'