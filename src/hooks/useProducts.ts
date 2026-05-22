'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsService } from '@/services/products.service';
import type { Product, ProductListResponse, ProductQueryParams } from '@/types/api';

/**
 * Hook para gestionar productos con estados de carga y errores
 */
export function useProducts(initialParams?: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ProductListResponse['meta'] | null>(null);

  /**
   * Cargar productos con parámetros específicos
   */
  const fetchProducts = useCallback(async (params?: ProductQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsService.list(params);
      setProducts(response.items);
      setMeta(response.meta);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cargar productos';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar productos al montar el componente
   */
  useEffect(() => {
    fetchProducts(initialParams);
  }, [fetchProducts, initialParams]);

  /**
   * Refrescar lista de productos
   */
  const refresh = useCallback(() => {
    fetchProducts(initialParams);
  }, [fetchProducts, initialParams]);

  /**
   * Buscar productos por término
   */
  const search = useCallback(async (query: string) => {
    await fetchProducts({ ...initialParams, search: query });
  }, [fetchProducts, initialParams]);

  /**
   * Cambiar de página
   */
  const goToPage = useCallback(async (page: number) => {
    await fetchProducts({ ...initialParams, page });
  }, [fetchProducts, initialParams]);

  return {
    products,
    loading,
    error,
    meta,
    refresh,
    search,
    goToPage,
  };
}

/**
 * Hook para obtener un producto individual por ID
 */
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await productsService.getById(id);
        setProduct(data);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Error al cargar producto';
        setError(Array.isArray(message) ? message.join(', ') : message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return {
    product,
    loading,
    error,
  };
}

export default useProducts;
