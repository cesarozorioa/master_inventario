from rest_framework import viewsets,status
from rest_framework.response import Response
from . serializer import *
from . models import *
# Create your views here.
class Tipo_ProductoViewSet(viewsets.ModelViewSet):    
    serializer_class = Tipo_ProductoSerializer
    queryset = Tipo_Producto.objects.all()

class ProveedoresViewSet(viewsets.ModelViewSet):
    serializer_class = ProveedoresSerializer
    queryset = Proveedores.objects.all()
    
class SucursalesViewSet(viewsets.ModelViewSet):
    serializer_class = SucursalSerializer
    queryset = Sucursal.objects.all()

class CategoriaViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaSerializer
    queryset = Categoria.objects.all()

class ProductoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()

class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    queryset = Pedido.objects.all()

class Detalle_PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = Detalle_PedidoSerializer
    queryset = Detalle_Pedido.objects.all()
    def get_queryset(self):
        queryset =  super().get_queryset()
        pedido = self.request.query_params.get('idPed_fk', None)
        if pedido is not None:
            queryset = queryset.filter(idPed_fk=pedido)
        return queryset
class DevolucionesViewSet(viewsets.ModelViewSet):
    serializer_class = DevolucionesSerializer
    queryset = Devoluciones.objects.all()

class ProduccionViewSet(viewsets.ModelViewSet):
    serializer_class = ProduccionSerializer
    queryset = Produccion.objects.all()

class DetalleProduccionViewSet(viewsets.ModelViewSet):
    serializer_class = Detalle_ProduccionSerializer
    queryset = Detalle_Produccion.objects.all()

    def get_queryset(self):
        queryset =  super().get_queryset()
        produccion = self.request.query_params.get('idProduccion_fk', None)
        if produccion is not None:
            queryset = queryset.filter(idProduccion_fk=produccion)
        return queryset
    

class IngresoViewSet(viewsets.ModelViewSet):
    serializer_class = IngresoSerializer    
    queryset = Ingreso.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        producto = Producto.objects.get(idProducto=serializer.data['idProd_fk'])
        producto.stock += serializer.validated_data['cantIngreso']
        producto.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()  # Obtiene la instancia de Ingreso a eliminar
        ingreso = Ingreso.objects.get(idIngreso=instance.idIngreso)  # Obtiene el ingreso específico

    # Eliminar el ingreso
        self.perform_destroy(instance)

    # Acceder al producto relacionado con el ingreso
        producto = Producto.objects.get(idProducto=ingreso.idProd_fk.idProducto)  # Accede al ID del producto

    # Actualizar el stock
        producto.stock -= ingreso.cantIngreso
        producto.save()

    # Respuesta exitosa
        return Response(status=status.HTTP_204_NO_CONTENT)


class DespachoViewSet(viewsets.ModelViewSet):
    serializer_class = DespachoSerializer
    queryset = Despacho.objects.all()