'use client';

import React, { useState } from 'react';
import { Gift, Copy, Check, Users, Award, HelpCircle, ArrowRight, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
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
  
  // Custom referral code based on user's name or fallback
  const referralCode = user 
    ? `${user.firstName.toUpperCase()}${Math.floor(100 + Math.random() * 900)}3D`
    : 'TIENDA3D500';

  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${referralCode}`
    : `https://tienda3d.pe/register?ref=${referralCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

  const referralHistory = [
    {
      id: '1',
      friendName: 'Carlos Pérez',
      email: 'c***z@gmail.com',
      date: '15/05/2026',
      status: 'Completado',
      points: 500,
    },
    {
      id: '2',
      friendName: 'Sofía Ramos',
      email: 's***s@hotmail.com',
      date: '02/05/2026',
      status: 'Completado',
      points: 500,
    },
    {
      id: '3',
      friendName: 'Luis Gómez',
      email: 'l***z@gmail.com',
      date: '28/04/2026',
      status: 'Registrado',
      points: 100,
    },
    {
      id: '4',
      friendName: 'Ana Mendoza',
      email: 'a***a@gmail.com',
      date: '10/04/2026',
      status: 'Pendiente',
      points: 0,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2">
          <Gift className="h-7 w-7 text-primary" /> Programa de Referidos
        </h1>
        <p className="text-sm font-semibold text-muted-foreground mt-1">
          Invita a tus amigos y gana Puntos 3D canjeables por descuentos y productos físicos.
        </p>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/10 bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Amigos Invitados</span>
              <span className="text-xl font-heading font-black text-foreground">4 amigos</span>
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
              <span className="text-xl font-heading font-black text-primary">1,100 pts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#00D47C]/10 border border-[#00D47C]/20 flex items-center justify-center text-[#00AF66] shrink-0">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Próxima Recompensa</span>
              <span className="text-xl font-heading font-black text-foreground">A los 1,500 pts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code & Sharing Card */}
      <Card className="border-primary/15 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-3xl overflow-hidden shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-heading font-black">Comparte tu Experiencia 3D</CardTitle>
          <CardDescription className="text-xs font-semibold text-muted-foreground mt-0.5">
            Tus amigos obtienen un **10% de descuento** en su primer pedido, y tú obtienes **500 Puntos 3D** cuando realicen su compra.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Referral Code block */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground block">Tu Código de Referido</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-card border border-primary/10 rounded-xl px-4 flex items-center justify-between font-mono font-black text-lg text-primary tracking-wider select-all shadow-inner h-11">
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
                Envía tu código o enlace a tus amigos interesados en impresión y modelos 3D.
              </p>
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">2</span>
                <span className="text-xs font-bold text-foreground">Ellos obtienen 10% dto.</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Tus amigos obtienen un descuento automático de bienvenida del 10% en su primera orden.
              </p>
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-[#00D47C]/10 border border-[#00D47C]/20 flex items-center justify-center text-xs font-black text-[#00AF66]">3</span>
                <span className="text-xs font-bold text-foreground">¡Tú ganas Puntos!</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Al completarse el envío del primer pedido de tu amigo, se sumarán 500 Puntos 3D a tu cuenta.
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
            Monitorea el estado de tus recomendaciones y los puntos obtenidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/5 hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Amigo</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Fecha</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Estado</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Puntos Ganados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralHistory.map((item) => (
                  <TableRow key={item.id} className="border-primary/5 hover:bg-primary/5/30 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{item.friendName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{item.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground py-3.5">{item.date}</TableCell>
                    <TableCell className="py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md border tracking-wider select-none ${
                        item.status === 'Completado' 
                          ? 'bg-[#00D47C]/10 border-[#00D47C]/15 text-[#00AF66]' 
                          : item.status === 'Registrado'
                          ? 'bg-[#00D2D3]/10 border-[#00D2D3]/15 text-[#00A8A9]'
                          : 'bg-muted border-primary/10 text-muted-foreground'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <span className={`text-xs font-black font-mono ${item.points > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {item.points > 0 ? `+${item.points} pts` : '0 pts'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
