'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, ThumbsUp, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { reviewsService, Review } from '../services/reviews.service';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

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

  const renderStars = (rating: number, interactive = false, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => interactive && onClick && onClick(star)}
            className={cn(
              "h-3 w-3 transition-all",
              star <= rating
                ? 'fill-foreground text-foreground'
                : 'text-muted-foreground/30 fill-transparent',
              interactive ? 'cursor-pointer hover:scale-125' : ''
            )}
          />
        ))}
      </div>
    );
  };

  const handleHelpful = (id: string) => {
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
      
      await fetchReviews();
    } catch (err: any) {
      console.error('Error publicando reseña:', err);
      const msg = err.response?.data?.message;
      setErrorMessage(
        Array.isArray(msg) ? msg[0] : msg || 'Imposible registrar. Verifica tu sesión o compras previas.'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatReviewDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '.');
    } catch (e) {
      return 'RECIENTE';
    }
  };

  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="w-full space-y-12">
      {/* HEADER ROW */}
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Feedback</h2>
          <div className="text-2xl font-black tracking-tight text-foreground flex items-center gap-4">
            {averageRating}
            <div className="flex gap-1">{renderStars(Math.round(parseFloat(averageRating)))}</div>
          </div>
        </div>
        
        <button
          onClick={() => {
            if (!isAuthenticated) {
              setErrorMessage('AUTENTICACIÓN REQUERIDA PARA OPINAR.');
              setShowAddForm(false);
              return;
            }
            setShowAddForm(!showAddForm);
            setErrorMessage('');
          }}
          disabled={loading}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors disabled:opacity-50"
        >
          {showAddForm ? 'CANCELAR' : 'NUEVO REPORTE'}
        </button>
      </div>

      {/* MESSAGES */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground bg-foreground/5 p-4 border-l-2 border-foreground"
          >
            REGISTRO COMPLETADO CORRECTAMENTE.
          </motion.div>
        )}
        
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive bg-destructive/5 p-4 border-l-2 border-destructive"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmitReview} 
            className="space-y-6 bg-muted/20 p-8 border border-border"
          >
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block">
                Nivel de Satisfacción
              </label>
              <div className="flex items-center gap-4">
                {renderStars(newRating, true, setNewRating)}
                <span className="text-[10px] font-mono text-muted-foreground">[{newRating}.0]</span>
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="rev-comment" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block">
                Reporte Detallado
              </label>
              <textarea
                id="rev-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ingresa tus observaciones sobre topología, materiales y entrega..."
                required
                rows={4}
                className="w-full bg-transparent border-b border-border focus:border-foreground transition-colors p-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none font-medium"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitLoading}
                className="h-10 px-8 bg-foreground text-background font-bold uppercase tracking-[0.1em] text-[10px] transition-colors hover:bg-foreground/90 disabled:opacity-50 flex items-center justify-center"
              >
                {submitLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'SUBIR REPORTE'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* REVIEWS LIST */}
      <div className="space-y-0">
        {loading ? (
          <div className="py-12 flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Recuperando registros...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-[10px] font-bold tracking-widest uppercase text-muted-foreground border-b border-border">
            0 REGISTROS ENCONTRADOS.
          </div>
        ) : (
          reviews.map((rev) => {
            const fullName = rev.user
              ? `${rev.user.firstName} ${rev.user.lastName}`
              : 'ANÓNIMO';

            return (
              <div key={rev.id} className="py-8 border-b border-border flex flex-col md:flex-row gap-6 md:gap-12 group">
                {/* Meta sidebar */}
                <div className="w-full md:w-48 shrink-0 space-y-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-foreground truncate">
                      {fullName}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      ID: {rev.id.split('-')[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {formatReviewDate(rev.createdAt)}
                  </div>
                  {renderStars(rev.rating)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {rev.comment}
                  </p>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => handleHelpful(rev.id)}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group/btn"
                    >
                      <ThumbsUp className="h-3 w-3 transition-transform group-hover/btn:-translate-y-0.5" />
                      <span>Verificado Útil ({(rev as any).helpfulCount || 0})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
