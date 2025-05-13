from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from user_management.models import Useri, Product, Payment, Review_Shop
from decimal import Decimal


class RegisterViewTests(TestCase):
    def test_register_customer_valid(self):
        """Customer should register correctly."""
        data = {
            "username": "User1",
            "password": "12345678",
            "email": "testuser1@example.com"
        }
        response = self.client.post(reverse('register'), content_type='application/json', data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_customer_invalid(self):
        """Customer should not register with missing fields."""
        data = {}
        response = self.client.post(reverse('register'), content_type='application/json', data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProductListViewTests(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            product_name="Test Product",
            price=Decimal('100.00')
        )

    def test_product_list(self):
        """Test that product list returns products correctly."""
        response = self.client.get(reverse('product-list'))
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, self.product.product_name)


class PaymentCreateViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.user_instance = Useri.objects.create(username=self.user, email="testuser@example.com")
        self.product = Product.objects.create(
            product_name="Test Product",
            price=Decimal('100.00')
        )

    def test_create_payment_valid(self):
        """Test that payment is created correctly."""
        data = {
            "total_price": "100.00",
            "Product_id": self.product.id,
            "userid": self.user_instance.id
        }
        response = self.client.post(reverse('create-payment'), data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['total_price'], 100.0)

    def test_create_payment_invalid(self):
        """Test that payment creation fails with invalid data."""
        data = {
            "total_price": "100.00",
            "Product_id": self.product.id
        }
        response = self.client.post(reverse('create-payment'), data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RatingViewTests(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            product_name="Test Product",
            price=Decimal('100.00')
        )

    def test_rating_valid(self):
        """Test that product rating is updated correctly."""
        data = {"rating": 4, "product_id": self.product.id}
        response = self.client.post(reverse('submit_rating'), data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.point, 4)

    def test_rating_invalid_product(self):
        """Test that rating fails if product does not exist."""
        data = {"rating": 4, "product_id": 9999}
        response = self.client.post(reverse('submit_rating'), data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateReviewViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.user_instance = Useri.objects.create(username=self.user, email="testuser@example.com")
        self.product = Product.objects.create(
            product_name="Test Product",
            price=Decimal('100.00')
        )

    def test_create_review_valid(self):
        """Test creating a valid review."""
        data = {
            "product_id": self.product.id,
            "rating": 5,
            "comment": "Great product!",
            "user_id": self.user_instance.id
        }
        response = self.client.post(reverse('create-review'), data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['comment'], "Great product!")

    def test_create_review_invalid(self):
        """Test creating a review without user ID."""
        data = {
            "product_id": self.product.id,
            "rating": 5,
            "comment": "Great product!"
        }
        response = self.client.post(reverse('create-review'), data=data)
        print("STATUS:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
