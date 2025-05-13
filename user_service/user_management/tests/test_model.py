from django.test import TestCase
from django.contrib.auth.models import User
from user_management.models import Useri, Product, Review_Shop, Review, Product_detail, Payment

class ShopAppTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.useri = Useri.objects.create(username=self.user, email="test@example.com")
        self.product = Product.objects.create(
            product_name="Test Product",
            status=True,
            point=4.5,
            price=150.00,
            top=True
        )

    def test_useri_creation(self):
        self.assertEqual(str(self.useri), "testuser", msg="Useri username mismatch")
        self.assertEqual(self.useri.email, "test@example.com", msg="Useri email mismatch")

    def test_product_creation(self):
        self.assertEqual(str(self.product), "Test Product", msg="Product name mismatch")
        self.assertEqual(self.product.price, 150.00, msg="Product price mismatch")

    def test_review_shop_creation(self):
        review_shop = Review_Shop.objects.create(userid=self.useri, comment="Nice shop")
        self.assertEqual(str(review_shop), f"Review by User ID {self.useri}", msg="Review_Shop __str__ mismatch")
        self.assertEqual(review_shop.comment, "Nice shop", msg="Review_Shop comment mismatch")

    def test_review_creation(self):
        review = Review.objects.create(product_id=self.product, user_id=self.useri, rating=4)
        expected_str = f"Review for {self.product.product_name} by {self.user.username}"
        self.assertEqual(str(review), expected_str, msg="Review __str__ mismatch")
        self.assertEqual(review.rating, 4, msg="Review rating mismatch")

    def test_product_detail_creation_with_default_price(self):
        detail = Product_detail.objects.create(product_id=self.product, location="Bangkok")
        self.assertEqual(detail.total_price, self.product.price, msg="Default total_price not matched product.price")
        self.assertEqual(str(detail), f"{self.product.id} detail", msg="Product_detail __str__ mismatch")

    def test_payment_creation_and_price_autoset(self):
        detail = Product_detail.objects.create(product_id=self.product, location="BKK", total_price=123.45)
        payment = Payment(userid=self.useri, Product_id=self.product, payment_method="Credit Card")
        payment.Product_detail_id = detail
        payment.save()
        self.assertEqual(payment.total_price, detail.total_price, msg="Payment total_price mismatch with Product_detail")
        self.assertEqual(str(payment), f"Payment by {self.user.username}", msg="Payment __str__ mismatch")
