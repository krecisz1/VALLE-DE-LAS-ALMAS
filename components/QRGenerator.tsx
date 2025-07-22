import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  QrCode, 
  Download, 
  Printer, 
  Share2, 
  X, 
  Copy, 
  Check, 
  Settings, 
  Image as ImageIcon,
  FileText,
  Smartphone,
  Info,
  ExternalLink
} from 'lucide-react';
import { Memorial } from '../App';

interface QRGeneratorProps {
  memorial: Memorial;
  onClose: () => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ memorial, onClose }) => {
  const [qrSize, setQrSize] = useState(300);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [qrStyle, setQrStyle] = useState('standard');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // URL del memorial
  const memorialUrl = `${window.location.origin}/memorial/${memorial.id}?qr=true`;

  useEffect(() => {
    generateQRCode();
  }, [qrSize, includeLogo, qrStyle, bgColor, fgColor]);

  const generateQRCode = () => {
    // Simulación de generación de QR - en producción usarías qrcode.js o similar
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    canvas.width = qrSize;
    canvas.height = qrSize + (includeLogo ? 80 : 0);

    // Limpiar canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar QR simulado (patrón de cuadrados)
    const moduleSize = Math.floor(qrSize / 25);
    const startX = (qrSize - (moduleSize * 25)) / 2;
    const startY = 10;

    ctx.fillStyle = fgColor;

    // Dibujar patrón QR simulado
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Simular patrón QR con esquinas y datos aleatorios
        const isCorner = (i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7);
        const isData = Math.random() > 0.5;
        
        if (isCorner || isData) {
          ctx.fillRect(
            startX + i * moduleSize,
            startY + j * moduleSize,
            moduleSize - 1,
            moduleSize - 1
          );
        }
      }
    }

    // Añadir esquinas de posición
    drawPositionMarker(ctx, startX, startY, moduleSize);
    drawPositionMarker(ctx, startX + 18 * moduleSize, startY, moduleSize);
    drawPositionMarker(ctx, startX, startY + 18 * moduleSize, moduleSize);

    // Añadir información del memorial si está habilitado
    if (includeLogo) {
      const textY = qrSize + 20;
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${memorial.nombre} ${memorial.apellidos}`, qrSize / 2, textY);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666666';
      const dates = `${memorial.fechaNacimiento.getFullYear()} - ${memorial.fechaFallecimiento.getFullYear()}`;
      ctx.fillText(dates, qrSize / 2, textY + 20);
      
      ctx.fillText('Valle de las Almas', qrSize / 2, textY + 40);
    }
  };

  const drawPositionMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Cuadrado exterior
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
    ctx.fillStyle = bgColor;
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
    ctx.fillStyle = fgColor;
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
  };

  const downloadQR = (format: 'png' | 'jpg' = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = downloadLinkRef.current;
    if (!link) return;

    const dataUrl = canvas.toDataURL(`image/${format}`, 0.9);
    link.href = dataUrl;
    link.download = `qr-memorial-${memorial.nombre.toLowerCase().replace(/\s+/g, '-')}.${format}`;
    link.click();
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Memorial de ${memorial.nombre} ${memorial.apellidos}`,
          text: 'Accede al memorial a través de este enlace',
          url: memorialUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      copyUrl();
    }
  };

  const printQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const img = canvas.toDataURL('image/png');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Código QR - ${memorial.nombre} ${memorial.apellidos}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              margin: 40px;
              background: white;
            }
            .qr-container {
              display: inline-block;
              border: 2px solid #333;
              padding: 20px;
              background: white;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .memorial-info {
              margin-bottom: 20px;
              color: #333;
            }
            .instructions {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="memorial-info">
              <h2>${memorial.nombre} ${memorial.apellidos}</h2>
              <p>${memorial.fechaNacimiento.getFullYear()} - ${memorial.fechaFallecimiento.getFullYear()}</p>
            </div>
            <img src="${img}" alt="Código QR del Memorial" style="max-width: 100%; height: auto;" />
            <div class="instructions">
              <p><strong>Escanea este código QR para acceder al memorial digital</strong></p>
              <p>También puedes visitar: ${memorialUrl}</p>
              <p style="margin-top: 15px; font-size: 10px;">
                Este código QR está diseñado para resistir las condiciones climáticas cuando se plastifica adecuadamente.
                Recomendamos laminarlo o protegerlo con material resistente al agua.
              </p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white/95 backdrop-blur-md border-white/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center gap-2">
              <QrCode className="w-6 h-6 text-teal-600" />
              Generar Código QR para Lápida
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-600">
            Crea un código QR personalizado para el memorial de <strong>{memorial.nombre} {memorial.apellidos}</strong>
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel de configuración */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Instrucciones para la lápida</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Este código QR está optimizado para uso en exteriores. Se recomienda imprimirlo en material resistente al agua 
                      o laminarlo para mayor durabilidad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración del QR
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="qr-size">Tamaño (px)</Label>
                    <Select value={qrSize.toString()} onValueChange={(value) => setQrSize(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200">200px (Pequeño)</SelectItem>
                        <SelectItem value="300">300px (Mediano)</SelectItem>
                        <SelectItem value="400">400px (Grande)</SelectItem>
                        <SelectItem value="500">500px (Extra Grande)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="qr-style">Estilo</Label>
                    <Select value={qrStyle} onValueChange={setQrStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Estándar</SelectItem>
                        <SelectItem value="rounded">Redondeado</SelectItem>
                        <SelectItem value="dots">Puntos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bg-color">Color de fondo</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fg-color">Color del código</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include-logo"
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="include-logo" className="text-sm">
                    Incluir información del memorial
                  </Label>
                </div>
              </div>

              {/* URL del memorial */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  URL del Memorial
                </h4>
                <div className="flex gap-2">
                  <Input
                    value={memorialUrl}
                    readOnly
                    className="bg-gray-50 text-sm"
                  />
                  <Button
                    onClick={copyUrl}
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {copied && (
                  <p className="text-green-600 text-sm">¡URL copiada al portapapeles!</p>
                )}
              </div>
            </div>

            {/* Vista previa del QR */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
                <div className="inline-block p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-4">
                <h4 className="font-medium">Descargar y Compartir</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => downloadQR('png')}
                    className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PNG
                  </Button>
                  
                  <Button
                    onClick={() => downloadQR('jpg')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    JPG
                  </Button>
                  
                  <Button
                    onClick={printQR}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </Button>
                  
                  <Button
                    onClick={shareQR}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </Button>
                </div>

                {/* Recomendaciones de impresión */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Printer className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-amber-900 mb-2">Recomendaciones de impresión:</h5>
                      <ul className="text-amber-800 text-sm space-y-1">
                        <li>• Usar papel de alta calidad (mínimo 200gsm)</li>
                        <li>• Laminar o plastificar para resistencia al clima</li>
                        <li>• Tamaño mínimo recomendado: 5x5 cm</li>
                        <li>• Evitar pliegues o daños en el código</li>
                        <li>• Probar el escaneo antes de instalar</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Información sobre escaneo */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">¿Cómo escanear?</h5>
                      <p className="text-gray-700 text-sm">
                        Los visitantes pueden usar cualquier aplicación de cámara de smartphone moderno 
                        o apps específicas de códigos QR para acceder al memorial instantáneamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Link oculto para descargas */}
      <a ref={downloadLinkRef} style={{ display: 'none' }} />
    </div>
  );
};

export default QRGenerator;