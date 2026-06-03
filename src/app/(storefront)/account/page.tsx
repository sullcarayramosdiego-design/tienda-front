'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { usersService } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Shield, 
  Sparkles, 
  KeyRound, 
  Loader2, 
  CheckCircle2, 
  Edit2, 
  X, 
  Save, 
  Crown, 
  ArrowRight 
} from 'lucide-react';
import { subscriptionService } from '@/features/subscriptions';

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Profile Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Sincronizar campos de edición con el usuario actual
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Password Reset States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Subscription States
  const [activeSub, setActiveSub] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // Fetch active subscription on mount
  useEffect(() => {
    async function loadSubscription() {
      try {
        setLoadingSub(true);
        const sub = await subscriptionService.getCurrentSubscription();
        setActiveSub(sub);
      } catch (err) {
        console.error('Error al cargar la suscripción en el perfil:', err);
      } finally {
        setLoadingSub(false);
      }
    }
    loadSubscription();
  }, []);

  // Synchronize form fields when user or editing changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user, isEditing]);

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
      const cleanPhone = phone.replace(/\D/g, '');
      await usersService.updateProfile({ firstName, lastName, phone: cleanPhone || undefined });
      toast({
        title: '✨ ¡Perfil Actualizado!',
        description: 'Tus datos de perfil se han actualizado con éxito.',
        type: 'success',
      });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: 'Error al actualizar perfil',
        description: err.response?.data?.message || 'No se pudo guardar tu información en este momento.',
        type: 'error',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) {
      toast({ title: 'Campos requeridos', description: 'Completa ambos campos para restablecer tu contraseña.', type: 'error' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Contraseña muy corta', description: 'La contraseña debe tener al menos 6 caracteres.', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: 'Las contraseñas no coinciden', description: 'Verifica que ambas contraseñas coincidan exactamente.', type: 'error' });
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
      confirmPassword && setConfirmPassword('');
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
          <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden relative shadow-md">
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

          {/* Dynamic VIP Status Card based on Subscription */}
          {loadingSub ? (
            <div className="p-4 border border-primary/10 rounded-2xl animate-pulse bg-muted/20 h-20 flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-semibold">Verificando estatus VIP...</span>
            </div>
          ) : activeSub && activeSub.status === 'ACTIVE' ? (
            <div className="flex items-center gap-3 p-4 border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-primary/5 to-transparent rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
              <Crown className="h-5 w-5 text-emerald-500 shrink-0 animate-pulse" />
              <div className="space-y-0.5 relative z-10">
                <span className="text-xs font-black text-foreground">Socio VIP ({activeSub.plan.name})</span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Tienes acceso a todas las funcionalidades tridimensionales interactivas, AR y soporte prioritario.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4 border border-primary/10 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-foreground">Membresía Básica</span>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Explora y visualiza modelos 3D. Adquiere una suscripción Premium para desbloquear AR y envíos gratis.
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="w-full text-[10px] font-bold h-7 rounded-lg bg-primary hover:bg-primary/95 text-white shadow-sm active:scale-98 transition-transform">
                <Link href="/subscription">
                  Adquirir Suscripción Premium <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Profile Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Profile Info Edit */}
          <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-2xl shadow-md">
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
                  className="rounded-xl border-primary/15 hover:bg-primary/5 text-xs gap-1.5 h-8"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Editar
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl hover:bg-muted text-xs gap-1 h-8 text-muted-foreground"
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
                    <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary/5 border border-primary/5 sm:col-span-2">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Teléfono / Celular</span>
                      <p className="text-sm font-bold text-foreground">{user.phone || 'No registrado'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary/5 border border-primary/5">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Correo Electrónico</span>
                      <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                    </div>
                    <div className="space-y-1.5 p-3.5 rounded-2xl bg-primary/5 border border-primary/5">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Número de Celular</span>
                      <p className="text-sm font-bold text-foreground">{user.phone || 'No registrado'}</p>
                    </div>
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Teléfono / Celular</label>
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="rounded-xl h-10 border-primary/10" 
                      placeholder="Ej: 51918941272"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button 
                      type="submit" 
                      disabled={updatingProfile} 
                      className="rounded-xl h-10 px-4 font-bold text-xs gap-1.5"
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
          <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-2xl shadow-md">
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
                    className="rounded-xl h-10 px-4 font-bold text-xs gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground shadow-md"
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
