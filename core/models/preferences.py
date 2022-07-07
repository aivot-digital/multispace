from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

VIEW_CHOICES = [
    ('MP', 'Karte'),
    ('LS', 'Liste'),
]


class Preferences(models.Model):
    user = models.OneToOneField(User, related_name='preferences', on_delete=models.CASCADE)
    view = models.CharField(max_length=2, choices=VIEW_CHOICES, default='LS')

    class Meta:
        verbose_name = 'Einstellungen'
        verbose_name_plural = 'Einstellungen'

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def handle_user_save(sender, instance, **kwargs):
    Preferences.objects.get_or_create(user=instance)
