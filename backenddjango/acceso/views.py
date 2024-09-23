from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404  
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

# Create your views here.
@api_view(['POST'])
def login(request):
    user=get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)    
    token, created = Token.objects.get_or_create(user=user)
    return Response({'token': token.key,'user':UserSerializer(user).data}, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key,'user':serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

@api_view(['POST'])
@authentication_classes([TokenAuthentication])#para validar el token
@permission_classes([IsAuthenticated])#para validar el permiso
def profile(request):
    print (request.user)
    return Response("usted esta auntenticado con {}".format(request.user.username), status=status.HTTP_200_OK)