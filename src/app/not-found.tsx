import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-muted p-3 rounded-full w-fit mb-2">
            <FileQuestion className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <h2 className="text-xl font-semibold text-foreground">Página no encontrada</h2>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Lo sentimos, no pudimos encontrar la página que estás buscando. Puede que haya sido movida, eliminada, o que el enlace sea incorrecto.
          </p>
          <Button asChild className="w-full font-semibold" size="lg">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
