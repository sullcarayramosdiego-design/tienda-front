const fs = require('fs');
const file = 'src/components/admin/InventoryTable.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { VariantBuilder, VariantDraft } from './VariantBuilder';",
  "import { VariantBuilder, VariantDraft } from './VariantBuilder';\nimport { VariantsManager } from './VariantsManager';"
);

const oldModal = `      {/* MODAL: GESTIÓN DE VARIANTES (PLACEHOLDER) */}
      <Dialog open={isVariantsOpen} onOpenChange={setIsVariantsOpen}>
        <DialogContent className="sm:max-w-xl rounded-xl p-6 shadow-xl bg-card border-primary/5">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Variantes de {variantsSheetProduct?.name}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              La edición de variantes existentes se activará en el próximo release.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <Layers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Gestión avanzada de variantes en construcción.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsVariantsOpen(false)} className="rounded-xl text-xs font-bold w-full cursor-pointer">
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>`;

const newModal = `      {/* MODAL 6: GESTIÓN DE VARIANTES EXISTENTES */}
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
      </Dialog>`;

content = content.replace(oldModal, newModal);
fs.writeFileSync(file, content);
console.log('Injected VariantsManager');
