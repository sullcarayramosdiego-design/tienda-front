'use client';

import { useState, useCallback } from 'react';
import { loyaltyService, type LoyaltyAccount } from '@/services/loyalty.service';

/**
 * Hook para gestionar el programa de lealtad del usuario autenticado.
 * Conecta con GET /loyalty/me y POST /loyalty/redeem (Fase 1 backend).
 */
export function useLoyalty() {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  /**
   * Carga la cuenta de lealtad completa del usuario
   */
  const fetchAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loyaltyService.getMyAccount();
      setAccount(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(msg || 'Error al cargar cuenta de lealtad');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Canjea puntos por descuento y actualiza el estado local
   */
  const redeemPoints = useCallback(
    async (points: number): Promise<{ discountAmount: number; remainingPoints: number } | null> => {
      setRedeeming(true);
      setError(null);
      try {
        const result = await loyaltyService.redeemPoints(points);
        // Actualizar puntos localmente sin refetch
        if (account) {
          setAccount((prev) =>
            prev
              ? {
                  ...prev,
                  points: result.remainingPoints,
                  discountValue: result.remainingPoints / 100,
                }
              : prev,
          );
        }
        return result;
      } catch (err: unknown) {
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
        setError(msg || 'Error al canjear puntos');
        return null;
      } finally {
        setRedeeming(false);
      }
    },
    [account],
  );

  return { account, loading, error, redeeming, fetchAccount, redeemPoints };
}

export default useLoyalty;
