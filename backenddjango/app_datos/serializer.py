from rest_framework import serializers
from django_filters import rest_framework as filters
from .models import *

class Tipo_ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_Producto
        fields = '__all__'

class ProveedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedores
        fields = '__all__'

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'
        
class ProductoSerializer(serializers.ModelSerializer): 
     
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['idCategoria_fk'] = instance.idCategoria_fk.nombCategoria
        rep['idTipo_fk'] = instance.idTipo_fk.nombTipo
        rep['idProveedor_fk'] = instance.idProveedor_fk.nombProveedor
        return rep
     
    class Meta:
        model = Producto
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['idSucursal_fk'] = instance.idSucursal_fk.nombSucursal
        return rep
    class Meta:
        model = Pedido
        fields = '__all__'

class Detalle_PedidoFilter(filters.FilterSet):
    #name = filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = Detalle_Pedido
        fields = ['idPed_fk']

class Detalle_PedidoSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['idProd_fk'] = instance.idProd_fk.nombProd
        
        return rep
    class Meta:
        model = Detalle_Pedido
        fields = '__all__'
        filterset_class = Detalle_PedidoFilter        

class DevolucionesSerializer(serializers.ModelSerializer):     #idSuc_fk = serializers.StringR
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        #rep['idProd_fk'] = instance.idProd_fk.nombProd 
        rep['idSuc_fk'] = instance.idSuc_fk.nombSucursal    
        return rep   
    
    class Meta:
        model = Devoluciones
        fields = '__all__'

class ProduccionSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['idProd_fk'] = instance.idProd_fk.nombProd
        return rep
    class Meta:
        model = Produccion
        fields = '__all__'


class Detalle_ProduccionFilter(filters.FilterSet):
   # name = filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = Detalle_Produccion
        fields = ['idProduccion_fk']
    
class Detalle_ProduccionSerializer(serializers.ModelSerializer):
   # name = serializers.CharField(source='idProduccion_fk')
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['idMateriaPrima_fk'] = instance.idMateriaPrima_fk.nombProd
        return rep
    class Meta:
        model = Detalle_Produccion
        fields = '__all__'
        filterset_class = Detalle_ProduccionFilter
        


class IngresoSerializer(serializers.ModelSerializer):    #idProd_fk = ProductoSerializer()    
    #idProd_fk = serializers.StringRelatedField()
    
    class Meta:
        model = Ingreso
        fields = '__all__'

class DespachoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Despacho
        fields = '__all__'
