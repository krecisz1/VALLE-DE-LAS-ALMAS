import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  X, 
  Plus, 
  Upload, 
  Calendar, 
  User, 
  MapPin, 
  Briefcase, 
  Heart, 
  ImageIcon, 
  Video, 
  Camera, 
  FileImage, 
  AlertCircle, 
  CheckCircle,
  Play,
  Loader2,
  TreeDeciduous,
  Users,
  Edit3,
  Crown,
  Sparkles,
  Lock,
  Check,
  Star,
  RefreshCw
} from 'lucide-react';
import { Memorial, FamilyRelation, PhotoWithTitle, Usuario, SUBSCRIPTION_PLANS } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CreateMemorialFormProps {
  onSubmit: (memorial: Omit<Memorial, 'id' | 'fechaCreacion' | 'createdBy'>, familyRelations?: Omit<FamilyRelation, 'id' | 'dateCreated' | 'createdBy'>[]) => void;
  onCancel: () => void;
  existingMemorials?: Memorial[];
  currentUser?: Usuario;
  checkPlanLimits: (user: Usuario, action: string, currentCount?: number) => { allowed: boolean, message?: string };
  onShowPricing: () => void;
}

interface MultimediaItem {
  id: string;
  type: 'foto' | 'video';
  url: string;
  name: string;
  size: number;
  file?: File;
  thumbnail?: string;
  uploading: boolean;
  error?: string;
  title?: string;
}

interface FamilyRelationData {
  memorialId: string;
  relationType: FamilyRelation['relationType'];
}

