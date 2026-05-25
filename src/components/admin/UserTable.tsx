'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Shield, 
  UserCheck, 
  UserX, 
  Trash2, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User as UserSilhouette
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { usersService } from '@/services/users.service';
import type { User } from '@/types/api';

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Estados de Modales
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Cargar lista de usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersService.listAll(page, limit, searchQuery || undefined);
      setUsers(data.users);
      setTotalCount(data.total);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error('Error fetching admin users list:', error);
      toast({
        type: 'error',
        title: 'Error al cargar usuarios',
        description: error.response?.data?.message || 'Error de conexión con el servidor.',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Manejar cambio de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Resetear a página 1 al buscar
  };

  // Manejar cambio de rol
  const handleRoleChange = async (userId: string, newRole: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN') => {
    try {
      await usersService.updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast({
        type: 'success',
        title: 'Rol actualizado',
        description: `El usuario ahora posee privilegios de: ${newRole}.`,
      });
    } catch (error: any) {
      console.error('Error changing user role:', error);
      toast({
        type: 'error',
        title: 'Error al actualizar rol',
        description: error.response?.data?.message || 'Error de permisos o conexión.',
      });
    }
  };

  // Activar/Desactivar cuenta
  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      await usersService.toggleActive(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: nextStatus } : u))
      );
      toast({
        type: nextStatus ? 'success' : 'warning',
        title: nextStatus ? 'Cuenta activada' : 'Cuenta suspendida',
        description: nextStatus 
          ? 'El usuario ahora puede acceder a la plataforma.'
          : 'Se ha revocado el acceso de esta cuenta temporalmente.',
      });
    } catch (error: any) {
      console.error('Error toggling active status:', error);
      toast({
        type: 'error',
        title: 'Error al cambiar estado',
        description: error.response?.data?.message || 'Error de permisos.',
      });
    }
  };

  // Confirmar eliminación de usuario
  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await usersService.delete(userToDelete.id);
      
      toast({
        type: 'success',
        title: 'Usuario eliminado',
        description: 'La cuenta se ha borrado definitivamente.',
      });
      
      setIsDeleteOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Recargar lista
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        type: 'error',
        title: 'Error al eliminar usuario',
        description: error.response?.data?.message || 'Acción rechazada por el servidor.',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Formateadores
  const getUserInitials = (firstName = '', lastName = '') => {
    return `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`.toUpperCase() || 'U';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 font-black text-[10px] gap-1"><ShieldCheck className="h-3 w-3" /> SUPER ADMIN</Badge>;
      case 'ADMIN':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-extrabold text-[10px] gap-1"><Shield className="h-3 w-3" /> ADMIN</Badge>;
      case 'CUSTOMER':
      default:
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/10 font-semibold text-[10px]">CLIENTE</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Grid de Stats de Usuarios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Registrados */}
        <Card className="bg-card/75 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <UsersIcon className="h-24 w-24 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total Registrados
              <UsersIcon className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-black text-foreground">
                {totalCount} <span className="text-xs font-bold text-muted-foreground">Usuarios</span>
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Cuentas creadas en base de datos
            </p>
          </CardContent>
        </Card>

        {/* Cuentas Activas */}
        <Card className="bg-card/75 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <UserCheck className="h-24 w-24 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Estado de Cuentas
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-black text-emerald-500">
                {users.filter(u => u.isActive).length} <span className="text-xs font-bold text-emerald-500/80">Activos</span>
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Usuarios con autorización activa de logueo
            </p>
          </CardContent>
        </Card>

        {/* Roles jerárquicos */}
        <Card className="bg-card/75 border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-2 opacity-5 scale-150">
            <Shield className="h-24 w-24 text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Equipo Administrativo
              <Shield className="h-4 w-4 text-indigo-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-black text-indigo-500">
                {users.filter(u => u.role !== 'CUSTOMER').length} <span className="text-xs font-bold text-indigo-500/80">Admins</span>
              </div>
            )}
            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-1">
              Personal con acceso a panel administrativo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Búsqueda y Control */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/40 p-4 rounded-xl border border-primary/5">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Buscar usuario por nombre, apellido o email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 h-10 rounded-xl bg-muted/40 border-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
          />
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm" className="h-10 px-3.5 rounded-xl text-xs font-bold gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" />
          Sincronizar
        </Button>
      </div>

      {/* Tabla de Usuarios */}
      <Card className="bg-card/40 border-primary/5">
        <CardContent className="p-0">
          <div className="rounded-xl border border-primary/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold text-xs">Usuario</TableHead>
                  <TableHead className="font-bold text-xs">Email</TableHead>
                  <TableHead className="font-bold text-xs">Rol</TableHead>
                  <TableHead className="font-bold text-xs">Asignar Rol</TableHead>
                  <TableHead className="font-bold text-xs">Cuenta Creada</TableHead>
                  <TableHead className="font-bold text-xs">Estado</TableHead>
                  <TableHead className="font-bold text-xs text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-10 w-40 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5.5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-9 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell align="right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs font-semibold text-muted-foreground">
                      No se encontraron usuarios en el sistema.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/40 transition-colors">
                      {/* Avatar y Nombre */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-primary/10">
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-bold text-xs">
                              {getUserInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-foreground">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: {user.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="text-xs text-muted-foreground font-semibold">
                        {user.email}
                      </TableCell>

                      {/* Badge Rol Actual */}
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>

                      {/* Combo Selección de Rol */}
                      <TableCell>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(val: any) => handleRoleChange(user.id, val)}
                        >
                          <SelectTrigger className="h-8 w-32 rounded-lg bg-muted/30 border-primary/5 text-[11px] cursor-pointer">
                            <SelectValue placeholder="Seleccione Rol" />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            <SelectItem className="text-xs cursor-pointer" value="CUSTOMER">Cliente</SelectItem>
                            <SelectItem className="text-xs cursor-pointer" value="ADMIN">Admin</SelectItem>
                            <SelectItem className="text-xs cursor-pointer" value="SUPER_ADMIN">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Fecha de Registro */}
                      <TableCell className="text-xs text-muted-foreground font-semibold">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      {/* Estado de Cuenta */}
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black border",
                            user.isActive
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}
                        >
                          {user.isActive ? 'ACTIVO' : 'SUSPENDIDO'}
                        </Badge>
                      </TableCell>

                      {/* Acciones de Activación/Bloqueo */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Botón Activar / Bloquear */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(user.id, user.isActive ?? true)}
                            className={cn(
                              "h-8 w-8 rounded-lg cursor-pointer transition-colors",
                              user.isActive 
                                ? "hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground"
                                : "hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground"
                            )}
                            title={user.isActive ? 'Suspender cuenta' : 'Activar cuenta'}
                          >
                            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>

                          {/* Botón Eliminar Cuenta */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(user)}
                            className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-primary/5">
              <span className="text-xs font-bold text-muted-foreground">
                Página <span className="text-foreground">{page}</span> de <span className="text-foreground">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOG: ELIMINAR CUENTA */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-xl bg-card border-primary/5 max-w-sm" showCloseButton={true}>
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">¿Eliminar cuenta definitivamente?</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Esta acción borrará irrevocablemente los datos de <span className="font-bold text-primary">{userToDelete?.firstName} {userToDelete?.lastName}</span>.
              No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl text-xs cursor-pointer">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              disabled={deleting}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-xs cursor-pointer shadow-md shadow-destructive/10"
            >
              {deleting ? 'Eliminando...' : 'Eliminar Cuenta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
