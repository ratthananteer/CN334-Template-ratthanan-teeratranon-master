from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator


class Useri(models.Model):
    username =  models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(blank=True)

    def __str__(self):
        return self.username.username 


class Review_Shop(models.Model):
    userid = models.ForeignKey(Useri, on_delete=models.CASCADE)
    comment = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f'Review by User ID {self.userid}'


class Product(models.Model):
    product_name = models.CharField(max_length=200)
    status = models.BooleanField(default=True)
    point = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    top = models.BooleanField(default=False)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    
    def __str__(self):
        return self.product_name


class Review(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews', null=True, blank=True) 
    user_id = models.ForeignKey(Useri, on_delete=models.CASCADE, null=True, blank=True) 
    rating = models.PositiveIntegerField(default=1,validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):
        return f"Review for {self.product_id.product_name if self.product_id else 'Unknown'} by {self.user_id.username if self.user_id else 'Anonymous'}"

    

class Product_detail(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_details', null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2 , default=0.00)
    habit = models.CharField(max_length=200, blank=True)
    like = models.CharField(max_length=200, blank=True)
    ability = models.CharField(max_length=200, blank=True)

    def save(self, *args, **kwargs):
        if self.product_id and (self.total_price == 0 or self.total_price is None):
            self.total_price = self.product_id.price
        super().save(*args, **kwargs)
    def __str__(self):
        return f'{self.product_id.id} detail'


class Payment(models.Model):
    userid = models.ForeignKey(Useri, on_delete=models.CASCADE, null=True, blank=True)
    Product_id = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    status = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=100)
    total_price = models.DecimalField(max_digits=10, decimal_places=2 , default=0.00)

    def __str__(self):
        return f"Payment by {self.userid.username if self.userid else 'Anonymous'}"

@receiver(pre_save, sender=Payment)
def update_payment_total_price(sender, instance, **kwargs):
    if instance.total_price in [0, None] and instance.Product_detail_id:
        instance.total_price = instance.Product_detail_id.total_price
