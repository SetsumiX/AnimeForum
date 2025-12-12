import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Создание админа (
from django.contrib.auth.models import User

User.objects.filter(username='kanava').delete()
user = User.objects.create_user(
    username='kanava',
    email='kanava@fachan.com',
    password='123',
)
user.is_superuser = True
user.is_staff = True
user.save()
print(f"Админ(Логин: kanava, Пароль: 123)")
# Создание админа )

# Создание липовых новостей (
from main.models import News

if News.objects.count() == 0:
    from django.core.management import call_command
    call_command('loaddata', 'data_news.json')
# Создание липовых новостей )