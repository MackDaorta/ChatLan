import os
import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

def create_users():
    users = [
        ('admin', 'admin@chat.com', '123', True), 
        ('jefe', 'jefe@empresa.com', '123', False),
        ('operador1', 'op1@empresa.com', '123', False),
        ('operador2', 'op2@empresa.com', '123', False),
        ('ventas', 'ventas@empresa.com', '123', False),
        ('mack','','123',False)
    ]

    for username, email, password, is_superuser in users:
        if not User.objects.filter(username=username).exists():
            if is_superuser:
                User.objects.create_superuser(username, email, password)
                print(f"   SUPERUSER creado: {username}")
            else:
                User.objects.create_user(username, email, password)
                print(f"   Usuario creado: {username}")
        else:
            print(f"   El usuario {username} ya existe.")

    print("✅ ¡Usuarios listos!")

if __name__ == '__main__':
    create_users()