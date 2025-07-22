import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { QrCode, ArrowLeft, Search, User, Camera, X, Smartphone, AlertCircle } from 'lucide-react';
import backgroundImage from 'figma:asset/92ed8809373d0443e889c9832bc19ce557dbab8b.png';

interface QRAccessScreenProps {
  onAccessMemorial: (memorialId: string) => void;
  onBack: () => void;
}

const QRAccessScreen: React.FC<QRAccessScreenProps> = ({ onAccessMemorial, onBack }) => {
  const [qrCode, setQrCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string>('');
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Verificar disponibilidad de cámara al cargar
  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
    } catch (error) {
      console.error('Error checking camera:', error);
      setHasCamera(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode.trim()) return;

    setIsSearching(true);
    setScanError('');
    
    // Simular búsqueda
    setTimeout(() => {
      try {
        // Extraer ID del memorial del código QR o URL
        let memorialId = '';
        
        if (qrCode.includes('valle-de-las-almas.com/memorial/')) {
          memorialId = qrCode.split('/memorial/')[1].split('?')[0];
        } else if (qrCode.includes('qr=')) {
          memorialId = qrCode.split('qr=')[1].split('&')[0];
        } else if (qrCode.includes('memorial_')) {
          memorialId = qrCode.trim();
        } else {
          // Asumir que es un ID directo
          memorialId = qrCode.trim();
        }
        
        if (memorialId) {
          onAccessMemorial(memorialId);
        } else {
          setScanError('Código QR o enlace no válido. Verifique e intente nuevamente.');
        }
      } catch (error) {
        setScanError('Error al procesar el código. Intente nuevamente.');
      } finally {
        setIsSearching(false);
      }
    }, 1500);
  };

  const startCamera = async () => {
    try {
      setScanError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Cámara trasera preferida
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        // Simular detección de QR cada 2 segundos
        setTimeout(() => {
          detectQRCode();
        }, 2000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setScanError('No se pudo acceder a la cámara. Verifique los permisos.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const detectQRCode = () => {
    // Simulación de detección de QR - en una implementación real usarías una librería como jsQR
    const simulatedQRCodes = [
      'memorial_1735577123456',
      'https://valle-de-las-almas.com/memorial/1735577123456',
      'memorial_1735577123457',
      'memorial_1735577123458'
    ];
    
    // Simular detección aleatoria
    if (Math.random() > 0.6) {
      const randomQR = simulatedQRCodes[Math.floor(Math.random() * simulatedQRCodes.length)];
      setQrCode(randomQR);
      stopCamera();
      setScanError('');
      
      // Auto-procesar el QR detectado
      setTimeout(() => {
        handleQRDetected(randomQR);
      }, 500);
    } else {
      // Continuar escaneando
      setTimeout(() => {
        if (isScanning) detectQRCode();
      }, 1000);
    }
  };

  const handleQRDetected = (detectedQR: string) => {
    setQrCode(detectedQR);
    // Auto-enviar el formulario
    const event = new Event('submit') as unknown as React.FormEvent;
    handleSubmit(event);
  };

  const handleQRScan = () => {
    if (!hasCamera) {
      setScanError('Cámara no disponible en este dispositivo.');
      return;
    }
    
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-start overflow-hidden">
      {/* Fondo con la imagen del Valle de las Almas */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      />
      
      {/* Overlay muy sutil */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Botón volver */}
      <Button
        onClick={() => {
          stopCamera();
          onBack();
        }}
        variant="ghost"
        className="absolute top-8 left-8 text-white hover:bg-white/20 flex items-center gap-2 z-20 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </Button>

      {/* Contenedor principal */}
      <div className="relative z-10 mt-[65vh] transform -translate-y-[40%] bg-white/15 backdrop-blur-md p-10 rounded-xl shadow-2xl max-w-[500px] w-[95%] text-center border border-white/20">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="w-8 h-8 text-teal-300" />
            <h1 className="text-3xl text-white drop-shadow-lg">
              Acceso QR
            </h1>
          </div>
          <p className="text-white/90 drop-shadow">
            Accede a un memorial mediante código QR o enlace
          </p>
        </div>

        {/* Error de escaneo */}
        {scanError && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">
              {scanError}
              <Button
                onClick={() => setScanError('')}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 mt-2 ml-auto block"
              >
                Cerrar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Cámara QR Scanner */}
        {isScanning && (
          <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/30">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Escaneando código QR...
                </CardTitle>
                <Button
                  onClick={stopCamera}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-black rounded-lg object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                {/* Overlay de scanning */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-teal-400 rounded-lg">
                    <div className="w-full h-full relative">
                      {/* Esquinas del scanner */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-teal-400"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-teal-400"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-teal-400"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-teal-400"></div>
                      
                      {/* Línea de escaneo animada */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-teal-400 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-sm mt-3">
                Apunta la cámara hacia el código QR del memorial
              </p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Código QR o enlace del memorial"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full p-4 pl-12 text-lg bg-white/95 border border-white/30 rounded-md backdrop-blur-sm"
                required
              />
            </div>
            <p className="text-white/70 text-sm mt-2 text-left">
              Pega aquí el enlace completo o solo el código del memorial
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              type="submit"
              disabled={isSearching || !qrCode.trim()}
              className="w-full py-3 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors duration-300 disabled:opacity-50 shadow-lg"
            >
              {isSearching ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Buscando memorial...
                </div>
              ) : (
                'Acceder al Memorial'
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/40" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-3 text-white/80">o</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleQRScan}
              disabled={!hasCamera}
              variant="outline"
              className={`w-full py-3 text-lg ${
                isScanning 
                  ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/40' 
                  : 'bg-white/15 hover:bg-white/25 border-white/40'
              } text-white rounded-md transition-colors duration-300 flex items-center justify-center gap-2 backdrop-blur-sm disabled:opacity-50`}
            >
              {isScanning ? (
                <>
                  <X className="w-5 h-5" />
                  Detener Escáner
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  {hasCamera ? 'Escanear Código QR' : 'Cámara no disponible'}
                </>
              )}
            </Button>
            
            {!hasCamera && (
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Funciona mejor en dispositivos móviles</span>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 space-y-4">
          <div className="bg-white/15 rounded-lg p-4 backdrop-blur-sm border border-white/20">
            <h3 className="text-white mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              ¿Qué puedes ver con acceso QR?
            </h3>
            <ul className="text-white/90 text-sm space-y-1 text-left">
              <li>• Información básica del ser querido</li>
              <li>• Foto principal y fechas importantes</li>
              <li>• Resumen de la biografía</li>
              <li>• Mensaje conmemorativo</li>
            </ul>
          </div>

          <p className="text-white/70 text-sm">
            Para acceso completo con fotos, videos y comentarios, solicita permisos al propietario del memorial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRAccessScreen;