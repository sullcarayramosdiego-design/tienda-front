'use client';

import { useState, useRef } from 'react';
import { assetsService } from '@/services/assets.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Upload, File, Check } from 'lucide-react';

interface Asset3DUploadProps {
  productId: string;
  onUploadSuccess?: () => void;
}

/**
 * Componente para subir modelos 3D (.glb, .usdz) al backend
 * Requiere autenticación y rol ADMIN
 */
export function Asset3DUpload({ productId, onUploadSuccess }: Asset3DUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    if (!assetsService.isValid3DFile(selectedFile)) {
      setError('Solo se permiten archivos .glb o .usdz');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

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
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Subir Modelo 3D
        </CardTitle>
        <CardDescription>
          Sube archivos .glb o .usdz para vista AR/VR
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Archivo 3D</Label>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept=".glb,.usdz"
            onChange={handleFileSelect}
            disabled={uploading}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90
              cursor-pointer"
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <File className="h-4 w-4" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {assetsService.formatFileSize(file.size)}
              </p>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              Modelo 3D subido exitosamente
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? 'Subiendo...' : 'Subir Modelo'}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Formatos aceptados: .glb, .usdz</p>
          <p>• Tamaño máximo: Configurado en el backend</p>
          <p>• Requiere rol de administrador</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Asset3DUpload;
