from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Product, Order, OrderItem, ShippingAddress, Review
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .serializer import ProductSerializer, UserSerializer, UserSerialazerWithToken, OrderSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import datetime


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
	def validate(self, attrs):
		data = super().validate(attrs)
		
		serialazer = UserSerialazerWithToken(self.user).data

		for key, value in serialazer.items():
			data[key] = value

		return data

	
class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer 


# users view

@api_view(['POST'])
def register_user(request):
	data = request.data

	try:
		user = User.objects.create(
			first_name=data['name'],
			username=data['email'],
			email=data['email'],
			password=make_password(data['password'])
		)
		serializer = UserSerialazerWithToken(user, many=False)
		return Response(serializer.data)
	except:
		message = {'detail': 'User with this email already exist'}
		return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
	user = request.user
	serializer = UserSerializer(user, many=False)
	return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
	user = request.user
	serializer = UserSerialazerWithToken(user, many=False)

	data = request.data
	 
	user.first_name = data['name']
	user.username = data['email']
	user.email = data['email']

	if 'password' in data and data['password'] != '':
		user.password = make_password(data['password'])

	user.save()

	return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
	users = User.objects.all()
	serializer = UserSerializer(users, many=True)
	return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_user_by_id(request, pk):
	user = User.objects.get(id=pk)
	serializer = UserSerializer(user, many=False)
	return Response(serializer.data)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
	user = User.objects.get(id=pk)

	data = request.data
	 
	user.first_name = data['name']
	user.username = data['email']
	user.email = data['email']
	user.is_staff = data['is_admin']

	user.save()
	serializer = UserSerializer(user, many=False)

	return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
	user_delete = User.objects.get(id=pk)
	user_delete.delete()
	return Response('User was deleted')



# products view

@api_view(['GET'])
def get_products(request):
    query = request.query_params.get('keyword', '')
    products = Product.objects.filter(name__icontains=query)
    
    page = request.query_params.get('page')
    paginator = Paginator(products, 3)

    try:
        page = int(page) if page else 1
        products = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        products = paginator.page(1)

    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})



@api_view(['GET'])
def get_top_products(request):
	products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
	serializer = ProductSerializer(products, many=True)
	return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
	product = Product.objects.get(id=pk)
	serializer = ProductSerializer(product, many=False)
	return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
	user = request.user
	product = Product.objects.create(
		user=user,
		name='Name',
		price=0,
		brand='Brand',
		countInStock=0,
		category='Category',
		description='Description'
	)

	serializer = ProductSerializer(product, many=False)
	return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_product(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)

    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.brand = data.get('brand', product.brand)
    product.countInStock = data.get('countInStock', product.countInStock)
    product.category = data.get('category', product.category)
    product.description = data.get('description', product.description)

    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, pk):
	product = Product.objects.get(id=pk)
	product.delete()
	return Response('Product deleted')


# orders view

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):
	user = request.user
	data = request.data
	orderItems = data['orderItems']
	if orderItems and len(orderItems) == 0:
		return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)

	else:
		order = Order.objects.create(
			user=user,
			paymentMethod=data['paymentMethod'],
			taxPrice = data['taxPrice'],
			shippingPrice=data['shippingPrice'],
			totalPrice=data['totalPrice']
		)

		shipping = ShippingAddress.objects.create(
			order=order,
			address=data['shippingAddress']['address'],
			city=data['shippingAddress']['city'],
			postalCode=data['shippingAddress']['postalCode'],
			country=data['shippingAddress']['country'],
		)

		for i in orderItems:
			product = Product.objects.get(id=i['product'])
			item = OrderItem.objects.create(
				product=product,
				order=order,
				name=product.name,
				qty=i['qty'],
				price=i['price'],
				image=product.image.url
			)
			product.countInStock -= item.qty
			product.save()
		serializer = OrderSerializer(order, many=False)
		return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
	user = request.user

	try: 
		order = Order.objects.get(id=pk)
		if user.is_staff or order.user == user:
			serializer = OrderSerializer(order, many=False)
			return Response(serializer.data)
		else: 
			Response({'detail': 'Not authorized'}, status=status.HTTP_400_BAD_REQUEST)

	except:
		return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)
	


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
	user = request.user
	orders = user.order_set.all()
	serializer = OrderSerializer(orders, many=True)
	return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders_list(request):
	orders = Order.objects.all()
	serializer = OrderSerializer(orders, many=True)
	return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
	order = Order.objects.get(id=pk)
	order.isPaid = True
	order.paidAt = datetime.now()
	order.save()
	return Response('Paid')


# review view

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, pk):
	user = request.user
	product = Product.objects.get(id=pk)
	data = request.data

	already_exists = product.reviews.filter(user=user).exists()
	if already_exists:
		content = {'detail': 'Product already reviewed'}
		return Response(content, status=status.HTTP_400_BAD_REQUEST)
	
	elif data['rating'] == 0:
		content = {'detail': 'Please, put the rating'}
		return Response(content, status=status.HTTP_400_BAD_REQUEST)
	
	else:
		review = Review.objects.create(
			user=user,
			product=product,
			name=user.first_name,
			rating=data['rating'],
			comment=data['comment']
		)
		reviews = product.reviews.all()
		product.numReviews = len(reviews)

		total = 0
		for i in reviews:
			total += i.rating

		product.rating = total / len(reviews)
		product.save()

		return Response('Review added')

