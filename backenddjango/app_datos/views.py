from rest_framework import viewsets
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
    

class InventarioViewSet(viewsets.ModelViewSet):
    serializer_class = InventarioSerializer
    queryset = Inventario.objects.all()

class IngresoViewSet(viewsets.ModelViewSet):
    serializer_class = IngresoSerializer    
    queryset = Ingreso.objects.all()

class DespachoViewSet(viewsets.ModelViewSet):
    serializer_class = DespachoSerializer
    queryset = Despacho.objects.all()