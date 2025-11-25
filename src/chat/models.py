from django.db import models

# Create your models here.
class Message(models.Model):
    content = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('timestamp',)

    def __str__(self):
        return self.content
