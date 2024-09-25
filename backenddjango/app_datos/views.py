from rest_framework import viewsets,status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
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
    """Implementación para el manejo de inventario"""
    def destroy(self, request, *args, **kwargs):
        # Obtener el pedido que se va a eliminar
        instance = self.get_object()        
        # Obtener todos los productos asociados a este pedido
        detalles_pedido = Detalle_Pedido.objects.filter(idPed_fk=instance.idPedido)        
        # Iterar sobre cada detalle de pedido y actualizar el stock de cada producto
        for detalle in detalles_pedido:
            producto = Producto.objects.get(idProducto=detalle.idProd_fk.idProducto)            
            # Sumar la cantidad del producto en el pedido de vuelta al stock
            producto.stock += detalle.cantidadPedido
            producto.save()        
        # Eliminar los detalles del pedido (productos solicitados)
        detalles_pedido.delete()        
        # Eliminar el pedido
        self.perform_destroy(instance)        
        return Response(status=status.HTTP_204_NO_CONTENT)


class Detalle_PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = Detalle_PedidoSerializer
    queryset = Detalle_Pedido.objects.all()
    def get_queryset(self):
        queryset =  super().get_queryset()
        pedido = self.request.query_params.get('idPed_fk', None)
        if pedido is not None:
            queryset = queryset.filter(idPed_fk=pedido)
        return queryset    
    #funciones para el manejo de inventario
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        producto = Producto.objects.get(idProducto=serializer.data['idProd_fk'])
        if serializer.data['cantidadPedido'] > 0 and producto.stock >= serializer.data['cantidadPedido']:
            producto.stock -= serializer.validated_data['cantidadPedido']
            producto.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        #metodo put para el front
    def update(self, request, *args, **kwargs):
        detalle_original = self.get_object()
        partial = kwargs.pop('partial', False)
        instance = self.get_object()    
    # Actualiza el ingreso
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)    
    # Obtén el id del producto desde el serializer data
        id_producto = serializer.data['idProd_fk']  # Asegúrate de que este campo devuelva el ID del producto, no la instancia
     # Busca el producto usando el ID
        producto = Producto.objects.get(idProducto=id_producto)    
    # Si estás actualizando la cantidad del ingreso, deberías ajustar el stock del producto.   
        nueva_cantidad = serializer.data['cantidadPedido'] 
        diferencia = nueva_cantidad - detalle_original.cantidadPedido 
        if diferencia > 0:
            producto.stock -= abs(diferencia)
        elif diferencia < 0:
            producto.stock += abs(diferencia)
    # Actualiza el stock del producto
        #producto.stock += nueva_cantidad  # Aquí ajustas según tu lógica
        producto.save()
        return Response(serializer.data)
    #metodo delete para el front
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()  # Obtiene la instancia de Ingreso a eliminar
        pedido = Detalle_Pedido.objects.get(idDetalleP=instance.idDetalleP)  # Obtiene el ingreso específico
    # Eliminar el ingreso
        self.perform_destroy(instance)
    # Acceder al producto relacionado con el ingreso
        producto = Producto.objects.get(idProducto=pedido.idProd_fk.idProducto)  # Accede al ID del producto
    # Actualizar el stock
        producto.stock += pedido.cantidadPedido
        producto.save()
    # Respuesta exitosa
        return Response(status=status.HTTP_204_NO_CONTENT)

