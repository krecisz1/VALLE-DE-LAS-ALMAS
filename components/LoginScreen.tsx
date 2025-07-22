import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { QrCode, Mail, Lock } from 'lucide-react';
import { Usuario } from '../App';
import backgroundImage from 'figma:asset/92ed8809373d0443e889c9832bc19ce557dbab8b.png';

interface LoginScreenProps {
  onLogin: (user: Usuario) => void;
  onQRAccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onQRAccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) return;

    const userData: Usuario = {
      id: Date.now().toString(),
      username: formData.email.split('@')[0], // Generar username a partir del email
      email: formData.email,
      nombre: formData.nombre || 'Usuario',
      apellidos: formData.apellidos || '',
      memorialesCreados: [],
      memorialesPermitidos: []
    };

    onLogin(userData);
  };

  const handleGoogleLogin = () => {
    // Simulación de login con Google
    const userData: Usuario = {
      id: 'google_' + Date.now().toString(),
      username: 'usuario_google',
      email: 'usuario@gmail.com',
      nombre: 'Usuario',
      apellidos: 'Google',
      memorialesCreados: [],
      memorialesPermitidos: []
    };

    onLogin(userData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      
      {/* Overlay muy sutil para no opacar la belleza del fondo */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Contenedor del formulario - posicionado más abajo para no interferir con el logo del fondo */}
      <div className="relative z-10 mt-[65vh] transform -translate-y-[40%] bg-white/15 backdrop-blur-md p-10 rounded-xl shadow-2xl max-w-[480px] w-[95%] text-center border border-white/20">
        <div className="mb-8">
          <h1 className="text-3xl text-white drop-shadow-lg mb-2">
            {isLogin ? 'Bienvenido' : 'Únete a nosotros'}
          </h1>
          <p className="text-white/90 drop-shadow">
            {isLogin 
              ? 'Honra la memoria de tus seres queridos' 
              : 'Crea un espacio eterno para sus recuerdos'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="p-3 bg-white/95 border border-white/30 rounded-md backdrop-blur-sm"
                required
              />
              <Input
                type="text"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                className="p-3 bg-white/95 border border-white/30 rounded-md backdrop-blur-sm"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-4 pl-12 text-lg bg-white/95 border border-white/30 rounded-md backdrop-blur-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full p-4 pl-12 bg-white/95 border border-white/30 rounded-md backdrop-blur-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button 
              type="submit"
              className="w-full py-3 text-lg bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors duration-300 shadow-lg"
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full py-3 text-lg bg-white/95 hover:bg-white text-gray-700 border-white/30 rounded-md transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg backdrop-blur-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full py-3 text-lg bg-white/20 hover:bg-white/30 text-white border-white/40 rounded-md transition-colors duration-300 backdrop-blur-sm"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/40" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-3 text-white/80">o</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={onQRAccess}
              variant="outline"
              className="w-full py-3 text-lg bg-white/15 hover:bg-white/25 text-white border-white/40 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <QrCode className="w-5 h-5" />
              Acceder con Código QR
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-white/70 text-sm">
          <p>Un lugar sagrado para honrar la memoria</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;