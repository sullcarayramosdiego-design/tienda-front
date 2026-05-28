"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth.schema";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ShieldAlert, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      console.log("Intentando login con:", data.email);
      
      const response = await login({
        email: data.email,
        password: data.password,
      });
      
      console.log("Login exitoso, usuario:", response.user);
      
      toast({
        title: "¡Inicio de Sesión Exitoso!",
        description: `Bienvenido de nuevo, ${response.user.firstName} ${response.user.lastName}.`,
        type: "success"
      });

      // Redirigir según el rol del usuario
      if (response.user.role === 'SUPER_ADMIN' || response.user.role === 'ADMIN') {
        console.log("Redirigiendo a /admin");
        router.push("/admin");
      } else {
        console.log("Redirigiendo a /account");
        router.push("/account");
      }
      router.refresh();
    } catch (err: unknown) {
      console.error("Error en login:", err);
      
      // Extraer mensaje de error del response de axios
      let message = "Error al iniciar sesión. Verifica tus credenciales.";
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = (err as { response?: { data?: { message?: string | string[] } } }).response;
        if (errorResponse?.data?.message) {
          message = Array.isArray(errorResponse.data.message) 
            ? errorResponse.data.message.join(", ") 
            : errorResponse.data.message;
        }
      }
      
      setError(message);
      toast({
        title: "Error al Iniciar Sesión",
        description: message,
        type: "error"
      });
    }
  };
const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      
      const result = await signIn('google', {
        callbackUrl: '/catalog',
        redirect: true,
      });
      
      if (result?.error) {
        setError('Error al iniciar sesión con Google. Intenta de nuevo.');
        toast({
          title: "Error",
          description: "No se pudo iniciar sesión con Google",
          type: "error"
        });
      }
    } catch (err) {
      console.error('Error Google Sign In:', err);
      setError('Error al conectar con Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  
  return (
    <div className="relative w-full max-w-[400px] mx-auto animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
      {/* Decorative Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl md:rounded-3xl blur-xl opacity-40" />
      
      <Card className="relative border-primary/10 shadow-2xl bg-card/75 backdrop-blur-xl dark:bg-card/45 rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-300">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex flex-col items-center space-y-2 mb-2">
            {/* Sparkles Brand Circle */}
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20 animate-pulse">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            
            <CardTitle className="text-2xl font-extrabold text-center tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Bienvenido de Nuevo
            </CardTitle>
            <CardDescription className="text-center text-xs sm:text-sm">
              Ingresa tus credenciales para acceder a la tienda 3D
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Error Alert */}
          {error && (
            <Alert variant="destructive" className="relative pr-10 animate-in fade-in-0 zoom-in-95 duration-200">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
              <button
                type="button"
                onClick={() => setError(null)}
                className="absolute top-3 right-3 text-destructive/70 hover:text-destructive focus:outline-none focus:ring-1 focus:ring-destructive rounded p-0.5 transition-colors"
                aria-label="Cerrar error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-foreground/80">Correo electrónico</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                        <Input
                          type="email"
                          placeholder="tu@ejemplo.com"
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            "pl-10 h-11 transition-all duration-200 rounded-xl bg-background/50 border-primary/10 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary",
                            form.formState.errors.email 
                              ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive" 
                              : form.formState.dirtyFields.email 
                                ? "border-emerald-500/40 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                                : "focus-visible:ring-primary"
                          )}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] font-medium mt-1" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-foreground/80">Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={form.formState.isSubmitting}
                          className={cn(
                            "pl-10 pr-10 h-11 transition-all duration-200 rounded-xl bg-background/50 border-primary/10 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary",
                            form.formState.errors.password 
                              ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive" 
                              : form.formState.dirtyFields.password 
                                ? "border-emerald-500/40 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                                : "focus-visible:ring-primary"
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={form.formState.isSubmitting}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary rounded-full p-1 transition-colors duration-200"
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px] font-medium mt-1" />
                  </FormItem>
                )}
              />
              
              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    disabled={form.formState.isSubmitting}
                    className="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary focus:ring-offset-background dark:border-primary/10 bg-background/50 accent-primary cursor-pointer disabled:opacity-50"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs font-semibold text-muted-foreground cursor-pointer select-none disabled:opacity-50"
                  >
                    Recordarme
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline underline-offset-4 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 bg-primary hover:bg-primary/95 transition-all transform active:scale-98 cursor-pointer gap-2"
                disabled={form.formState.isSubmitting}
                aria-label={form.formState.isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </Button>
            </form>
          </Form>


          {/* Separator */}
          <div className="relative my-4">
            <Separator className="bg-primary/5" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/90 px-3 text-[10px] sm:text-xs font-semibold text-muted-foreground rounded-full border border-primary/5">
              O continúa con
            </span>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              type="button" 
              disabled={form.formState.isSubmitting || isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="h-10 border-primary/10 hover:bg-primary/5 hover:border-primary/20 transition-all rounded-xl transform active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              aria-label="Iniciar sesión con Google"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-xs font-semibold">Google</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              type="button" 
              disabled={form.formState.isSubmitting}
              className="h-10 border-primary/10 hover:bg-primary/5 hover:border-primary/20 transition-all rounded-xl transform active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              aria-label="Iniciar sesión con GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-xs font-semibold">GitHub</span>
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center bg-muted/20 border-t border-primary/5 py-4">
          <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
