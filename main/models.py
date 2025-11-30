from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    count_views = models.IntegerField(default=0, blank=True)
    category = models.CharField(max_length=50)
    # image = models.ImageField(upload_to="news_images/", blank=True, null=True)
    image = models.CharField(max_length=500)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"

class Thread(models.Model):
    CATEGORY_CHOICES = [
        ('Обсуждение', 'Обсуждение'),
        ('Вопрос', 'Вопрос'),
        ('Рекомендации', 'Рекомендации'),
        ('Новости', 'Новости'),
        ('Игры', 'Игры'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Обсуждение')
    count_messages = models.IntegerField(default=0, blank=True)
    count_views = models.IntegerField(default=0, blank=True)
    last_message_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Тема форума"
        verbose_name_plural = "Темы форума"