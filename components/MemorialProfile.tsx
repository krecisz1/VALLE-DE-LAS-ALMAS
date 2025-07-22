import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Share2, 
  MessageCircle,
  Send,
  QrCode,
  Users,
  Eye,
  User,
  Printer,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { Memorial, Usuario, Comentario, AccessMode } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import QRGenerator from './QRGenerator';
import backgroundImage from 'figma:asset/16183e18b8dc35ae92f2ac6dc9026bd0b153816c.png';

interface MemorialProfileProps {
  memorial: Memorial;
  accessMode: AccessMode;
  currentUser: Usuario | null;
  comentarios: Comentario[];
  canAccessFullContent: boolean;
  onBack: () => void;
  onAddComment: (comment: Omit<Comentario, 'id' | 'fecha'>) => void;
}

const MemorialProfile: React.FC<MemorialProfileProps> = ({
  memorial,
  accessMode,
  currentUser,
  comentarios,
  canAccessFullContent,
  onBack,
  onAddComment
}) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  
  // Estado para comentarios individuales por foto
  const [photoComments, setPhotoComments] = useState<{ [key: number]: string }>({});
  const [showPhotoComments, setShowPhotoComments] = useState<{ [key: number]: boolean }>({});
  const [showAllPhotoComments, setShowAllPhotoComments] = useState<{ [key: number]: boolean }>({});

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAge = (fechaNac: Date, fechaFall: Date) => {
    const years = fechaFall.getFullYear() - fechaNac.getFullYear();
    const months = fechaFall.getMonth() - fechaNac.getMonth();
    if (months < 0 || (months === 0 && fechaFall.getDate() < fechaNac.getDate())) {
      return years - 1;
    }
    return years;
  };

  // Función para manejar comentarios individuales por foto
  const handlePhotoComment = (photoIndex: number, e: React.FormEvent) => {
    e.preventDefault();
    const comment = photoComments[photoIndex];
    if (!comment?.trim() || !currentUser) return;

    onAddComment({
      memorialId: memorial.id,
      autorId: currentUser.id,
      autorNombre: `${currentUser.nombre} ${currentUser.apellidos}`.trim(),
      contenido: `[Sobre la foto ${photoIndex + 1}] ${comment.trim()}`,
      esPrivado: false
    });

    setPhotoComments(prev => ({ ...prev, [photoIndex]: '' }));
  };

  // Obtener comentarios específicos de una foto
  const getPhotoComments = (photoIndex: number) => {
    return comentarios.filter(c => 
      c.contenido.includes(`[Sobre la foto ${photoIndex + 1}]`)
    );
  };

  const togglePhotoComments = (photoIndex: number) => {
    setShowPhotoComments(prev => ({
      ...prev,
      [photoIndex]: !prev[photoIndex]
    }));
  };

  const toggleShowAllPhotoComments = (photoIndex: number) => {
    setShowAllPhotoComments(prev => ({
      ...prev,
      [photoIndex]: !prev[photoIndex]
    }));
  };

  const generateQRUrl = () => {
    return `${window.location.origin}?qr=${memorial.id}`;
  };

  const copyQRUrl = () => {
    navigator.clipboard.writeText(generateQRUrl());
    alert('Enlace QR copiado al portapapeles');
  };

  const getAccessModeInfo = () => {
    switch (accessMode.type) {
      case 'owner':
        return { icon: Users, text: 'Acceso Completo', color: 'text-green-400' };
      case 'permitted':
        return { icon: User, text: 'Acceso Completo', color: 'text-blue-400' };
      case 'qr':
        return { icon: QrCode, text: 'Acceso QR', color: 'text-yellow-400' };
      default:
        return { icon: Eye, text: 'Visitante', color: 'text-gray-400' };
    }
  };

  const accessInfo = getAccessModeInfo();
  const AccessIcon = accessInfo.icon;

  // Verificar si el usuario puede generar QR (propietario)
  const canGenerateQR = accessMode.type === 'owner';

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="relative z-10 p-6">
        {/* Header simplificado */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 flex items-center gap-2 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Button>

          <div className="flex items-center gap-4">
            {/* Solo mostrar indicador de acceso QR si es necesario */}
            {accessMode.type === 'qr' && (
              <div className={`flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full ${accessInfo.color}`}>
                <AccessIcon className="w-4 h-4" />
                <span className="text-sm">{accessInfo.text}</span>
              </div>
            )}
            
            {/* Botones de QR */}
            <div className="flex gap-2">
              {canGenerateQR && (
                <Button
                  onClick={() => setShowQRGenerator(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 backdrop-blur-sm shadow-lg"
                  title="Generar código QR para lápida"
                >
                  <Printer className="w-4 h-4" />
                  QR para Lápida
                </Button>
              )}
              
              {(accessMode.type === 'owner' || memorial.esPublico) && (
                <Button
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="bg-white/20 hover:bg-white/30 text-white flex items-center gap-2 backdrop-blur-sm"
                  title="Compartir enlace rápido"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Información Principal */}
          <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={memorial.fotoPrincipal}
                    alt={memorial.nombre}
                    className="w-48 h-48 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl text-white mb-2 drop-shadow-lg">
                      {memorial.nombre} {memorial.apellidos}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/90 text-lg">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {formatDate(memorial.fechaNacimiento)} - {formatDate(memorial.fechaFallecimiento)}
                      </span>
                    </div>
                    <p className="text-white/80 text-lg mt-2">
                      {getAge(memorial.fechaNacimiento, memorial.fechaFallecimiento)} años de vida • {memorial.tipo}
                    </p>
                  </div>

                  {canAccessFullContent && memorial.ubicacion && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span>{memorial.ubicacion}</span>
                    </div>
                  )}

                  {canAccessFullContent && memorial.ocupacion && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
                      <Briefcase className="w-4 h-4" />
                      <span>{memorial.ocupacion}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biografía */}
          <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-teal-400" />
                {accessMode.type === 'qr' ? 'En Memoria' : 'Historia de Vida'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed text-lg">
                {accessMode.type === 'qr' 
                  ? memorial.biografia.substring(0, 200) + (memorial.biografia.length > 200 ? '...' : '')
                  : memorial.biografia
                }
              </p>
              {accessMode.type === 'qr' && memorial.biografia.length > 200 && (
                <p className="text-white/70 text-sm mt-4 italic">
                  Para ver el contenido completo, solicita acceso al propietario del memorial.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Fotos con títulos y comentarios - Solo para acceso completo */}
          {canAccessFullContent && memorial.fotos && memorial.fotos.length > 0 && (
            <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Galería de Recuerdos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {memorial.fotos.map((foto, index) => {
                    const photoCommentsList = getPhotoComments(index);
                    const showComments = showPhotoComments[index];
                    const showAll = showAllPhotoComments[index];
                    
                    // Mostrar solo 1-2 comentarios inicialmente
                    const visibleComments = showAll ? photoCommentsList : photoCommentsList.slice(0, 2);
                    const hasMoreComments = photoCommentsList.length > 2;
                    
                    return (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        {/* Foto con título */}
                        <div className="aspect-video mb-4">
                          <ImageWithFallback
                            src={foto.url}
                            alt={foto.title || `Recuerdo especial`}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                          />
                        </div>
                        
                        {/* Título de la foto */}
                        {foto.title && (
                          <h3 className="text-white text-lg mb-3 font-medium">
                            {foto.title}
                          </h3>
                        )}
                        
                        {/* Botón para mostrar/ocultar comentarios */}
                        <div className="flex items-center justify-end mb-3">
                          <Button
                            onClick={() => togglePhotoComments(index)}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Comentarios ({photoCommentsList.length})</span>
                            {showComments ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* Sección de comentarios expandible */}
                        {showComments && currentUser && (
                          <div className="space-y-4 border-t border-white/20 pt-4">
                            {/* Formulario para comentar esta foto específica */}
                            <form onSubmit={(e) => handlePhotoComment(index, e)} className="space-y-3">
                              <Textarea
                                value={photoComments[index] || ''}
                                onChange={(e) => setPhotoComments(prev => ({
                                  ...prev,
                                  [index]: e.target.value
                                }))}
                                placeholder={`Comparte un recuerdo sobre ${foto.title || 'esta foto'}...`}
                                className="bg-white/80 border-white/30 min-h-[80px] resize-none backdrop-blur-sm text-sm"
                              />
                              <div className="flex justify-end">
                                <Button
                                  type="submit"
                                  disabled={!photoComments[index]?.trim()}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                >
                                  <Send className="w-3 h-3" />
                                  Comentar
                                </Button>
                              </div>
                            </form>

                            {/* Lista de comentarios de esta foto (limitados) */}
                            <div className="space-y-3">
                              {visibleComments.map((comentario) => (
                                <div key={comentario.id} className="bg-white/15 backdrop-blur-sm p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-white/90 text-sm font-medium">{comentario.autorNombre}</span>
                                    <span className="text-white/70 text-xs">
                                      {formatDate(comentario.fecha)}
                                    </span>
                                  </div>
                                  <p className="text-white/80 text-sm leading-relaxed">
                                    {comentario.contenido.replace(`[Sobre la foto ${index + 1}] `, '')}
                                  </p>
                                </div>
                              ))}
                              
                              {/* Botón "Ver más comentarios" si hay más de 2 */}
                              {hasMoreComments && (
                                <Button
                                  onClick={() => toggleShowAllPhotoComments(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-white/80 hover:bg-white/20 flex items-center justify-center gap-2"
                                >
                                  {showAll ? (
                                    <>
                                      <ChevronUp className="w-4 h-4" />
                                      Ver menos comentarios
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-4 h-4" />
                                      Ver {photoCommentsList.length - 2} comentarios más
                                    </>
                                  )}
                                </Button>
                              )}
                              
                              {photoCommentsList.length === 0 && (
                                <div className="text-center py-4">
                                  <MessageCircle className="w-8 h-8 text-white/40 mx-auto mb-2" />
                                  <p className="text-white/60 text-sm">
                                    Sé el primero en comentar esta foto
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Videos - Solo para acceso completo */}
          {canAccessFullContent && memorial.videos && memorial.videos.length > 0 && (
            <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Videos Especiales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memorial.videos.map((video, index) => (
                    <div key={index} className="bg-white/15 backdrop-blur-sm p-4 rounded-lg">
                      <p className="text-white/80 text-sm">Video {index + 1}</p>
                      <a 
                        href={video} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-300 underline"
                      >
                        Ver video
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Limitación de acceso QR */}
          {accessMode.type === 'qr' && (
            <Card className="bg-white/20 backdrop-blur-md border-yellow-400/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <QrCode className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">Acceso Limitado</h3>
                <p className="text-white/80 mb-4">
                  Estás viendo información básica a través de un código QR. 
                  Para acceder al contenido completo, solicita permisos al propietario del memorial.
                </p>
                <div className="bg-blue-50/20 backdrop-blur-sm border border-blue-200/30 rounded-lg p-4 mt-4">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>¿Eres familiar?</strong> Contacta al propietario del memorial para obtener acceso completo 
                    a fotos, videos, comentarios y toda la información del ser querido.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Display Simple - Solo para compartir rápido */}
          {showQRCode && (
            <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Compartir Memorial
                  </CardTitle>
                  <Button
                    onClick={() => setShowQRCode(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-white p-6 rounded-lg inline-block mb-4">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm text-gray-600">Código QR</p>
                      <p className="text-xs text-gray-500 mt-1">Escanear para acceder</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/80 mb-4">
                    Comparte este enlace para acceso rápido:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generateQRUrl()}
                      readOnly
                      className="flex-1 p-2 bg-white/90 rounded text-sm backdrop-blur-sm"
                    />
                    <Button onClick={copyQRUrl} className="bg-teal-600 hover:bg-teal-700 shadow-lg">
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-50/20 backdrop-blur-sm border border-amber-200/30 rounded-lg p-4">
                  <p className="text-amber-200 text-sm">
                    📱 <strong>Nota:</strong> Para códigos QR optimizados para lápidas con configuración 
                    avanzada, usa el botón "QR para Lápida" arriba.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Generador QR Avanzado */}
        {showQRGenerator && (
          <QRGenerator
            memorial={memorial}
            onClose={() => setShowQRGenerator(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MemorialProfile;