from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

@login_required
def index(request): 
    user=request.user
    if user.is_superuser:
        return redirect('/gerencia/')
    
    return redirect('/general/')



@login_required
def room(request, room_name):
    return render(request, 'chat/index.html', {
        'room_name': room_name,
        'username': request.user.username 
    })