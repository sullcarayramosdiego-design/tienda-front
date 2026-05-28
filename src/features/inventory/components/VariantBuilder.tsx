'use client';

import { useState, useCallback, useId } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Tag,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types (exported so InventoryTable can use them)
// ─────────────────────────────────────────────────────────────────────────────

export interface VariantDraft {
  _localId: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
  attributes: { key: string; value: string }[];
}

interface AttributeGroup {
  _id: string;
  name: string;   // e.g. "Color"
  valuesRaw: string; // e.g. "Rojo, Azul, Verde"
}

export interface VariantBuilderProps {
  /** SKU base del producto para pre-llenar variantes */
  baseSku: string;
  /** Precio base del producto (heredado por defecto en cada variante) */
  basePrice: string;
  /** Stock base del producto (heredado por defecto en cada variante) */
  baseStock: string;
  /** Callback cuando cambia el estado de variantes */
  onChange: (drafts: VariantDraft[], enabled: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Calcula el producto cartesiano de varios arrays de strings */
function cartesian(arrays: string[][]): string[][] {
  if (arrays.length === 0) return [[]];
  const [first, ...rest] = arrays;
  const restProduct = cartesian(rest);
  return first.flatMap((val) => restProduct.map((combo) => [val, ...combo]));
}

/** Genera un SKU de variante limpio a partir del SKU base y valores de la combinación */
function generateVariantSku(baseSku: string, values: string[]): string {
  const suffix = values
    .map((v) =>
      v
        .trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 4)
    )
    .join('-');
  return `${baseSku}-${suffix}`.toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// VariantBuilder Component
// ─────────────────────────────────────────────────────────────────────────────

let _idCounter = 0;
const genId = () => `vb-${++_idCounter}-${Date.now()}`;

export function VariantBuilder({
  baseSku,
  basePrice,
  baseStock,
  onChange,
}: VariantBuilderProps) {
  const [enabled, setEnabled] = useState(false);
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([
    { _id: genId(), name: '', valuesRaw: '' },
  ]);
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>([]);
  const [generated, setGenerated] = useState(false);

  // ── Toggle de variantes ─────────────────────────────────────────────────

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (!next) {
      // Desactivar: limpiar todo y notificar vacío
      setAttributeGroups([{ _id: genId(), name: '', valuesRaw: '' }]);
      setVariantDrafts([]);
      setGenerated(false);
      onChange([], false);
    } else {
      onChange(variantDrafts, true);
    }
  };

  // ── Gestión de grupos de atributos ───────────────────────────────────────

  const addGroup = () => {
    setAttributeGroups((prev) => [...prev, { _id: genId(), name: '', valuesRaw: '' }]);
    setGenerated(false);
  };

  const removeGroup = (id: string) => {
    setAttributeGroups((prev) => prev.filter((g) => g._id !== id));
    setGenerated(false);
  };

  const updateGroup = (id: string, field: 'name' | 'valuesRaw', value: string) => {
    setAttributeGroups((prev) =>
      prev.map((g) => (g._id === id ? { ...g, [field]: value } : g))
    );
    setGenerated(false);
  };

  // ── Generador cartesiano ─────────────────────────────────────────────────

  const generateCombinations = useCallback(() => {
    // Validar grupos: nombre y al menos 1 valor
    const validGroups = attributeGroups.filter(
      (g) => g.name.trim() && g.valuesRaw.trim()
    );
    if (validGroups.length === 0) return;

    const valueArrays = validGroups.map((g) =>
      g.valuesRaw
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    );

    const combinations = cartesian(valueArrays);

    const drafts: VariantDraft[] = combinations.map((combo) => {
      const attributes = validGroups.map((g, i) => ({
        key: g.name.trim(),
        value: combo[i],
      }));
      const name = combo.join(' / ');
      const sku = generateVariantSku(baseSku || 'PRD', combo);
      return {
        _localId: genId(),
        name,
        sku,
        price: basePrice || '0',
        stock: baseStock || '0',
        attributes,
      };
    });

    setVariantDrafts(drafts);
    setGenerated(true);
    onChange(drafts, true);
  }, [attributeGroups, baseSku, basePrice, baseStock, onChange]);

  // ── Edición inline de variantes ──────────────────────────────────────────

  const updateDraft = (localId: string, field: 'name' | 'sku' | 'price' | 'stock', value: string) => {
    setVariantDrafts((prev) => {
      const updated = prev.map((d) =>
        d._localId === localId ? { ...d, [field]: value } : d
      );
      onChange(updated, true);
      return updated;
    });
  };

  const removeDraft = (localId: string) => {
    setVariantDrafts((prev) => {
      const updated = prev.filter((d) => d._localId !== localId);
      onChange(updated, true);
      return updated;
    });
  };

  const addManualVariant = () => {
    const newDraft: VariantDraft = {
      _localId: genId(),
      name: '',
      sku: baseSku ? `${baseSku}-VAR-${variantDrafts.length + 1}` : '',
      price: basePrice || '0',
      stock: baseStock || '0',
      attributes: [],
    };
    setVariantDrafts((prev) => {
      const updated = [...prev, newDraft];
      onChange(updated, true);
      return updated;
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Toggle principal */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer',
          enabled
            ? 'border-violet-500/40 bg-violet-500/5'
            : 'border-primary/10 bg-muted/20 hover:border-primary/20 hover:bg-muted/40'
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center transition-colors',
              enabled ? 'bg-violet-500/15' : 'bg-muted/60'
            )}
          >
            <Layers
              className={cn(
                'h-4 w-4 transition-colors',
                enabled ? 'text-violet-500' : 'text-muted-foreground/60'
              )}
            />
          </div>
          <div className="text-left">
            <p
              className={cn(
                'text-xs font-bold transition-colors',
                enabled ? 'text-violet-600' : 'text-foreground'
              )}
            >
              Este producto tiene variantes
            </p>
            <p className="text-[10px] text-muted-foreground/70">
              Color, talla, material u otros atributos combinables
            </p>
          </div>
        </div>
        {/* Toggle visual */}
        <div
          className={cn(
            'relative h-5 w-9 rounded-full transition-colors duration-200',
            enabled ? 'bg-violet-500' : 'bg-muted-foreground/20'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
              enabled ? 'translate-x-4' : 'translate-x-0.5'
            )}
          />
        </div>
      </button>

      {/* Panel de construcción de variantes */}
      {enabled && (
        <div className="border border-violet-500/15 bg-violet-500/3 rounded-xl p-4 space-y-5 animate-in slide-in-from-top-2 duration-200">

          {/* ── Sección 1: Grupos de Atributos ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black text-violet-600 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Grupos de Atributos
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addGroup}
                className="h-7 px-2.5 rounded-lg text-[10px] font-bold text-violet-600 hover:bg-violet-500/10 cursor-pointer gap-1"
              >
                <Plus className="h-3 w-3" />
                Añadir
              </Button>
            </div>

            <div className="space-y-2">
              {attributeGroups.map((group, idx) => (
                <div key={group._id} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-black text-muted-foreground/50 w-4 text-right">
                      {idx + 1}.
                    </span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Atributo (ej. Color)"
                    value={group.name}
                    onChange={(e) => updateGroup(group._id, 'name', e.target.value)}
                    className="h-8 text-xs rounded-lg bg-background border-violet-500/15 focus-visible:ring-1 focus-visible:ring-violet-500/40 w-28 shrink-0 font-semibold"
                  />
                  <Input
                    type="text"
                    placeholder="Valores separados por coma (ej. Rojo, Azul)"
                    value={group.valuesRaw}
                    onChange={(e) => updateGroup(group._id, 'valuesRaw', e.target.value)}
                    className="h-8 text-xs rounded-lg bg-background border-violet-500/15 focus-visible:ring-1 focus-visible:ring-violet-500/40 flex-1"
                  />
                  {attributeGroups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGroup(group._id)}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Preview de valores ingresados */}
            <div className="flex flex-wrap gap-1">
              {attributeGroups
                .filter((g) => g.name.trim() && g.valuesRaw.trim())
                .flatMap((g) =>
                  g.valuesRaw
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .map((v) => ({ group: g.name, value: v }))
                )
                .map((item, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[9px] font-bold border-violet-500/20 text-violet-600 bg-violet-500/5"
                  >
                    {item.group}: {item.value}
                  </Badge>
                ))}
            </div>

            <Button
              type="button"
              onClick={generateCombinations}
              className="w-full h-9 rounded-xl text-xs font-bold gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generar {(() => {
                const valid = attributeGroups.filter(
                  (g) => g.name.trim() && g.valuesRaw.trim()
                );
                if (valid.length === 0) return 'Combinaciones';
                const count = valid.reduce(
                  (acc, g) =>
                    acc *
                    g.valuesRaw.split(',').map((v) => v.trim()).filter(Boolean).length,
                  1
                );
                return `${count} Combinación${count !== 1 ? 'es' : ''}`;
              })()}
            </Button>
          </div>

          {/* ── Sección 2: Tabla de Variantes Generadas ── */}
          {variantDrafts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black text-violet-600 uppercase tracking-wider">
                  {variantDrafts.length} Variante{variantDrafts.length !== 1 ? 's' : ''} — Edita precio y stock
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addManualVariant}
                  className="h-7 px-2.5 rounded-lg text-[10px] font-bold text-violet-600 hover:bg-violet-500/10 cursor-pointer gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Manual
                </Button>
              </div>

              <div className="rounded-xl border border-violet-500/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-violet-500/5">
                    <TableRow className="border-violet-500/10 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black text-violet-500/80 uppercase py-2 w-[30%]">
                        Variante
                      </TableHead>
                      <TableHead className="text-[10px] font-black text-violet-500/80 uppercase py-2 w-[28%]">
                        SKU
                      </TableHead>
                      <TableHead className="text-[10px] font-black text-violet-500/80 uppercase py-2 text-center w-[16%]">
                        Precio S/.
                      </TableHead>
                      <TableHead className="text-[10px] font-black text-violet-500/80 uppercase py-2 text-center w-[14%]">
                        Stock
                      </TableHead>
                      <TableHead className="w-8 py-2" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variantDrafts.map((draft, idx) => (
                      <TableRow
                        key={draft._localId}
                        className="border-violet-500/10 hover:bg-violet-500/3"
                      >
                        <TableCell className="py-1.5 px-2">
                          <Input
                            value={draft.name}
                            onChange={(e) =>
                              updateDraft(draft._localId, 'name', e.target.value)
                            }
                            placeholder="Nombre variante"
                            className="h-7 text-[11px] rounded-lg border-violet-500/15 bg-background focus-visible:ring-1 focus-visible:ring-violet-500/40"
                          />
                        </TableCell>
                        <TableCell className="py-1.5 px-2">
                          <Input
                            value={draft.sku}
                            onChange={(e) =>
                              updateDraft(
                                draft._localId,
                                'sku',
                                e.target.value.toUpperCase()
                              )
                            }
                            placeholder="SKU-VAR"
                            className="h-7 text-[11px] rounded-lg border-violet-500/15 bg-background focus-visible:ring-1 focus-visible:ring-violet-500/40 font-mono uppercase"
                          />
                        </TableCell>
                        <TableCell className="py-1.5 px-2">
                          <Input
                            value={draft.price}
                            onChange={(e) =>
                              updateDraft(draft._localId, 'price', e.target.value)
                            }
                            type="number"
                            step="0.01"
                            min="0"
                            className="h-7 text-[11px] rounded-lg border-violet-500/15 bg-background focus-visible:ring-1 focus-visible:ring-violet-500/40 text-center"
                          />
                        </TableCell>
                        <TableCell className="py-1.5 px-2">
                          <Input
                            value={draft.stock}
                            onChange={(e) =>
                              updateDraft(draft._localId, 'stock', e.target.value)
                            }
                            type="number"
                            min="0"
                            className="h-7 text-[11px] rounded-lg border-violet-500/15 bg-background focus-visible:ring-1 focus-visible:ring-violet-500/40 text-center"
                          />
                        </TableCell>
                        <TableCell className="py-1.5 px-1">
                          <button
                            type="button"
                            onClick={() => removeDraft(draft._localId)}
                            className="h-6 w-6 rounded-md flex items-center justify-center text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Eliminar variante"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <p className="text-[9px] text-muted-foreground/60 text-center">
                Puedes editar SKU, precio y stock de cada variante antes de crear el producto.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VariantBuilder;
