'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  User as UserIcon,
  Box,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Trash2,
  EyeOff,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { MoreHorizontal, SlidersHorizontal, Settings, Layers } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { productsService } from '@/features/catalog';
import { variantsService } from '@/features/inventory/services/variants.service';
import { VariantBuilder, VariantDraft } from './VariantBuilder';
import { VariantsManager } from './VariantsManager';
import { inventoryService, LowStockAlert, InventoryMovement } from '@/features/inventory/services/inventory.service';
import type  { Product } from '@/features/inventory';
import { Asset3DUpload } from './Asset3DUpload';

export function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<'sku' | 'name' | 'category' | 'price' | 'stock' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Estados de Filtros por Columna
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [skuFilter, setSkuFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceMinFilter, setPriceMinFilter] = useState('');
  const [priceMaxFilter, setPriceMaxFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
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

  // Estados de Editar Producto
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProductName, setEditProductName] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductSku, setEditProductSku] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editProductCategoryId, setEditProductCategoryId] = useState('');
  const [editProductImages, setEditProductImages] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Estados de Crear Categoría
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [submittingCategory, setSubmittingCategory] = useState(false);

  // Estados para variantes
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [isVariantsOpen, setIsVariantsOpen] = useState(false);
  const [variantsSheetProduct, setVariantsSheetProduct] = useState<Product | null>(null);

  // Estados de Modales
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
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

  // Estado del Dialog de Confirmación (reemplaza window.confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'toggle' | 'delete';
    product: Product | null;
    submitting: boolean;
  }>({
    open: false,
    type: 'toggle',
    product: null,
    submitting: false,
  });

  // Cargar productos y alertas
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, alertsData] = await Promise.all([
        productsService.list({ limit: 100 }),
        inventoryService.getLowStockAlerts(10),
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
      } catch {
        // Silencioso: categorías son opcionales en la UI
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
      const createdProduct = await productsService.create({
        name: newProductName.trim(),
        description: newProductDescription.trim(),
        sku: newProductSku.trim().toUpperCase(),
        price: priceNum,
        stock: stockNum,
        categoryId: newProductCategoryId || undefined,
      });

      // Registrar movimiento de stock inicial en el historial
      const initialStockQty = hasVariants && variantDrafts.length > 0
        ? variantDrafts.reduce((sum, d) => sum + (parseInt(d.stock, 10) || 0), 0)
        : stockNum;

      if (initialStockQty > 0) {
        try {
          await inventoryService.recordMovement({
            productId: createdProduct.id,
            movementType: 'PURCHASE',
            quantity: initialStockQty,
            reason: 'Registro de stock inicial de producto.',
          });
        } catch (mvErr) {
          console.error('Error al registrar movimiento inicial de stock:', mvErr);
        }
      }

      if (hasVariants && variantDrafts.length > 0) {
        await variantsService.bulkCreate(
          createdProduct.id,
          variantDrafts.map((d) => ({
            name: d.name,
            sku: d.sku,
            price: parseFloat(d.price),
            stock: parseInt(d.stock, 10),
            attributes: d.attributes,
          }))
        );
      }
      toast({
        type: 'success',
        title: 'Producto Creado 🎁',
        description: `El producto ${newProductName} se ha registrado y agregado al inventario con éxito.`,
      });
      setNewProductName('');
      setNewProductDescription('');
      setNewProductSku('');
      setNewProductPrice('');
      setNewProductStock('0');
      setNewProductCategoryId('');
      setVariantDrafts([]);
      setHasVariants(false);
      setIsCreateOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Error al registrar producto',
        description: error.response?.data?.message || 'Verifique que el SKU no esté duplicado.',
      });
    } finally {
      setSubmittingCreate(false);
    }
  };

  // Enviar creación del nuevo categoría
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({ type: 'error', title: 'Error', description: 'El nombre de la categoría es obligatorio.' });
      return;
    }
    try {
      setSubmittingCategory(true);
      await productsService.createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      });
      toast({
        type: 'success',
        title: 'Categoría Creada 📁',
        description: `La categoría "${newCategoryName}" se registró con éxito.`,
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      setIsCategoryCreateOpen(false);
      const cats = await productsService.getCategories();
      setCategoriesList(cats);
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Error al crear categoría',
        description: error.response?.data?.message || 'Hubo un error al crear la categoría.',
      });
    } finally {
      setSubmittingCategory(false);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditProductName(product.name);
    setEditProductDescription(product.description || '');
    setEditProductSku(product.sku);
    setEditProductPrice(product.price.toString());
    setEditProductCategoryId(product.category?.id || (product as any).categoryId || '');
    setEditProductImages(product.images ? product.images.join('\n') : '');
    setIsEditOpen(true);
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setSubmittingEdit(true);
      const priceVal = parseFloat(editProductPrice);
      if (isNaN(priceVal)) {
        throw new Error('Precio inválido');
      }

      const imagesArray = editProductImages
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      await productsService.update(selectedProduct.id, {
        name: editProductName,
        description: editProductDescription,
        price: priceVal,
        sku: editProductSku.toUpperCase(),
        categoryId: editProductCategoryId || undefined,
        images: imagesArray,
      });

      toast({
        type: 'success',
        title: '¡Producto Actualizado! ✨',
        description: 'Los detalles del producto se guardaron con éxito.'
      });

      setIsEditOpen(false);
      fetchData();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Error al actualizar',
        description: err.response?.data?.message || err.message || 'Ocurrió un error.'
      });
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Abrir dialog de confirmación de baja/alta
  const handleToggleActive = (product: Product) => {
    setConfirmDialog({ open: true, type: 'toggle', product, submitting: false });
  };

  // Abrir dialog de confirmación de eliminación
  const handleDeleteProduct = (product: Product) => {
    setConfirmDialog({ open: true, type: 'delete', product, submitting: false });
  };

  // Ejecutar la acción confirmada
  const handleConfirmAction = async () => {
    const { type, product } = confirmDialog;
    if (!product) return;
    setConfirmDialog((prev) => ({ ...prev, submitting: true }));
    try {
      if (type === 'toggle') {
        await productsService.update(product.id, {
          isActive: product.isActive !== false ? false : true,
        });
        toast({
          type: 'success',
          title: product.isActive !== false ? 'Producto Dado de Baja 🚫' : 'Producto Activado 👍',
          description: `El producto "${product.name}" se actualizó correctamente.`,
        });
      } else {
        await productsService.delete(product.id);
        toast({
          type: 'success',
          title: 'Producto Eliminado 🗑️',
          description: `El producto "${product.name}" se eliminó del catálogo de manera permanente.`,
        });
      }
      fetchData();
    } catch (error: any) {
      toast({
        type: 'error',
        title: type === 'toggle' ? 'Error de actualización' : 'Error de eliminación',
        description: error.response?.data?.message || 'No se pudo completar la acción.',
      });
    } finally {
      setConfirmDialog({ open: false, type: 'toggle', product: null, submitting: false });
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

  // Manejar apertura de modal de carga 3D
  const openUploadModal = (product: Product) => {
    setSelectedProduct(product);
    setIsUploadOpen(true);
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

  // Ordenamiento callback
  const handleSort = (key: 'sku' | 'name' | 'category' | 'price' | 'stock' | 'status') => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null); // Quitar ordenamiento en el tercer click
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Helper para renderizar cabecera interactiva
  const renderSortHeader = (key: 'sku' | 'name' | 'category' | 'price' | 'stock' | 'status', label: string, align: 'left' | 'center' | 'right' = 'left') => {
    const isSorted = sortKey === key;
    return (
      <TableHead 
        className={cn(
          "font-bold text-xs select-none cursor-pointer transition-colors hover:text-foreground group",
          align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''
        )}
        onClick={() => handleSort(key)}
      >
        <div className={cn("flex items-center gap-1", align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start')}>
          <span>{label}</span>
          {isSorted ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="h-3 w-3 text-primary animate-in fade-in zoom-in duration-200" />
            ) : (
              <ArrowDown className="h-3 w-3 text-primary animate-in fade-in zoom-in duration-200" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
          )}
        </div>
      </TableHead>
    );
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchQuery('');
    setSkuFilter('');
    setNameFilter('');
    setCategoryFilter('all');
    setPriceMinFilter('');
    setPriceMaxFilter('');
    setStockStatusFilter('all');
    setSortKey(null);
    setSortDirection('asc');
  };

  const hasActiveFilters = !!(searchQuery || skuFilter || nameFilter ||
    categoryFilter !== 'all' || priceMinFilter || priceMaxFilter ||
    stockStatusFilter !== 'all' || sortKey);

  // Filtrar y ordenar productos con useMemo
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Búsqueda global (SKU o nombre)
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)
      );
    }

    // 2. Filtros por columna
    if (skuFilter.trim()) {
      const term = skuFilter.toLowerCase();
      result = result.filter((p) => p.sku.toLowerCase().includes(term));
    }
    if (nameFilter.trim()) {
      const term = nameFilter.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(term));
    }
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(
        (p) => p.category?.id === categoryFilter || (p as any).categoryId === categoryFilter
      );
    }
    if (priceMinFilter.trim()) {
      const min = parseFloat(priceMinFilter);
      if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    }
    if (priceMaxFilter.trim()) {
      const max = parseFloat(priceMaxFilter);
      if (!isNaN(max)) result = result.filter((p) => p.price <= max);
    }
    if (stockStatusFilter && stockStatusFilter !== 'all') {
      result = result.filter((p) => {
        if (stockStatusFilter === 'out_of_stock') return p.stock <= 0;
        if (stockStatusFilter === 'low_stock') return p.stock > 0 && p.stock < 10;
        if (stockStatusFilter === 'in_stock') return p.stock >= 10;
        return true;
      });
    }

    // 3. Ordenamiento
    if (sortKey) {
      result.sort((a, b) => {
        let valA: any = '';
        let valB: any = '';
        if (sortKey === 'sku') { valA = a.sku || ''; valB = b.sku || ''; }
        else if (sortKey === 'name') { valA = a.name || ''; valB = b.name || ''; }
        else if (sortKey === 'category') { valA = a.category?.name || 'General'; valB = b.category?.name || 'General'; }
        else if (sortKey === 'price') { valA = a.price || 0; valB = b.price || 0; }
        else if (sortKey === 'stock' || sortKey === 'status') { valA = a.stock || 0; valB = b.stock || 0; }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB, 'es', { sensitivity: 'base' })
            : valB.localeCompare(valA, 'es', { sensitivity: 'base' });
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, searchQuery, skuFilter, nameFilter, categoryFilter, priceMinFilter, priceMaxFilter, stockStatusFilter, sortKey, sortDirection]);

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: 'SIN STOCK', variant: 'destructive', color: 'text-rose-500 border-border' };
    if (stock < 10) return { label: 'BAJO STOCK', variant: 'outline', color: 'text-amber-500 border-border' };
    return { label: 'DISPONIBLE', variant: 'outline', color: 'text-emerald-500 border-border' };
  };

  const getMovementBadge = (type: InventoryMovement['movementType']) => {
    switch (type) {
      case 'PURCHASE':
        return <Badge variant="outline" className="text-emerald-500 border-border bg-transparent font-mono text-[10px] rounded-sm uppercase">COMPRA</Badge>;
      case 'SALE':
        return <Badge variant="outline" className="text-blue-500 border-border bg-transparent font-mono text-[10px] rounded-sm uppercase">VENTA</Badge>;
      case 'RETURN':
        return <Badge variant="outline" className="text-purple-500 border-border bg-transparent font-mono text-[10px] rounded-sm uppercase">RETORNO</Badge>;
      case 'DAMAGE':
        return <Badge variant="outline" className="text-rose-500 border-border bg-transparent font-mono text-[10px] rounded-sm uppercase">DAÑADO</Badge>;
      case 'ADJUSTMENT':
      default:
        return <Badge variant="outline" className="text-amber-500 border-border bg-transparent font-mono text-[10px] rounded-sm uppercase">AJUSTE</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Acciones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        {/* Buscador y Filtros */}
        <div className="flex flex-1 items-center gap-2 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-sm border-border bg-transparent focus-visible:ring-1 focus-visible:ring-foreground shadow-none text-xs"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3 rounded-sm border-border shadow-none relative cursor-pointer text-xs font-semibold">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                )}
              </Button>
            </SheetTrigger>
             <SheetContent className="w-[90vw] sm:max-w-md flex flex-col gap-0 p-0 border-l border-border bg-card">
              <SheetHeader className="px-6 py-4 border-b border-border/40 shrink-0 mb-0">
                <SheetTitle className="text-base font-bold">Filtros Avanzados</SheetTitle>
                <SheetDescription className="text-xs">Refina la búsqueda del inventario.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">Categoría</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-9 rounded-sm bg-transparent border-border text-xs">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent className="bg-card rounded-sm border-border">
                      <SelectItem value="all" className="text-xs cursor-pointer">Todas</SelectItem>
                      {categoriesList.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="text-xs cursor-pointer">{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">Estado del Stock</Label>
                  <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                    <SelectTrigger className="h-9 rounded-sm bg-transparent border-border text-xs">
                      <SelectValue placeholder="Cualquier estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-card rounded-sm border-border">
                      <SelectItem value="all" className="text-xs cursor-pointer">Todos</SelectItem>
                      <SelectItem value="in_stock" className="text-xs cursor-pointer">En stock</SelectItem>
                      <SelectItem value="low_stock" className="text-xs cursor-pointer">Por agotar</SelectItem>
                      <SelectItem value="out_of_stock" className="text-xs cursor-pointer">Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 mt-auto">
                  <Button variant="secondary" className="w-full h-9 rounded-sm text-xs font-bold cursor-pointer" onClick={clearAllFilters}>
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={fetchData} className="h-9 w-9 p-0 rounded-sm border-border shadow-none cursor-pointer">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsCategoryCreateOpen(true)} className="h-9 rounded-sm border-border shadow-none hidden sm:flex cursor-pointer text-xs font-semibold">
            Nueva Categoría
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)} className="h-9 rounded-sm shadow-none cursor-pointer text-xs font-semibold">
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="border border-border rounded-sm overflow-hidden bg-transparent">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-transparent">
              {renderSortHeader('name', 'Producto')}
              {renderSortHeader('stock', 'Stock', 'center')}
              {renderSortHeader('status', 'Estado')}
              <TableHead className="text-right font-medium text-xs pr-4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((p) => {
                const status = getStockStatus(p.stock);
                return (
                  <TableRow key={p.id} className="hover:bg-muted/10 transition-colors duration-75">
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm text-foreground">{p.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase border border-border bg-transparent rounded-sm px-1.5 py-0.5 mt-1 w-max">{p.sku}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <span className="text-sm font-mono font-normal">{p.stock}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={cn("font-mono font-medium text-[10px] uppercase shadow-none border bg-transparent rounded-sm", status.color)}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 shadow-lg rounded-xl border-border">
                          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Gestión de Inventario</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openAdjustModal(p)} className="text-xs cursor-pointer">
                            <Sliders className="mr-2 h-3.5 w-3.5"/> Ajustar Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setVariantsSheetProduct(p); setIsVariantsOpen(true); }} className="text-xs cursor-pointer">
                            <Layers className="mr-2 h-3.5 w-3.5"/> Gestionar Variantes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openUploadModal(p)} className="text-xs cursor-pointer">
                            <Box className="mr-2 h-3.5 w-3.5"/> Assets 3D
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openHistoryModal(p)} className="text-xs cursor-pointer">
                            <History className="mr-2 h-3.5 w-3.5"/> Historial
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(p)} className="text-xs cursor-pointer">
                            <Settings className="mr-2 h-3.5 w-3.5"/> Editar Detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleActive(p)} className="text-xs cursor-pointer">
                            <EyeOff className="mr-2 h-3.5 w-3.5"/> {p.isActive !== false ? 'Desactivar' : 'Activar'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteProduct(p)} className="text-xs text-red-600 focus:text-red-600 cursor-pointer">
                            <Trash2 className="mr-2 h-3.5 w-3.5"/> Eliminar Producto
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

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

        {/* MODAL 4: CARGAR MODELO 3D INLINE */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="sm:max-w-md rounded-xl p-6 shadow-xl bg-card border-primary/5">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">Asociar Modelo 3D / AR</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Cargue un archivo .glb o .usdz para <span className="font-bold text-primary">{selectedProduct?.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {selectedProduct && (
                <Asset3DUpload 
                  productId={selectedProduct.id} 
                  onUploadSuccess={async () => {
                    toast({
                      type: 'success',
                      title: '¡Modelo 3D Vinculado!',
                      description: 'El modelo se asoció con éxito al producto.'
                    });
                    setIsUploadOpen(false);
                    fetchData(); // Recargar inventario para actualizar badge
                  }} 
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadOpen(false)}
                className="rounded-xl text-xs cursor-pointer w-full"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* MODAL DE EDICIÓN DE DETALLES */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl p-6 shadow-xl bg-card border-primary/5 max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEditProduct}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">Editar Detalles del Producto</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Actualice los detalles y enlaces de imágenes para este producto.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-1">
                <Label htmlFor="editName" className="text-xs font-bold text-muted-foreground">Nombre del Producto</Label>
                <Input
                  id="editName"
                  type="text"
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editSku" className="text-xs font-bold text-muted-foreground">SKU</Label>
                <Input
                  id="editSku"
                  type="text"
                  value={editProductSku}
                  onChange={(e) => setEditProductSku(e.target.value)}
                  className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs font-mono uppercase"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editPrice" className="text-xs font-bold text-muted-foreground">Precio (S/.)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editProductPrice}
                  onChange={(e) => setEditProductPrice(e.target.value)}
                  className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editCategory" className="text-xs font-bold text-muted-foreground">Categoría</Label>
                <Select
                  value={editProductCategoryId}
                  onValueChange={setEditProductCategoryId}
                >
                  <SelectTrigger id="editCategory" className="h-10 rounded-xl bg-muted/40 border-primary/5 text-xs">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {categoriesList.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-xs cursor-pointer">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editDesc" className="text-xs font-bold text-muted-foreground">Descripción</Label>
                <textarea
                  id="editDesc"
                  placeholder="Detalles sobre el producto..."
                  value={editProductDescription}
                  onChange={(e) => setEditProductDescription(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-primary/10 bg-muted/40 px-3.5 py-2 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40 h-24"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editImages" className="text-xs font-bold text-muted-foreground">
                  Enlaces de Imágenes (URLs)
                </Label>
                <DialogDescription className="text-[10px] text-muted-foreground">
                  Coloque un enlace de imagen por línea. Se permiten múltiples enlaces.
                </DialogDescription>
                <textarea
                  id="editImages"
                  placeholder="https://drive.google.com/...\nhttps://images.unsplash.com/..."
                  value={editProductImages}
                  onChange={(e) => setEditProductImages(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-primary/10 bg-muted/40 px-3.5 py-2 text-xs font-mono transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40 h-28"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingEdit}
                className="rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer shadow-md shadow-primary/10"
              >
                {submittingEdit ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: CREAR NUEVO PRODUCTO */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl p-6 shadow-xl bg-card border-primary/5 max-h-[90vh] overflow-y-auto">
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
              <VariantBuilder
                baseSku={newProductSku}
                basePrice={newProductPrice}
                baseStock={newProductStock}
                onChange={(drafts, enabled) => {
                  setVariantDrafts(drafts);
                  setHasVariants(enabled);
                }}
              />
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

      {/* MODAL 5: CREAR NUEVA CATEGORÍA */}
      <Dialog open={isCategoryCreateOpen} onOpenChange={setIsCategoryCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6 shadow-xl bg-card border-primary/5">
          <form onSubmit={handleCreateCategory}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">Crear Nueva Categoría</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Agrega una nueva categoría al catálogo para clasificar tus productos y modelos 3D.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Nombre */}
              <div className="grid gap-1">
                <Label htmlFor="catName" className="text-xs font-bold text-muted-foreground">Nombre de la Categoría</Label>
                <Input
                  id="catName"
                  type="text"
                  placeholder="Ej: Muebles de Oficina"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="grid gap-1">
                <Label htmlFor="catDesc" className="text-xs font-bold text-muted-foreground">Descripción (Opcional)</Label>
                <textarea
                  id="catDesc"
                  placeholder="Describe qué tipo de productos pertenecerán a esta categoría..."
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-primary/10 bg-muted/40 px-3.5 py-2 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40 h-20"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCategoryCreateOpen(false)}
                className="rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingCategory}
                className="rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer shadow-md shadow-primary/10"
              >
                {submittingCategory ? 'Creando...' : 'Crear Categoría'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 6: GESTIÓN DE VARIANTES EXISTENTES */}
      <Dialog open={isVariantsOpen} onOpenChange={setIsVariantsOpen}>
        <DialogContent className="sm:max-w-2xl rounded-xl p-6 shadow-xl bg-card border-primary/5 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-base font-bold text-foreground">Gestor de Variantes</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modifica los precios y stocks de las variantes para <span className="font-bold text-primary">{variantsSheetProduct?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            {variantsSheetProduct && (
              <VariantsManager productId={variantsSheetProduct.id} />
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button onClick={() => setIsVariantsOpen(false)} variant="outline" className="rounded-xl text-xs font-bold w-full cursor-pointer border-border">
              Cerrar Gestor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
