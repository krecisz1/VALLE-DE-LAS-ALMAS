import React from 'react';
import { Button } from './ui/button';
import { Trash2, Calendar, Tag } from 'lucide-react';
import { Ficha } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FichaCardProps {
  ficha: Ficha;
  onDelete: (id: string) => void;
}

const FichaCard: React.FC<FichaCardProps> = ({ ficha, onDelete }) => {
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'personal':
        return 'bg-green-500';
      case 'trabajo':
        return 'bg-blue-500';
      case 'proyecto':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white/15 backdrop-blur-sm p-8 rounded-2xl mx-auto max-w-2xl shadow-lg animate-in fade-in slide-in-from-bottom duration-400">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getTipoColor(ficha.tipo)}`} />
          <span className="text-white/80 text-sm uppercase tracking-wide drop-shadow">
            <Tag className="inline w-4 h-4 mr-1" />
            {ficha.tipo}
          </span>
        </div>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(ficha.id)}
          className="bg-red-500/80 hover:bg-red-600 text-white p-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <h3 className="text-2xl text-white mb-3 drop-shadow">
        {ficha.titulo}
      </h3>

      <p className="text-white/90 mb-4 leading-relaxed drop-shadow">
        {ficha.descripcion}
      </p>

      {ficha.imagen && (
        <div className="mb-4">
          <ImageWithFallback
            src={ficha.imagen}
            alt={ficha.titulo}
            className="w-full max-w-md mx-auto rounded-2xl shadow-md"
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-white/70 text-sm drop-shadow">
        <Calendar className="w-4 h-4" />
        <span>Creado el {formatFecha(ficha.fechaCreacion)}</span>
      </div>
    </div>
  );
};

export default FichaCard;