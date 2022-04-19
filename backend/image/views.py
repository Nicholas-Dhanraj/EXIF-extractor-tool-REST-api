from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Image
from .serializers import ImageSerializer
# from image.models import Image
# from image.serializers import ImageSerializer


class GetImagesView(APIView):
    def get(self, request, format=None):
        # queryset = Image.objects.all()
        # serializer_class = ImageSerializer
        if Image.objects.all().exists():
            images = Image.objects.all()
            images = ImageSerializer(images, many=True)

            return Response(
                {'images': images.data},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'No images found'},
                status=status.HTTP_404_NOT_FOUND

            )


class ImageUploadView(APIView):

    def post(self, request):
        # queryset = Image.objects.all()
        # serializer_class = ImageSerializer
        print('HELLO')

        try:
            data = self.request.data
            print('HELLO')

            image = data['image']
            alt_text = data['alt_text']

            Image.objects.create(
                image=image,
                alt_text=alt_text
            )
            print('HELLO')

            return Response(
                {'success': 'Successfully uploaded image'},
                status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                {'error': 'Something went wrong when uploading image'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            # print('HELLO')
