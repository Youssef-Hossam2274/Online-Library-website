"""
URL configuration for OnlineLibrary project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from OnlineLibrary import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api.books/',views.book_list),
    path('api.authors/',views.author_list),
    path('api.categories/',views.category_list),
    path('api.users/',views.users_list),
    path('api.books/<int:book_id>/', views.get_book_cover, name='get_book_cover'),
]