class DevolucionesViewSet(viewsets.ModelViewSet):
    serializer_class = DevolucionesSerializer
    queryset = Devoluciones.objects.all()
    #metodo post para el front
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        producto = Producto.objects.get(idProducto=serializer.data['idProd_fk'])
        producto.stock += serializer.validated_data['cantDevuelta']
        producto.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        #metodo put para el front
    def update(self, request, *args, **kwargs):
        devolucion_original = self.get_object()
        partial = kwargs.pop('partial', False)
        instance = self.get_object()    
    # Actualiza el ingreso
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)    
    # Obtén el id del producto desde el serializer data
        id_producto = serializer.data['idProd_fk']  # Asegúrate de que este campo devuelva el ID del producto, no la instancia
     # Busca el producto usando el ID
        producto = Producto.objects.get(idProducto=id_producto)    
    # Si estás actualizando la cantidad del ingreso, deberías ajustar el stock del producto.   
        nueva_cantidad = serializer.data['cantDevuelta'] 
        diferencia = nueva_cantidad - devolucion_original.cantDevuelta 
        if diferencia > 0:
            producto.stock += abs(diferencia)
        elif diferencia < 0:
            producto.stock -= abs(diferencia)
    # Actualiza el stock del producto
        #producto.stock += nueva_cantidad  # Aquí ajustas según tu lógica
        producto.save()
        return Response(serializer.data)
    #metodo delete para el front
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()  # Obtiene la instancia de Ingreso a eliminar
        devolucion = Devoluciones.objects.get(idDevolucion=instance.idDevolucion)  # Obtiene el ingreso específico
    # Eliminar el ingreso
        self.perform_destroy(instance)
    # Acceder al producto relacionado con el ingreso
        producto = Producto.objects.get(idProducto=devolucion.idProd_fk.idProducto)  # Accede al ID del producto
    # Actualizar el stock
        producto.stock -= devolucion.cantDevuelta
        producto.save()
    # Respuesta exitosa
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProduccionViewSet(viewsets.ModelViewSet):
    serializer_class = ProduccionSerializer
    queryset = Produccion.objects.all()
    """ Funcion para actualizar Inventario"""

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        producto = Producto.objects.get(idProducto=serializer.data['idProd_fk'])
        producto.stock += serializer.validated_data['cantProduccion']
        producto.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        #metodo put para el front
    def update(self, request, *args, **kwargs):
        produccion_original = self.get_object()
        partial = kwargs.pop('partial', False)
        instance = self.get_object()    
    # Actualiza el ingreso
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)    
    # Obtén el id del producto desde el serializer data
        id_producto = serializer.data['idProd_fk']  # Asegúrate de que este campo devuelva el ID del producto, no la instancia
     # Busca el producto usando el ID
        producto = Producto.objects.get(idProducto=id_producto)    
    # Si estás actualizando la cantidad del ingreso, deberías ajustar el stock del producto.   
        nueva_cantidad = serializer.data['cantProduccion'] 
        diferencia = nueva_cantidad - produccion_original.cantProduccion 
        if diferencia > 0:
            producto.stock += abs(diferencia)
        elif diferencia < 0:
            producto.stock -= abs(diferencia)
    # Actualiza el stock del producto
        #producto.stock += nueva_cantidad  # Aquí ajustas según tu lógica
        producto.save()
        return Response(serializer.data)
    #metodo delete para el front
    """ elimina la produccion con su detalle"""

    def destroy(self, request, *args, **kwargs):
        # Envolver en una transacción atómica para asegurar la consistencia
        with transaction.atomic():
            # Obtener la producción que se va a eliminar
            instance = self.get_object()
            
            # Obtener los productos usados en esta producción (detalle_produccion)
            detalles_produccion = Detalle_Produccion.objects.filter(idProduccion_fk=instance.idProduccion)
            
            # Actualizar el stock del producto a elaborarse (restar lo que se produjo)
            producto_elaborado = Producto.objects.get(idProducto=instance.idProd_fk.idProducto)
            producto_elaborado.stock -= instance.cantProduccion  # Se resta del stock del producto elaborado
            producto_elaborado.save()
            
            # Iterar sobre cada producto usado en la producción y devolver el stock
            for detalle in detalles_produccion:
                producto_usado = Producto.objects.get(idProducto=detalle.idMateriaPrima_fk.idProducto)                
                # Sumar la cantidad usada de cada producto de vuelta al stock
                producto_usado.stock += detalle.cantidadUsada
                producto_usado.save()
            
            # Eliminar los detalles de la producción (productos usados)
            detalles_produccion.delete()            
            # Eliminar la producción
            self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)

