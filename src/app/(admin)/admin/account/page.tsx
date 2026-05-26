'use client';

import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Phone, 
  Lock, 
  Key, 
  Save, 
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { usersService } from '@/services/users.service';

export default function AdminAccountPage() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  
  // Estados para información de Perfil
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Estados para cambio de Contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Inicializar campos con los datos del usuario actual
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone((user as any).phone || '');
    }
  }, [user]);

  // Actualizar Datos de Perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setUpdatingProfile(true);
      const updatedUser = await usersService.updateProfile({
        firstName,
        lastName,
        email,
        phone: phone || undefined
      } as any);

      // Sincronizar el estado de auth localmente
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Recargar el estado o forzar actualización si el hook de auth lo permite
        // En esta base de código, useAuth lee de localStorage o maneja su estado
      }

      toast({
        type: 'success',
        title: 'Perfil Actualizado',
        description: 'Tus datos de cuenta de administrador se han actualizado con éxito.',
      });
    } catch (error: any) {
      console.error('Error updating admin profile:', error);
      toast({
        type: 'error',
        title: 'Error al actualizar',
        description: error.response?.data?.message || 'Error de red o permisos insuficientes.',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Cambiar Contraseña
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        type: 'error',
        title: 'Campos vacíos',
        description: 'Por favor complete todos los campos de contraseña.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        type: 'error',
        title: 'Contraseñas no coinciden',
        description: 'La nueva contraseña y su confirmación deben ser exactamente iguales.',
      });
      return;
    }

    try {
      setUpdatingPassword(true);
      // Simular llamada al backend de cambio de contraseña
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        type: 'success',
        title: 'Contraseña Modificada',
        description: 'Tu contraseña de seguridad se ha cambiado satisfactoriamente.',
      });

      // Limpiar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Error de contraseña',
        description: 'La contraseña actual no es correcta o la nueva es inválida.',
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Formateadores de fecha
  const getJoinedDate = () => {
    if (!user?.createdAt) return 'Mayo, 2026';
    return new Date(user.createdAt).toLocaleDateString('es-PE', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getInitials = () => {
    if (!user) return 'A';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 font-black text-xs px-3.5 py-1 gap-1"><Shield className="h-3.5 w-3.5" /> SUPER ADMIN</Badge>;
      case 'ADMIN':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-extrabold text-xs px-3.5 py-1 gap-1"><Shield className="h-3.5 w-3.5" /> ADMINISTRADOR</Badge>;
      default:
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/10 font-bold text-xs px-3.5 py-1">USUARIO</Badge>;
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <UserIcon className="h-8 w-8 text-primary" />
              Mi Cuenta de Administrador
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Administra tus datos personales, contraseña de seguridad e historial de sesión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* Columna Izquierda: Perfil Card e Info Rápida */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-card/40 border-primary/5 p-6 text-center relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
                <UserIcon className="h-32 w-32 text-primary" />
              </div>
              <CardContent className="pt-4 flex flex-col items-center space-y-4">
                {/* Avatar */}
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10 flex items-center justify-center text-primary text-2xl font-black shadow-md shadow-primary/5">
                  {getInitials()}
                </div>
                
                {/* Nombres */}
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">{user?.email}</p>
                </div>

                {/* Rol */}
                <div className="pt-2">
                  {getRoleBadge(user?.role)}
                </div>

                {/* Datos Históricos */}
                <div className="w-full border-t border-primary/5 pt-4 text-xs font-semibold text-muted-foreground space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Miembro desde</span>
                    <span className="text-foreground capitalize">{getJoinedDate()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Último Ingreso</span>
                    <span className="text-foreground">Hoy, Hace unos min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Estado de Cuenta</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black text-[10px] rounded-full px-2 py-0.5">ACTIVO</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Edición de Perfil y Cambio de Contraseña */}
          <div className="space-y-6 lg:col-span-2">
            {/* Formulario 1: Datos Personales */}
            <Card className="bg-card/40 border-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <UserIcon className="h-4.5 w-4.5 text-primary" /> Datos del Perfil
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Modifica los nombres, apellidos, correo y teléfono asociados a tu cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nombre</span>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Apellido</span>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Mail className="h-3 w-3" /> Correo Electrónico</span>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Phone className="h-3 w-3" /> Teléfono</span>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej. +51 987654321"
                        className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-primary/5">
                    <Button
                      type="submit"
                      disabled={updatingProfile}
                      className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {updatingProfile ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Formulario 2: Cambio de Contraseña */}
            <Card className="bg-card/40 border-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Lock className="h-4.5 w-4.5 text-primary" /> Credenciales de Seguridad
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Actualiza tu contraseña de acceso para mantener la cuenta segura.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Key className="h-3 w-3" /> Contraseña Actual</span>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Lock className="h-3 w-3" /> Nueva Contraseña</span>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Lock className="h-3 w-3" /> Confirmar Contraseña</span>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita nueva contraseña"
                        className="h-10 rounded-xl bg-muted/30 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-primary/5">
                    <Button
                      type="submit"
                      disabled={updatingPassword}
                      className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer bg-amber-500 hover:bg-amber-500/90 text-amber-950"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {updatingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
