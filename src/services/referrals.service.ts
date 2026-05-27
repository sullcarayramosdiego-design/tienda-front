import apiClient from '@/lib/api-client';

export interface ReferralUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrer: ReferralUser;
  referredId: string;
  referred: ReferralUser;
  status: 'PENDING' | 'COMPLETED';
  pointsAwarded: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralCodeResult {
  referralCode: string;
  referralLink: string;
}

export interface ReferralStats {
  pendingReferrals: number;
  completedReferrals: number;
  totalReferrals: number;
  totalPointsEarned: number;
}

export interface ReferralListResponse {
  success: boolean;
  data: {
    data: ReferralRecord[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const referralsService = {
  /**
   * POST /referrals/apply — Asociar el patrocinador que refirió al usuario logueado
   */
  async applyReferral(referrerId: string): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.post<{ success: boolean; data: any }>('/referrals/apply', {
      referrerId,
    });
    return response.data;
  },

  /**
   * GET /referrals/my-code — Obtener código y link de referido del usuario logueado
   */
  async getMyCode(): Promise<ReferralCodeResult> {
    const response = await apiClient.get<{ success: boolean; data: ReferralCodeResult }>('/referrals/my-code');
    return response.data.data;
  },

  /**
   * GET /referrals/stats — Obtener estadísticas del programa de referidos del usuario
   */
  async getStats(): Promise<ReferralStats> {
    const response = await apiClient.get<{ success: boolean; data: ReferralStats }>('/referrals/stats');
    return response.data.data;
  },

  /**
   * GET /referrals/my-referrals — Obtener listado de referidos asociados al usuario
   */
  async getMyReferrals(): Promise<ReferralRecord[]> {
    const response = await apiClient.get<{ success: boolean; data: ReferralRecord[] }>('/referrals/my-referrals');
    return response.data.data;
  },

  /**
   * GET /referrals/admin — Listar todos los registros de referidos del sistema (solo Admins)
   */
  async getAllAdmin(page: number = 1, limit: number = 10): Promise<{
    data: ReferralRecord[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get<ReferralListResponse>(`/referrals/admin?page=${page}&limit=${limit}`);
    return response.data.data as any;
  },
};

export default referralsService;
