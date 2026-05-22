import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar Horizontal */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <span className="text-xl font-bold">E-Commerce 3D</span>
          </Link>

          {/* Navegación Derecha */}
          <nav className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost">Inicio</Button>
            </Link>
            <Link href="/catalog">
              <Button variant="ghost">Catálogo</Button>
            </Link>
            <div className="h-6 w-px bg-border mx-1" />
            <Link href="/login">
              <Button variant="outline">Ingresar</Button>
            </Link>
            <Link href="/register">
              <Button>Crear Cuenta</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido Centrado */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} E-Commerce 3D. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
