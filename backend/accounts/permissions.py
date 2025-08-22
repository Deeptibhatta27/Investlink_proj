from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsInvestor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'investor'

class IsStartup(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'startup'
