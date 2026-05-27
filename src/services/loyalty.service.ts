import apiClient from '@/lib/api-client';

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface PointsTransaction {
  id: string;
  points: number;
  reason: string;
  relatedOrderId?: string;
  createdAt: string;
}

export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  tier: LoyaltyTier;
  discountValue: number;       // points / 100 = soles de descuento disponibles
  nextTier: LoyaltyTier | null;
  pointsToNextTier: number;
  tierThresholds: Record<LoyaltyTier, number>;
  transactions: PointsTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface RedeemResult {
  discountAmount: number;
  remainingPoints: number;
}

/**
 * Servicio para interactuar con la API de lealtad
 * Endpoints implementados en Fase 1 del backend
 */
export const loyaltyService = {
  /**
   * GET /loyalty/me
   */
  async getMyAccount(): Promise<LoyaltyAccount> {
    const response = await apiClient.get<{ success: boolean; data: LoyaltyAccount }>('/loyalty/me');
    return response.data.data;
  },

  /**
   * POST /loyalty/redeem — 100 pts = S/. 1.00
   */
  async redeemPoints(points: number): Promise<RedeemResult> {
    const response = await apiClient.post<{ success: boolean; data: RedeemResult }>('/loyalty/redeem', { points });
    return response.data.data;
  },

  // ========================================================
  // ENDPOINTS ADMINISTRATIVOS (Solo ADMIN / SUPER_ADMIN)
  // ========================================================

  /**
   * GET /loyalty/admin/balances - Listar cuentas globales de fidelización
   */
  async getAccountsAdmin(page: number = 1, limit: number = 10): Promise<{
    accounts: LoyaltyAccount[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        accounts: LoyaltyAccount[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/loyalty/admin/balances?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  /**
   * POST /loyalty/admin/adjust - Ajuste manual de puntos para un usuario
   */
  async adjustPointsAdmin(userId: string, points: number, reason: string): Promise<LoyaltyAccount> {
    const response = await apiClient.post<{ success: boolean; data: LoyaltyAccount }>('/loyalty/admin/adjust', {
      userId,
      points,
      reason,
    });
    return response.data.data;
  },
};

export default loyaltyService;
