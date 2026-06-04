// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  assets?: Asset3D[];
  variants?: ProductVariant[];
  category?: any;
  isActive?: boolean;
  images?: string[];
}

// ============================================================================
// Product Variant Types
// ============================================================================

export interface VariantAttribute {
  key: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: VariantAttribute[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  images?: string[];
}

export interface CreateVariantData {
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes?: VariantAttribute[];
  images?: string[];
}

export interface UpdateVariantData {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  attributes?: VariantAttribute[];
  isActive?: boolean;
  images?: string[];
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  categoryId?: string;
  isActive?: boolean;
  images?: string[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
  categoryId?: string;
  isActive?: boolean;
  images?: string[];
}

export interface ProductListResponse {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  only3D?: boolean;
}

// ============================================================================
// 3D Asset Types
// ============================================================================

export interface Asset3D {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  format: 'glb' | 'usdz';
  productId: string;
  createdAt: string;
}

export interface UploadAssetData {
  file: File;
  productId: string;
}
