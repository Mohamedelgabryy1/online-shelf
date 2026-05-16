from django.urls import path
from .admin import admin
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.custom_logout, name='logout'),
    path('user-dashboard/', views.user_dashboard, name='user_dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('all-books/', views.all_books, name='all_books'),
    path('all-users/', views.all_users, name='all_users'),
    path('make-admin/<int:user_id>/', views.make_admin, name='make_admin'),
    path('revoke-admin/<int:user_id>/', views.revoke_admin, name='revoke_admin'),
    path('edit-profile/', views.edit_profile, name='edit_profile'),
    path('add-book/', views.add_book, name='add_book'),
    path('edit-book/<int:book_id>/', views.edit_book, name='edit_book'),    path('book-info/<int:book_id>/', views.book_info, name='book_info'),
    path('my-books/', views.my_books, name='my_books'),
    path('wishlist/', views.wishlist, name='wishlist'),
    path('search-results/', views.search_results, name='search_results'),
    path('delete-book/<int:book_id>/', views.delete_book, name='delete_book'),
    path('toggle-user-status/<int:user_id>/', views.toggle_user_status, name='toggle_user_status'),
    path('borrow-book/<int:book_id>/', views.borrow_book, name='borrow_book'),
    path('toggle-wishlist/<int:book_id>/', views.toggle_wishlist, name='toggle_wishlist'),
    path('return-book/<int:book_id>/', views.return_book, name='return_book'),
    
]
