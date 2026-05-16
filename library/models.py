from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from datetime import timedelta
from django.utils import timezone

class Book(models.Model):
    CATEGORY_CHOICES = [
        ('Biography', 'Biography'),
        ('Comedy', 'Comedy'),
        ('Drama', 'Drama'),
        ('Fantasy', 'Fantasy'),
        ('History', 'History'),
        ('Horror', 'Horror'),
        ('Mystery', 'Mystery'),
        ('Romance', 'Romance'),
        ('Sci-Fi', 'Sci-Fi'),
        ('Thriller', 'Thriller'),
    ]
    
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    cover = models.URLField(
        max_length=500, 
        default='https://via.placeholder.com/150x210?text=Book+Cover'
    )
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        default='Fantasy'
    )
    description = models.TextField(blank=True)
    pages = models.PositiveIntegerField(
        validators=[MinValueValidator(1)], 
        null=True, 
        blank=True
    )
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.author}"

    def get_status(self):
        return "Available" if self.available else "Borrowed"

class UserProfile(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='active'
    )
    join_date = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True)
    profile_picture = models.URLField(
        blank=True,
        default='https://via.placeholder.com/150'
    )

    def __str__(self):
        return f"{self.user.username}'s profile"

    def get_initials(self):
        names = self.user.get_full_name().split()
        return ''.join([name[0] for name in names]) if names else self.user.username[0].upper()

class BorrowedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    return_date = models.DateTimeField(null=True, blank=True)
    returned = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'book')  # Prevent duplicate records for the same user and book

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title}"

    def save(self, *args, **kwargs):
        if not self.pk:  # Only set due_date on creation
            self.due_date = timezone.now() + timedelta(days=14)
        super().save(*args, **kwargs)

    def days_remaining(self):
        return (self.due_date - timezone.now()).days

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')
        ordering = ['-added_date']

    def __str__(self):
        return f"{self.user.username}'s wishlist: {self.book.title}"