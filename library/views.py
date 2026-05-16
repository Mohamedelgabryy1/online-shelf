from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.urls import path
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import login,logout, authenticate
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import Book, Wishlist, BorrowedBook

# Check if the user is an admin
def is_admin(user):
    return user.is_staff

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    books = Book.objects.all()[:4]  # Fetch the first 4 books
    users = User.objects.all()[:4]  # Fetch the first 4 users
    return render(request, 'adminDashboard.html', {'books': books, 'users': users})

@login_required
@user_passes_test(is_admin)
def delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    book.delete()
    return redirect('admin_dashboard')

@login_required
@user_passes_test(is_admin)
def toggle_user_status(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.is_active = not user.is_active
    user.save()
    return redirect('admin_dashboard')

def home(request):
    books = Book.objects.all()[:4]  # Fetch the first 4 books for the featured section
    wishlist = Wishlist.objects.filter(user=request.user) if request.user.is_authenticated else []
    return render(request, 'index.html', {'books': books, 'wishlist': wishlist})

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_active:
                # Log the user in
                login(request, user)
                next_url = request.GET.get('next', 'home')  # Default to 'home' if 'next' is not provided
                return redirect(next_url)
            else:
                messages.error(request, 'Your account is inactive. Please contact support.')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'logIn.html')

def custom_logout(request):
    logout(request)
    return redirect('home')

def signup(request):
    if request.method == 'POST':
        full_name = request.POST.get('fullname')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm-password')

        # Validate passwords match
        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return redirect('signup')

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return redirect('signup')
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists.')
            return redirect('signup')

        # Create the user
        user = User.objects.create_user(username=username, email=email, password=password)
        if ' ' in full_name:
            user.first_name, user.last_name = full_name.split(' ', 1)
        else:
            user.first_name = full_name
        user.save()

        # Log the user in and redirect to the home page
        login(request, user)
        return redirect('home')

    return render(request, 'signUp.html')

@login_required
def user_dashboard(request):
    user = request.user

    # Fetch borrowed books
    borrowed_books = BorrowedBook.objects.filter(user=user).select_related('book')

    # Fetch wishlist items
    wishlist_items = Wishlist.objects.filter(user=user).select_related('book')

    return render(request, 'userDashboard.html', {
        'user': user,
        'borrowed_books': borrowed_books,
        'wishlist_items': wishlist_items,
    })

def all_books(request):
    books = Book.objects.all()
    wishlist = Wishlist.objects.filter(user=request.user).values_list('book_id', flat=True) if request.user.is_authenticated else []
    return render(request, 'allBooks.html', {'books': books, 'wishlist': wishlist})

@login_required
@user_passes_test(is_admin)
def all_users(request):
    users = User.objects.annotate(borrowed_books_count=Count('borrowedbook'))
    return render(request, 'allUsers.html', {'users': users})

