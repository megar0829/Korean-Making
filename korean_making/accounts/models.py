from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.dispatch import receiver
from django.db.models.signals import post_save

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, email, password, **kwargs):
        if not username:
            raise ValueError('ID를 입력하세요')
        
        if not email:
            raise ValueError('Email을 입력하세요')

        user = self.model(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username=None, email=None, password=None, **extra_fields):
        superuser = self.create_user(
            username=username,
            email=email,
            password=password,
        )
        superuser.is_staff = True
        superuser.is_superuser = True
        superuser.is_active = True
        superuser.save(using=self._db)
        return superuser


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=30, unique=True, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'user'
        
    @property
    def is_staff(self):
        return self.is_superuser
    
    def __str__(self):
        return self.username



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_pk = models.IntegerField(blank=True)
    nickname = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=200, blank=True)
    exp = models.IntegerField(default=0)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, user_pk=instance.id)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()














# # api/models.py
# from django.db import models

# # Create your models here.
# from django.contrib.auth.models import User
# from django.db.models.signals import post_save
# from django.dispatch import receiver


# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     user_pk = models.IntegerField(blank=True)
#     email = models.EmailField(max_length=500, blank=True)
#     nickname = models.CharField(max_length=200, blank=True)
#     country = models.CharField(max_length=200, blank=True)
#     exp = models.IntegerField(default=0)

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance, user_pk=instance.id)


# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()


# # from django.db import models
# # from django.contrib.auth.models import AbstractUser

# # # username, nickname, password, email, exp

# # class User(AbstractUser):
# #     nickname = models.CharField(max_length=100, blank=True)
# #     exp = models.IntegerField(default=0)
    