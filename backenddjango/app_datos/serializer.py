from rest_framework import serializers
from .models import *

class Tipo_ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_Producto
        fields = '__all__'

class ProveedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedores
        fields = '__all__'
class Tipo_PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_Pedido
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
    class Meta:
        model = Producto
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

class Detalle_PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detalle_Pedido
        fields = '__all__'

class DevolucionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devoluciones
        fields = '__all__'

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'
class Detalle_ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detalle_Produccion
        fields = '__all__'
class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = '__all__'

class IngresoSerializer(serializers.ModelSerializer):
    #idProd_fk = ProductoSerializer()    
    #idProd_fk = serializers.StringRelatedField()
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['idProd_fk'] = instance.idProd_fk.nombProd
        return rep



    class Meta:
        model = Ingreso
        fields = '__all__'

class DespachoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Despacho
        fields = '__all__'
