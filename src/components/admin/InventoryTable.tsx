'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  AlertTriangle, 
  History, 
  Sliders, 
  Search, 
  Plus, 
  Minus,
  RefreshCw,
  CheckCircle,
  FileText,
  User as UserIcon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { productsService } from '@/services/products.service';
import { inventoryService, LowStockAlert, InventoryMovement } from '@/services/inventory.service';
import type { Product } from '@/types/api';

export function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Estados de Crear Producto
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('0');
  const [newProductCategoryId, setNewProductCategoryId] = useState('');
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Estados de Modales
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'PURCHASE' | 'DAMAGE' | 'ADJUSTMENT' | 'RETURN'>('ADJUSTMENT');
  const [adjustQuantity, setAdjustQuantity] = useState('1');
  const [adjustDirection, setAdjustDirection] = useState<'ADD' | 'SUBTRACT'>('ADD');
  const [adjustReason, setAdjustReason] = useState('');
  const [submittingAdjust, setSubmittingAdjust] = useState(false);

  // Estados de Historial
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyMovements, setHistoryMovements] = useState<InventoryMovement[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Cargar productos y alertas
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, alertsData] = await Promise.all([
        productsService.list({ limit: 100 }),
        inventoryService.getLowStockAlerts(10), // Umbral de 10 unidades
      ]);
      const prodArray = Array.isArray(productsData)
        ? productsData
        : Array.isArray((productsData as any).data)
        ? (productsData as any).data
        : Array.isArray((productsData as any).items)
        ? (productsData as any).items
        : [];
      setProducts(prodArray);
      setLowStockAlerts(alertsData);
    } catch (error: any) {
      console.error('Error fetching inventory data:', error);
      toast({
        type: 'error',
        title: 'Error al sincronizar inventario',
        description: error.response?.data?.message || 'Error de comunicación.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cargar categorías al montar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productsService.getCategories();
        setCategoriesList(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Generar SKU de manera inteligente
  const generateSku = () => {
    if (newProductName) {
      const prefix = newProductName.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, 'PRD');
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      setNewProductSku(`${prefix}-${randomPart}`);
    } else {
      const randomPart = Math.floor(100000 + Math.random() * 900000);
      setNewProductSku(`PRD-${randomPart}`);
    }
  };

  // Enviar creación del nuevo producto
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceNum = parseFloat(newProductPrice);
    const stockNum = parseInt(newProductStock, 10);
    
    if (!newProductName.trim()) {
      toast({ type: 'error', title: 'Error', description: 'El nombre es obligatorio.' });
      return;
    }
    if (!newProductSku.trim()) {
      toast({ type: 'error', title: 'Error', description: 'El SKU es obligatorio.' });
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      toast({ type: 'error', title: 'Error', description: 'El precio debe ser un número mayor o igual a 0.' });
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      toast({ type: 'error', title: 'Error', description: 'El stock inicial debe ser mayor o igual a 0.' });
      return;
    }
    
    try {
      setSubmittingCreate(true);
      await productsService.create({
        name: newProductName.trim(),
        description: newProductDescription.trim(),
        sku: newProductSku.trim().toUpperCase(),
        price: priceNum,
        stock: stockNum,
        categoryId: newProductCategoryId || undefined,
      });
      
      toast({
        type: 'success',
        title: 'Producto Creado 🎁',
        description: `El producto ${newProductName} se ha registrado y agregado al inventario con éxito.`,
      });
      
      // Limpiar y Cerrar
      setNewProductName('');
      setNewProductDescription('');
      setNewProductSku('');
      setNewProductPrice('');
      setNewProductStock('0');
      setNewProductCategoryId('');
      setIsCreateOpen(false);
      
      // Recargar datos de la tabla
      fetchData();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        type: 'error',
        title: 'Error al registrar producto',
        description: error.response?.data?.message || 'Verifique que el SKU no esté duplicado.',
      });
    } finally {
      setSubmittingCreate(false);
    }
  };

  // Manejar apertura de modal de ajuste
  const openAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setAdjustType('ADJUSTMENT');
    setAdjustQuantity('1');
    setAdjustDirection('ADD');
    setAdjustReason('');
    setIsAdjustOpen(true);
  };

  // Enviar ajuste manual de stock
  const handleRecordAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = parseInt(adjustQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      toast({
        type: 'error',
        title: 'Cantidad inválida',
        description: 'Por favor ingrese un número entero mayor a 0.',
      });
      return;
    }

    // Calcular el delta real a enviar al backend
    // Si la dirección es SUBTRACT (restar), enviamos cantidad negativa
    const delta = adjustDirection === 'ADD' ? qty : -qty;

    try {
      setSubmittingAdjust(true);
      await inventoryService.recordMovement({
        productId: selectedProduct.id,
        movementType: adjustType,
        quantity: delta,
        reason: adjustReason || undefined,
      });

      toast({
        type: 'success',
        title: 'Inventario actualizado',
        description: `Se ajustó el stock de ${selectedProduct.name} correctamente.`,
      });

      setIsAdjustOpen(false);
      fetchData(); // Recargar tablas de stock
    } catch (error: any) {
      console.error('Error recording movement:', error);
      toast({
        type: 'error',
        title: 'Error al guardar movimiento',
        description: error.response?.data?.message || 'Verifique los permisos y cantidades.',
      });
    } finally {
      setSubmittingAdjust(false);
    }
  };

  // Abrir y cargar historial de movimientos
  const openHistoryModal = async (product: Product) => {
    setSelectedProduct(product);
    setIsHistoryOpen(true);
    setLoadingHistory(true);
    try {
      const data = await inventoryService.getProductMovements(product.id, 1, 30);
      setHistoryMovements(data.movements);
    } catch (error: any) {
      console.error('Error fetching movements history:', error);
      toast({
        type: 'error',
        title: 'Error al cargar historial',
        description: 'No se pudo obtener el historial de movimientos.',
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((p) => {
    const term = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
  });

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: 'SIN STOCK', variant: 'destructive', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
    if (stock < 10) return { label: 'BAJO STOCK', variant: 'outline', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' };
    return { label: 'DISPONIBLE', variant: 'outline', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
  };

  const getMovementBadge = (type: InventoryMovement['movementType']) => {
    switch (type) {
      case 'PURCHASE':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-extrabold text-[10px]">COMPRA</Badge>;
      case 'SALE':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-extrabold text-[10px]">VENTA</Badge>;
      case 'RETURN':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-extrabold text-[10px]">RETORNO</Badge>;
      case 'DAMAGE':
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-extrabold text-[10px]">DAÑADO</Badge>;
      case 'ADJUSTMENT':
      default:
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-extrabold text-[10px]">AJUSTE</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Productos */}
        <Card className="bg-card/75 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <Package className="h-24 w-24 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total de Catálogo
              <Package className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-black text-foreground">
                {products.length} <span className="text-xs font-bold text-muted-foreground">Productos</span>
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Catálogo activo de modelos 3D y tangibles
            </p>
          </CardContent>
        </Card>

        {/* Alertas Stock Crítico */}
        <Card className="bg-card/75 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <AlertTriangle className="h-24 w-24 text-rose-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Alertas de Stock
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-black text-rose-500">
                {lowStockAlerts.length} <span className="text-xs font-bold text-rose-500/80">Críticos</span>
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Productos con stock menor a 10 unidades
            </p>
          </CardContent>
        </Card>

        {/* Auditoría */}
        <Card className="bg-card/75 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <CheckCircle className="h-24 w-24 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Estado de Sistema
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-500">
              AUDITABLE
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Todos los movimientos registran audit logs ACID
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Buscador de Stock */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 p-4 rounded-xl border border-primary/5">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Buscar producto por SKU o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsCreateOpen(true)} className="flex-1 sm:flex-initial h-10 px-3.5 rounded-xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm shadow-primary/10">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
          <Button onClick={fetchData} variant="outline" size="sm" className="h-10 px-3.5 rounded-xl text-xs font-bold gap-1 cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" />
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Tabla Principal */}
      <Card className="bg-card/40 border-primary/5">
        <CardContent className="p-0">
          <div className="rounded-xl border border-primary/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold text-xs">SKU</TableHead>
                  <TableHead className="font-bold text-xs">Producto</TableHead>
                  <TableHead className="font-bold text-xs">Categoría</TableHead>
                  <TableHead className="font-bold text-xs">Precio</TableHead>
                  <TableHead className="font-bold text-xs text-center">Stock Disponible</TableHead>
                  <TableHead className="font-bold text-xs">Estado</TableHead>
                  <TableHead className="font-bold text-xs text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell align="center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4.5 w-20" /></TableCell>
                      <TableCell align="right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs font-semibold text-muted-foreground">
                      No se encontraron productos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((p) => {
                    const status = getStockStatus(p.stock);
                    return (
                      <TableRow key={p.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-mono text-xs font-bold">{p.sku}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-foreground">{p.name}</span>
                            {p.assets && p.assets.length > 0 && (
                              <span className="text-[9px] font-black text-primary bg-primary/5 px-1 py-0.2 rounded w-fit mt-0.5">
                                3D VIEW
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-semibold">
                          {p.category?.name || 'General'}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-foreground">
                          S/. {p.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-xs font-black text-center text-foreground">
                          {p.stock}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant as any} className={cn("px-2.5 py-0.5 text-[9px] font-black border", status.color)}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Ver Historial */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openHistoryModal(p)}
                              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary cursor-pointer"
                              title="Historial de movimientos"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            {/* Ajustar Stock */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAdjustModal(p)}
                              className="h-8 px-2.5 rounded-lg border-primary/5 text-xs font-bold hover:bg-primary/5 hover:text-primary cursor-pointer gap-1"
                            >
                              <Sliders className="h-3.5 w-3.5" />
                              Ajustar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: AJUSTE MANUAL DE STOCK */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6 shadow-xl bg-card border-primary/5">
          <form onSubmit={handleRecordAdjustment}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">Ajustar Inventario Manual</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Registre un ajuste de stock auditable para <span className="font-bold text-primary">{selectedProduct?.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Tipo de movimiento */}
              <div className="grid gap-1">
                <Label htmlFor="type" className="text-xs font-bold text-muted-foreground">Tipo de Movimiento</Label>
                <Select
                  value={adjustType}
                  onValueChange={(val: any) => setAdjustType(val)}
                >
                  <SelectTrigger id="type" className="h-10 rounded-xl bg-muted/40 border-primary/5 text-xs cursor-pointer">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem className="text-xs cursor-pointer" value="ADJUSTMENT">Ajuste General</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="PURCHASE">Nueva Compra / Abastecimiento</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="DAMAGE">Pérdida / Dañado</SelectItem>
                    <SelectItem className="text-xs cursor-pointer" value="RETURN">Retorno de Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dirección del ajuste (Agregar/Quitar) */}
              <div className="grid gap-1">
                <Label className="text-xs font-bold text-muted-foreground">Acción de Stock</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={adjustDirection === 'ADD' ? 'default' : 'outline'}
                    onClick={() => setAdjustDirection('ADD')}
                    className="flex-1 h-10 rounded-xl font-bold text-xs gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Sumar Stock
                  </Button>
                  <Button
                    type="button"
                    variant={adjustDirection === 'SUBTRACT' ? 'destructive' : 'outline'}
                    onClick={() => setAdjustDirection('SUBTRACT')}
                    className="flex-1 h-10 rounded-xl font-bold text-xs gap-1 cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                    Restar Stock
                  </Button>
                </div>
              </div>

              {/* Cantidad */}
              <div className="grid gap-1">
                <Label htmlFor="qty" className="text-xs font-bold text-muted-foreground">Cantidad de Unidades</Label>
                <Input
                  id="qty"
                  type="number"
                  min="1"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  required
                />
              </div>

              {/* Razón */}
              <div className="grid gap-1">
                <Label htmlFor="reason" className="text-xs font-bold text-muted-foreground">Motivo / Razón del Ajuste</Label>
                <textarea
                  id="reason"
                  placeholder="Explique detalladamente por qué realiza este ajuste de inventario..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-primary/10 bg-muted/40 px-3.5 py-2 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 md:text-sm h-20"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAdjustOpen(false)}
                className="rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingAdjust}
                className="rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer shadow-md shadow-primary/10"
              >
                {submittingAdjust ? 'Registrando...' : 'Confirmar Ajuste'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: HISTORIAL DE MOVIMIENTOS */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-xl rounded-xl p-6 shadow-xl bg-card border-primary/5">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Historial de Auditoría de Inventario</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Auditoría completa de entradas y salidas de stock para <span className="font-bold text-primary">{selectedProduct?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-[350px] overflow-y-auto pr-1">
            {loadingHistory ? (
              <div className="space-y-2 py-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : historyMovements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-primary/5 rounded-xl bg-muted/5">
                <FileText className="h-8 w-8 text-muted-foreground/35 mb-2" />
                <span className="text-xs font-bold text-muted-foreground/60">Sin movimientos previos</span>
                <span className="text-[10px] text-muted-foreground/50 mt-0.5">Las ventas o ajustes manuales aparecerán aquí.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {historyMovements.map((mv) => {
                  const isPositive = mv.quantity > 0;
                  return (
                    <div
                      key={mv.id}
                      className="p-3 bg-muted/20 border border-primary/5 rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">{getMovementBadge(mv.movementType)}</div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-foreground truncate max-w-[280px]">
                            {mv.reason || 'Movimiento de inventario sin razón especificada'}
                          </span>
                          
                          {/* Performed by */}
                          {mv.performedBy && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold mt-1">
                              <UserIcon className="h-3 w-3 shrink-0" />
                              Operador: {mv.performedBy}
                            </span>
                          )}
                          
                          <span className="text-[9px] text-muted-foreground mt-0.5 font-medium">
                            {new Date(mv.createdAt).toLocaleString('es-PE')}
                          </span>
                        </div>
                      </div>

                      <span className={cn(
                        "font-black text-xs shrink-0 px-2 py-0.5 rounded-full border",
                        isPositive 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {isPositive ? `+${mv.quantity}` : mv.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsHistoryOpen(false)}
              className="rounded-xl text-xs cursor-pointer w-full"
            >
              Cerrar Auditoría
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: CREAR NUEVO PRODUCTO */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl p-6 shadow-xl bg-card border-primary/5">
          <form onSubmit={handleCreateProduct}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">Registrar Nuevo Producto en Catálogo</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Agrega un nuevo artículo físico o modelo 3D al catálogo e inicializa su inventario.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Fila 1: Nombre */}
              <div className="grid gap-1">
                <Label htmlFor="prodName" className="text-xs font-bold text-muted-foreground">Nombre del Producto</Label>
                <Input
                  id="prodName"
                  type="text"
                  placeholder="Ej: Silla de Oficina Ergonómica 3D"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  required
                />
              </div>

              {/* Fila 2: SKU con Auto-Generador */}
              <div className="grid gap-1">
                <Label htmlFor="prodSku" className="text-xs font-bold text-muted-foreground">SKU (Código Único)</Label>
                <div className="flex gap-2">
                  <Input
                    id="prodSku"
                    type="text"
                    placeholder="Ej: FURN-CHAIR-99"
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value)}
                    className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs font-mono uppercase"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSku}
                    className="h-10 rounded-xl text-xs font-bold border-primary/5 hover:bg-primary/5 cursor-pointer shrink-0"
                  >
                    Generar SKU
                  </Button>
                </div>
              </div>

              {/* Fila 3: Precio y Stock Inicial en 2 columnas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="prodPrice" className="text-xs font-bold text-muted-foreground">Precio (S/.)</Label>
                  <Input
                    id="prodPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 299.90"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="prodStock" className="text-xs font-bold text-muted-foreground">Stock Inicial</Label>
                  <Input
                    id="prodStock"
                    type="number"
                    min="0"
                    placeholder="Ej: 25"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Fila 4: Categoría */}
              <div className="grid gap-1">
                <Label htmlFor="prodCategory" className="text-xs font-bold text-muted-foreground">Categoría</Label>
                <Select
                  value={newProductCategoryId}
                  onValueChange={(val: any) => setNewProductCategoryId(val)}
                >
                  <SelectTrigger id="prodCategory" className="h-10 rounded-xl bg-muted/40 border-primary/5 text-xs cursor-pointer">
                    <SelectValue placeholder="Seleccione una categoría (Opcional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {categoriesList.map((cat) => (
                      <SelectItem key={cat.id} className="text-xs cursor-pointer" value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fila 5: Descripción */}
              <div className="grid gap-1">
                <Label htmlFor="prodDesc" className="text-xs font-bold text-muted-foreground">Descripción Detallada</Label>
                <textarea
                  id="prodDesc"
                  placeholder="Detalla las especificaciones del producto, dimensiones y compatibilidad 3D..."
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-primary/10 bg-muted/40 px-3.5 py-2 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40 h-20"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingCreate}
                className="rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer shadow-md shadow-primary/10"
              >
                {submittingCreate ? 'Creando...' : 'Crear Producto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