// Función helper para capitalizar la primera letra (autocorrector)
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const CreateMemorialForm: React.FC<CreateMemorialFormProps> = ({ 
  onSubmit, 
  onCancel, 
  existingMemorials = [], 
  currentUser, 
  checkPlanLimits, 
  onShowPricing 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    fechaFallecimiento: '',
    tipo: '' as 'humano' | 'mascota' | '',
    biografia: '',
    ubicacion: '',
    ocupacion: '',
    fotoPrincipal: '',
    fotos: [] as PhotoWithTitle[],
    videos: [] as string[],
    esPublico: false,
    usuariosPermitidos: [] as string[]
  });

  const [familyRelations, setFamilyRelations] = useState<FamilyRelationData[]>([
    { memorialId: '', relationType: 'padre' }
  ]);
  const [multimedia, setMultimedia] = useState<MultimediaItem[]>([]);
  const [profilePhotos, setProfilePhotos] = useState<MultimediaItem[]>([]); // Nueva estado para fotos de perfil
  const [errors, setErrors] = useState<string[]>([]);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);

  const currentPlan = currentUser ? SUBSCRIPTION_PLANS[currentUser.plan] : SUBSCRIPTION_PLANS.gratuito;

  // ACTUALIZADO: Array completo con todas las 23 relaciones familiares organizadas por categorías
  const relationTypes: { 
    category: string; 
    relations: { value: FamilyRelation['relationType'], label: string }[] 
  }[] = [
    {
      category: "👨‍👩‍👧‍👦 Familia Directa",
      relations: [
        { value: 'padre', label: 'Padre' },
        { value: 'madre', label: 'Madre' },
        { value: 'hijo', label: 'Hijo' },
        { value: 'hija', label: 'Hija' },
        { value: 'hermano', label: 'Hermano' },
        { value: 'hermana', label: 'Hermana' },
      ]
    },
    {
      category: "👴👵 Abuelos y Generaciones",
      relations: [
        { value: 'abuelo', label: 'Abuelo' },
        { value: 'abuela', label: 'Abuela' },
        { value: 'nieto', label: 'Nieto' },
        { value: 'nieta', label: 'Nieta' },
        { value: 'bisabuelo', label: 'Bisabuelo' },
        { value: 'bisabuela', label: 'Bisabuela' },
        { value: 'bisnieto', label: 'Bisnieto' },
        { value: 'bisnieta', label: 'Bisnieta' },
      ]
    },
    {
      category: "👨‍👦 Familia Extendida",
      relations: [
        { value: 'tio', label: 'Tío' },
        { value: 'tia', label: 'Tía' },
        { value: 'sobrino', label: 'Sobrino' },
        { value: 'sobrina', label: 'Sobrina' },
        { value: 'primo', label: 'Primo' },
        { value: 'prima', label: 'Prima' },
      ]
    },
    {
      category: "💑 Familia Política",
      relations: [
        { value: 'suegro', label: 'Suegro' },
        { value: 'suegra', label: 'Suegra' },
        { value: 'yerno', label: 'Yerno' },
        { value: 'nuera', label: 'Nuera' },
        { value: 'cuñado', label: 'Cuñado' },
        { value: 'cuñada', label: 'Cuñada' },
      ]
    },
    {
      category: "💕 Otros",
      relations: [
        { value: 'conyuge', label: 'Cónyuge' },
        { value: 'pareja', label: 'Pareja' },
        { value: 'mascota', label: 'Mascota' },
      ]
    }
  ];

  // Array plano para fácil acceso
  const allRelationTypes = relationTypes.flatMap(category => category.relations);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.fechaNacimiento || !formData.fechaFallecimiento || !formData.biografia || !formData.tipo) {
      setErrors(['Por favor completa todos los campos obligatorios']);
      return;
    }

    // Para plan premium, validar relaciones familiares si se proporcionaron
    const hasValidRelation = familyRelations.some(relation => 
      relation.memorialId && relation.relationType
    );

    // Combinar fotos de perfil con fotos de galería
    const fotosGaleria = multimedia.filter(item => item.type === 'foto' && !item.error).map(item => ({
      url: item.url,
      title: item.title || undefined
    }));

    const fotosPerfil = profilePhotos.filter(item => item.type === 'foto' && !item.error).map(item => ({
      url: item.url,
      title: item.title || undefined
    }));

    // Combinar todas las fotos (perfil + galería)
    const todasLasFotos = [...fotosPerfil, ...fotosGaleria];

    // Asegurar que tenemos una foto principal
    let fotoPrincipalUrl = formData.fotoPrincipal;
    if (!fotoPrincipalUrl && profilePhotos.length > 0) {
      // Si no hay foto principal seleccionada pero hay fotos de perfil, usar la primera
      fotoPrincipalUrl = profilePhotos[0].url;
    }

    const memorialData = {
      ...formData,
      fechaNacimiento: new Date(formData.fechaNacimiento),
      fechaFallecimiento: new Date(formData.fechaFallecimiento),
      fotoPrincipal: fotoPrincipalUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
      fotos: todasLasFotos, // Incluir todas las fotos
      videos: []
    };

    // Solo pasar relaciones familiares si el plan las permite y hay relaciones válidas
    let familyRelationData: Omit<FamilyRelation, 'id' | 'dateCreated' | 'createdBy'>[] = [];
    if (currentPlan.limits.canUseFamilyTree && hasValidRelation) {
      familyRelationData = familyRelations
        .filter(relation => relation.memorialId && relation.relationType)
        .map(relation => ({
          fromMemorialId: 'TEMP_ID',
          toMemorialId: relation.memorialId,
          relationType: relation.relationType
        }));
    }

    console.log('Memorial data being submitted:', {
      ...memorialData,
      fotoPrincipal: memorialData.fotoPrincipal,
      totalFotos: memorialData.fotos.length,
      fotosPerfil: fotosPerfil.length,
      fotosGaleria: fotosGaleria.length
    });

    onSubmit(memorialData, familyRelationData);
  };

  // Handler para fotos de perfil
  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const imageUrl = URL.createObjectURL(file);
        const newItem: MultimediaItem = {
          id: Date.now().toString() + Math.random(),
          type: 'foto',
          url: imageUrl,
          name: file.name,
          size: file.size,
          uploading: false,
          title: ''
        };
        setProfilePhotos(prev => [...prev, newItem]);
      });
    }
  };

  // Handler para galería de recuerdos
  const handleMultimediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return;

    const limitCheck = checkPlanLimits(currentUser, 'add_photos');
    if (!limitCheck.allowed) {
      alert(limitCheck.message);
      onShowPricing();
      return;
    }

    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const imageUrl = URL.createObjectURL(file);
        const newItem: MultimediaItem = {
          id: Date.now().toString() + Math.random(),
          type: 'foto',
          url: imageUrl,
          name: file.name,
          size: file.size,
          uploading: false,
          title: ''
        };
        setMultimedia(prev => [...prev, newItem]);
      });
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setMultimedia(prev => prev.filter(item => item.id !== photoId));
  };

  const handleRemoveProfilePhoto = (photoId: string) => {
    setProfilePhotos(prev => prev.filter(item => item.id !== photoId));
    // Si la foto eliminada era la foto principal, limpiar
    const photoToRemove = profilePhotos.find(p => p.id === photoId);
    if (photoToRemove && formData.fotoPrincipal === photoToRemove.url) {
      setFormData(prev => ({ ...prev, fotoPrincipal: '' }));
    }
  };

  const handleSelectAsMainPhoto = (photoUrl: string) => {
    setFormData(prev => ({ ...prev, fotoPrincipal: photoUrl }));
    console.log('Selected main photo:', photoUrl);
  };

  const handleUpdatePhotoTitle = (photoId: string, title: string) => {
    setMultimedia(prev => 
      prev.map(item => 
        item.id === photoId ? { ...item, title } : item
      )
    );
  };

  const handleUpdateProfilePhotoTitle = (photoId: string, title: string) => {
    setProfilePhotos(prev => 
      prev.map(item => 
        item.id === photoId ? { ...item, title } : item
      )
    );
  };

  // Función para cambiar la imagen de perfil seleccionada
  const handleChangeProfilePhoto = () => {
    setFormData(prev => ({ ...prev, fotoPrincipal: '' }));
  };

  // Función para limpiar todas las fotos de perfil y empezar de nuevo
  const handleClearAllProfilePhotos = () => {
    setProfilePhotos([]);
    setFormData(prev => ({ ...prev, fotoPrincipal: '' }));
  };

  const canUseFamilyTree = currentPlan.limits.canUseFamilyTree;
  const canAddMultipleMedia = currentPlan.limits.canAddMultipleMedia;

  // Filtrar memoriales para incluir los del usuario actual, los memoriales demo y agregar al usuario
  const availableMemorials = existingMemorials.filter(memorial => {
    // Incluir memoriales del usuario actual
    if (currentUser && memorial.createdBy === currentUser.id) return true;
    
    // Para usuarios sin memoriales propios, incluir los demo
    const userMemorials = existingMemorials.filter(m => currentUser && m.createdBy === currentUser.id);
    if (userMemorials.length === 0 && memorial.createdBy === 'user_demo') return true;
    
    // Incluir memoriales donde el usuario tiene permisos
    if (currentUser && memorial.usuariosPermitidos.includes(currentUser.id)) return true;
    
    return false;
  });

  return (
    <div className={canUseFamilyTree ? "max-w-6xl mx-auto" : "max-w-4xl mx-auto"}>
      <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-teal-400" />
              CREAR MEMORIAL
              {currentUser?.plan === 'gratuito' && (
                <Badge className="bg-blue-100 text-blue-800 text-sm ml-2">
                  Plan Gratuito
                </Badge>
              )}
            </CardTitle>
            <Button onClick={onCancel} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {errors.length > 0 && (
            <Alert className="mb-6 bg-red-500/20 border-red-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-white">
                {errors.map((error, index) => <div key={index}>{error}</div>)}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contenedor principal con lógica de ancho */}
            <div className={canUseFamilyTree ? 
              `grid grid-cols-1 lg:grid-cols-2 gap-8` : 
              `flex justify-center`
            }>
              {/* Contenido principal */}
              <div className={canUseFamilyTree ? 
                `space-y-6` : 
                `w-full max-w-2xl space-y-6`
              }>
                <h3 className="text-lg text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-400" />
                  Información Personal
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-white">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      className="bg-white/90 border-white/30"
                      placeholder="Nombre"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellidos" className="text-white">Apellidos</Label>
                    <Input
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                      className="bg-white/90 border-white/30"
                      placeholder="Apellidos"
                    />
                  </div>

                  {/* Nueva sección de Imagen de Perfil - Lógica mejorada */}
                  <div className="space-y-4">
                    <h3 className="text-lg text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-teal-400" />
                      Imagen de Perfil
                    </h3>
                    
                    {/* CASO 1: No hay fotos subidas - Mostrar área de upload */}
                    {profilePhotos.length === 0 && (
                      <>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="hidden"
                          id="profile-photo-upload"
                        />
                        <Label htmlFor="profile-photo-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                            <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                            <p className="text-white/80">Haz clic para subir fotos para el perfil</p>
                            <p className="text-white/60 text-sm mt-1">Puedes subir varias y luego seleccionar una como principal</p>
                          </div>
                        </Label>
                      </>
                    )}

                    {/* CASO 2: Hay fotos subidas pero NO hay imagen principal - Solo mostrar grid de selección */}
                    {profilePhotos.length > 0 && !formData.fotoPrincipal && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm">
                            Selecciona una imagen como principal:
                          </p>
                          <Button
                            type="button"
                            onClick={handleClearAllProfilePhotos}
                            variant="ghost" 
                            size="sm"
                            className="text-white/70 hover:text-white hover:bg-white/20 text-xs"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Limpiar todo
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {profilePhotos.map((item) => (
                            <div key={item.id} className="relative bg-white/10 rounded-lg p-3">
                              <div className="w-full aspect-[4/3] bg-white/5 rounded overflow-hidden">
                                <ImageWithFallback
                                  src={item.url}
                                  alt={item.title || 'Foto de perfil'}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <Input
                                placeholder="Título de la foto"
                                value={item.title || ''}
                                onChange={(e) => handleUpdateProfilePhotoTitle(item.id, e.target.value)}
                                className="mt-2 bg-white/20 border-white/30 text-white text-sm placeholder:text-white/60"
                              />
                              
                              {/* Botón para seleccionar como imagen principal */}
                              <Button
                                type="button"
                                onClick={() => handleSelectAsMainPhoto(item.url)}
                                className="absolute top-1 left-1 p-1 h-7 w-7 bg-blue-600 hover:bg-blue-700 text-white"
                                title="Seleccionar como imagen principal"
                              >
                                <Check className="w-4 h-4" />
                              </Button>

                              {/* Botón para eliminar foto */}
                              <Button
                                type="button"
                                onClick={() => handleRemoveProfilePhoto(item.id)}
                                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 h-7 w-7"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CASO 3: Hay imagen principal seleccionada - Mostrar vista previa grande */}
                    {formData.fotoPrincipal && (
                      <div className="space-y-4">
                        {/* Vista previa grande de la imagen principal seleccionada */}
                        <div className="p-4 bg-white/10 rounded-lg">
                          <div className="flex items-center gap-4">
                            <ImageWithFallback
                              src={formData.fotoPrincipal} 
                              alt="Imagen principal seleccionada" 
                              className="w-24 h-24 rounded-full object-cover border-3 border-yellow-400 shadow-lg"
                            />
                            <div className="flex-1">
                              <p className="text-white text-lg flex items-center gap-2 mb-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                Imagen de perfil seleccionada
                              </p>
                              <p className="text-white/70 text-sm">
                                Esta será la imagen principal que aparecerá en el memorial
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Botones para cambiar o limpiar */}
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={handleChangeProfilePhoto}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Cambiar imagen principal
                          </Button>
                          <Button
                            type="button"
                            onClick={handleClearAllProfilePhotos}
                            variant="ghost"
                            className="text-white/70 hover:text-white hover:bg-white/20 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Empezar de nuevo
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Debug info - remover en producción */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-white/60 text-xs">
                        Debug: {profilePhotos.length} fotos de perfil, foto principal: {formData.fotoPrincipal ? 'Sí' : 'No'}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento" className="text-white">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Fecha de Nacimiento *
                      </Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                        className="bg-white/90 border-white/30"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fechaFallecimiento" className="text-white">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Fecha de Fallecimiento *
                      </Label>
                      <Input
                        id="fechaFallecimiento"
                        type="date"
                        value={formData.fechaFallecimiento}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaFallecimiento: e.target.value }))}
                        className="bg-white/90 border-white/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Tipo de Memorial *</Label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'humano' }))}
                        className={`flex-1 ${formData.tipo === 'humano' ? 'bg-teal-600' : 'bg-white/20'}`}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Persona
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'mascota' }))}
                        className={`flex-1 ${formData.tipo === 'mascota' ? 'bg-teal-600' : 'bg-white/20'}`}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Mascota
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biografia" className="text-white">Biografía *</Label>
                    <Textarea
                      id="biografia"
                      value={formData.biografia}
                      onChange={(e) => setFormData(prev => ({ ...prev, biografia: e.target.value }))}
                      className="bg-white/90 border-white/30 min-h-[120px]"
                      placeholder="Comparte la historia de vida..."
                      required
                    />
                  </div>

                  {/* Galería de Recuerdos - Solo para plan premium */}
                  {canAddMultipleMedia && (
                    <div className="space-y-4">
                      <h3 className="text-lg text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-teal-400" />
                        Galería de Recuerdos
                      </h3>
                      
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultimediaUpload}
                        className="hidden"
                        id="multimedia-upload"
                      />
                      <Label htmlFor="multimedia-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                          <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                          <p className="text-white/80">Haz clic para subir fotos adicionales</p>
                          <p className="text-white/60 text-sm mt-1">Galería de recuerdos para el memorial</p>
                        </div>
                      </Label>

                      {/* Mostrar fotos subidas */}
                      {multimedia.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          {multimedia.map((item) => (
                            <div key={item.id} className="relative bg-white/10 rounded-lg p-3">
                              <div className="w-full aspect-[4/3] bg-white/5 rounded overflow-hidden">
                                <ImageWithFallback
                                  src={item.url}
                                  alt={item.title || 'Foto'}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <Input
                                placeholder="Título de la foto"
                                value={item.title || ''}
                                onChange={(e) => handleUpdatePhotoTitle(item.id, e.target.value)}
                                className="mt-2 bg-white/20 border-white/30 text-white text-sm placeholder:text-white/60"
                              />
                              <Button
                                type="button"
                                onClick={() => handleRemovePhoto(item.id)}
                                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 h-6 w-6"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Relaciones Familiares - Solo para plan premium */}
              {canUseFamilyTree && (
                <div className="space-y-6">
                  <h3 className="text-lg text-white flex items-center gap-2">
                    <TreeDeciduous className="w-5 h-5 text-teal-400" />
                    Relaciones Familiares
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </h3>

                  <div className="space-y-4">
                    {familyRelations.map((relation, index) => (
                      <div key={index} className="space-y-3 p-4 bg-white/10 rounded-lg border border-white/20">
                        <div className="flex justify-between items-center">
                          <Label className="text-white text-sm">Relación {index + 1}</Label>
                          {familyRelations.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => setFamilyRelations(prev => prev.filter((_, i) => i !== index))}
                              variant="ghost"
                              size="sm"
                              className="text-white/70 hover:text-white hover:bg-white/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-white/80 text-sm">Este memorial es:</Label>
                            <Select
                              value={relation.relationType}
                              onValueChange={(value: FamilyRelation['relationType']) => {
                                setFamilyRelations(prev => 
                                  prev.map((rel, i) => 
                                    i === index ? { ...rel, relationType: value } : rel
                                  )
                                );
                              }}
                            >
                              <SelectTrigger className="bg-white/90 border-white/30">
                                <SelectValue placeholder="Seleccionar relación..." />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 max-h-[300px] overflow-y-auto">
                                {relationTypes.map((category) => (
                                  <div key={category.category}>
                                    {/* Encabezado de categoría */}
                                    <div className="px-2 py-2 text-sm text-gray-500 border-b border-gray-100">
                                      {category.category}
                                    </div>
                                    {/* Opciones de la categoría */}
                                    {category.relations.map((relation) => (
                                      <SelectItem 
                                        key={relation.value} 
                                        value={relation.value}
                                        className="hover:bg-gray-50"
                                      >
                                        {relation.label}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white/80 text-sm">De:</Label>
                            <Select
                              value={relation.memorialId}
                              onValueChange={(value: string) => {
                                setFamilyRelations(prev => 
                                  prev.map((rel, i) => 
                                    i === index ? { ...rel, memorialId: value } : rel
                                  )
                                );
                              }}
                            >
                              <SelectTrigger className="bg-white/90 border-white/30">
                                <SelectValue placeholder="Seleccionar memorial o persona..." />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 max-h-[200px] overflow-y-auto">
                                {/* Opción para el usuario actual */}
                                {currentUser && (
                                  <SelectItem value={currentUser.id}>
                                    {currentUser.nombre} {currentUser.apellidos} (Tu perfil)
                                  </SelectItem>
                                )}
                                {/* Memoriales disponibles */}
                                {availableMemorials.map((memorial) => (
                                  <SelectItem key={memorial.id} value={memorial.id}>
                                    {memorial.nombre} {memorial.apellidos}
                                    {memorial.tipo === 'mascota' && ' 🐾'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={() => setFamilyRelations(prev => [...prev, { memorialId: '', relationType: 'padre' }])}
                      variant="ghost"
                      className="w-full text-white border border-white/30 hover:bg-white/20"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar otra relación familiar
                    </Button>
                  </div>

                  {/* Información sobre relaciones */}
                  <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <div className="flex gap-3">
                      <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-white text-sm">
                          <strong>¿Cómo funcionan las relaciones?</strong>
                        </p>
                        <p className="text-white/80 text-xs leading-relaxed">
                          Define cómo este nuevo memorial se relaciona con otros. Por ejemplo, si estás creando el memorial de tu padre, 
                          seleccionarías "Padre" como relación y tu propio perfil como "De". Esto creará automáticamente una conexión 
                          bidireccional en el árbol familiar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={onCancel}
                variant="ghost"
                className="flex-1 text-white border border-white/30 hover:bg-white/20"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                Crear Memorial
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMemorialForm;