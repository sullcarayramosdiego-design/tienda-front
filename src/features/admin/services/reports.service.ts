import apiClient from '@/lib/api-client';
import type  { ApiResponse } from '@/types/api';

export interface FinanceSummary {
  totalRevenue: number;
  orderCount: number;
  averageTicket: number;
  paymentMethods: Array<{
    method: string;
    revenue: number;
    count: number;
  }>;
  period: {
    start: string;
    end: string;
  };
}

export interface LedgerTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  providerId: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface FinanceLedgerResponse {
  ledger: LedgerTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeBuyersCount: number;
  conversionRate: number;
  periodNewUsers: number;
  periodActiveBuyers: number;
  dailyRegistrations: Array<{
    date: string;
    count: number;
  }>;
}

export interface ProductAnalytics {
  topProducts: Array<{
    productId: string;
    name: string;
    sku: string;
    category: string;
    unitsSold: number;
    revenue: number;
  }>;
  categoriesBreakdown: Array<{
    category: string;
    revenue: number;
    unitsSold: number;
  }>;
}

export const reportsService = {
  /**
   * GET /reports/finance/summary
   */
  async getFinanceSummary(startDate?: string, endDate?: string): Promise<FinanceSummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<ApiResponse<FinanceSummary>>(
      `/reports/finance/summary?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * GET /reports/finance/ledger
   */
  async getFinanceLedger(
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 10
  ): Promise<FinanceLedgerResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<ApiResponse<FinanceLedgerResponse>>(
      `/reports/finance/ledger?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * GET /reports/analytics/users
   */
  async getAnalyticsUsers(startDate?: string, endDate?: string): Promise<UserAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<ApiResponse<UserAnalytics>>(
      `/reports/analytics/users?${params.toString()}`
    );
    return response.data.data;
  },

  /**
   * GET /reports/analytics/products
   */
  async getAnalyticsProducts(
    startDate?: string,
    endDate?: string,
    limit = 5
  ): Promise<ProductAnalytics> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get<ApiResponse<ProductAnalytics>>(
      `/reports/analytics/products?${params.toString()}`
    );
    return response.data.data;
  },
};

export default reportsService;
