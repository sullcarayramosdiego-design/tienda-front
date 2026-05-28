'use client';

import { useState, useRef, useCallback } from 'react';
import { assetsService } from '@/services/assets.service';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, File, Check, X, CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Asset3DUploadProps {
  productId: string;
  onUploadSuccess?: () => void;
}

/**
 * Zona de carga de modelos 3D (.glb, .usdz) con drag-and-drop visual.
 * Requiere autenticación y rol ADMIN.
 */
export function Asset3DUpload({ productId, onUploadSuccess }: Asset3DUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (f: File) => {
    if (!assetsService.isValid3DFile(f)) {
      setError('Solo se permiten archivos .glb o .usdz');
      setFile(null);
      return;
    }
    setFile(f);
    setError(null);
    setSuccess(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const asset = await assetsService.upload(file, productId);

      console.log('Asset subido:', {
        id: asset.id,
        url: asset.fileUrl,
        size: assetsService.formatFileSize(asset.fileSize),
        format: asset.format,
      });

      setSuccess(true);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isGlb = file?.name.toLowerCase().endsWith('.glb');

  return (
    <div className="space-y-3">
      {/* Zona de Drag & Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer select-none',
          dragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : file
            ? 'border-primary/30 bg-primary/5'
            : 'border-primary/10 bg-muted/20 hover:border-primary/30 hover:bg-muted/40'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.usdz"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        {file ? (
          /* Archivo seleccionado */
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center min-w-0 w-full px-4">
              <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge className={cn(
                  'text-[9px] font-black uppercase border',
                  isGlb
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                )}>
                  {isGlb ? 'GLB' : 'USDZ (iOS)'}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {assetsService.formatFileSize(file.size)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-muted/60 hover:bg-destructive/10 hover:text-destructive text-muted-foreground flex items-center justify-center transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          /* Estado vacío */
          <>
            <div className={cn(
              'h-12 w-12 rounded-2xl flex items-center justify-center transition-colors',
              dragging ? 'bg-primary/15' : 'bg-muted/60'
            )}>
              <CloudUpload className={cn(
                'h-6 w-6 transition-colors',
                dragging ? 'text-primary' : 'text-muted-foreground/60'
              )} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                {dragging ? 'Suelta el archivo aquí' : 'Arrastra tu modelo 3D aquí'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                o haz clic para seleccionar · .glb o .usdz
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[8px] font-black uppercase border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                GLB
              </Badge>
              <Badge variant="outline" className="text-[8px] font-black uppercase border-blue-500/20 text-blue-500 bg-blue-500/5">
                USDZ (iOS)
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* Mensajes */}
      {error && (
        <Alert variant="destructive" className="py-2 px-3 rounded-xl text-xs">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="py-2 px-3 rounded-xl border-emerald-500/20 bg-emerald-500/5">
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <AlertDescription className="text-xs text-emerald-600 font-semibold ml-1">
            Modelo 3D subido exitosamente
          </AlertDescription>
        </Alert>
      )}

      {/* Botón de Subida */}
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full h-10 rounded-xl font-bold text-xs gap-2 shadow-sm shadow-primary/10"
      >
        {uploading ? (
          <>
            <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            Subiendo modelo...
          </>
        ) : (
          <>
            <Upload className="h-3.5 w-3.5" />
            Subir Modelo 3D
          </>
        )}
      </Button>
    </div>
  );
}

export default Asset3DUpload;
