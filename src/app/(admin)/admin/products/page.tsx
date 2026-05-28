'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Sparkles, 
  Box, 
  Trash2, 
  Upload, 
  Search, 
  RefreshCw, 
  File, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeftRight,
  Eye
} from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import { Asset3DUpload } from '@/features/inventory';
import { Asset3DPreviewModal } from '@/features/inventory';
import { productsService } from '@/features/catalog';
import { assetsService } from '@/features/inventory';
import type  { Product, Asset3D } from '@/features/inventory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sheet states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);

  // Preview states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');

  // Load products list from backend
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productsService.list({ limit: 100 });
      const prodArray = Array.isArray(data)
        ? data
        : Array.isArray((data as any).data)
        ? (data as any).data
        : Array.isArray((data as any).items)
        ? (data as any).items
        : [];
      setProducts(prodArray);
    } catch (err: any) {
      console.error('Error al cargar productos:', err);
      toast({
        type: 'error',
        title: 'Error de Conexión',
        description: err.response?.data?.message || 'Error al conectar con la API de productos.'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle successful upload (refresh both parent lists and selected product state)
  const handleUploadSuccess = async () => {
    if (!selectedProduct) return;
    
    toast({
      type: 'success',
      title: '¡Modelo 3D Cargado!',
      description: 'El activo se ha subido e integrado con éxito al catálogo.'
    });
    
    // Refresh product list
    await loadProducts();
    
    // Refresh selected product to show new assets in Sheet
    try {
      const refreshedProd = await productsService.getById(selectedProduct.id);
      setSelectedProduct(refreshedProd);
    } catch (err) {
      console.error('Error al refrescar producto seleccionado:', err);
    }
  };

  // Delete 3D asset from product
  const handleDeleteAsset = async (assetId: string) => {
    if (!selectedProduct || !confirm('¿Estás seguro de que deseas eliminar este modelo 3D? Los usuarios ya no podrán visualizarlo en AR o 3D.')) return;
    
    try {
      setDeletingAssetId(assetId);
      await assetsService.delete(assetId);
      toast({
        type: 'success',
        title: 'Modelo 3D Eliminado',
        description: 'El activo se ha eliminado del producto de forma atómica.'
      });
      
      // Refresh list
      await loadProducts();
      
      // Refresh selected product
      const refreshedProd = await productsService.getById(selectedProduct.id);
      setSelectedProduct(refreshedProd);
    } catch (err: any) {
      console.error('Error al eliminar asset:', err);
      toast({
        type: 'error',
        title: 'Error al Eliminar',
        description: err.response?.data?.message || 'No se pudo eliminar el activo 3D.'
      });
    } finally {
      setDeletingAssetId(null);
    }
  };

  const openPreviewModal = (url: string, name: string) => {
    setPreviewUrl(url);
    setPreviewName(name);
    setIsPreviewOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    const term = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
  });

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        
        {/* Banner Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Box className="h-8 w-8 text-primary animate-pulse" />
              Catálogo & Modelos 3D
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Asocia archivos .glb y .usdz a tus productos del catálogo para habilitar Realidad Aumentada y vista 3D.
            </p>
          </div>
          <Button 
            onClick={loadProducts} 
            variant="outline" 
            className="self-start md:self-auto gap-2 font-bold text-xs h-10 px-4 rounded-xl cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" /> Refrescar Catálogo
          </Button>
        </div>

        {/* Buscador y Controles */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 p-4 rounded-xl border border-primary/5">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Buscar por SKU o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground select-none">
            {filteredProducts.length} productos listados
          </span>
        </div>

        {/* Tabla de Productos */}
        <Card className="bg-card/40 border-primary/5 shadow-md rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-primary/5 hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">SKU</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Producto</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Precio</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Stock</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground">Estado 3D</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <TableRow key={idx} className="border-primary/5">
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-8 w-24 mx-auto rounded-lg" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-xs font-semibold text-muted-foreground">
                        No se encontraron productos registrados en el catálogo.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((p) => {
                      const has3D = p.assets && p.assets.length > 0;
                      const hasGlb = p.assets?.some(a => a.format === 'glb');
                      const hasUsdz = p.assets?.some(a => a.format === 'usdz');

                      return (
                        <TableRow key={p.id} className="border-primary/5 hover:bg-primary/5/30 transition-colors">
                          <TableCell className="font-mono text-xs font-bold py-3.5">{p.sku}</TableCell>
                          <TableCell className="py-3.5">
                            <span className="font-semibold text-xs text-foreground">{p.name}</span>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-foreground py-3.5">
                            S/. {p.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-muted-foreground py-3.5">
                            {p.stock} uds
                          </TableCell>
                          <TableCell className="py-3.5">
                            {has3D ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {hasGlb && (
                                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase">
                                    GLB
                                  </Badge>
                                )}
                                {hasUsdz && (
                                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-black uppercase">
                                    USDZ (iOS)
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[9px] font-bold">
                                Sin Modelo 3D
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-3.5 text-center">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProduct(p);
                                setIsSheetOpen(true);
                              }}
                              className="h-8 px-3.5 rounded-lg border-primary/10 hover:bg-primary/5 font-bold text-[10px] cursor-pointer gap-1"
                            >
                              <Upload className="h-3.5 w-3.5" />
                              Gestionar 3D
                            </Button>
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

        {/* PANEL LATERAL DE GESTIÓN (SHEET SHADCN) */}
        {selectedProduct && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="w-full sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/5 overflow-y-auto">
              <SheetHeader className="pb-4 border-b border-primary/5">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest block">Consola 3D de Producto</span>
                <SheetTitle className="text-lg font-heading font-black text-foreground">{selectedProduct.name}</SheetTitle>
                <SheetDescription className="text-xs">
                  SKU: <strong className="font-mono text-primary font-bold">{selectedProduct.sku}</strong> · Gestión de recursos de Realidad Aumentada.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                
                {/* 1. Listado de modelos existentes */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <File className="h-4 w-4 text-primary" />
                    Archivos Cargados Activos
                  </h3>
                  
                  {selectedProduct.assets && selectedProduct.assets.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedProduct.assets.map((asset) => (
                        <div 
                          key={asset.id} 
                          className="p-3 bg-muted/30 border border-primary/5 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate max-w-[200px]" title={asset.fileName}>
                              {asset.fileName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black uppercase">
                                {asset.format}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                {assetsService.formatFileSize(asset.fileSize)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openPreviewModal(asset.fileUrl, asset.fileName)}
                              className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary text-muted-foreground transition-colors cursor-pointer"
                              title="Auditar modelo 3D"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <a 
                              href={asset.fileUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="h-8 w-8 rounded-lg border border-primary/5 hover:bg-primary/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                              title="Descargar"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteAsset(asset.id)}
                              disabled={deletingAssetId === asset.id}
                              className="h-8 w-8 rounded-lg hover:bg-destructive/5 hover:text-destructive text-muted-foreground transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-primary/10 rounded-2xl text-center space-y-1.5 bg-muted/5">
                      <AlertCircle className="h-6 w-6 text-muted-foreground/45 mx-auto" />
                      <p className="text-[11px] font-semibold text-muted-foreground/80">No hay modelos 3D asignados</p>
                      <p className="text-[9px] text-muted-foreground/60 max-w-[240px] mx-auto">
                        Este producto se venderá como artículo tradicional hasta que se cargue su modelo.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Zona de subida */}
                <div className="border-t border-primary/5 pt-6">
                  <Asset3DUpload 
                    productId={selectedProduct.id} 
                    onUploadSuccess={handleUploadSuccess} 
                  />
                </div>

              </div>
            </SheetContent>
          </Sheet>
        )}

      </div>

      <Asset3DPreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        assetUrl={previewUrl}
        assetName={previewName}
      />
    </ProtectedRoute>
  );
}
