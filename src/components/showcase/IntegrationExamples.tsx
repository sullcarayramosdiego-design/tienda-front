/**
 * 🚀 GUÍA DE INTEGRACIÓN - Backend E-Commerce 3D
 * 
 * Este archivo contiene ejemplos de uso de los servicios creados
 * para integrar el frontend Next.js con el backend NestJS.
 */

// ============================================================================
// 1. AUTENTICACIÓN
// ============================================================================

// Ejemplo de uso en un componente de Login
import { useAuth } from '@/features/auth/hooks/useAuth';

export function LoginExample() {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'admin@ecommerce3d.com',
        password: 'Admin123!',
      });
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login fallido:', err);
    }
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Cargando...' : 'Iniciar Sesión'}
    </button>
  );
}

// Ejemplo de registro
export function RegisterExample() {
  const { register, loading, error } = useAuth();

  const handleRegister = async () => {
    try {
      await register({
        email: 'nuevo@ejemplo.com',
        password: 'Password123!',
        firstName: 'Juan',
        lastName: 'Pérez',
      });
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Registro fallido:', err);
    }
  };

  return (
    <button onClick={handleRegister} disabled={loading}>
      {loading ? 'Registrando...' : 'Crear Cuenta'}
    </button>
  );
}

// ============================================================================
// 2. PRODUCTOS
// ============================================================================

// Listar productos con paginación
import { useProducts } from '@/features/inventory/hooks/useProducts';

export function ProductListExample() {
  const { products, loading, error, meta, goToPage } = useProducts({
    page: 1,
    limit: 20,
  });

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3>{product.name}</h3>
            <p>S/ {product.price.toFixed(2)}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
      
      {/* Paginación */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: meta?.totalPages || 0 }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={meta?.page === i + 1 ? 'font-bold' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// Obtener un producto individual
import { useProduct } from '@/features/inventory/hooks/useProducts';

export function ProductDetailExample({ productId }: { productId: string }) {
  const { product, loading, error } = useProduct(productId);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-2xl font-bold">S/ {product.price.toFixed(2)}</p>
      <p>SKU: {product.sku}</p>
      <p>Stock disponible: {product.stock}</p>
      
      {/* Modelos 3D asociados */}
      {product.assets && product.assets.length > 0 && (
        <div className="mt-4">
          <h3>Modelos 3D:</h3>
          {product.assets.map((asset) => (
            <div key={asset.id}>
              <a href={asset.fileUrl} download>
                {asset.fileName} ({asset.format})
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Crear producto (solo admin)
import { productsService } from '@/features/catalog/services/products.service';

export async function createProductExample() {
  try {
    const newProduct = await productsService.create({
      name: 'Silla Gamer 3D',
      description: 'Silla ergonómica con vista AR',
      price: 899.99,
      sku: 'CHAIR-001',
      stock: 50,
    });
    
    console.log('Producto creado:', newProduct);
    return newProduct;
  } catch (err: any) {
    console.error('Error:', err.response?.data?.message);
  }
}

// ============================================================================
// 3. ASSETS 3D
// ============================================================================

// Subir modelo 3D
import { assetsService } from '@/features/inventory/services/assets.service';
import { useState } from 'react';

export function UploadAssetExample({ productId }: { productId: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!assetsService.isValid3DFile(file)) {
      setError('Solo se permiten archivos .glb o .usdz');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const asset = await assetsService.upload(file, productId);
      
      console.log('Asset subido exitosamente:', asset);
      console.log('URL:', asset.fileUrl);
      console.log('Tamaño:', assetsService.formatFileSize(asset.fileSize));
      
      alert('Modelo 3D subido correctamente');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".glb,.usdz"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p>Subiendo modelo 3D...</p>}
      {error && <p className="text-destructive">{error}</p>}
    </div>
  );
}

// ============================================================================
// 4. USUARIO
// ============================================================================

// Obtener perfil del usuario actual
import { usersService } from '@/features/auth/services/users.service';

export async function getUserProfileExample() {
  try {
    const user = await usersService.getCurrentUser();
    console.log('Usuario actual:', user);
    return user;
  } catch (err: any) {
    console.error('Error:', err.response?.data?.message);
  }
}

// Actualizar perfil
export async function updateProfileExample() {
  try {
    const updatedUser = await usersService.updateProfile({
      firstName: 'Nuevo Nombre',
      lastName: 'Nuevo Apellido',
    });
    
    console.log('Perfil actualizado:', updatedUser);
    return updatedUser;
  } catch (err: any) {
    console.error('Error:', err.response?.data?.message);
  }
}

// ============================================================================
// 5. PROTECCIÓN DE RUTAS
// ============================================================================

// Middleware para proteger rutas autenticadas
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}

// Proteger ruta solo para administradores
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated || !isAdmin) return null;

  return <>{children}</>;
}

// ============================================================================
// 6. MANEJO DE ERRORES
// ============================================================================

// Manejo centralizado de errores de API
import { AxiosError } from 'axios';

export function handleApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    switch (status) {
      case 400:
        console.error('Datos inválidos:', message);
        break;
      case 401:
        console.error('No autorizado - Token inválido');
        // Redirigir al login
        window.location.href = '/login';
        break;
      case 403:
        console.error('Acceso denegado - Permisos insuficientes');
        break;
      case 404:
        console.error('Recurso no encontrado');
        break;
      case 500:
        console.error('Error del servidor');
        break;
      default:
        console.error('Error desconocido:', message);
    }
    
    return Array.isArray(message) ? message.join(', ') : message || 'Error desconocido';
  }
  
  return 'Error de conexión';
}

// ============================================================================
// 7. BÚSQUEDA Y FILTROS
// ============================================================================

// Búsqueda de productos
export function SearchExample() {
  const { search, products, loading } = useProducts();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    search(query);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
      />
      <button onClick={handleSearch} disabled={loading}>
        Buscar
      </button>
      
      {loading ? (
        <p>Buscando...</p>
      ) : (
        <div>
          {products.map((p) => (
            <div key={p.id}>{p.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// Filtrar por precio
export async function filterByPriceExample() {
  try {
    const results = await productsService.filterByPrice(100, 500);
    console.log(`Encontrados ${results.meta.total} productos entre S/100 - S/500`);
    return results;
  } catch (err: any) {
    console.error('Error al filtrar:', err.response?.data?.message);
  }
}
