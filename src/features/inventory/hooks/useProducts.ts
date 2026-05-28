'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { productsService } from '@/features/catalog';
import type  { Product, ProductListResponse, ProductQueryParams } from '@/features/inventory';

/**
 * Hook para gestionar productos con estados de carga y errores
 */
export function useProducts(initialParams?: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ProductListResponse['meta'] | null>(null);

  /**
   * Cargar productos con parámetros específicos.
   * No tiene dependencias externas: los params se pasan en cada llamada.
   */
  const fetchProducts = useCallback(async (params?: ProductQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsService.list(params);
      if (Array.isArray(response)) {
        setProducts(response);
        setMeta({
          total: response.length,
          page: 1,
          limit: response.length,
          totalPages: 1,
        });
      } else if (response && Array.isArray((response as any).items)) {
        setProducts((response as any).items);
        setMeta((response as any).meta);
      } else if (response && Array.isArray((response as any).data)) {
        // In case the raw data is wrapped inside a secondary data field
        const rawData = (response as any).data;
        setProducts(rawData);
        if ((response as any).meta) {
          setMeta((response as any).meta);
        } else {
          setMeta({
            total: rawData.length,
            page: 1,
            limit: rawData.length,
            totalPages: 1,
          });
        }
      } else {
        setProducts([]);
        setMeta(null);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cargar productos';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  }, []); // ← sin dependencias: params se pasan al invocar

  /**
   * FIX "Maximum update depth exceeded":
   *
   * El problema raíz es que `initialParams` es un OBJETO LITERAL creado en el
   * componente padre. Cada render padre produce una nueva referencia de objeto,
   * aunque los valores sean idénticos. Si ponemos el objeto directamente en el
   * array de deps del useEffect, React lo compara por referencia (===), detecta
   * un objeto "nuevo" en cada render y dispara el efecto infinitamente.
   *
   * Solución: serializar los params con JSON.stringify → string estable que sólo
   * cambia cuando los VALORES realmente son distintos.
   */
  const paramsKey = JSON.stringify(initialParams ?? null);

  // Ref para acceder a los últimos params dentro del efecto sin añadirlos como dep.
  const paramsRef = useRef(initialParams);
  useEffect(() => {
    paramsRef.current = initialParams;
  });

  /**
   * Disparar fetch al montar y cuando los valores de initialParams cambien.
   */
  useEffect(() => {
    fetchProducts(paramsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProducts, paramsKey]); // paramsKey es string → comparación por valor, no por referencia

  /**
   * Refrescar lista de productos
   */
  const refresh = useCallback(() => {
    fetchProducts(paramsRef.current);
  }, [fetchProducts]);

  /**
   * Buscar productos por término
   */
  const search = useCallback(async (query: string) => {
    await fetchProducts({ ...paramsRef.current, search: query });
  }, [fetchProducts]);

  /**
   * Cambiar de página
   */
  const goToPage = useCallback(async (page: number) => {
    await fetchProducts({ ...paramsRef.current, page });
  }, [fetchProducts]);

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
 * Hook para obtener un producto individual por ID o Slug
 */
export function useProduct(idOrSlug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
        const data = isUuid 
          ? await productsService.getById(idOrSlug)
          : await productsService.getBySlug(idOrSlug);

        setProduct(data);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Error al cargar producto';
        setError(Array.isArray(message) ? message.join(', ') : message);
      } finally {
        setLoading(false);
      }
    };

    if (idOrSlug) {
      fetchProduct();
    }
  }, [idOrSlug]);

  return {
    product,
    loading,
    error,
  };
}

export default useProducts;
