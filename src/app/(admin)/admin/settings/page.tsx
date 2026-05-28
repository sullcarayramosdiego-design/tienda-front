'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Eye, 
  CreditCard, 
  Bell, 
  Truck,
  ShieldCheck,
  CheckCircle,
  Database,
  Gift,
  Percent,
  Coins
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Estados de configuración de la Tienda y Finanzas
  const [stockThreshold, setStockThreshold] = useState('10');
  const [currency, setCurrency] = useState('PEN');
  const [taxRate, setTaxRate] = useState('18');
  const [shippingFee, setShippingFee] = useState('15.00');

  // Estados de Mecánicas de Fidelización (Club 3D)
  const [vipDiscount, setVipDiscount] = useState('10');
  const [pointsEquivalence, setPointsEquivalence] = useState('1.00'); // 100 puntos = 1.00
  const [pointsPerPurchase, setPointsPerPurchase] = useState('5'); // 5 pts por S/1
  const [pointsReferrer, setPointsReferrer] = useState('500');
  const [pointsReferee, setPointsReferee] = useState('250');

  // Estados de Pasarelas
  const [paymentCulqi, setPaymentCulqi] = useState(true);
  const [paymentYape, setPaymentYape] = useState(true);
  const [paymentPlin, setPaymentPlin] = useState(true);
  const [paymentCod, setPaymentCod] = useState(true);

  // Estados de configuración 3D y AR
  const [autoRotate, setAutoRotate] = useState('true');
  const [renderQuality, setRenderQuality] = useState('HIGH');
  const [arEnabled, setArEnabled] = useState('true');

  // Estados de configuración de Notificaciones
  const [alertEmail, setAlertEmail] = useState('admin@ecommerce3d.com');
  const [soundEnabled, setSoundEnabled] = useState('true');
  const [notifyNewOrder, setNotifyNewOrder] = useState('true');

  // Guardar Configuraciones
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Simular guardado en base de datos
      await new Promise((resolve) => setTimeout(resolve, 1200));

      toast({
        type: 'success',
        title: 'Configuraciones Guardadas',
        description: 'Las variables globales del panel y catálogo se han actualizado correctamente.',
      });
    } catch (error) {
      toast({
        type: 'error',
        title: 'Error al guardar',
        description: 'Ocurrió un error inesperado al escribir en la base de datos.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Restablecer valores predeterminados
  const handleResetSettings = () => {
    setStockThreshold('10');
    setCurrency('PEN');
    setTaxRate('18');
    setShippingFee('15.00');
    setVipDiscount('10');
    setPointsEquivalence('1.00');
    setPointsPerPurchase('5');
    setPointsReferrer('500');
    setPointsReferee('250');
    setPaymentCulqi(true);
    setPaymentYape(true);
    setPaymentPlin(true);
    setPaymentCod(true);
    setAutoRotate('true');
    setRenderQuality('HIGH');
    setArEnabled('true');
    setAlertEmail('admin@ecommerce3d.com');
    setSoundEnabled('true');
    setNotifyNewOrder('true');

    toast({
      type: 'warning',
      title: 'Valores restablecidos',
      description: 'Se han cargado los valores por defecto del sistema (presione Guardar para aplicar).',
    });
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <SettingsIcon className="h-8 w-8 text-primary" />
              Configuración del Panel de Control
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Ajusta las variables operativas de la tienda, pasarelas de pago, visualizador 3D y notificaciones.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleResetSettings} 
              variant="outline" 
              className="gap-2 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Predeterminados
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving}
              className="gap-2 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer bg-primary text-primary-foreground"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Guardando...' : 'Guardar Todo'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* Bloque 1: Configuración Operativa e Inventario */}
          <Card className="bg-card/40 border-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Truck className="h-4.5 w-4.5 text-primary" /> Gestión Financiera y Operativa
              </CardTitle>
              <CardDescription className="text-[11px]">
                Umbrales críticos, moneda, impuestos (IGV) y tarifas de envío globales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                {/* Umbral de Stock */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Umbral Crítico (Alerta)</span>
                  <Input
                    type="number"
                    value={stockThreshold}
                    onChange={(e) => setStockThreshold(e.target.value)}
                    required
                    className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  />
                </div>
                {/* Divisa */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Divisa Oficial</span>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-primary/5 text-xs cursor-pointer">
                      <SelectValue placeholder="Soles (S/.)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem className="text-xs cursor-pointer" value="PEN">Soles Peruanos (S/.)</SelectItem>
                      <SelectItem className="text-xs cursor-pointer" value="USD">Dólares Americanos ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* IGV */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tasa de IGV (%)</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    required
                    className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  />
                </div>
                {/* Envío */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tarifa Base Envío (S/.)</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.10"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    required
                    className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloque 2: Mecánicas de Fidelización (Club 3D) */}
          <Card className="bg-card/40 border-primary/5 border-violet-500/10">
            <CardHeader className="bg-violet-500/5 pb-4 border-b border-violet-500/10 rounded-t-xl">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-violet-500">
                <Gift className="h-4.5 w-4.5" /> Mecánicas de Fidelización (Club 3D)
              </CardTitle>
              <CardDescription className="text-[11px] text-violet-500/70">
                Configura los beneficios, descuentos y reglas del sistema de lealtad.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold pt-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Descuento VIP */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dcto. Usuarios VIP (%)</span>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={vipDiscount}
                      onChange={(e) => setVipDiscount(e.target.value)}
                      required
                      className="h-10 rounded-xl pl-9 bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-violet-500/40 text-xs"
                    />
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                {/* Equivalencia Puntos */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor de 100 Pts (S/.)</span>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.10"
                      value={pointsEquivalence}
                      onChange={(e) => setPointsEquivalence(e.target.value)}
                      required
                      className="h-10 rounded-xl pl-9 bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-violet-500/40 text-xs"
                    />
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-primary/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Emisión de Puntos por Compras y Referidos</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground">Pts x S/1 Gasto</span>
                    <Input
                      type="number"
                      value={pointsPerPurchase}
                      onChange={(e) => setPointsPerPurchase(e.target.value)}
                      className="h-9 rounded-lg bg-muted/30 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground">Bono Patrocinador</span>
                    <Input
                      type="number"
                      value={pointsReferrer}
                      onChange={(e) => setPointsReferrer(e.target.value)}
                      className="h-9 rounded-lg bg-muted/30 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground">Bono Invitado</span>
                    <Input
                      type="number"
                      value={pointsReferee}
                      onChange={(e) => setPointsReferee(e.target.value)}
                      className="h-9 rounded-lg bg-muted/30 text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloque 3: Pasarelas de Pago Activas */}
          <Card className="bg-card/40 border-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-primary" /> Métodos de Pago Disponibles
              </CardTitle>
              <CardDescription className="text-[11px]">
                Habilita o deshabilita los proveedores de facturación durante el checkout del cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                {/* Culqi */}
                <button
                  type="button"
                  onClick={() => setPaymentCulqi(!paymentCulqi)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentCulqi 
                      ? "bg-primary/5 border-primary/20 text-foreground"
                      : "bg-muted/10 border-primary/5 text-muted-foreground opacity-60"
                  }`}
                >
                  <CheckCircle className={`h-4.5 w-4.5 ${paymentCulqi ? 'text-primary' : 'text-muted-foreground/40'}`} />
                  <span className="text-xs font-bold">Tarjeta Culqi</span>
                  <Badge variant="outline" className="text-[9px] scale-90">PERÚ</Badge>
                </button>

                {/* Yape */}
                <button
                  type="button"
                  onClick={() => setPaymentYape(!paymentYape)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentYape 
                      ? "bg-primary/5 border-primary/20 text-foreground"
                      : "bg-muted/10 border-primary/5 text-muted-foreground opacity-60"
                  }`}
                >
                  <CheckCircle className={`h-4.5 w-4.5 ${paymentYape ? 'text-primary' : 'text-muted-foreground/40'}`} />
                  <span className="text-xs font-bold">Yape QR</span>
                  <Badge variant="outline" className="text-[9px] scale-90">BARRAS</Badge>
                </button>

                {/* Plin */}
                <button
                  type="button"
                  onClick={() => setPaymentPlin(!paymentPlin)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentPlin 
                      ? "bg-primary/5 border-primary/20 text-foreground"
                      : "bg-muted/10 border-primary/5 text-muted-foreground opacity-60"
                  }`}
                >
                  <CheckCircle className={`h-4.5 w-4.5 ${paymentPlin ? 'text-primary' : 'text-muted-foreground/40'}`} />
                  <span className="text-xs font-bold">Plin QR</span>
                  <Badge variant="outline" className="text-[9px] scale-90">BARRAS</Badge>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentCod(!paymentCod)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentCod 
                      ? "bg-primary/5 border-primary/20 text-foreground"
                      : "bg-muted/10 border-primary/5 text-muted-foreground opacity-60"
                  }`}
                >
                  <CheckCircle className={`h-4.5 w-4.5 ${paymentCod ? 'text-primary' : 'text-muted-foreground/40'}`} />
                  <span className="text-xs font-bold">Contra Entrega</span>
                  <Badge variant="outline" className="text-[9px] scale-90">FÍSICO</Badge>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Bloque 3: Visualizador 3D & Realidad Aumentada */}
          <Card className="bg-card/40 border-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-primary" /> Visualizador 3D & Realidad Aumentada
              </CardTitle>
              <CardDescription className="text-[11px]">
                Configura los parámetros predeterminados para los renders de modelos GLB/USDZ en la tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              {/* Auto-rotar */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Auto-Rotación en Carga de Modelo</span>
                <Select value={autoRotate} onValueChange={setAutoRotate}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-primary/5 text-xs cursor-pointer">
                    <SelectValue placeholder="Habilitado" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem className="text-xs cursor-pointer" value="true">Habilitado por defecto</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="false">Apagado (Estático)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calidad */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Calidad de Renderizado Gráfico</span>
                <Select value={renderQuality} onValueChange={setRenderQuality}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-primary/5 text-xs cursor-pointer">
                    <SelectValue placeholder="Alta Calidad" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem className="text-xs cursor-pointer" value="HIGH">Alta Calidad (HDR + Sombras)</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="MEDIUM">Medio (Balance de Batería/Rendimiento)</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="LOW">Bajo (Optimizado para móviles antiguos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AR habilitado */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Realidad Aumentada (AR QuickLook / SceneViewer)</span>
                <Select value={arEnabled} onValueChange={setArEnabled}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-primary/5 text-xs cursor-pointer">
                    <SelectValue placeholder="Habilitado" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem className="text-xs cursor-pointer" value="true">Habilitado para iOS/Android</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="false">Desactivar botón AR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bloque 4: Alertas del Sistema y Notificaciones */}
          <Card className="bg-card/40 border-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-primary" /> Alertas de Sistema & Notificaciones
              </CardTitle>
              <CardDescription className="text-[11px]">
                Configura cómo y dónde quieres enterarte de los movimientos operativos de la tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              {/* Correo de Alerta */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Correo de Alertas Críticas (Broadcasts)</span>
                <Input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  required
                  className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                />
              </div>

              {/* Sonidos del Panel */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sonidos de Notificación en Panel</span>
                <Select value={soundEnabled} onValueChange={setSoundEnabled}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-primary/5 text-xs cursor-pointer">
                    <SelectValue placeholder="Habilitado" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem className="text-xs cursor-pointer" value="true">Activar sonidos (Campana en tiempo real)</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="false">Silencioso (Solo indicador visual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nuevas órdenes alertas */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alerta en Pantalla por Nuevos Pedidos</span>
                <Select value={notifyNewOrder} onValueChange={setNotifyNewOrder}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-primary/5 text-xs cursor-pointer">
                    <SelectValue placeholder="Habilitado" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem className="text-xs cursor-pointer" value="true">Habilitado (Popup en tiempo real)</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="false">Habilitado silenciosamente en campana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Info extra */}
        <div className="flex items-center gap-2 bg-muted/20 p-4 rounded-xl border border-primary/5 text-xs font-semibold text-muted-foreground">
          <Database className="h-4.5 w-4.5 text-primary shrink-0" />
          <span>Configuraciones de base de datos conectadas en tiempo real. Los cambios afectarán directamente a los módulos storefront y a las pasarelas activas de forma inmediata.</span>
        </div>
      </div>
    </ProtectedRoute>
  );
}
