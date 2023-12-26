from django.contrib import admin
from core.models import Product, Review, Order, OrderItem, ShippingAddress


admin.site.register([Product, Review, Order, OrderItem, ShippingAddress])
