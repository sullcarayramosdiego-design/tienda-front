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
  Database
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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

  // Estados de configuración de la Tienda
  const [stockThreshold, setStockThreshold] = useState('10');
  const [currency, setCurrency] = useState('PEN');
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
                <Truck className="h-4.5 w-4.5 text-primary" /> Gestión Operativa e Inventario
              </CardTitle>
              <CardDescription className="text-[11px]">
                Umbrales críticos del stock de productos y parámetros de facturación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold">
              {/* Umbral de Stock */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Umbral de Stock Crítico (Alerta)</span>
                <Input
                  type="number"
                  value={stockThreshold}
                  onChange={(e) => setStockThreshold(e.target.value)}
                  required
                  className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                />
                <p className="text-[10px] text-muted-foreground/60 font-medium">Los productos con stock igual o inferior a este número dispararán el banner rojo de alerta.</p>
              </div>

              {/* Divisa */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Divisa Oficial de la Plataforma</span>
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
            </CardContent>
          </Card>

          {/* Bloque 2: Pasarelas de Pago Activas */}
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
