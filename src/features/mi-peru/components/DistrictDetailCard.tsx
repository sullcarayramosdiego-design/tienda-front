import React from 'react';
import { MapPin, Video, Calendar, Image as ImageIcon, X } from 'lucide-react';

interface DistrictDetail {
  id: string;
  name: string;
  slug: string;
  history: string;
  howToGetThere: string;
  photos: string[];
  festivities: Array<{
    id: string;
    name: string;
    description: string;
    youtubeVideos: string[];
    images: string[];
  }>;
}

interface DistrictDetailCardProps {
  detail: DistrictDetail;
  onClose: () => void;
  renderProducts: React.ReactNode;
}

export const DistrictDetailCard: React.FC<DistrictDetailCardProps> = ({ detail, onClose, renderProducts }) => {
  // Extract YouTube ID from URLs
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* Main Drawer Container */}
      <div className="
        fixed bottom-0 left-0 w-full rounded-t-[32px] max-h-[85vh] z-50 bg-card border-t border-border/80 p-5 overflow-y-auto shadow-2xl flex flex-col gap-6
        md:relative md:bottom-auto md:left-auto md:w-full md:rounded-3xl md:max-h-[none] md:z-auto md:bg-card md:border md:border-border md:p-8 md:overflow-visible
        text-foreground backdrop-blur-md transition-all duration-300
      ">
        {/* Mobile Pull Handle Indicator */}
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-2 md:hidden" onClick={onClose} />

        {/* Header */}
        <div className="flex justify-between items-start border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold tracking-widest uppercase mb-1">
              <MapPin size={14} className="text-primary" />
              <span>DISTRITO DE EXPLORACIÓN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {detail.name}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-background hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Cerrar panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-secondary font-heading">Historia y Origen</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-[65ch]">
              {detail.history || "No hay información histórica cargada para este distrito."}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-primary font-heading">¿Cómo llegar?</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-[65ch]">
              {detail.howToGetThere || "La información sobre rutas y accesos está siendo procesada."}
            </p>
          </div>
        </div>

        {/* Photos Google Drive */}
        {detail.photos && detail.photos.length > 0 && (
          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="text-base sm:text-lg font-bold text-accent flex items-center gap-2 font-heading">
              <ImageIcon size={18} className="text-accent" />
              Galería de Fotos (Google Drive)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {detail.photos.map((photoUrl, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border/80 bg-background group">
                  <img 
                    src={photoUrl} 
                    alt={`Fotografía ${idx + 1} de ${detail.name}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image in case Google Drive links block or take time to load
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/peru-folklore/320/180';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <span className="text-[10px] text-muted-foreground font-medium">Foto #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Festivities Segment */}
        {detail.festivities && detail.festivities.length > 0 && (
          <div className="space-y-5 border-t border-border pt-6">
            <h3 className="text-base sm:text-lg font-bold text-secondary flex items-center gap-2 font-heading">
              <Calendar size={18} className="text-secondary" />
              Festividades y Calendario Cultural
            </h3>
            <div className="space-y-4">
              {detail.festivities.map((fest) => (
                <div key={fest.id} className="bg-background/40 border border-border/60 p-4 sm:p-5 rounded-2xl space-y-4">
                  <div>
                    <h4 className="text-sm sm:text-md font-bold text-primary font-heading">{fest.name}</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mt-1.5 max-w-[70ch]">
                      {fest.description}
                    </p>
                  </div>
                  
                  {/* YouTube Video if available */}
                  {fest.youtubeVideos && fest.youtubeVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fest.youtubeVideos.map((videoUrl, vIdx) => {
                        const videoId = getYouTubeId(videoUrl);
                        if (!videoId) return null;
                        return (
                          <div key={vIdx} className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-accent font-semibold">
                              <Video size={14} className="text-accent" />
                              <span>Material Audiovisual</span>
                            </div>
                            <div className="aspect-video w-full rounded-xl overflow-hidden border border-border/60 bg-background">
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`Video descriptivo ${fest.name}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Associated Products Render Slot */}
        <div className="mt-2">
          {renderProducts}
        </div>
      </div>
    </>
  );
};
