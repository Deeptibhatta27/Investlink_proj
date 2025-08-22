from rest_framework import permissions

class IsStartupOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow startups to create posts.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user and request.user.role == 'startup'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.startup == request.user
