from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .forms import UserRegisterForm, UserLoginForm, ThreadForm, CommentForm, ProfileForm, ThreadEditForm
from .models import News, Thread, Comment, Profile

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
    news = News.objects.all().order_by('-created_at')
    threads = Thread.objects.all().order_by('-created_at')

    context = {
        'news': news,
        'threads': threads,
        'items_count': news.count(),
        'active_tab': 'news',
        'user_count': User.objects.count(),
        'threads_count': Thread.objects.count(),
    }
    return render(request, 'main/news.html', context)

def news_page(request):
    news = News.objects.all().order_by("-created_at")
    context = {
        'news': news,
        'items_count': news.count(),
        'active_tab': 'news',
    }
    return render(request, 'main/news.html', context)

def news_detail(request, news_id):
    news = get_object_or_404(News, id=news_id)
    news.count_views += 1
    news.save()

    context = {
        'news': news,
    }
    return render(request, 'main/news_detail.html', context)

def forums_page(request):
    threads = Thread.objects.all().order_by("-created_at")
    context = {
        'threads': threads,
        'items_count': threads.count(),
        'active_tab': 'forum',
    }
    return render(request, 'main/threads.html', context)

def thread_detail(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)

    comments = thread.comments.all()

    # Форма комментария
    if request.method == 'POST' and request.user.is_authenticated:
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.thread = thread
            comment.author = request.user
            comment.save()

            thread.count_messages += 1
            thread.last_message_time = comment.created_at
            thread.save()

            messages.success(request, 'Комментарий добавлен!')
            return redirect('thread_detail', thread_id=thread.id)
    else:
        form = CommentForm()

    thread.count_views += 1
    thread.save()

    context = {
        'thread': thread,
        'comments': comments,
        'form': form,
    }
    return render(request, 'main/thread_detail.html', context)

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


@login_required
def thread_edit(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)

    if not (request.user == thread.author or request.user.is_staff):
        messages.error(request, 'У вас нет прав для редактирования этой темы')
        return redirect('thread_detail', thread_id=thread_id)

    if request.method == 'POST':
        form = ThreadEditForm(request.POST, instance=thread)
        if form.is_valid():
            form.save()
            messages.success(request, 'Тема успешно обновлена!')
            return redirect('thread_detail', thread_id=thread_id)
    else:
        form = ThreadEditForm(instance=thread)

    return render(request, 'main/thread_edit.html', {
        'form': form,
        'thread': thread,
    })


@login_required
def thread_delete(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)

    if not (request.user == thread.author or request.user.is_staff):
        messages.error(request, 'У вас нет прав для удаления этой темы')
        return redirect('thread_detail', thread_id=thread_id)

    if request.method == 'POST':
        thread.delete()
        messages.success(request, 'Тема успешно удалена!')
        return redirect('forums_page')

    return render(request, 'main/thread_delete_confirm.html', {
        'thread': thread,
    })


def profile_view(request, username):
    user = get_object_or_404(User, username=username)

    profile, created = Profile.objects.get_or_create(user=user)

    context = {
        'profile_user': user,
        'profile': profile,
        'user_threads': Thread.objects.filter(author=user),
        'user_comments': Comment.objects.filter(author=user),
    }
    return render(request, 'main/profile.html', context)


@login_required
def profile_edit(request):
    profile = request.user.profile

    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Профиль обновлён!')
            return redirect('profile', username=request.user.username)
    else:
        form = ProfileForm(instance=profile)

    context = {
        'form': form,
    }

    return render(request, 'main/profile_edit.html', context)


def search(request):
    query = request.GET.get('q', '').strip()
    results = {
        'news': [],
        'threads': [],
        'users': []
    }

    if query:
        results['news'] = News.objects.filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )[:10]

        results['threads'] = Thread.objects.filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )[:10]

        results['users'] = User.objects.filter(
            Q(username__icontains=query) | Q(email__icontains=query)
        )[:10]

    context = {
        'query': query,
        'results': results,
        'total_results': sum(len(v) for v in results.values()),
    }
    return render(request, 'main/search.html', context)