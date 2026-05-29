import apiClient from '@/lib/api-client';

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: ReviewUser;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export const reviewsService = {
  /**
   * GET /reviews/product/:productId — Obtener reseñas de un producto
   */
  async getProductReviews(productId: string, page = 1, limit = 10): Promise<{ data: Review[]; total: number }> {
    const response = await apiClient.get<{ success: boolean; data: { data: Review[]; meta: { total: number } } }>(
      `/reviews/product/${productId}`,
      { params: { page, limit } }
    );
    
    return {
      data: response.data.data.data,
      total: response.data.data.meta.total,
    };
  },

  /**
   * POST /reviews — Crear una nueva reseña
   */
  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const response = await apiClient.post<{ success: boolean; data: Review }>('/reviews', payload);
    return response.data.data;
  },
};

export default reviewsService;
