from django.test import TestCase
from models import Tipo_Producto

# Create your tests here.



class ProductoModelTest(TestCase):

    def setUp(self):
        self.tipo_producto = Tipo_Producto.objects.create(idTipo=1, nombTipo="Materia Prima")


    def test_creacion_producto(self):
        self.assertEqual(self.tipo_producto.idTipo, 1)
        self.assertEqual(self.tipo_producto.nombTipo, "Matria Prima")
        
        

