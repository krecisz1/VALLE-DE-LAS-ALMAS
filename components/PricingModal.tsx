import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles,
  Users,
  QrCode,
  Camera,
  Video,
  TreeDeciduous,
  MessageCircle,
  Heart,
  Shield,
  Search,
  Share2,
  Bell,
  Star
} from 'lucide-react';
import { PlanType, SUBSCRIPTION_PLANS } from '../App';

interface PricingModalProps {
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({
  currentPlan,
  onUpgrade,
  onClose
}) => {
  const freePlan = SUBSCRIPTION_PLANS.gratuito;
  const premiumPlan = SUBSCRIPTION_PLANS.tributo_completo;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Elige tu Plan
              </h2>
              <p className="text-gray-600">
                Selecciona el plan que mejor se adapte a tus necesidades
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Gratuito */}
            <Card className={`relative transition-all duration-300 ${
              currentPlan === 'gratuito' 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-lg'
            }`}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-6 h-6 text-blue-500" />
                  <CardTitle className="text-2xl text-gray-900">
                    Plan Gratuito
                  </CardTitle>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $0
                  <span className="text-lg font-normal text-gray-500">/mes</span>
                </div>
                <p className="text-gray-600">
                  Perfecto para comenzar tu primer memorial
                </p>
                {currentPlan === 'gratuito' && (
                  <Badge className="bg-blue-100 text-blue-800 text-sm">
                    Plan Actual
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Incluido en el Plan Gratuito
                  </h4>
                  <ul className="space-y-2">
                    {freePlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    No Incluido
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-gray-400">
                      <Camera className="w-4 h-4 flex-shrink-0" />
                      <span>Galería de fotos múltiple</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-400">
                      <Video className="w-4 h-4 flex-shrink-0" />
                      <span>Videos y multimedia</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-400">
                      <TreeDeciduous className="w-4 h-4 flex-shrink-0" />
                      <span>Árbol genealógico</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-400">
                      <QrCode className="w-4 h-4 flex-shrink-0" />
                      <span>Códigos QR para lápidas</span>
                    </li>
                  </ul>
                </div>

                {currentPlan !== 'gratuito' ? (
                  <Button
                    onClick={() => onUpgrade('gratuito')}
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Downgrade no disponible
                  </Button>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    Plan actual
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Tributo Completo */}
            <Card className={`relative transition-all duration-300 border-2 ${
              currentPlan === 'tributo_completo' 
                ? 'ring-2 ring-purple-500 shadow-xl border-purple-200' 
                : 'border-purple-200 hover:shadow-xl hover:border-purple-300'
            }`}>
              {/* Badge Premium */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm">
                  <Crown className="w-4 h-4 mr-1" />
                  MÁS POPULAR
                </Badge>
              </div>

              <CardHeader className="text-center pb-4 pt-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-6 h-6 text-purple-500" />
                  <CardTitle className="text-2xl text-gray-900">
                    Plan Tributo Completo
                  </CardTitle>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  $4.99
                  <span className="text-lg font-normal text-gray-500">/mes</span>
                </div>
                <p className="text-gray-600">
                  La experiencia completa de memorial digital
                </p>
                {currentPlan === 'tributo_completo' && (
                  <Badge className="bg-purple-100 text-purple-800 text-sm">
                    Plan Actual
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Todo lo del Plan Gratuito +
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {premiumPlan.features.slice(6).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-600">
                        <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Características Premium
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Camera className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium text-gray-900">Galería Ilimitada</div>
                        <div className="text-sm text-gray-600">Fotos con títulos personalizados</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <TreeDeciduous className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium text-gray-900">Árbol Genealógico</div>
                        <div className="text-sm text-gray-600">Relaciones familiares interactivas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <QrCode className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium text-gray-900">Códigos QR</div>
                        <div className="text-sm text-gray-600">Para lápidas y compartir</div>
                      </div>
                    </div>
                  </div>
                </div>

                {currentPlan !== 'tributo_completo' ? (
                  <Button
                    onClick={() => onUpgrade('tributo_completo')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-medium"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Actualizar Ahora
                  </Button>
                ) : (
                  <div className="text-center text-purple-600 font-medium">
                    ✨ Plan activo - Disfruta todas las funciones
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Beneficios adicionales */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir el Plan Tributo Completo?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Memorial Completo</h4>
                <p className="text-gray-600 text-sm">
                  Crea un homenaje digital completo con fotos, videos y árbol genealógico
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fácil Compartir</h4>
                <p className="text-gray-600 text-sm">
                  Códigos QR para lápidas y enlaces para compartir con familiares
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Seguro y Privado</h4>
                <p className="text-gray-600 text-sm">
                  Tus memoriales están seguros con opciones de privacidad avanzadas
                </p>
              </div>
            </div>
          </div>

          {/* Garantía */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl text-center">
            <h4 className="font-semibold text-gray-900 mb-2">
              💝 Garantía de 30 días
            </h4>
            <p className="text-gray-600 text-sm">
              Si no estás completamente satisfecho, te devolvemos el dinero sin preguntas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;