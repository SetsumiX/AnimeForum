from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

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

class Comment(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "comment"
        verbose_name_plural = "comments"

    def __str__(self):
        return f"Комментарий от {self.author} к '{self.thread.title}'"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=400, blank=True)
    birth_day = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Профиль {self.user.username}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)