import { Navbar } from "@/components/layout/Navbar";
import { StorefrontHeader } from "@/components/layout/StorefrontHeader";
import { Footer } from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Desktop Navigation */}
      <Navbar />
      
      {/* Mobile Header */}
      <StorefrontHeader />
      
      {/* Contenido Centrado */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}
