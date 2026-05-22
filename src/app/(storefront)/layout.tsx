import { Navbar } from '@/components/layout/Navbar';
import { StorefrontHeader } from '@/components/layout/StorefrontHeader';
import { Footer } from '@/components/layout/Footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Navigation */}
      <Navbar />
      
      {/* Mobile Header */}
      <StorefrontHeader />
      
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
