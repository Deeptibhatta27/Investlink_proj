from django.db import models
from django.conf import settings

class StartupPost(models.Model):
    startup = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    video = models.FileField(upload_to='startup_videos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.startup.company} - {self.created_at}"

class PostComment(models.Model):
    post = models.ForeignKey(StartupPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user.name} on {self.post}"
