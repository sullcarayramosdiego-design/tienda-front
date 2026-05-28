'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, StarHalf, PlusCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      name: 'Juan D.',
      avatar: 'JD',
      rating: 5,
      date: 'Hace 2 días',
      comment: 'La experiencia 3D en la web es alucinante. Pude ver el acabado exacto y la escala del producto antes de comprarlo. 100% recomendado.',
      verified: true,
      helpfulCount: 8,
    },
    {
      id: '2',
      name: 'María R.',
      avatar: 'MR',
      rating: 4,
      date: 'Hace 1 semana',
      comment: 'Excelente calidad y acabados. El visor 3D es muy fiel a la realidad. El envío a Trujillo tardó 2 días pero todo llegó en perfecto estado.',
      verified: true,
      helpfulCount: 3,
    },
    {
      id: '3',
      name: 'Carlos M.',
      avatar: 'CM',
      rating: 5,
      date: 'Hace 3 semanas',
      comment: 'Me encantó interactuar con el modelo 3D antes de comprar. El producto físico es idéntico. Excelente atención por parte del equipo.',
      verified: true,
      helpfulCount: 5,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Helper to render stars
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
    setReviews((prev) =>
      prev.map((rev) =>
        rev.id === id ? { ...rev, helpfulCount: rev.helpfulCount + 1 } : rev
      )
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: Date.now().toString(),
      name: newName,
      avatar: newName.substring(0, 2).toUpperCase(),
      rating: newRating,
      date: 'Hace un momento',
      comment: newComment,
      verified: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setNewName('');
    setNewComment('');
    setNewRating(5);
    setShowAddForm(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  // Calculate stats
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden mt-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl font-heading font-extrabold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Reseñas de Clientes
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-muted-foreground mt-0.5">
              Opiniones de compradores verificados
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            variant="outline"
            className="border-primary/15 hover:bg-primary/5 rounded-xl cursor-pointer text-xs font-bold gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            {showAddForm ? 'Cancelar' : 'Escribir Reseña'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rating Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 rounded-2xl bg-primary/5 border border-primary/5 items-center">
          <div className="text-center sm:border-r border-primary/5 py-2">
            <span className="text-4xl font-heading font-black text-foreground">{averageRating}</span>
            <div className="flex justify-center my-1.5">{renderStars(Math.round(parseFloat(averageRating)))}</div>
            <span className="text-xs font-bold text-muted-foreground">{totalReviews} valoraciones</span>
          </div>

          <div className="sm:col-span-2 space-y-2.5">
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

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-[#00D47C]/10 border border-[#00D47C]/20 text-[#00AF66] rounded-2xl text-xs font-bold animate-fade-in">
            <CheckCircle className="h-4.5 w-4.5" />
            <span>¡Tu reseña ha sido publicada exitosamente y se muestra en la lista!</span>
          </div>
        )}

        {/* Add Review Form */}
        {showAddForm && (
          <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border border-primary/10 rounded-2xl bg-card animate-fade-in">
            <h4 className="text-sm font-bold text-foreground">Tu Reseña</h4>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground">Tu Calificación</Label>
              <div className="flex items-center gap-2">
                {renderStars(newRating, true, setNewRating)}
                <span className="text-xs font-mono font-bold text-amber-500">({newRating} estrellas)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rev-name" className="text-xs font-bold text-muted-foreground">Tu Nombre</Label>
              <Input
                id="rev-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Diego S."
                required
                className="rounded-xl border-primary/10 focus:border-primary/20 bg-background/50 h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rev-comment" className="text-xs font-bold text-muted-foreground">Comentario</Label>
              <textarea
                id="rev-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comparte tu experiencia interactuando con el modelo 3D y la calidad del producto..."
                required
                rows={3}
                className="w-full rounded-xl border border-primary/10 focus:border-primary/20 bg-background/50 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl h-9 text-xs cursor-pointer active:scale-95 transition-all"
            >
              Publicar Reseña
            </Button>
          </form>
        )}

        {/* Reviews List */}
        <div className="divide-y divide-primary/5 space-y-4">
          {reviews.map((rev, index) => (
            <div key={rev.id} className={`pt-4 ${index === 0 ? 'pt-0' : ''} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-full border border-primary/10 shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-extrabold">
                      {rev.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">{rev.name}</span>
                      {rev.verified && (
                        <span className="px-1.5 py-0.5 text-[8px] font-black bg-[#00D47C]/10 text-[#00AF66] rounded-md border border-[#00D47C]/15 uppercase tracking-wide flex items-center gap-0.5">
                          <CheckCircle className="h-2 w-2 fill-current" /> Verificado
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 font-semibold">{rev.date}</span>
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
                  <span>¿Útil? ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
