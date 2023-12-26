from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
	name = models.CharField(max_length=250)
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	image = models.ImageField(null=True, blank=True, default='/flower.jpg')
	brand = models.CharField(max_length=150, null=True, blank=True)
	category = models.CharField(max_length=100, null=True, blank=True)
	description = models.TextField(null=True, blank=True)
	rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	numReviews = models.PositiveIntegerField(null=True, blank=True, default=0)
	price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	countInStock = models.PositiveIntegerField(null=True, blank=True, default=0)
	createAt = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return self.name
	

class Review(models.Model):
	product = models.ForeignKey(to="core.Product", related_name="reviews", on_delete=models.SET_NULL, null=True)
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	name = models.CharField(max_length=150, null=True, blank=True)
	rating = models.PositiveIntegerField(null=True, blank=True, default=0)
	comment = models.TextField(null=True, blank=True)
	createAt = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return str(self.rating)
	

class Order(models.Model):
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	paymentMethod = models.CharField(max_length=150, null=True, blank=True)
	taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	isPaid = models.BooleanField(default=False)
	payAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
	isDelivered = models.BooleanField(default=False)
	deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
	createAt = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return str(self.id)
	

class OrderItem(models.Model):
	product = models.ForeignKey(to="core.Product", related_name="product", on_delete=models.SET_NULL, null=True)
	order = models.ForeignKey(to="core.Order", related_name="order", on_delete=models.SET_NULL, null=True)
	name = models.CharField(max_length=150, null=True, blank=True)
	qty = models.PositiveIntegerField(null=True, blank=True, default=0)
	price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
	image = models.CharField(max_length=150, null=True, blank=True)

	def __str__(self) -> str:
		return self.name
	

class ShippingAddress(models.Model):
	order = models.OneToOneField(to="core.Order", on_delete=models.CASCADE, null=True, blank=True)
	address = models.CharField(max_length=300, null=True, blank=True)
	city = models.CharField(max_length=100, null=True, blank=True)
	postalCode = models.CharField(max_length=100, null=True, blank=True)
	country = models.CharField(max_length=150, null=True, blank=True)
	shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

	def __str__(self) -> str:
		return self.address
	