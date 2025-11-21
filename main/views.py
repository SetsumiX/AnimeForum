from django.shortcuts import render
from django.contrib.auth.models import User
from .forms import UserRegisterForm, UserLoginForm
from .models import News, Thread

# Create your views here.
def home(request):
    news = News.objects.all().order_by('-created_at')[:3]
    threads = Thread.objects.all().order_by('-created_at')[:6]

    context = {
        'news': news,
        'threads': threads,
    }
    return render(request, 'main/base.html', context)
