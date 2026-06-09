'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ServerCrash, WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  // Determinar el tipo de error
  const isNetworkError = error.message.includes('Network Error') || error.message.includes('fetch failed');
  const isServerError = error.message.includes('500') || error.message.includes('Server Error');
  const isBadRequest = error.message.includes('400') || error.message.includes('Bad Request');

  let title = '¡Algo salió mal!';
  let description = 'Ocurrió un error inesperado al procesar tu solicitud.';
  let Icon = AlertCircle;

  if (isNetworkError) {
    title = 'Error de conexión';
    description = 'No pudimos conectarnos con el servidor. Por favor, revisa tu conexión a internet o intenta de nuevo más tarde.';
    Icon = WifiOff;
  } else if (isServerError) {
    title = 'Error del servidor (500)';
    description = 'Nuestro servidor está experimentando problemas técnicos. El equipo ya ha sido notificado.';
    Icon = ServerCrash;
  } else if (isBadRequest) {
    title = 'Solicitud incorrecta (400)';
    description = 'Hubo un problema con la información enviada. Por favor, intenta de nuevo.';
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2">
            <Icon className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            {description}
          </p>
          
          {process.env.NODE_ENV !== 'production' && error.message && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-left overflow-auto max-h-32">
              <p className="text-xs font-mono text-destructive">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={reset} className="w-full font-semibold" size="lg">
              Intentar de nuevo
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
