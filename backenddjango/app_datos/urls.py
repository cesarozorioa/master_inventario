from django.urls import path,include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from app_datos import views 

router = routers.DefaultRouter()
router.register(r'tipo_producto', views.Tipo_ProductoViewSet, 'tipo_producto')

router.register(r'proveedores', views.ProveedoresViewSet, 'proveedores')

router.register(r'sucursal', views.SucursalesViewSet, 'sucursal')

router.register(r'categoria', views.CategoriaViewSet, 'categoria')

router.register(r'producto', views.ProductoViewSet, 'producto')

router.register(r'pedido', views.PedidoViewSet, 'pedido')

router.register(r'detalle_pedido', views.Detalle_PedidoViewSet, 'detalle_pedido')

router.register(r'devolucion', views.DevolucionesViewSet, 'devoluciones')

router.register(r'produccion', views.ProduccionViewSet, 'produccion')

router.register(r'detalle_produccion', views.DetalleProduccionViewSet, 'detalle_produccion')

router.register(r'ingreso', views.IngresoViewSet, 'ingreso')

router.register(r'egreso', views.EgresoViewSet, 'egreso')

router.register(r'despacho', views.DespachoViewSet, 'despacho')



urlpatterns = [
    path('v1/', include(router.urls)),
   path('docs/', include_docs_urls(title='api_inventarios', public=False)), 
]