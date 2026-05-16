from django.contrib import admin
from .models import Book, Wishlist, UserProfile


admin.site.register(Book)
admin.site.register(Wishlist)
admin.site.register(UserProfile)
