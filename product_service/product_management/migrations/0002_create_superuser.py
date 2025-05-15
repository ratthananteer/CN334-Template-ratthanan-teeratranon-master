from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')  # ใช้ User ดั้งเดิมของ Django
    if not User.objects.filter(username='admin').exists():
        User.objects.create(
            username='admin',
            email='admin@example.com',
            password=make_password('admin1234'),  # ต้องเข้ารหัสผ่าน
            is_superuser=True,
            is_staff=True,
            is_active=True,
        )
        print("✅ Superuser 'admin' created")
    else:
        print("ℹ️ Superuser 'admin' already exists")

class Migration(migrations.Migration):

    dependencies = [
        ('product_management', '0001_initial'),  # แก้ให้ตรงกับ migration ล่าสุดของแอป
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
