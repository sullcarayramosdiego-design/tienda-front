export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold">
        Producto: {params.slug}
      </h1>
      <p className="text-muted-foreground mt-4">
        Página de detalle del producto (por implementar)
      </p>
    </div>
  );
}