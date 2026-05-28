'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  RefreshCcw, 
  Sun, 
  Moon, 
  Settings2, 
  Box,
  Maximize,
  LightbulbOff,
  Lightbulb
} from 'lucide-react';
import { ModelViewer } from '@/components/shared/ModelViewer';

export interface Asset3DPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assetUrl: string | null;
  assetName: string;
}

export function Asset3DPreviewModal({
  isOpen,
  onOpenChange,
  assetUrl,
  assetName,
}: Asset3DPreviewModalProps) {
  // Audit tools state
  const [autoRotate, setAutoRotate] = useState(true);
  const [exposure, setExposure] = useState<number>(1);
  const [shadowIntensity, setShadowIntensity] = useState<number>(1);
  const [bgMode, setBgMode] = useState<'light' | 'dark' | 'transparent'>('transparent');

  if (!assetUrl) return null;

  const bgClasses = {
    light: 'bg-white',
    dark: 'bg-slate-900',
    transparent: 'bg-transparent bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZmlsbD0iI2QxZDVkYiIgZD0iTTAgMGgxMHYxMEgweiIvPjxwYXRoIGZpbGw9IiNmM2Y0ZjYiIGQ0iTTEwIDBoMTB2MTBIMTB6TTB2MTBoMTB2MTBIMHoiLz48L3N2Zz4=")]'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-card border-primary/10 shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[600px]">
        
        {/* Left Side: 3D Viewer Canvas */}
        <div className={`relative flex-1 ${bgClasses[bgMode]} transition-colors duration-300 flex items-center justify-center overflow-hidden border-r border-primary/10`}>
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] font-black uppercase text-primary/70 tracking-widest bg-background/50 backdrop-blur-md px-2 py-1 rounded-md border border-primary/10">
              Auditoría de Render
            </span>
          </div>

          <ModelViewer
            src={assetUrl}
            alt={assetName}
            autoRotate={autoRotate}
            exposure={exposure}
            shadowIntensity={shadowIntensity}
            className="w-full h-full min-h-[400px] outline-none"
          />
        </div>

        {/* Right Side: Tools & Controls */}
        <div className="w-full md:w-80 bg-muted/20 flex flex-col h-full overflow-y-auto">
          <div className="p-5 border-b border-primary/10">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" />
                Control de Calidad 3D
              </DialogTitle>
              <DialogDescription className="text-xs mt-1 truncate" title={assetName}>
                {assetName}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5 space-y-6 flex-1">
            
            {/* Control: Animación */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCcw className="h-3.5 w-3.5" /> Comportamiento
              </h4>
              <Button
                variant={autoRotate ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-xs h-9 rounded-xl ${autoRotate ? 'shadow-sm shadow-primary/20' : ''}`}
                onClick={() => setAutoRotate(!autoRotate)}
              >
                {autoRotate ? <RefreshCcw className="h-4 w-4 mr-2 animate-spin-slow" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
                {autoRotate ? 'Rotación Automática: ON' : 'Rotación Automática: OFF'}
              </Button>
            </div>

            {/* Control: Iluminación */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5" /> Iluminación (Exposición)
              </h4>
              <div className="flex gap-2">
                <Button
                  variant={exposure === 0.5 ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8"
                  onClick={() => setExposure(0.5)}
                >
                  <Moon className="h-3.5 w-3.5 mr-1.5" /> Baja
                </Button>
                <Button
                  variant={exposure === 1 ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8"
                  onClick={() => setExposure(1)}
                >
                  <Sun className="h-3.5 w-3.5 mr-1.5" /> Normal
                </Button>
                <Button
                  variant={exposure === 2 ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8"
                  onClick={() => setExposure(2)}
                >
                  <Lightbulb className="h-3.5 w-3.5 mr-1.5" /> Alta
                </Button>
              </div>
            </div>

            {/* Control: Sombras */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Settings2 className="h-3.5 w-3.5" /> Sombras
              </h4>
              <div className="flex gap-2">
                <Button
                  variant={shadowIntensity === 0 ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8"
                  onClick={() => setShadowIntensity(0)}
                >
                  <LightbulbOff className="h-3.5 w-3.5 mr-1.5" /> Sin Sombra
                </Button>
                <Button
                  variant={shadowIntensity === 1 ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8"
                  onClick={() => setShadowIntensity(1)}
                >
                  Suave
                </Button>
                <Button
                  variant={shadowIntensity === 2 ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8"
                  onClick={() => setShadowIntensity(2)}
                >
                  Dura
                </Button>
              </div>
            </div>

            {/* Control: Fondo de Contraste */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Maximize className="h-3.5 w-3.5" /> Fondo de Contraste
              </h4>
              <div className="flex gap-2">
                <Button
                  variant={bgMode === 'transparent' ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8"
                  onClick={() => setBgMode('transparent')}
                >
                  Malla
                </Button>
                <Button
                  variant={bgMode === 'light' ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8 bg-white text-slate-900 border-slate-200 hover:bg-slate-100"
                  onClick={() => setBgMode('light')}
                >
                  Claro
                </Button>
                <Button
                  variant={bgMode === 'dark' ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-[10px] rounded-xl h-8 bg-slate-900 text-white border-slate-700 hover:bg-slate-800"
                  onClick={() => setBgMode('dark')}
                >
                  Oscuro
                </Button>
              </div>
            </div>

          </div>

          <div className="p-5 border-t border-primary/10 bg-background/50">
            <Button 
              className="w-full text-xs font-bold rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cerrar Auditoría
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
