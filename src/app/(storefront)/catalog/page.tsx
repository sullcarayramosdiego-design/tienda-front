export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-bold mb-6">Catálogo 3D</h1>
      <p className="text-lg text-muted-foreground">
        Explora nuestros productos con visualización 3D interactiva
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted aspect-square rounded-xl flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Producto 1</p>
        </div>
        <div className="bg-muted aspect-square rounded-xl flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Producto 2</p>
        </div>
        <div className="bg-muted aspect-square rounded-xl flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Producto 3</p>
        </div>
      </div>
    </div>
  );
}