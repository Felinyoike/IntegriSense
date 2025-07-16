from rest_framework.decorators import api_view
from django.http import FileResponse, Http404, JsonResponse
from rest_framework.response import Response
from rest_framework import status
from .serializers import SensorDataSerializer
from .models import SensorData  
import os

@api_view(['POST'])
def upload_sensor_data(request):
    serializer = SensorDataSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(
                {'message': 'Data saved successfully', 'data': serializer.data}, 
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': 'Database error occurred'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_sensor_data(request):
    try:
        sensor_data = SensorData.objects.all()
        serializer = SensorDataSerializer(sensor_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        # print(e)  # Optional: log the error
        return Response(
            {'error': 'Failed to retrieve data'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    
