import React, { useState } from 'react';
import { Button } from './ui/button';
import FichaCard from './FichaCard';
import FichaForm from './FichaForm';
import { Ficha } from '../App';

interface ProfileScreenProps {
  username: string;
  fichas: Ficha[];
  onLogout: () => void;
  onCreateFicha: (ficha: Omit<Ficha, 'id' | 'fechaCreacion'>) => void;
  onDeleteFicha: (id: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  username,
  fichas,
  onLogout,
  onCreateFicha,
  onDeleteFicha
}) => {
  const [showFichaForm, setShowFichaForm] = useState(false);

  const handleCreateFicha = (fichaData: Omit<Ficha, 'id' | 'fechaCreacion'>) => {
    onCreateFicha(fichaData);
    setShowFichaForm(false);
  };

  return (
    <div 
      className="min-h-screen p-6 box-border relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10">
        {/* Encabezado del perfil */}
        <header className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl text-white drop-shadow-lg">
              ¡Bienvenido, {username}!
            </h1>
            <p className="text-white/80 text-lg mt-2 drop-shadow">
              Gestiona tus fichas y proyectos
            </p>
          </div>

          <div className="flex gap-6 items-center">
            <Button
              onClick={() => setShowFichaForm(true)}
              className="bg-blue-400 hover:bg-blue-500 text-white px-5 py-2.5 text-lg transition-colors duration-300"
            >
              Crear Ficha
            </Button>

            <Button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 text-lg transition-colors duration-300"
            >
              Cerrar Sesión
            </Button>
          </div>
        </header>

        {/* Contenedor de fichas */}
        {!showFichaForm && (
          <div className="animate-in fade-in duration-500">
            {fichas.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/15 backdrop-blur-sm p-8 rounded-2xl mx-auto max-w-md">
                  <h3 className="text-2xl text-white mb-4 drop-shadow">
                    No tienes fichas aún
                  </h3>
                  <p className="text-white/80 mb-6 drop-shadow">
                    Crea tu primera ficha para comenzar
                  </p>
                  <Button
                    onClick={() => setShowFichaForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                  >
                    Crear Primera Ficha
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {fichas.map((ficha) => (
                  <FichaCard
                    key={ficha.id}
                    ficha={ficha}
                    onDelete={onDeleteFicha}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formulario de creación de ficha */}
        {showFichaForm && (
          <FichaForm
            onSubmit={handleCreateFicha}
            onCancel={() => setShowFichaForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;