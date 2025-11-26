from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Message(models.Model):
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    room_name=models.CharField(max_length=50,default='general')

    class Meta:
        ordering=['timestamp']

    def __str__(self):
        return f"{self.author.username}:{self.content}"
