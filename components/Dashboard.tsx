import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Plus, 
  LogOut, 
  Users, 
  QrCode, 
  Eye, 
  Lock, 
  User, 
  Search,
  Bell,
  Settings,
  MessageCircle,
  Share2,
  TrendingUp,
  Calendar as CalendarIcon,
  Heart,
  Trash2,
  X,
  Check,
  Shield,
  TreeDeciduous,
  Edit3,
  AlertTriangle,
  Crown,
  Sparkles,
  Info
} from 'lucide-react';
import { Usuario, Memorial, AccessMode, FamilyRelation, SUBSCRIPTION_PLANS, PlanType } from '../App';
import CreateMemorialForm from './CreateMemorialForm';
import QRGenerator from './QRGenerator';
import UserProfileForm from './UserProfileForm';
import ConfirmDialog from './ConfirmDialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import backgroundImage from 'figma:asset/16183e18b8dc35ae92f2ac6dc9026bd0b153816c.png';

interface DashboardProps {
  user: Usuario;
  memoriales: Memorial[];
  onCreateMemorial: (memorial: Omit<Memorial, 'id' | 'fechaCreacion' | 'createdBy'>, familyRelations?: Omit<FamilyRelation, 'id' | 'dateCreated' | 'createdBy'>[]) => void;
  onViewMemorial: (memorial: Memorial, mode: AccessMode) => void;
  onDeleteMemorial: (memorialId: string) => void;
  onUpdateUserProfile: (userData: Partial<Usuario> & { fotoPerfil?: string }) => void;
  onLogout: () => void;
  onViewFamilyTree: () => void;
  getMemorialRelationship: (memorialId: string) => string;
  checkPlanLimits: (user: Usuario, action: string, currentCount?: number) => { allowed: boolean, message?: string };
  onShowPricing: () => void;
}

// Función helper para capitalizar la primera letra (autocorrector)
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Notificaciones expandidas (incluyendo las estadísticas convertidas)
const initialNotifications = [
  { id: '1', title: 'Nuevo comentario en memorial de María', time: '2 horas', type: 'comment', icon: MessageCircle, unread: true },
  { id: '2', title: 'Memorial de Carlos compartido', time: '1 día', type: 'share', icon: Share2, unread: true },
  { id: '3', title: 'Aniversario de memoria próximo', time: '3 días', type: 'anniversary', icon: CalendarIcon, unread: false }
];

