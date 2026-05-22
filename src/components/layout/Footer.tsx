export function Footer() {
  return (
    <footer className="border-t bg-background py-2 lg:py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} E-Commerce 3D. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
