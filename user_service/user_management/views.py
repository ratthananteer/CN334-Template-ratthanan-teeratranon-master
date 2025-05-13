from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from user_management.models import Useri , Review_Shop
from user_management.serializers import Review_ShopSerializer , UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import ProductSerializer, PaymentSerializer, Review_ShopSerializer 
from .models import Product , Payment , Review_Shop
from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, generics, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        if 'username' not in data or 'password' not in data or 'email' not in data:
            return JsonResponse({"error": "Missing username, password, or email."}, status=400)
        try:
           user = User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data['email']
            )
        except Exception as e:
            return JsonResponse({"message": "username already used."}, status=400)
    
        useri = Useri(username=user, email=data['email'])
        useri.save()
        
        serializer = UserSerializer(useri)
        return JsonResponse(serializer.data, status=201)
    return JsonResponse({"error":"method not allowed."}, status=405)
    
class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class PaymentDetailView(RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ReviewListView(APIView):
    def get(self, request):
        reviews = Review_Shop.objects.all()
        review_serializer = Review_ShopSerializer(reviews, many=True)
        return Response(review_serializer.data)
    
from decimal import Decimal

@api_view(['POST'])
def create_payment(request):
    try:
        total_price = request.data.get("total_price")
        product_id = request.data.get("Product_id")

        if total_price is None or product_id is None:
            return Response({"error": "total_price and Product_id are required"}, status=400)

        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        user_id = request.data.get("userid")
        if not user_id:
            return Response({"error": "Missing userid"}, status=400)

        try:
            user_instance = Useri.objects.get(username__id=user_id)
        except Useri.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        payment = Payment.objects.create(
            userid=user_instance,
            total_price=Decimal(total_price),
            Product_id=product,  
        )

        return Response({
            "id": payment.id,
            "product_name": product.product_name,
            "total_price": float(payment.total_price)
        }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)

class MyTokenSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields['password'] = serializers.CharField(write_only=True)
        del self.fields['username']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        try:
            useri = Useri.objects.get(email=email)
            user = useri.username  
        except Useri.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")

        refresh = RefreshToken.for_user(user)
        
        refresh["user_id"] = useri.id

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': useri.id,
        }

class MyTokenView(TokenObtainPairView):
    serializer_class = MyTokenSerializer

@api_view(['POST'])
def rating_view(request):
    rating = request.data.get('rating')
    product_id = request.data.get('product_id')

    try:
        product = Product.objects.get(id=product_id)

        if product.point == 0 or product.point is None:
            product.point = rating
        else:
            product.point = (product.point + rating) / 2

        product.save()
        return Response({"message": "Rating saved."}, status=200)

    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=404)

class CreateReviewView(APIView):
    def post(self, request):
        serializer = Review_ShopSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user_id = request.data.get('user_id')
                if not user_id:
                    return Response({"detail": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    user_id = int(user_id)
                except ValueError:
                    return Response({"detail": "Invalid User ID."}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    useri = Useri.objects.get(id=user_id)
                    print(useri)
                except Useri.DoesNotExist:
                    return Response({"detail": f"Useri with ID {user_id} not found."}, status=status.HTTP_400_BAD_REQUEST)

                serializer.save(userid=useri) 
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
