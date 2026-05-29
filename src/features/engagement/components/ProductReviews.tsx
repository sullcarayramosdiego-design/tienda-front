'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, ThumbsUp, PlusCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth';
import { reviewsService, Review } from '../services/reviews.service';

export function ProductReviews({ productId }: { productId: string }) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar reseñas desde el backend
  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await reviewsService.getProductReviews(productId);
      setReviews(res.data);
      setTotalReviews(res.total);
    } catch (error) {
      console.error('Error cargando reseñas del producto:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Helper para renderizar estrellas
  const renderStars = (rating: number, interactive = false, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => interactive && onClick && onClick(star)}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30 fill-transparent'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          />
        ))}
      </div>
    );
  };

  const handleHelpful = (id: string) => {
    // Simulación visual en frontend del botón de utilidad
    setReviews((prev) =>
      prev.map((rev) =>
        rev.id === id ? { ...rev, helpfulCount: (rev as any).helpfulCount ? (rev as any).helpfulCount + 1 : 1 } : rev
      )
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !productId) return;

    try {
      setSubmitLoading(true);
      setErrorMessage('');
      
      await reviewsService.createReview({
        productId,
        rating: newRating,
        comment: newComment,
      });

      setNewComment('');
      setNewRating(5);
      setShowAddForm(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 5000);
      
      // Recargar listado completo
      await fetchReviews();
    } catch (err: any) {
      console.error('Error publicando reseña:', err);
      const msg = err.response?.data?.message;
      setErrorMessage(
        Array.isArray(msg) ? msg[0] : msg || 'No se pudo publicar la reseña. Es posible que ya hayas opinado sobre este producto.'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper para formatear fechas reales de base de datos
  const formatReviewDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Hace poco';
    }
  };

  // Calcular valoraciones promedio
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden mt-6">
      <CardHeader className="pb-4 border-b border-primary/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl font-heading font-extrabold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Reseñas de Clientes
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-muted-foreground mt-0.5">
              Opiniones y valoraciones de compradores verificados
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                setErrorMessage('⚠️ Debes iniciar sesión para calificar este producto y dejar un comentario.');
                setShowAddForm(false);
                return;
              }
              setShowAddForm(!showAddForm);
              setErrorMessage('');
            }}
            size="sm"
            variant="outline"
            disabled={loading}
            className="border-primary/15 hover:bg-primary/5 rounded-xl cursor-pointer text-xs font-bold gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            {showAddForm ? 'Cancelar' : 'Escribir Reseña'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xs font-bold text-muted-foreground">Cargando valoraciones reales...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA - CALIFICACIONES Y RESUMEN (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              
              {/* Bloque de Resumen */}
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/5 space-y-4">
                <div className="text-center pb-4 border-b border-primary/5">
                  <span className="text-5xl font-heading font-black text-foreground">{averageRating}</span>
                  <div className="flex justify-center my-2">{renderStars(Math.round(parseFloat(averageRating)))}</div>
                  <span className="text-xs font-bold text-muted-foreground">{totalReviews} valoraciones</span>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter((r) => r.rating === stars).length;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                        <span className="w-3 text-right">{stars}</span>
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-mono text-[10px]">{percentage.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mensajes de éxito y error */}
              {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-[#00D47C]/10 border border-[#00D47C]/20 text-[#00AF66] rounded-2xl text-xs font-bold animate-fade-in">
                  <CheckCircle className="h-4.5 w-4.5" />
                  <span>¡Tu reseña ha sido publicada exitosamente!</span>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs font-bold animate-fade-in">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span>{errorMessage}</span>
                    {!isAuthenticated && (
                      <div className="flex gap-2 mt-2">
                        <Button asChild size="xs" className="h-7 text-[10px] font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer rounded-lg">
                          <a href="/login">Iniciar Sesión</a>
                        </Button>
                        <Button asChild variant="outline" size="xs" className="h-7 text-[10px] font-bold border-destructive/20 hover:bg-destructive/5 text-destructive cursor-pointer rounded-lg">
                          <a href="/register">Registrarse</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Formulario para Añadir Opinión */}
              {showAddForm && (
                <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border border-primary/10 rounded-2xl bg-card animate-fade-in shadow-inner">
                  <h4 className="text-sm font-bold text-foreground">Escribe tu opinión</h4>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground">Tu Calificación</Label>
                    <div className="flex items-center gap-2">
                      {renderStars(newRating, true, setNewRating)}
                      <span className="text-xs font-mono font-bold text-amber-500">({newRating} estrellas)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="rev-comment" className="text-xs font-bold text-muted-foreground">Comentario</Label>
                    <textarea
                      id="rev-comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Cuéntanos qué te pareció el visor 3D, la calidad del producto y el despacho..."
                      required
                      rows={3}
                      className="w-full rounded-xl border border-primary/10 focus:border-primary/20 bg-background/50 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitLoading}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl h-9 text-xs cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    {submitLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Publicar Reseña
                  </Button>
                </form>
              )}
            </div>

            {/* COLUMNA DERECHA - HILO DE COMENTARIOS (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground/80 uppercase tracking-wider mb-2">
                Hilos y Opiniones de Compradores
              </h3>
              
              <div className="divide-y divide-primary/5 space-y-4 shadow-sm border border-primary/5 bg-background/40 backdrop-blur-sm rounded-2xl p-5">
                {reviews.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-xs font-bold">
                    Aún no hay opiniones para este producto. ¡Sé el primero en calificarlo!
                  </div>
                ) : (
                  reviews.map((rev, index) => {
                    const initials = rev.user
                      ? `${rev.user.firstName?.[0] || ''}${rev.user.lastName?.[0] || ''}`.toUpperCase()
                      : 'U';
                    const fullName = rev.user
                      ? `${rev.user.firstName} ${rev.user.lastName}`
                      : 'Usuario';

                    return (
                      <div key={rev.id} className={`pt-4 ${index === 0 ? 'pt-0' : ''} space-y-2.5`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-full border border-primary/10 shadow-sm">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-extrabold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-foreground">{fullName}</span>
                                <span className="px-1.5 py-0.5 text-[8px] font-black bg-[#00D47C]/10 text-[#00AF66] rounded-md border border-[#00D47C]/15 uppercase tracking-wide flex items-center gap-0.5">
                                  Verificado
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground/60 font-semibold">
                                {formatReviewDate(rev.createdAt)}
                              </span>
                            </div>
                          </div>
                          {renderStars(rev.rating)}
                        </div>

                        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pl-11">
                          {rev.comment}
                        </p>

                        <div className="flex items-center gap-4 pl-11">
                          <button
                            type="button"
                            onClick={() => handleHelpful(rev.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>¿Útil? ({(rev as any).helpfulCount || 0})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
