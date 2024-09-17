from django.db import models

# Create your models here.
class Tipo_Producto(models.Model):
    idTipo = models.AutoField(primary_key=True)
    nombTipo = models.CharField(max_length=25,null=False,blank=False)
    class Meta:        
        db_table = 'tipo_Producto'
    def __str__(self):
        return self.nombTipo

class Proveedores(models.Model):
    idProveedor = models.AutoField(primary_key=True)
    nombProveedor = models.CharField(max_length=25,null=False,blank=False)
    telefProveedor = models.CharField(max_length=10,null=True,blank=True)
    class Meta:        
        db_table = 'proveedores'
    def __str__(self):
        return self.nombProveedor

    
class Sucursal(models.Model):
    idSucursal = models.AutoField(primary_key=True)
    nombSucursal = models.CharField(max_length=25,null=False,blank=False)
    telefSucursal = models.CharField(max_length=10,null=True,blank=True)
    class Meta:        
        db_table = 'sucursal'
    def __str__(self):
        return self.nombSucursal
class Categoria(models.Model):
    idCategoria = models.AutoField(primary_key=True)
    nombCategoria = models.CharField(max_length=20,null=False,blank=False)
    class Meta:
        db_table = 'categoria'
    def __str__(self):
        return self.nombCategoria
    
class Producto(models.Model):
    idProducto = models.AutoField(primary_key=True)
    nombProd = models.CharField(max_length=25,null=False,blank=False)
    idCategoria_fk = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    idTipo_fk = models.ForeignKey(Tipo_Producto, on_delete=models.CASCADE)
    idProveedor_fk = models.ForeignKey(Proveedores, on_delete=models.CASCADE)
    unidadProducto = models.CharField(max_length=25,null=True,blank=True)
    class Meta:        
        db_table = 'producto'
    def __str__(self):
        return self.nombProd

class Ingreso(models.Model):
    idIngreso = models.AutoField(primary_key=True)
    idProd_fk = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantIngreso = models.IntegerField(null=False,blank=False)
    fechaIngreso = models.DateField(null=False,blank=False)
    class Meta:        
        db_table = 'ingreso'
    def __str__(self):
        return str(self.idIngreso)
    
class Pedido(models.Model):
    idPedido = models.AutoField(primary_key=True)         
    idSucursal_fk = models.ForeignKey(Sucursal, on_delete=models.CASCADE)
    fechaPedido = models.DateField(null=True,blank=True)    
    class Meta:        
        db_table = 'pedido'
    def __str__(self):
        return str(self.idPedido)
class Detalle_Pedido(models.Model):
    idDetalleP = models.AutoField(primary_key=True)
    idProd_fk = models.ForeignKey(Producto, on_delete=models.CASCADE)
    idPed_fk = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    cantidadPedido = models.IntegerField(null=False,blank=False)
    
    class Meta:        
        db_table = 'detalle_Pedido'
    def __str__(self):
        return str(self.idDetalleP)

class Devoluciones(models.Model):
    idDevolucion = models.AutoField(primary_key=True)
    idProd_fk = models.ForeignKey(Producto, on_delete=models.CASCADE)
    idSuc_fk = models.ForeignKey(Sucursal, on_delete=models.CASCADE)
    cantDevuelta = models.IntegerField(null=False,blank=False)
    fechaDevolucion = models.DateField(null=False,blank=False)
    motivoDevolucion = models.TextField(max_length=100,null=True,blank=True)
    class Meta:        
        db_table = 'devoluciones'
    def __str__(self):
        return str(self.idDevolucion)

class Produccion(models.Model):
    idProduccion = models.AutoField(primary_key=True)
    idProd_fk = models.ForeignKey(Producto, on_delete=models.CASCADE)    
    cantProduccion = models.IntegerField(null=False,blank=False)
    fechaProduccion = models.DateField(null=False,blank=False)
    class Meta:        
        db_table = 'produccion'
    def __str__(self):
        return str(self.idProduccion)

class Detalle_Produccion(models.Model):
    idDetalleProduccion = models.AutoField(primary_key=True)
    idProduccion_fk = models.ForeignKey(Produccion, on_delete=models.CASCADE)
    idMateriaPrima_fk = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidadUsada = models.IntegerField(null=False,blank=False)
    class Meta:        
        db_table = 'detalle_Produccion'
    def __str__(self):
        return str(self.idDetalleProduccion)    

class Inventario(models.Model):
    idInventario = models.AutoField(primary_key=True)
    idProd_fk = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantInventario = models.IntegerField(null=False,blank=False)
    fechaInventario = models.DateField(null=False,blank=False)
    class Meta:        
        db_table = 'inventario'
    def __str__(self):
        return str(self.idInventario)

class Despacho(models.Model):
    idDespacho = models.AutoField(primary_key = True)
    idPedido_fk = models.OneToOneField(Pedido, on_delete=models.CASCADE,null=False,blank=False)
    fechaDespacho = models.DateField(null=False,blank=False)
    class Meta:
        db_table = 'despacho'
    def __str__(self):
        return str(self.idDespacho)
