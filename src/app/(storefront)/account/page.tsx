'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth';
import { usersService } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { User, Mail, Shield, Sparkles, KeyRound, Loader2, CheckCircle2, Edit2, X, Save } from 'lucide-react';

export default function AccountPage() {
  const { user, login } = useAuth();
  const { toast } = useToast();

  // Profile Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Reset States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (!user) {
    return (
      <Card className="border-primary/10 bg-card/60 backdrop-blur-md p-6 text-center">
        <p className="text-sm text-muted-foreground font-semibold">Cargando perfil de usuario...</p>
      </Card>
    );
  }

  // Generate fallback initials
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast({ title: 'Campos requeridos', description: 'Por favor, completa todos los campos.', type: 'error' });
      return;
    }

    setUpdatingProfile(true);
    try {
      const updatedUser = await usersService.updateProfile({ firstName, lastName });
      toast({
        title: '🎉 ¡Perfil Actualizado!',
        description: 'Tus datos personales han sido actualizados con éxito.',
        type: 'success',
      });
      setIsEditing(false);
      
      // Update local storage and context if necessary
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload(); // Refresh to update layout names in header/sidebar
      }
    } catch (err: any) {
      toast({
        title: 'Error al actualizar',
        description: err.response?.data?.message || 'Ocurrió un error inesperado al actualizar tu perfil.',
        type: 'error',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast({ title: 'Contraseña requerida', description: 'Por favor, ingresa tu nueva contraseña.', type: 'error' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Contraseña muy corta', description: 'La contraseña debe tener al menos 6 caracteres.', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Las contraseñas no coinciden', description: 'Verifica que ambas contraseñas escritas sean iguales.', type: 'error' });
      return;
    }

    setUpdatingPassword(true);
    try {
      await usersService.updateProfile({ password });
      toast({
        title: '🔑 ¡Contraseña Restablecida!',
        description: 'Tu nueva contraseña se ha guardado de forma segura y encriptada.',
        type: 'success',
      });
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({
        title: 'Error al cambiar contraseña',
        description: err.response?.data?.message || 'No se pudo actualizar tu contraseña en este momento.',
        type: 'error',
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full pb-10">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-foreground">Mi Perfil</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gestiona tus datos personales, credenciales y privilegios dentro del ecosistema 3D
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card Summary */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-3xl overflow-hidden relative shadow-md">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary" />
            <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-md shadow-primary/10">
                <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-primary text-white font-black text-xl uppercase">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <h2 className="text-lg font-heading font-black text-foreground">{`${user.firstName} ${user.lastName}`}</h2>
                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border-primary/20 select-none">
                  {user.role || 'CLIENTE'}
                </Badge>
              </div>

              <hr className="w-full border-primary/5" />

              <div className="w-full space-y-2.5 text-left text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate text-foreground">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-foreground">ID: {user.id.slice(0, 8)}...</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3 p-4 border border-primary/15 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent rounded-2xl">
            <Sparkles className="h-5 w-5 text-primary shrink-0 animate-pulse" />
            <div className="space-y-0.5">
              <span className="text-xs font-black text-foreground">Socio VIP Club 3D</span>
              <p className="text-[10px] text-muted-foreground leading-normal">Tienes acceso a todas las funcionalidades tridimensionales interactivas y soporte prioritario.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Profile Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Profile Info Edit */}
          <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-3xl shadow-md">
            <CardHeader className="pb-3 border-b border-primary/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-heading font-bold text-foreground">Información Personal</CardTitle>
                <CardDescription className="text-xs">Detalles registrados para tu facturación y envíos automáticos.</CardDescription>
              </div>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-primary/15 hover:bg-primary/5 text-xs gap-1.5 h-8 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Editar
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl hover:bg-muted text-xs gap-1 h-8 cursor-pointer text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" /> Cancelar
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {!isEditing ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary/5 border border-primary/5">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Nombres</span>
                      <p className="text-sm font-bold text-foreground">{user.firstName}</p>
                    </div>
                    <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary/5 border border-primary/5">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Apellidos</span>
                      <p className="text-sm font-bold text-foreground">{user.lastName}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary/5 border border-primary/5">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Correo Electrónico</span>
                    <p className="text-sm font-bold text-foreground">{user.email}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Nombres</label>
                      <Input 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        className="rounded-xl h-10 border-primary/10" 
                        placeholder="Nombres"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Apellidos</label>
                      <Input 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        className="rounded-xl h-10 border-primary/10" 
                        placeholder="Apellidos"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button 
                      type="submit" 
                      disabled={updatingProfile} 
                      className="rounded-xl h-10 px-4 font-bold text-xs gap-1.5 cursor-pointer"
                    >
                      {updatingProfile ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando...</>
                      ) : (
                        <><Save className="h-3.5 w-3.5" /> Guardar Cambios</>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Card: Password Change Form */}
          <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-3xl shadow-md">
            <CardHeader className="pb-3 border-b border-primary/5">
              <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                <KeyRound className="h-4.5 w-4.5 text-primary" /> Restablecer Contraseña
              </CardTitle>
              <CardDescription className="text-xs">Actualiza tus credenciales para mantener tu cuenta completamente segura.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Nueva Contraseña</label>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="rounded-xl h-10 border-primary/10" 
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Confirmar Contraseña</label>
                    <Input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="rounded-xl h-10 border-primary/10" 
                      placeholder="Repite la contraseña"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    disabled={updatingPassword} 
                    className="rounded-xl h-10 px-4 font-bold text-xs gap-1.5 cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground shadow-md"
                  >
                    {updatingPassword ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando...</>
                    ) : (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> Actualizar Contraseña</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
