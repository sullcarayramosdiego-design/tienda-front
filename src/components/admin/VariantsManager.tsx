'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Check, X, AlertCircle, Save, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { variantsService } from '@/services/variants.service';
import type { ProductVariant } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface VariantsManagerProps {
  productId: string;
}

export function VariantsManager({ productId }: VariantsManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de edición inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Estados para crear nueva variante manual
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [savingNew, setSavingNew] = useState(false);

  const fetchVariants = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await variantsService.list(productId);
      setVariants(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las variantes');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  // Manejadores de Edición Inline
  const startEdit = (variant: ProductVariant) => {
    setEditingId(variant.id);
    setEditPrice(variant.price.toString());
    setEditStock(variant.stock.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
    setEditStock('');
  };

  const saveEdit = async (variantId: string) => {
    try {
      setSavingId(variantId);
      const priceVal = parseFloat(editPrice);
      const stockVal = parseInt(editStock, 10);
      
      if (isNaN(priceVal) || isNaN(stockVal)) {
        throw new Error("Valores numéricos inválidos");
      }

      const updated = await variantsService.update(productId, variantId, {
        price: priceVal,
        stock: stockVal,
      });

      setVariants((prev) => prev.map((v) => (v.id === variantId ? updated : v)));
      cancelEdit();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la variante');
    } finally {
      setSavingId(null);
    }
  };

  // Manejador para Eliminar
  const handleDelete = async (variantId: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta variante?')) return;
    try {
      setDeletingId(variantId);
      await variantsService.delete(productId, variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la variante');
    } finally {
      setDeletingId(null);
    }
  };

  // Manejador para Crear Nueva Variante
  const handleCreateNew = async () => {
    try {
      setSavingNew(true);
      setError('');

      if (!newName.trim() || !newSku.trim()) {
        throw new Error('El nombre y SKU son obligatorios');
      }

      const created = await variantsService.create(productId, {
        name: newName.trim(),
        sku: newSku.trim().toUpperCase(),
        price: parseFloat(newPrice) || 0,
        stock: parseInt(newStock, 10) || 0,
        attributes: [], // Atributos personalizados inline no soportados en el formulario simple aún
      });

      setVariants((prev) => [...prev, created]);
      
      // Reset
      setIsCreating(false);
      setNewName('');
      setNewSku('');
      setNewPrice('');
      setNewStock('');
    } catch (err: any) {
      setError(err.message || 'Error al crear nueva variante');
    } finally {
      setSavingNew(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Encabezado con Botón Añadir */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Lista de Variantes ({variants.length})
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          className={cn(
            "h-8 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer gap-1.5",
            isCreating ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 hover:text-rose-700" : "bg-primary/5 text-primary hover:bg-primary/10"
          )}
        >
          {isCreating ? (
            <>
              <X className="h-3.5 w-3.5" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Añadir Variante
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Formulario Inline para Crear */}
      {isCreating && (
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-muted-foreground uppercase">Nombre Variante</Label>
              <Input
                placeholder="Ej. Rojo / Talla S"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 text-xs rounded-lg border-primary/15 bg-background focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-muted-foreground uppercase">SKU Variante</Label>
              <Input
                placeholder="PROD-ROJO-S"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                className="h-8 text-xs rounded-lg border-primary/15 bg-background focus-visible:ring-1 focus-visible:ring-primary/40 uppercase font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-muted-foreground uppercase">Precio (S/.)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="h-8 text-xs rounded-lg border-primary/15 bg-background focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-muted-foreground uppercase">Stock Inicial</Label>
              <Input
                type="number"
                placeholder="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="h-8 text-xs rounded-lg border-primary/15 bg-background focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              disabled={savingNew}
              onClick={handleCreateNew}
              className="h-8 rounded-lg text-xs font-bold cursor-pointer"
            >
              {savingNew && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Guardar Variante
            </Button>
          </div>
        </div>
      )}

      {/* Tabla de Variantes */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-[10px] font-black text-muted-foreground uppercase py-2">Detalles</TableHead>
              <TableHead className="text-[10px] font-black text-muted-foreground uppercase py-2 w-28 text-center">Precio (S/.)</TableHead>
              <TableHead className="text-[10px] font-black text-muted-foreground uppercase py-2 w-24 text-center">Stock</TableHead>
              <TableHead className="text-[10px] font-black text-muted-foreground uppercase py-2 w-24 text-right pr-4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-2"><Skeleton className="h-8 w-full max-w-[200px]" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell className="py-2"><Skeleton className="h-8 w-full ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                    <Info className="h-5 w-5 opacity-50" />
                    <span className="text-xs font-medium">Este producto aún no tiene variantes</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              variants.map((v) => {
                const isEditing = editingId === v.id;
                const isSaving = savingId === v.id;
                const isDeleting = deletingId === v.id;

                return (
                  <TableRow key={v.id} className={cn("hover:bg-muted/20 transition-colors", isEditing && "bg-primary/5")}>
                    <TableCell className="py-2">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-bold text-xs truncate" title={v.name}>{v.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase truncate" title={v.sku}>{v.sku}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-2 px-1 text-center">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="h-7 text-xs rounded-md text-center bg-background focus-visible:ring-1 w-full border-primary/20"
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {Number(v.price).toFixed(2)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-2 px-1 text-center">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          className="h-7 text-xs rounded-md text-center bg-background focus-visible:ring-1 w-full border-primary/20"
                        />
                      ) : (
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold border",
                          v.stock > 10 ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : 
                          v.stock > 0 ? "text-amber-600 bg-amber-500/10 border-amber-500/20" : 
                          "text-rose-600 bg-rose-500/10 border-rose-500/20"
                        )}>
                          {v.stock}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="py-2 text-right pr-4">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="h-7 w-7 text-muted-foreground hover:bg-muted cursor-pointer rounded-md"
                            title="Cancelar"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEdit(v.id)}
                            disabled={isSaving}
                            className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 cursor-pointer rounded-md"
                            title="Guardar"
                          >
                            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 opacity-60 hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(v)}
                            disabled={isDeleting}
                            className="h-7 w-7 hover:bg-muted cursor-pointer rounded-md"
                            title="Editar"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(v.id)}
                            disabled={isDeleting}
                            className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer rounded-md"
                            title="Eliminar"
                          >
                            {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
