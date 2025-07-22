import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { X, Upload } from 'lucide-react';
import { Ficha } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FichaFormProps {
  onSubmit: (ficha: Omit<Ficha, 'id' | 'fechaCreacion'>) => void;
  onCancel: () => void;
}

const FichaForm: React.FC<FichaFormProps> = ({ onSubmit, onCancel }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<'personal' | 'trabajo' | 'proyecto'>('personal');
  const [imagen, setImagen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim() || !descripcion.trim()) {
      return;
    }

    onSubmit({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tipo,
      imagen: imagen.trim() || undefined
    });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagen(e.target.value);
  };

  const getRandomImage = () => {
    const imageIds = [
      'photo-1517077304055-6e89abbf09b0',
      'photo-1519389950473-47ba0277781c',
      'photo-1486312338219-ce68d2c6f44d',
      'photo-1498050108023-c5249f4df085',
      'photo-1484417894907-623942c8ee29'
    ];
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
    setImagen(`https://images.unsplash.com/${randomId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`);
  };

  return (
    <>
      {/* Overlay de fondo */}
      <div 
        className="fixed inset-0 bg-black/50 z-20"
        onClick={onCancel}
      />

      {/* Modal centrado */}
      <div className="fixed top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/12 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-lg w-[90%] z-30 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white drop-shadow">
            Crear Nueva Ficha
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-white hover:bg-white/20 p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo" className="block text-left mb-1 text-white drop-shadow">
              Título
            </Label>
            <Input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-3 bg-white/90 border border-gray-300 rounded-md"
              placeholder="Ingresa el título de la ficha"
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion" className="block text-left mb-1 text-white drop-shadow">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-3 bg-white/90 border border-gray-300 rounded-md min-h-[100px] resize-none"
              placeholder="Describe tu ficha..."
              required
            />
          </div>

          <div>
            <Label className="block text-left mb-2 text-white drop-shadow">
              Tipo de Ficha
            </Label>
            <div className="flex justify-center gap-3">
              {(['personal', 'trabajo', 'proyecto'] as const).map((tipoOption) => (
                <Button
                  key={tipoOption}
                  type="button"
                  onClick={() => setTipo(tipoOption)}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    tipo === tipoOption
                      ? 'bg-blue-800 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {tipoOption.charAt(0).toUpperCase() + tipoOption.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="imagen" className="block text-left mb-1 text-white drop-shadow">
              URL de Imagen (opcional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="imagen"
                type="url"
                value={imagen}
                onChange={handleImageUrlChange}
                className="flex-1 p-3 bg-white/90 border border-gray-300 rounded-md"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <Button
                type="button"
                onClick={getRandomImage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3"
                title="Obtener imagen aleatoria"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {imagen && (
            <div className="mt-4">
              <ImageWithFallback
                src={imagen}
                alt="Vista previa"
                className="w-full max-w-xs mx-auto rounded-xl shadow-md"
              />
            </div>
          )}

          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
            >
              Crear Ficha
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FichaForm;