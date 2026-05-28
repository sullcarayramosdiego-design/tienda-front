'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, Award, HelpCircle, ArrowRight, Share2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth';
import { referralsService, ReferralRecord, ReferralStats } from '@/features/engagement';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [myCode, setMyCode] = useState<{ referralCode: string; referralLink: string } | null>(null);
  const [referralsList, setReferralsList] = useState<ReferralRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos reales desde la API
  useEffect(() => {
    async function loadReferralData() {
      try {
        setLoading(true);
        setError(null);

        const [statsData, codeData, listData] = await Promise.all([
          referralsService.getStats(),
          referralsService.getMyCode(),
          referralsService.getMyReferrals(),
        ]);

        setStats(statsData);
        setMyCode(codeData);
        setReferralsList(listData);
      } catch (err: any) {
        console.error('Error al cargar datos de referidos:', err);
        setError('No se pudieron sincronizar las estadísticas de referidos en tiempo real.');
      } finally {
        setLoading(false);
      }
    }

    loadReferralData();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  // Fallbacks seguros si no se han cargado datos
  const referralCode = myCode?.referralCode || 'Cargando...';
  const referralLink = myCode?.referralLink || 'Cargando...';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2">
          <Gift className="h-7 w-7 text-primary" /> Programa de Referidos
        </h1>
        <p className="text-sm font-semibold text-muted-foreground mt-1">
          Invita a tus amigos y gana Puntos Club 3D canjeables por descuentos y privilegios premium.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl text-destructive text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/10 bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Amigos Invitados</span>
              <span className="text-xl font-heading font-black text-foreground">
                {stats?.totalReferrals || 0} { (stats?.totalReferrals || 0) === 1 ? 'amigo' : 'amigos' }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Puntos Acumulados</span>
              <span className="text-xl font-heading font-black text-primary">
                {(stats?.totalPointsEarned || 0).toLocaleString('es-PE')} pts
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#00D47C]/10 border border-[#00D47C]/20 flex items-center justify-center text-[#00AF66] shrink-0">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Pendientes de Compra</span>
              <span className="text-xl font-heading font-black text-foreground">
                {stats?.pendingReferrals || 0} invitaciones
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code & Sharing Card */}
      <Card className="border-primary/15 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-3xl overflow-hidden shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-heading font-black">Comparte tu Experiencia 3D</CardTitle>
          <CardDescription className="text-xs font-semibold text-muted-foreground mt-0.5">
            Tus amigos obtienen un **10% de descuento** en su primer pedido, y tú obtienes **500 Puntos Club 3D** cuando realicen su compra confirmada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Referral Code block */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground block">Tu Código de Referido</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-card border border-primary/10 rounded-xl px-4 flex items-center justify-between font-mono font-black text-sm text-primary tracking-wider select-all shadow-inner h-11">
                  {referralCode}
                </div>
                <Button 
                  onClick={() => copyToClipboard(referralCode)}
                  className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 cursor-pointer shadow-md hover:bg-primary/95 transition-all active:scale-95"
                  aria-label="Copiar código"
                >
                  {copied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
                </Button>
              </div>
            </div>

            {/* Referral Link block */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground block">Enlace de Registro</label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={referralLink} 
                  className="bg-card border-primary/10 rounded-xl h-11 font-mono text-xs text-muted-foreground truncate focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button 
                  onClick={() => copyToClipboard(referralLink)}
                  variant="outline"
                  className="h-11 w-11 rounded-xl border-primary/10 hover:bg-primary/5 flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95"
                  aria-label="Copiar enlace"
                >
                  {copied ? <Check className="h-4.5 w-4.5" /> : <Share2 className="h-4.5 w-4.5" />}
                </Button>
              </div>
            </div>

          </div>

          {copied && (
            <div className="flex items-center gap-2 p-2 bg-[#00D47C]/10 border border-[#00D47C]/20 text-[#00AF66] rounded-xl text-xs font-bold animate-fade-in justify-center">
              <Check className="h-4 w-4" />
              <span>¡Copiado al portapapeles exitosamente!</span>
            </div>
          )}

        </CardContent>
      </Card>

      {/* How it works section */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-3xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading font-extrabold flex items-center gap-1.5">
            <HelpCircle className="h-5 w-5 text-primary" /> ¿Cómo funciona el programa?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">1</span>
                <span className="text-xs font-bold text-foreground">Comparte tu código</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Envía tu código o enlace a tus amigos interesados en impresión y modelos 3D interactivos.
              </p>
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">2</span>
                <span className="text-xs font-bold text-foreground">Ellos obtienen 10% dto.</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Tus amigos obtienen un descuento automático de bienvenida del 10% en su primera orden de compra.
              </p>
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-[#00D47C]/10 border border-[#00D47C]/20 flex items-center justify-center text-xs font-black text-[#00AF66]">3</span>
                <span className="text-xs font-bold text-foreground">¡Tú ganas Puntos!</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Al procesarse y completarse la primera compra pagada de tu amigo, se sumarán 500 Puntos Club 3D a tu cuenta.
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Referral History Table */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading font-extrabold">Historial de Invitados</CardTitle>
          <CardDescription className="text-xs font-semibold text-muted-foreground">
            Monitorea en tiempo real el estado de tus recomendaciones y los puntos reales obtenidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-5">
          {referralsList.length === 0 ? (
            <div className="text-center py-10 space-y-2.5">
              <Users className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-semibold text-muted-foreground">Aún no tienes amigos registrados</p>
              <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto">
                Comparte tu enlace de registro único con tus amigos para empezar a acumular Puntos Club 3D.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/5 hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Amigo</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Fecha de Unión</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Estado</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Puntos Ganados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralsList.map((item) => {
                    const friend = item.referred;
                    const dateStr = new Date(item.createdAt).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });

                    return (
                      <TableRow key={item.id} className="border-primary/5 hover:bg-primary/5/30 transition-colors">
                        <TableCell className="py-3.5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">
                              {friend.firstName} {friend.lastName}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {friend.email.replace(/(?<=.)[^@\n](?=[^@\n]*?[^@\n].@)/g, '*')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-muted-foreground py-3.5">
                          {dateStr}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md border tracking-wider select-none ${
                            item.status === 'COMPLETED' 
                              ? 'bg-[#00D47C]/10 border-[#00D47C]/15 text-[#00AF66]' 
                              : 'bg-amber-500/10 border-amber-500/15 text-amber-500'
                          }`}>
                            {item.status === 'COMPLETED' ? 'Completado' : 'Registrado / Pendiente'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right py-3.5">
                          <span className={`text-xs font-black font-mono ${item.pointsAwarded > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {item.pointsAwarded > 0 ? `+${item.pointsAwarded} pts` : '0 pts'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
