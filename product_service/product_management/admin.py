from django.contrib import admin
from .models import Useri, Review_Shop, Product, Review, Product_detail, Payment
class UseriAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Useri._meta.fields]

class ReviewShopAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Review_Shop._meta.fields]

class ProductAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Product._meta.fields]

class ReviewAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Review._meta.fields]

class ProductDetailAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'location', 'total_price', 'habit', 'like', 'ability')
    def product_name(self, obj):
        return obj.product_id.product_name  
    product_name.admin_order_field = 'product_id__product_name'  
    product_name.short_description = 'Product Name' 

class PaymentAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Payment._meta.fields]

admin.site.register(Useri, UseriAdmin)
admin.site.register(Review_Shop, ReviewShopAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Product_detail, ProductDetailAdmin)
admin.site.register(Payment, PaymentAdmin)

