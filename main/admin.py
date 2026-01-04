from django.contrib import admin
from .models import News, Thread, Comment, Profile

# Register your models here.
admin.site.register(News)
admin.site.register(Thread)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'thread', 'created_at', 'content_short']
    list_filter = ['created_at', 'thread']
    search_fields = ['content', 'author__username']

    def content_short(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content

    content_short.short_description = 'Комментарий'

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    search_fields = ['user__username', 'bio']