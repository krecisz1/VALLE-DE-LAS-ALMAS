import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  X, 
  Upload, 
  User, 
  Mail, 
  Camera, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Usuario } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfileFormProps {
  user: Usuario;
  onSubmit: (userData: Partial<Usuario> & { fotoPerfil?: string }) => void;
  onCancel: () => void;
}

interface ProfileData {
  nombre: string;
  apellidos: string;
  email: string;
  fotoPerfil: string;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProfileData>({
    nombre: user.nombre,
    apellidos: user.apellidos,
    email: user.email,
    fotoPerfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  });

  const [fotoUploading, setFotoUploading] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fotoRef = useRef<HTMLInputElement>(null);

  // Constantes para validación
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB para imágenes
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Solo se permiten archivos de imagen';
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return 'Formato de imagen no soportado. Usa JPG, PNG, GIF o WebP';
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return 'Las imágenes no pueden superar los 10MB';
    }

    return null;
  };

  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        setUploadProgress(Math.min(progress, 95));
        
        if (progress >= 95) {
          clearInterval(interval);
          
          // Simular posible error (2% de probabilidad)
          if (Math.random() < 0.02) {
            setUploadProgress(0);
            reject(new Error('Error al subir la imagen. Intenta nuevamente.'));
            return;
          }
          
          // Simular URL final
          setTimeout(() => {
            setUploadProgress(100);
            
            // URLs de perfiles profesionales de Unsplash
            const profileUrls = [
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face'
            ];
            
            const mockUrl = profileUrls[Math.floor(Math.random() * profileUrls.length)];
            
            setTimeout(() => {
              setUploadProgress(0);
              resolve(mockUrl);
            }, 500);
          }, 1000);
        }
      }, 200);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.apellidos.trim() || !formData.email.trim()) {
      setErrors(['Por favor completa todos los campos obligatorios']);
      return;
    }

    if (fotoUploading) {
      setErrors(['Espera a que termine de subir la foto']);
      return;
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(['Por favor ingresa un email válido']);
      return;
    }

    onSubmit({
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim(),
      fotoPerfil: formData.fotoPerfil
    });
  };

  const handleFotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setErrors([validationError]);
      return;
    }

    setFotoUploading(true);
    setFotoFile(file);
    setErrors([]);

    try {
      // Generar preview inmediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, fotoPerfil: e.target?.result as string }));
      };
      reader.readAsDataURL(file);

      // Simular upload
      const url = await simulateUpload(file);
      setFormData(prev => ({ ...prev, fotoPerfil: url }));
      setErrors([]);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Error al subir la foto']);
      setFormData(prev => ({ ...prev, fotoPerfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' }));
      setFotoFile(null);
    } finally {
      setFotoUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearErrors = () => setErrors([]);

  return (
    <>
      {/* Overlay de fondo */}
      <div 
        className="fixed inset-0 bg-black/50 z-20"
        onClick={onCancel}
      />

      {/* Modal centrado */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/12 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-lg w-[90%] z-30 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white drop-shadow flex items-center gap-2">
            <User className="w-6 h-6 text-teal-400" />
            Editar Perfil
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

        {/* Errores */}
        {errors.length > 0 && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
              <Button
                onClick={clearErrors}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 mt-2"
              >
                Cerrar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de perfil */}
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <ImageWithFallback
                src={formData.fotoPerfil}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
              />
              {fotoUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Button
                type="button"
                onClick={() => fotoRef.current?.click()}
                disabled={fotoUploading}
                className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
              >
                {fotoUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                {fotoUploading ? 'Subiendo...' : 'Cambiar Foto'}
              </Button>
              
              <input
                ref={fotoRef}
                type="file"
                accept="image/*"
                onChange={handleFotoUpload}
                className="hidden"
              />
              
              {/* Progress bar para foto */}
              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/80">
                    <span>Subiendo foto...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-teal-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {fotoFile && !fotoUploading && (
                <p className="text-white/70 text-xs">
                  {formatFileSize(fotoFile.size)}
                </p>
              )}
            </div>
          </div>

          {/* Información personal */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre" className="text-white mb-1 block">
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="bg-white/90 border-white/30"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <Label htmlFor="apellidos" className="text-white mb-1 block">
                  Apellidos *
                </Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                  className="bg-white/90 border-white/30"
                  placeholder="Tus apellidos"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white mb-1 block flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Correo Electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/90 border-white/30"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Información sobre la foto */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-white/90 text-sm">
              <strong>Foto de perfil:</strong>
            </p>
            <ul className="text-white/70 text-sm mt-1 space-y-1">
              <li>• Esta foto aparecerá en tu árbol genealógico</li>
              <li>• Formato: JPG, PNG, GIF o WebP</li>
              <li>• Tamaño máximo: 10MB</li>
              <li>• Recomendado: 400x400px o superior</li>
            </ul>
          </div>

          {/* Botones de acción */}
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
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors duration-200"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserProfileForm;