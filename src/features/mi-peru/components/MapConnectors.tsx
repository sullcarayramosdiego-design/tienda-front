'use client';
import { useEffect, useState } from 'react';

interface MapConnectorsProps {
  items: { id: string }[];
  hoveredId: string | null;
}

export function MapConnectors({ items, hoveredId }: MapConnectorsProps) {
  const [lines, setLines] = useState<{ id: string, x1: number, y1: number, x2: number, y2: number, isHovered: boolean }[]>([]);

  useEffect(() => {
    const updateLines = () => {
      const newLines = items.map(item => {
        const card = document.getElementById(`card-${item.id}`);
        const marker = document.getElementById(`marker-${item.id}`);
        if (!card || !marker) return null;

        const cardRect = card.getBoundingClientRect();
        const markerRect = marker.getBoundingClientRect();

        // Detectar si están visibles dentro de sus contenedores
        const cardContainer = card.closest('aside');
        const markerContainer = marker.closest('.maplibregl-map') || marker.parentElement?.parentElement?.parentElement;

        let isVisible = true;

        if (cardContainer) {
          const cRect = cardContainer.getBoundingClientRect();
          // Margen de 10px para ocultar antes de que toque el borde
          if (cardRect.bottom < cRect.top - 10 || cardRect.top > cRect.bottom + 10) isVisible = false;
        }

        if (markerContainer) {
          const mRect = markerContainer.getBoundingClientRect();
          if (markerRect.bottom < mRect.top || markerRect.top > mRect.bottom || markerRect.right < mRect.left || markerRect.left > mRect.right) {
            isVisible = false;
          }
        }

        if (!isVisible) return null;

        // Si el card está a la izquierda del marker, salir del borde derecho del card
        // Si está a la derecha, salir del borde izquierdo
        const startX = cardRect.left < markerRect.left ? cardRect.right : cardRect.left;
        const startY = cardRect.top + cardRect.height / 2;

        // Entrar al centro del marker
        const endX = markerRect.left + markerRect.width / 2;
        const endY = markerRect.top + markerRect.height / 2;

        return { 
          id: item.id, 
          x1: startX, 
          y1: startY, 
          x2: endX, 
          y2: endY,
          isHovered: hoveredId === item.id 
        };
      }).filter(Boolean);

      setLines(newLines as any);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    window.addEventListener('scroll', updateLines, true); // true para capturar scroll en sidebars
    
    let animationFrameId: number;
    const loop = () => {
      updateLines();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', updateLines);
      window.removeEventListener('scroll', updateLines, true);
      cancelAnimationFrame(animationFrameId);
    };
  }, [items, hoveredId]);

  if (lines.length === 0) return null;

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-[60]">
      {lines.map(line => (
        <line
          key={line.id}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="var(--secondary)"
          strokeWidth={line.isHovered ? "2.5" : "1.5"}
          strokeDasharray="4 4"
          opacity={line.isHovered ? 1 : 0.6}
          className="transition-all duration-300"
        />
      ))}
    </svg>
  );
}
