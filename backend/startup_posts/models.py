from django.db import models
from django.conf import settings
from django.utils.text import slugify
import os

def get_video_upload_path(instance, filename):
    # Generate a path like 'startup_videos/user_id/video_title_slug.mp4'
    ext = filename.split('.')[-1]
    slug = slugify(instance.title)
    return f'startup_videos/{instance.author.id}/{slug}.{ext}'

def get_thumbnail_upload_path(instance, filename):
    # Generate a path like 'startup_thumbnails/user_id/video_title_slug.jpg'
    ext = filename.split('.')[-1]
    slug = slugify(instance.title)
    return f'startup_thumbnails/{instance.author.id}/{slug}.{ext}'

class StartupPost(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='startup_posts'
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    video_url = models.FileField(
        upload_to=get_video_upload_path,
        null=True,
        blank=True
    )
    thumbnail_url = models.ImageField(
        upload_to=get_thumbnail_upload_path,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.PositiveIntegerField(default=0)
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_posts',
        blank=True
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['author']),
        ]

    def __str__(self):
        return f'{self.title} by {self.author.username}'

class PostComment(models.Model):
    post = models.ForeignKey(
        StartupPost,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='post_comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'
