import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Asset3DUpload } from '@/components/admin/Asset3DUpload';

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Subir Modelos 3D</h2>
            <Asset3DUpload productId="example-product-id" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Gestión de Productos</h2>
            <p className="text-muted-foreground">
              Aquí podrás crear, editar y eliminar productos del catálogo.
            </p>
            {/* Agregar más componentes de admin aquí */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
