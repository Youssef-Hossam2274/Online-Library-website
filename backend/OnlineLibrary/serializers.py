from rest_framework import serializers
from .models import Book, Author, Category, User,Favorite,BorrowTransaction

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BookSerializer(serializers.ModelSerializer):
    # author = AuthorSerializer()
    # category = CategorySerializer()

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'cover', 'rating', 'category', 'publish_date', 'available', 'description']

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.cover = validated_data.get('cover', instance.cover)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.publish_date = validated_data.get('publish_date', instance.publish_date)
        instance.available = validated_data.get('available', instance.available)
        instance.description = validated_data.get('description', instance.description)
        
        # Update author
        author_data = validated_data.pop('author', None)
        if author_data:
            author_serializer = AuthorSerializer(instance.author, data=author_data)
            if author_serializer.is_valid():
                author_serializer.save()
            else:
                raise serializers.ValidationError(author_serializer.errors)
        
        # Update category
        category_data = validated_data.pop('category', None)
        if category_data:
            category_serializer = CategorySerializer(instance.category, data=category_data)
            if category_serializer.is_valid():
                category_serializer.save()
            else:
                raise serializers.ValidationError(category_serializer.errors)
        
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'firstName', 'secondName', 'email', 'phoneNumber', 'photo', 'isAdmin']
        def update(self, instance, validated_data):
            instance.password = validated_data.get('password', instance.password)
            instance.firstNmae = validated_data.get('firstNmae', instance.firstNmae)
            instance.secondName = validated_data.get('secondName', instance.secondName)
            instance.email = validated_data.get('email', instance.email)
            instance.phoneNumber = validated_data.get('phoneNumber', instance.phoneNumber)
            instance.photo = validated_data.get('photo', instance.photo)
            
            instance.save()
            return instance
        


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'book']


class BorrowTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowTransaction
        fields = ['id', 'user', 'book', 'borrow_date']


