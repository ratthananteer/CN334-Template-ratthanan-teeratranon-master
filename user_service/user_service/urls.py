"""
URL configuration for user_service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from user_management.views import *
from user_management import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register', register, name="register"),
    path("api/token/", MyTokenView.as_view(), name="token_obtain_pair"),
    path('api/product/',ProductListView.as_view(), name="product-list"),
    path('api/product/<int:pk>/', ProductDetailView.as_view(), name="product-detail"),
    path('api/payment/<int:pk>/', PaymentDetailView.as_view(), name="payment-detail"),
    path('api/review/',ReviewListView.as_view(), name="review-list"),
    path('api/payment/', create_payment, name="create-payment"),
    path('api/submit-rating/', rating_view, name='submit_rating'),
    path('api/reviewshop/create/', CreateReviewView.as_view(), name='create-review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