@login_required
@user_passes_test(is_admin)
def make_admin(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.is_staff = True  # Promote the user to admin
    user.save()
    return redirect('all_users')

@login_required
@user_passes_test(is_admin)
def revoke_admin(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # Prevent revoking admin privileges from the superadmin
    if user.is_superuser:
        messages.error(request, "You cannot revoke admin privileges from the superadmin.")
        return redirect('all_users')

    # Prevent an admin from revoking their own privileges
    if user == request.user:
        messages.error(request, "You cannot revoke your own admin privileges.")
        return redirect('all_users')

    # Revoke admin privileges
    if user.is_staff:
        user.is_staff = False
        user.save()
        messages.success(request, f"Admin privileges revoked from {user.username}.")
    return redirect('all_users')

@login_required
def edit_profile(request):
    user = request.user

    if request.method == 'POST':
        if 'fullname' in request.POST:  # Profile update form
            full_name = request.POST.get('fullname')
            email = request.POST.get('email')

            # Extract initials from the full name
            initials = ''.join([name[0].upper() for name in full_name.split() if name])

            # Validate email uniqueness
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                messages.error(request, 'Email already exists.')
                return redirect('edit_profile')

            # Update user information
            if ' ' in full_name:
                user.first_name, user.last_name = full_name.split(' ', 1)
            else:
                user.first_name = full_name
                user.last_name = ''
            user.username = initials  # Set the username to the initials
            user.email = email
            user.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('edit_profile')

        elif 'current_password' in request.POST:  # Password change form
            current_password = request.POST.get('current_password')
            new_password = request.POST.get('new_password')
            confirm_password = request.POST.get('confirm_password')

            # Validate current password
            if not user.check_password(current_password):
                messages.error(request, 'Current password is incorrect.')
                return redirect('edit_profile')

            # Validate new password match
            if new_password != confirm_password:
                messages.error(request, 'New passwords do not match.')
                return redirect('edit_profile')

            # Update password
            user.set_password(new_password)
            user.save()
            messages.success(request, 'Password updated successfully. Please log in again.')
            return redirect('login')

    return render(request, 'editProfile.html', {'user': user})

@login_required
@user_passes_test(is_admin)
def add_book(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        author = request.POST.get('author')
        category = request.POST.get('category')
        description = request.POST.get('description', '')
        pages = request.POST.get('pages', None)
        cover = request.POST.get('cover-url', 'https://via.placeholder.com/150x210?text=Book+Cover')
        available = request.POST.get('status') == 'available'

        # Validate required fields
        if not title or not author:
            messages.error(request, 'Title and Author are required fields.')
            return redirect('add_book')

        # Save the book to the database
        Book.objects.create(
            title=title,
            author=author,
            category=category,
            description=description,
            pages=pages if pages else None,
            cover=cover,
            available=available
        )
        messages.success(request, 'Book added successfully!')
        return redirect('all_books')

    # Pass CATEGORY_CHOICES to the template
    return render(request, 'addBook.html', {'categories': Book.CATEGORY_CHOICES})

@login_required
@user_passes_test(lambda u: u.is_staff)  # Ensure only admins can access this view
def edit_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    if request.method == 'POST':
        book.title = request.POST.get('title')
        book.author = request.POST.get('author')
        book.category = request.POST.get('category')
        book.description = request.POST.get('description', '')
        book.pages = request.POST.get('pages', None)
        book.cover = request.POST.get('cover-url', 'https://via.placeholder.com/150x210?text=Book+Cover')
        book.available = request.POST.get('status') == 'available'
        book.save()

        messages.success(request, 'Book updated successfully!')
        return redirect('admin_dashboard')

    return render(request, 'EditBook.html', {'book': book})

@login_required
def book_info(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    is_in_wishlist = Wishlist.objects.filter(user=request.user, book=book).exists()
    return render(request, 'BookInfo.html', {'book': book, 'is_in_wishlist': is_in_wishlist})

@login_required
def my_books(request):
    borrowed_books = BorrowedBook.objects.filter(user=request.user).select_related('book')
    return render(request, 'mybooks.html', {'borrowed_books': borrowed_books})

@login_required
def return_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    borrowed_books = BorrowedBook.objects.filter(user=request.user, book=book)

    if not borrowed_books.exists():
        messages.error(request, 'No borrowed record found for this book.')
        return redirect('my_books')

    # Mark the book as available
    book.available = True
    book.save()

    # Delete all borrowed records for this user and book
    borrowed_books.delete()

    messages.success(request, f'You have successfully returned "{book.title}".')
    return redirect('my_books')

@login_required
def wishlist(request):
    user = request.user
    wishlist_items = Wishlist.objects.filter(user=user).select_related('book')
    return render(request, 'wishlist.html', {'wishlist_items': wishlist_items})


def search_results(request):
    query = request.GET.get('query', '').strip()

    # If the query is empty, render the search results page with no results
    if not query:
        return render(request, 'searchResults.html', {'query': query, 'books': []})

    # Search books by title, author, or category
    books = Book.objects.filter(
        Q(title__icontains=query) |
        Q(author__icontains=query) |
        Q(category__icontains=query)
    )

    # If the request is an AJAX request, return JSON response
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        books_data = books.values('id', 'title', 'cover')
        return JsonResponse({'books': list(books_data)})

    # Render the search results page with the results
    return render(request, 'searchResults.html', {'query': query, 'books': books})

@login_required
def borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    # Check if the book is already borrowed by the user
    if BorrowedBook.objects.filter(user=request.user, book=book).exists():
        return JsonResponse({'error': 'You have already borrowed this book.'}, status=400)

    # Check if the book is available
    if not book.available:
        return JsonResponse({'error': 'Book is not available'}, status=400)

    # Mark the book as borrowed
    book.available = False
    book.save()

    # Add to BorrowedBook model
    BorrowedBook.objects.create(
        user=request.user,
        book=book,
    )

    return JsonResponse({
        'success': True,
        'message': f'You have successfully borrowed "{book.title}".',
        'book_id': book.id
    })


@login_required
def toggle_wishlist(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, book=book)

    if not created:
        wishlist_item.delete()
        return JsonResponse({'added': False})
    return JsonResponse({'added': True})