const Dashboard: React.FC<DashboardProps> = ({
  user,
  memoriales,
  onCreateMemorial,
  onViewMemorial,
  onDeleteMemorial,
  onUpdateUserProfile,
  onLogout,
  onViewFamilyTree,
  getMemorialRelationship,
  checkPlanLimits,
  onShowPricing
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedMemorialForQR, setSelectedMemorialForQR] = useState<Memorial | null>(null);
  const [memorialToDelete, setMemorialToDelete] = useState<Memorial | null>(null);
  const [showPlanWelcome, setShowPlanWelcome] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Estados de configuración
  const [settings, setSettings] = useState({
    emailNotifications: true,
    twoFactorAuth: false
  });

  const currentPlan = SUBSCRIPTION_PLANS[user.plan];

  // Efecto para mostrar mensaje de bienvenida del plan solo una vez
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPlanWelcome(false);
    }, 10000); // Ocultar después de 10 segundos

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMemorialAge = (fechaNac: Date, fechaFall: Date) => {
    const years = fechaFall.getFullYear() - fechaNac.getFullYear();
    return years;
  };

  const generateQRUrl = (memorialId: string) => {
    return `${window.location.origin}?qr=${memorialId}`;
  };

  const showQRGenerator = (memorial: Memorial) => {
    // Verificar si puede usar códigos QR
    const limitCheck = checkPlanLimits(user, 'use_qr_codes');
    if (!limitCheck.allowed) {
      alert(limitCheck.message);
      onShowPricing();
      return;
    }
    setSelectedMemorialForQR(memorial);
  };

  const shareMemorial = (memorial: Memorial) => {
    const url = generateQRUrl(memorial.id);
    navigator.clipboard.writeText(url);
    alert('Enlace para compartir copiado al portapapeles');
  };

  // Función de búsqueda funcional
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchOpen(false);
  };

  // Función para marcar notificación como leída
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  // Función para eliminar notificación
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Función para limpiar todas las notificaciones
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Función para marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  // Función para actualizar configuración
  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Simular guardado
    setTimeout(() => {
      alert(`Configuración "${key}" ${value ? 'activada' : 'desactivada'} correctamente`);
    }, 500);
  };

  // Función para actualizar perfil de usuario
  const handleUpdateProfile = (userData: any) => {
    onUpdateUserProfile(userData);
    alert('Perfil actualizado correctamente');
    setShowProfileForm(false);
  };

  // Función para confirmar eliminación de memorial
  const confirmDeleteMemorial = (memorial: Memorial) => {
    setMemorialToDelete(memorial);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (memorialToDelete) {
      onDeleteMemorial(memorialToDelete.id);
      setMemorialToDelete(null);
    }
  };

  const handleCreateMemorialClick = () => {
    const limitCheck = checkPlanLimits(user, 'create_memorial');
    if (!limitCheck.allowed) {
      alert(limitCheck.message);
      onShowPricing();
      return;
    }
    setShowCreateForm(true);
  };

  const handleFamilyTreeClick = () => {
    const limitCheck = checkPlanLimits(user, 'use_family_tree');
    if (!limitCheck.allowed) {
      alert(limitCheck.message);
      onShowPricing();
      return;
    }
    onViewFamilyTree();
  };

  // Filtros aplicados con búsqueda funcional
  const filteredMemorials = useMemo(() => {
    let filtered = memoriales;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(memorial => 
        memorial.nombre.toLowerCase().includes(searchLower) ||
        memorial.apellidos.toLowerCase().includes(searchLower) ||
        memorial.biografia.toLowerCase().includes(searchLower) ||
        memorial.ubicacion?.toLowerCase().includes(searchLower) ||
        memorial.ocupacion?.toLowerCase().includes(searchLower)

      );
    }

    return filtered;
  }, [memoriales, searchTerm]);

  // Separar memoriales propios de los demos
  const misMemorias = filteredMemorials.filter(m => m.createdBy === user.id);
  const memoriasPermitidas = filteredMemorials.filter(m => 
    m.usuariosPermitidos.includes(user.id) && m.createdBy !== user.id
  );
  const memoriasDemo = filteredMemorials.filter(m => m.createdBy === 'user_demo');

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'comment': return 'text-blue-400';
      case 'share': return 'text-green-400';
      case 'anniversary': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen relative">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay muy sutil para no opacar la belleza del paisaje */}
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="relative z-10 p-4">
        {/* Header reorganizado - TODO del lado derecho */}
        <header className="flex justify-end items-start mb-6 pt-2">
          {/* Todo el contenido del lado derecho */}
          <div className="text-right">
            {/* Título principal arriba */}
            <div className="mb-4">
              <h1 className="text-5xl text-white drop-shadow-lg mb-2">
                Valle de las Almas
              </h1>
              <p className="text-white/90 drop-shadow text-sm">
                Honrando la memoria de nuestros seres queridos
              </p>
            </div>
            
            {/* Información de usuario y plan */}
            <div className="space-y-2 mb-4">
              <p className="text-white/90 drop-shadow text-xl">
                Bienvenido, <span className="font-medium">{user.nombre} {user.apellidos}</span>
              </p>
              {/* Indicador de plan más pequeño */}
              <div className="flex items-center justify-end gap-2">
                <Badge 
                  variant={user.plan === 'tributo_completo' ? 'default' : 'secondary'} 
                  className={`text-xs ${user.plan === 'tributo_completo' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-white/20 text-white'}`}
                >
                  {user.plan === 'tributo_completo' ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Tributo Completo
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Plan Gratuito
                    </>
                  )}
                </Badge>
                {user.plan === 'gratuito' && (
                  <Button
                    onClick={onShowPricing}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-2 py-1 text-xs h-6"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Actualizar
                  </Button>
                )}
              </div>
            </div>

            {/* Panel de botones */}
            <div className="flex gap-3 flex-wrap justify-end">
              {/* Botón de Búsqueda */}
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 flex items-center gap-2 shadow-lg text-sm">
                    <Search className="w-4 h-4" />
                    Buscar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white/20 backdrop-blur-md border-white/30" align="end">
                  <div className="space-y-4">
                    <h3 className="text-white text-lg flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Buscar Memoriales
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-white/60" />
                      <Input
                        placeholder="Buscar por nombre, biografía, ubicación..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        autoFocus
                      />
                    </div>
                    {searchTerm && (
                      <div className="space-y-2">
                        <p className="text-white/80 text-sm">
                          Resultados: {filteredMemorials.length} memorial(es)
                        </p>
                        <Button
                          onClick={clearSearch}
                          variant="ghost"
                          className="w-full text-white hover:bg-white/20"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Limpiar búsqueda
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Botón de Árbol Familiar con candado */}
              <Button
                onClick={handleFamilyTreeClick}
                className={`px-4 py-2 flex items-center gap-2 shadow-lg text-sm relative ${
                  user.plan === 'tributo_completo' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-gray-500/60 hover:bg-gray-600/60 text-white/80'
                }`}
              >
                <TreeDeciduous className="w-4 h-4" />
                Árbol Familiar
                {user.plan === 'gratuito' && (
                  <Lock className="w-3 h-3 text-white/60 ml-1" />
                )}
              </Button>

              {/* Botón de Notificaciones */}
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 flex items-center gap-2 shadow-lg relative text-sm">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 bg-white/20 backdrop-blur-md border-white/30" align="end">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notificaciones
                      </h3>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              markAllAsRead();
                            }}
                            className="text-white hover:bg-white/20 text-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Marcar todas
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            clearAllNotifications();
                          }}
                          className="text-white hover:bg-white/20 text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Limpiar
                        </Button>
                      </div>
                    </div>
                    
                    {notifications.length > 0 ? (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {notifications.map(notification => {
                          const IconComponent = notification.icon;
                          return (
                            <div key={notification.id} className={`flex items-center gap-3 p-3 rounded-lg ${notification.unread ? 'bg-white/20' : 'bg-white/10'}`}>
                              <IconComponent className={`w-4 h-4 ${getNotificationColor(notification.type)}`} />
                              <div className="flex-1">
                                <p className="text-white text-sm">{notification.title}</p>
                                <p className="text-white/60 text-xs">
                                  hace {notification.time}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {notification.unread && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markNotificationAsRead(notification.id)}
                                    className="text-white hover:bg-white/20 p-1"
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-white hover:bg-white/20 p-1"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/60">No tienes notificaciones</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Botón de Configuración */}
              <Popover open={configOpen} onOpenChange={setConfigOpen}>
                <PopoverTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 flex items-center gap-2 shadow-lg text-sm">
                    <Settings className="w-4 h-4" />
                    Configuración
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white/20 backdrop-blur-md border-white/30" align="end">
                  <div className="space-y-6">
                    <h3 className="text-white text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Configuración
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Plan actual */}
                      <div>
                        <h4 className="text-white/90 text-sm mb-3 flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Plan Actual
                        </h4>
                        <div className="p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium text-sm">{currentPlan.name}</span>
                            {user.plan === 'tributo_completo' && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                          {user.plan === 'gratuito' && (
                            <Button
                              onClick={onShowPricing}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                              size="sm"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Actualizar Plan
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Perfil de Usuario */}
                      <div>
                        <h4 className="text-white/90 text-sm mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Mi Perfil
                        </h4>
                        <Button
                          onClick={() => {
                            setShowProfileForm(true);
                            setConfigOpen(false);
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Editar Perfil
                        </Button>
                      </div>

                      <Separator className="bg-white/20" />

                      {/* Configuraciones de privacidad */}
                      <div>
                        <h4 className="text-white/90 text-sm mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Privacidad y Seguridad
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifications" className="text-white/80 text-sm">
                              Notificaciones por email
                            </Label>
                            <Switch
                              id="email-notifications"
                              checked={settings.emailNotifications}
                              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="two-factor" className="text-white/80 text-sm">
                              Autenticación de dos factores
                            </Label>
                            <Switch
                              id="two-factor"
                              checked={settings.twoFactorAuth}
                              onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Botones principales */}
              <Button
                onClick={handleCreateMemorialClick}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 flex items-center gap-2 shadow-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                Crear Memorial
              </Button>
              <Button
                onClick={onLogout}
                variant="destructive"
                className="px-4 py-2 flex items-center gap-2 shadow-lg text-sm"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        {/* Mensaje de bienvenida del plan con transparencia */}
        {showPlanWelcome && (
          <div className="mb-6">
            <Alert className="bg-white/15 backdrop-blur-md border-white/30 border-2">
              <Info className="h-4 w-4 text-white" />
              <AlertDescription className="text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>
                      {user.plan === 'tributo_completo' 
                        ? '✨ Plan Tributo Completo Activado' 
                        : '🔓 Estás usando el Plan Gratuito'
                      }
                    </strong>
                    <p className="text-sm text-white/80 mt-1">
                      {user.plan === 'tributo_completo'
                        ? 'Tienes acceso completo a todas las funciones: memoriales ilimitados, galería de fotos, árbol genealógico y códigos QR.'
                        : 'Puedes crear 1 memorial básico con foto principal. Actualiza para desbloquear galería de fotos, árbol genealógico y códigos QR.'
                      }
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {user.plan === 'gratuito' && (
                      <Button
                        onClick={onShowPricing}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white whitespace-nowrap"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Ver Planes
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowPlanWelcome(false)}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {!showCreateForm && !showProfileForm && (
          <div className="space-y-8">
            {/* Indicator de búsqueda activa */}
            {searchTerm && (
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Search className="w-5 h-5" />
                    <span>Buscando: "{searchTerm}"</span>
                    <Badge variant="secondary">{filteredMemorials.length} resultados</Badge>
                  </div>
                  <Button
                    onClick={() => setSearchTerm('')}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Estado vacío cuando no hay memoriales propios */}
            {misMemorias.length === 0 && !searchTerm && (
              <section className="mb-12">
                <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl max-w-2xl mx-auto">
                  <CardContent className="p-12 text-center">
                    <div className="mb-6">
                      <h2 className="text-3xl text-white mb-3 drop-shadow">
                        ¡Empecemos!
                      </h2>
                      <p className="text-white/90 text-lg mb-6 leading-relaxed">
                        Crea tu primer memorial para honrar la memoria de un ser querido. 
                        Comparte su historia, fotos especiales y mantén vivo su legado.
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleCreateMemorialClick}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg flex items-center gap-3 shadow-lg mx-auto"
                    >
                      <Plus className="w-6 h-6" />
                      Crear Mi Primer Memorial
                    </Button>
                    
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <p className="text-white/70 text-sm mb-4">
                        <strong>¿Qué puedes hacer?</strong>
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col items-center gap-2 text-white/80">
                          <User className="w-8 h-8 text-blue-300" />
                          <span>Biografías completas</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-white/80 relative">
                          <QrCode className="w-8 h-8 text-emerald-300" />
                          <span>Códigos QR para lápidas</span>
                          {user.plan === 'gratuito' && (
                            <Lock className="w-3 h-3 text-white/40 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2 text-white/80">
                          <MessageCircle className="w-8 h-8 text-violet-300" />
                          <span>Libro de recuerdos</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Mis Memoriales */}
            {misMemorias.length > 0 && (
              <section>
                <h2 className="text-2xl text-white mb-6 drop-shadow flex items-center gap-2">
                  <User className="w-6 h-6 text-teal-400" />
                  Mis Memoriales
                  {searchTerm && <Badge variant="secondary" className="ml-2">filtrados</Badge>}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {misMemorias.map((memorial) => {
                    const relationship = getMemorialRelationship(memorial.id);
                    return (
                      <Card key={memorial.id} className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 shadow-xl">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-white text-lg">
                              {memorial.nombre} {memorial.apellidos}
                            </CardTitle>
                            <div className="flex gap-2">
                              {memorial.esPublico ? (
                                <Eye className="w-4 h-4 text-green-400" title="Público" />
                              ) : (
                                <Lock className="w-4 h-4 text-red-400" title="Privado" />
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {memorial.tipo === 'mascota' ? capitalizeFirstLetter('mascota') : relationship || capitalizeFirstLetter('familiar')}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-4 mb-4">
                            <ImageWithFallback
                              src={memorial.fotoPrincipal}
                              alt={memorial.nombre}
                              className="w-24 h-24 rounded-full object-cover border-2 border-white/30"
                            />
                            <div>
                              <p className="text-white/90 text-sm">
                                {formatDate(memorial.fechaNacimiento)} - {formatDate(memorial.fechaFallecimiento)}
                              </p>
                              {memorial.tipo === 'humano' && (
                                <p className="text-white/70 text-xs">
                                  {getMemorialAge(memorial.fechaNacimiento, memorial.fechaFallecimiento)} años
                                </p>
                              )}
                              {memorial.ubicacion && (
                                <p className="text-white/70 text-xs">
                                  📍 {memorial.ubicacion}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-white/80 text-sm mb-4 line-clamp-3">
                            {memorial.biografia}
                          </p>
                          
                          <div className="flex justify-between gap-2">
                            <Button
                              size="sm"
                              onClick={() => onViewMemorial(memorial, { type: 'owner', userId: user.id })}
                              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => showQRGenerator(memorial)}
                              className={`relative ${
                                currentPlan.limits.canUseQRCodes 
                                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                                  : 'bg-gray-500/60 hover:bg-gray-600/60'
                              } text-white`}
                            >
                              <QrCode className="w-4 h-4" />
                              {!currentPlan.limits.canUseQRCodes && (
                                <Lock className="w-2 h-2 text-white/60 absolute -top-1 -right-1" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => shareMemorial(memorial)}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => confirmDeleteMemorial(memorial)}
                              variant="destructive"
                              className="hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Memoriales con Permisos */}
            {memoriasPermitidas.length > 0 && (
              <section>
                <h2 className="text-2xl text-white mb-6 drop-shadow flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  Memoriales Compartidos Conmigo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memoriasPermitidas.map((memorial) => (
                    <Card key={memorial.id} className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 shadow-xl">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg">
                            {memorial.nombre} {memorial.apellidos}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {capitalizeFirstLetter(memorial.tipo)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-4 mb-4">
                          <ImageWithFallback
                            src={memorial.fotoPrincipal}
                            alt={memorial.nombre}
                            className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
                          />
                          <div>
                            <p className="text-white/90 text-sm">
                              {formatDate(memorial.fechaNacimiento)} - {formatDate(memorial.fechaFallecimiento)}
                            </p>
                            {memorial.ubicacion && (
                              <p className="text-white/70 text-xs">
                                📍 {memorial.ubicacion}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            onClick={() => onViewMemorial(memorial, { type: 'permitted', userId: user.id })}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Memorial
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Memoriales Demo */}
            {memoriasDemo.length > 0 && (
              <section>
                <h2 className="text-2xl text-white mb-6 drop-shadow flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  Memoriales de Ejemplo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memoriasDemo.map((memorial) => (
                    <Card key={memorial.id} className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/25 transition-all duration-300 shadow-xl">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg">
                            {memorial.nombre} {memorial.apellidos}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {capitalizeFirstLetter(memorial.tipo)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-4 mb-4">
                          <ImageWithFallback
                            src={memorial.fotoPrincipal}
                            alt={memorial.nombre}
                            className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
                          />
                          <div>
                            <p className="text-white/90 text-sm">
                              {formatDate(memorial.fechaNacimiento)} - {formatDate(memorial.fechaFallecimiento)}
                            </p>
                            {memorial.ubicacion && (
                              <p className="text-white/70 text-xs">
                                📍 {memorial.ubicacion}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            onClick={() => onViewMemorial(memorial, { type: 'guest' })}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Memorial
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Formulario de creación de memorial */}
        {showCreateForm && (
          <CreateMemorialForm
            onSubmit={(memorial, familyRelations) => {
              onCreateMemorial(memorial, familyRelations);
              setShowCreateForm(false);
            }}
            onCancel={() => setShowCreateForm(false)}
            existingMemorials={memoriales}
            currentUser={user}
            checkPlanLimits={checkPlanLimits}
            onShowPricing={onShowPricing}
          />
        )}

        {/* Formulario de perfil de usuario */}
        {showProfileForm && (
          <UserProfileForm
            user={user}
            onSubmit={handleUpdateProfile}
            onCancel={() => setShowProfileForm(false)}
          />
        )}

        {/* Generador de QR */}
        {selectedMemorialForQR && (
          <QRGenerator
            memorial={selectedMemorialForQR}
            onClose={() => setSelectedMemorialForQR(null)}
          />
        )}

        {/* Diálogo de confirmación para eliminar memorial */}
        {memorialToDelete && (
          <ConfirmDialog
            isOpen={showConfirmDialog}
            onClose={() => {
              setShowConfirmDialog(false);
              setMemorialToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar Memorial"
            description={`¿Estás seguro de que quieres eliminar el memorial de "${memorialToDelete.nombre} ${memorialToDelete.apellidos}"?\n\nEsta acción no se puede deshacer y también eliminará todas las relaciones familiares y comentarios asociados.`}
            confirmText="Eliminar Memorial"
            cancelText="Cancelar"
            variant="destructive"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;