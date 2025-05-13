from rest_framework import serializers
from product_management.models import Useri
from .models import Review_Shop, Product, Review, Product_detail, Payment
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Useri
        fields = ['id', 'username', 'email']

class Review_ShopSerializer(serializers.ModelSerializer):
    userid = UserSerializer(read_only=True)

    class Meta:
        model = Review_Shop
        fields = ['id', 'userid', 'comment']
        extra_kwargs = {'userid': {'read_only': True}}  

class Product_detailMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_detail
        fields = ['location', 'total_price', 'habit', 'ability', 'like','product_id']


class ProductSerializer(serializers.ModelSerializer):
    latest_rating = serializers.SerializerMethodField()
    product_details = Product_detailMiniSerializer(many=True, read_only=True) 
    
    class Meta:
        model = Product
        fields = ['id', 'product_name', 'status', 'point', 'price', 'top', 'image', 'latest_rating', 'product_details']
    def get_latest_rating(self, obj):
        latest_review = obj.product_reviews.order_by('-id').first()
        return latest_review.rating if latest_review else None
    
class ReviewSerializer(serializers.ModelSerializer):
    product_id = ProductSerializer()  
    user_id = UserSerializer() 
    
    class Meta:
        model = Review
        fields = ['id', 'product_id', 'user_id', 'rating']

class Product_detailSerializer(serializers.ModelSerializer):
    product_id = ProductSerializer()  
    
    class Meta:
        model = Product_detail
        fields = ['id', 'product_id', 'location', 'total_price', 'habit', 'ability', 'like']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'userid', 'Product_id', 'status', 'payment_method', 'total_price']

    def create(self, validated_data):
        # convert plain ID to model instance
        user_id = validated_data.pop('userid')
        detail_id = validated_data.pop('Product_detail_id')

        validated_data['userid'] = Useri.objects.get(pk=user_id.id if hasattr(user_id, 'id') else user_id)
        validated_data['Product_detail_id'] = Product.objects.get(pk=detail_id.id if hasattr(detail_id, 'id') else detail_id)

        return super().create(validated_data)

