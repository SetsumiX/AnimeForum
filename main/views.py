from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .forms import UserRegisterForm, UserLoginForm, ThreadForm
from .models import News, Thread

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"Аккаунт {username} успешно создан")
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, "main/register.html", {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, "Неправильное имя пользователя или пароль!")

    else:
        form = UserLoginForm()
    return render(request, 'main/login.html', {'form': form})


def user_logout(request):
    logout(request)
    return redirect('login')

def home(request):
    news = News.objects.all().order_by('-created_at')[:3]
    threads = Thread.objects.all().order_by('-created_at')[:6]

    context = {
        'news': news,
        'threads': threads,
        'items_count': news.count(),
        'active_tab': 'news',
    }
    return render(request, 'main/news.html', context)

def news_page(request):
    news = News.objects.all().order_by("-created_at")[:3]
    context = {
        'news': news,
        'items_count': news.count(),
        'active_tab': 'news',
    }
    return render(request, 'main/news.html', context)

def forums_page(request):
    threads = Thread.objects.all().order_by("-created_at")[:6]
    context = {
        'threads': threads,
        'items_count': threads.count(),
        'active_tab': 'forum',
    }
    return render(request, 'main/threads.html', context)

@login_required
def create_thread(request):
    if request.method == 'POST':
        form = ThreadForm(request.POST)
        if form.is_valid():
            thread = form.save(commit=False)
            thread.author = request.user
            thread.save()
            messages.success(request, 'Форум создан!')
            return redirect('forums_page')
    else:
        form = ThreadForm()

    context = {
        'form': form,
    }

    return render(request, 'main/create_thread.html', context)

