import apiClient from '@/lib/api-client';
import type  { ApiResponse } from '@/types/api';
import type  { Asset3D } from '@/features/inventory';

/**
 * Servicio para gestión de activos 3D (.glb, .usdz)
 */
export const assetsService = {
  /**
   * Subir un archivo 3D y asociarlo a un producto (requiere rol ADMIN)
   * @param file - Archivo .glb o .usdz
   * @param productId - ID del producto al que se asociará el asset
   */
  async upload(file: File, productId: string): Promise<Asset3D> {
    // Validar tipo de archivo
    const validExtensions = ['.glb', '.usdz'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      throw new Error(`Tipo de archivo no válido. Solo se permiten archivos ${validExtensions.join(', ')}`);
    }

    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);

    // Enviar petición con Content-Type multipart/form-data
    const response = await apiClient.post<ApiResponse<Asset3D>>('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  /**
   * Obtener información de un asset 3D por ID
   */
  async getById(id: string): Promise<Asset3D> {
    const response = await apiClient.get<ApiResponse<Asset3D>>(`/assets/${id}`);
    return response.data.data;
  },

  /**
   * Eliminar un asset 3D (requiere rol ADMIN)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/assets/${id}`);
  },

  /**
   * Obtener URL de descarga del asset
   */
  getDownloadUrl(asset: Asset3D): string {
    return asset.fileUrl;
  },

  /**
   * Validar si un archivo es un modelo 3D válido
   */
  isValid3DFile(file: File): boolean {
    const validExtensions = ['.glb', '.usdz'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return validExtensions.includes(fileExtension);
  },

  /**
   * Formatear tamaño de archivo para mostrar
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
};

export default assetsService;