class DetalleProduccionViewSet(viewsets.ModelViewSet):
    serializer_class = Detalle_ProduccionSerializer
    queryset = Detalle_Produccion.objects.all()

    def get_queryset(self):
        queryset =  super().get_queryset()
        produccion = self.request.query_params.get('idProduccion_fk', None)
        if produccion is not None:
            queryset = queryset.filter(idProduccion_fk=produccion)
        return queryset
    """ Funcion para actualizar Inventario"""
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        producto = Producto.objects.get(idProducto=serializer.data['idMateriaPrima_fk'])
        if serializer.data['cantidadUsada'] > 0 and producto.stock >= serializer.data['cantidadUsada']:        
            #producto.stock += nueva_cantidad        
            producto.stock -= serializer.validated_data['cantidadUsada']
            producto.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        #metodo put para el front
    def update(self, request, *args, **kwargs):
        detalleP_original = self.get_object()
        partial = kwargs.pop('partial', False)
        instance = self.get_object()    
    # Actualiza el ingreso
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)    
    # Obtén el id del producto desde el serializer data
        id_producto = serializer.data['idMateriaPrima_fk']  # Asegúrate de que este campo devuelva el ID del producto, no la instancia
     # Busca el producto usando el ID
        producto = Producto.objects.get(idProducto=id_producto)    
    # Si estás actualizando la cantidad del ingreso, deberías ajustar el stock del producto.   
        nueva_cantidad = serializer.data['cantidadUsada'] 
        diferencia = nueva_cantidad - detalleP_original.cantidadUsada 
        if diferencia > 0:
            producto.stock -= abs(diferencia)
        elif diferencia < 0:
            producto.stock += abs(diferencia)
    # Actualiza el stock del producto
        #producto.stock += nueva_cantidad  # Aquí ajustas según tu lógica
        producto.save()
        return Response(serializer.data)
    #metodo delete para el front
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()  # Obtiene la instancia de Ingreso a eliminar
        prima = Detalle_Produccion.objects.get(idDetalleProduccion=instance.idDetalleProduccion)  # Obtiene el detalle especifico
    # Eliminar el ingreso
        self.perform_destroy(instance)
    # Acceder al producto relacionado con el ingreso
        producto = Producto.objects.get(idProducto=prima.idMateriaPrima_fk.idProducto)  # Accede al ID del producto
    # Actualizar el stock
        producto.stock += prima.cantidadUsada
        producto.save()
    # Respuesta exitosa
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class IngresoViewSet(viewsets.ModelViewSet):
    serializer_class = IngresoSerializer    
    queryset = Ingreso.objects.all()
    #metodo post para el front
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
        #metodo put para el front
    def update(self, request, *args, **kwargs):
        ingreso_original = self.get_object()
        partial = kwargs.pop('partial', False)
        instance = self.get_object()    
    # Actualiza el ingreso
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)    
    # Obtén el id del producto desde el serializer data
        id_producto = serializer.data['idProd_fk']  # Asegúrate de que este campo devuelva el ID del producto, no la instancia
     # Busca el producto usando el ID
        producto = Producto.objects.get(idProducto=id_producto)    
    # Si estás actualizando la cantidad del ingreso, deberías ajustar el stock del producto.   
        nueva_cantidad = serializer.data['cantIngreso'] 
        diferencia = nueva_cantidad - ingreso_original.cantIngreso 
        if diferencia > 0:
            producto.stock += abs(diferencia)
        elif diferencia < 0:
            producto.stock -= abs(diferencia)
    # Actualiza el stock del producto
        #producto.stock += nueva_cantidad  # Aquí ajustas según tu lógica
        producto.save()
        return Response(serializer.data)
    #metodo delete para el front
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