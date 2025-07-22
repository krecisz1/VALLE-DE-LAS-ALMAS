import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft,
  Users, 
  Plus, 
  Heart, 
  User, 
  Baby, 
  Crown,
  X,
  Trash2,
  PawPrint,
  TreeDeciduous
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Memorial, FamilyRelation, Usuario } from '../App';
import backgroundImage from 'figma:asset/16183e18b8dc35ae92f2ac6dc9026bd0b153816c.png';

interface FamilyTreeViewProps {
  currentUser: Usuario;
  familyRelations: FamilyRelation[];
  allMemorials: Memorial[];
  onBack: () => void;
  onAddRelation: (relation: Omit<FamilyRelation, 'id' | 'dateCreated'>) => void;
  onRemoveRelation: (relationId: string) => void;
  onViewMemorial: (memorial: Memorial) => void;
}

const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({
  currentUser,
  familyRelations,
  allMemorials,
  onBack,
  onAddRelation,
  onRemoveRelation,
  onViewMemorial
}) => {
  const [showAddRelationDialog, setShowAddRelationDialog] = useState(false);
  const [selectedMemorial1, setSelectedMemorial1] = useState<string>('');
  const [selectedMemorial2, setSelectedMemorial2] = useState<string>('');
  const [selectedRelationType, setSelectedRelationType] = useState<FamilyRelation['relationType']>('hijo');

  // Crear memorial virtual para el usuario actual
  const currentUserMemorial: Memorial = {
    id: `user_${currentUser.id}`,
    nombre: currentUser.nombre,
    apellidos: currentUser.apellidos,
    fechaNacimiento: new Date('1990-01-01'), // Fecha por defecto
    fechaFallecimiento: new Date(), // Fecha actual (sigue vivo)
    tipo: 'humano',
    fotoPrincipal: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    biografia: `Perfil del usuario ${currentUser.nombre} ${currentUser.apellidos}`,
    fotos: [],
    videos: [],
    createdBy: currentUser.id,
    esPublico: false,
    usuariosPermitidos: [],
    fechaCreacion: new Date()
  };

  // Combinar memoriales con el perfil del usuario
  const extendedMemorials = [currentUserMemorial, ...allMemorials];

  // Obtener todos los memoriales que aparecen en relaciones (incluyendo el usuario)
  const relatedMemorialIds = new Set([
    ...familyRelations.map(r => r.fromMemorialId),
    ...familyRelations.map(r => r.toMemorialId)
  ]);

  const relatedMemorials = extendedMemorials.filter(m => relatedMemorialIds.has(m.id));

  // Función para obtener el parentesco de un memorial respecto al usuario actual
  const getRelationshipToUser = (memorialId: string) => {
    const userMemorialId = `user_${currentUser.id}`;
    
    // Buscar relación directa
    const relation = familyRelations.find(r => 
      (r.fromMemorialId === userMemorialId && r.toMemorialId === memorialId) ||
      (r.toMemorialId === userMemorialId && r.fromMemorialId === memorialId)
    );

    if (!relation) return null;

    // Si el usuario es el "from", devolver la relación tal como está
    if (relation.fromMemorialId === userMemorialId) {
      return relation.relationType;
    }
    
    // Si el usuario es el "to", invertir la relación
    const reverseMap: Record<FamilyRelation['relationType'], string> = {
      'padre': 'Hijo',
      'madre': 'Hijo',
      'hijo': 'Padre',
      'hija': 'Padre',
      'hermano': 'Hermano',
      'hermana': 'Hermano',
      'abuelo': 'Nieto',
      'abuela': 'Nieto',
      'nieto': 'Abuelo',
      'nieta': 'Abuelo',
      'conyuge': 'Cónyuge',
      'pareja': 'Pareja',
      'mascota': 'Dueño'
    };
    
    return reverseMap[relation.relationType] || relation.relationType;
  };

  // Función para construir el árbol genealógico
  const buildFamilyTree = () => {
    const tree: { [key: string]: any } = {};
    const processedMemorials = new Set<string>();

    // Crear estructura de nodos
    relatedMemorials.forEach(memorial => {
      if (!tree[memorial.id]) {
        tree[memorial.id] = {
          memorial,
          parents: [],
          children: [],
          siblings: [],
          spouse: null,
          pets: [],
          grandparents: [],
          grandchildren: []
        };
      }
    });

    // Procesar relaciones
    familyRelations.forEach(relation => {
      const fromNode = tree[relation.fromMemorialId];
      const toNode = tree[relation.toMemorialId];

      if (!fromNode || !toNode) return;

      switch (relation.relationType) {
        case 'padre':
        case 'madre':
          toNode.parents.push({ memorial: fromNode.memorial, relation });
          fromNode.children.push({ memorial: toNode.memorial, relation });
          break;
        case 'hijo':
        case 'hija':
          fromNode.parents.push({ memorial: toNode.memorial, relation });
          toNode.children.push({ memorial: fromNode.memorial, relation });
          break;
        case 'hermano':
        case 'hermana':
          fromNode.siblings.push({ memorial: toNode.memorial, relation });
          toNode.siblings.push({ memorial: fromNode.memorial, relation });
          break;
        case 'conyuge':
        case 'pareja':
          fromNode.spouse = { memorial: toNode.memorial, relation };
          toNode.spouse = { memorial: fromNode.memorial, relation };
          break;
        case 'abuelo':
        case 'abuela':
          toNode.grandparents.push({ memorial: fromNode.memorial, relation });
          fromNode.grandchildren.push({ memorial: toNode.memorial, relation });
          break;
        case 'nieto':
        case 'nieta':
          fromNode.grandparents.push({ memorial: toNode.memorial, relation });
          toNode.grandchildren.push({ memorial: fromNode.memorial, relation });
          break;
        case 'mascota':
          fromNode.pets.push({ memorial: toNode.memorial, relation });
          break;
      }
    });

    return tree;
  };

  const familyTree = buildFamilyTree();

  const getRelationIcon = (relationType: FamilyRelation['relationType']) => {
    const iconMap = {
      'padre': <User className="w-4 h-4 text-blue-500" />,
      'madre': <User className="w-4 h-4 text-pink-500" />,
      'hijo': <Baby className="w-4 h-4 text-green-500" />,
      'hija': <Baby className="w-4 h-4 text-purple-500" />,
      'hermano': <Users className="w-4 h-4 text-orange-500" />,
      'hermana': <Users className="w-4 h-4 text-red-500" />,
      'abuelo': <Crown className="w-4 h-4 text-yellow-600" />,
      'abuela': <Crown className="w-4 h-4 text-yellow-500" />,
      'nieto': <Baby className="w-4 h-4 text-indigo-500" />,
      'nieta': <Baby className="w-4 h-4 text-pink-400" />,
      'conyuge': <Heart className="w-4 h-4 text-red-500" />,
      'pareja': <Heart className="w-4 h-4 text-red-400" />,
      'mascota': <PawPrint className="w-4 h-4 text-amber-500" />
    };
    return iconMap[relationType] || <User className="w-4 h-4 text-gray-500" />;
  };

  const handleAddRelation = () => {
    if (!currentUser || !selectedMemorial1 || !selectedMemorial2 || !selectedRelationType) return;
    
    onAddRelation({
      fromMemorialId: selectedMemorial1,
      toMemorialId: selectedMemorial2,
      relationType: selectedRelationType,
      createdBy: currentUser.id
    });
    
    setSelectedMemorial1('');
    setSelectedMemorial2('');
    setSelectedRelationType('hijo');
    setShowAddRelationDialog(false);
  };

  // Renderizar un nodo del árbol
  const renderTreeNode = (nodeId: string, position: 'center' | 'left' | 'right' = 'center') => {
    const node = familyTree[nodeId];
    if (!node) return null;

    const { memorial } = node;
    const isCurrentUser = memorial.id === `user_${currentUser.id}`;
    const relationshipToUser = isCurrentUser ? null : getRelationshipToUser(memorial.id);

    return (
      <div key={nodeId} className={`flex flex-col items-center ${position === 'center' ? 'mx-4' : ''}`}>
        <Card className={`bg-white/20 backdrop-blur-md border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300 w-48 ${isCurrentUser ? 'ring-2 ring-emerald-400' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="mb-3">
              <ImageWithFallback
                src={memorial.fotoPrincipal}
                alt={memorial.nombre}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30 mx-auto"
              />
            </div>
            <h4 className="text-white font-medium text-sm mb-1">
              {memorial.nombre} {memorial.apellidos}
              {isCurrentUser && (
                <span className="block text-emerald-400 text-xs font-normal">(Tú)</span>
              )}
            </h4>
            <p className="text-white/70 text-xs mb-2">
              {memorial.tipo === 'humano' 
                ? `${new Date().getFullYear() - memorial.fechaNacimiento.getFullYear()} años`
                : memorial.ocupacion
              }
            </p>
            
            {/* Mostrar parentesco al pie de la foto */}
            {relationshipToUser && (
              <div className="bg-emerald-500/20 backdrop-blur-sm px-2 py-1 rounded-full mb-2">
                <span className="text-emerald-300 text-xs font-medium">
                  {relationshipToUser}
                </span>
              </div>
            )}
            
            <div className="flex justify-center gap-1 mb-2">
              {!isCurrentUser && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewMemorial(memorial)}
                  className="text-white hover:bg-white/20 text-xs p-1"
                >
                  Ver
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Líneas conectoras */}
        {node.children.length > 0 && (
          <div className="h-8 w-px bg-white/30 my-2"></div>
        )}
      </div>
    );
  };

  // Obtener generaciones para mostrar en formato de árbol
  const getGenerations = () => {
    const generations: { [key: number]: string[] } = {};
    
    // Encontrar el nodo raíz (persona más vieja sin padres)
    let rootNodes = Object.keys(familyTree).filter(nodeId => {
      const node = familyTree[nodeId];
      return node.parents.length === 0 && node.memorial.tipo === 'humano';
    });

    if (rootNodes.length === 0) {
      rootNodes = Object.keys(familyTree).slice(0, 1); // Tomar el primero como raíz
    }

    const assignGeneration = (nodeId: string, generation: number, visited = new Set()) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      if (!generations[generation]) {
        generations[generation] = [];
      }
      generations[generation].push(nodeId);

      const node = familyTree[nodeId];
      if (node) {
        // Agregar hijos a la siguiente generación
        node.children.forEach((child: any) => {
          assignGeneration(child.memorial.id, generation + 1, visited);
        });
        
        // Agregar hermanos a la misma generación
        node.siblings.forEach((sibling: any) => {
          assignGeneration(sibling.memorial.id, generation, visited);
        });

        // Agregar cónyuge a la misma generación
        if (node.spouse) {
          assignGeneration(node.spouse.memorial.id, generation, visited);
        }

        // Agregar nietos a dos generaciones más adelante
        node.grandchildren.forEach((grandchild: any) => {
          assignGeneration(grandchild.memorial.id, generation + 2, visited);
        });

        // Agregar abuelos a generación anterior
        node.grandparents.forEach((grandparent: any) => {
          assignGeneration(grandparent.memorial.id, generation - 2, visited);
        });
      }
    };

    rootNodes.forEach(rootId => assignGeneration(rootId, 0));
    
    return generations;
  };

  const generations = getGenerations();

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 flex items-center gap-2 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </Button>

          <div className="text-center">
            <h1 className="text-4xl text-white mb-2 drop-shadow-lg flex items-center gap-3 justify-center">
              <TreeDeciduous className="w-10 h-10 text-emerald-400" />
              Árbol Genealógico
            </h1>
            <p className="text-white/80 text-lg">
              Conexiones familiares de Valle de las Almas
            </p>
          </div>

          <Dialog open={showAddRelationDialog} onOpenChange={setShowAddRelationDialog}>
            <DialogTrigger asChild>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Relación
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-gray-800">
                  Agregar Relación Familiar
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primera Persona/Mascota
                  </label>
                  <Select value={selectedMemorial1} onValueChange={setSelectedMemorial1}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {extendedMemorials.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex items-center gap-2">
                            <ImageWithFallback
                              src={m.fotoPrincipal}
                              alt={m.nombre}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span>
                              {m.nombre} {m.apellidos}
                              {m.id === `user_${currentUser.id}` && ' (Tú)'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Relación
                  </label>
                  <Select value={selectedRelationType} onValueChange={(value) => setSelectedRelationType(value as FamilyRelation['relationType'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="padre">Es padre de</SelectItem>
                      <SelectItem value="madre">Es madre de</SelectItem>
                      <SelectItem value="hijo">Es hijo de</SelectItem>
                      <SelectItem value="hija">Es hija de</SelectItem>
                      <SelectItem value="hermano">Es hermano de</SelectItem>
                      <SelectItem value="hermana">Es hermana de</SelectItem>
                      <SelectItem value="abuelo">Es abuelo de</SelectItem>
                      <SelectItem value="abuela">Es abuela de</SelectItem>
                      <SelectItem value="nieto">Es nieto de</SelectItem>
                      <SelectItem value="nieta">Es nieta de</SelectItem>
                      <SelectItem value="conyuge">Es cónyuge de</SelectItem>
                      <SelectItem value="pareja">Es pareja de</SelectItem>
                      <SelectItem value="mascota">Es mascota de</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segunda Persona/Mascota
                  </label>
                  <Select value={selectedMemorial2} onValueChange={setSelectedMemorial2}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {extendedMemorials.filter(m => m.id !== selectedMemorial1).map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex items-center gap-2">
                            <ImageWithFallback
                              src={m.fotoPrincipal}
                              alt={m.nombre}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span>
                              {m.nombre} {m.apellidos}
                              {m.id === `user_${currentUser.id}` && ' (Tú)'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleAddRelation}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={!selectedMemorial1 || !selectedMemorial2 || !selectedRelationType}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Relación
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddRelationDialog(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Árbol genealógico */}
        {Object.keys(familyTree).length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-12">
                  {Object.keys(generations).sort((a, b) => Number(a) - Number(b)).map(genKey => {
                    const generation = Number(genKey);
                    const nodes = generations[generation];
                    
                    return (
                      <div key={generation} className="flex flex-col items-center">
                        <div className="text-white/70 text-sm mb-4">
                          {generation === -2 && "Bisabuelos"}
                          {generation === -1 && "Abuelos"}
                          {generation === 0 && "Padres"}
                          {generation === 1 && "Hijos"}
                          {generation === 2 && "Nietos"}
                          {generation > 2 && `Generación +${generation}`}
                          {generation < -2 && `Generación ${generation}`}
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                          {nodes.map(nodeId => renderTreeNode(nodeId))}
                        </div>
                        {generation < Math.max(...Object.keys(generations).map(Number)) && (
                          <div className="h-8 w-px bg-white/30 mt-4"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <TreeDeciduous className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-white text-2xl mb-4">El árbol está creciendo</h3>
              <p className="text-white/80 text-lg mb-6">
                Agrega relaciones familiares para ver crecer tu árbol genealógico
              </p>
              <Button 
                onClick={() => setShowAddRelationDialog(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Primera Relación
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FamilyTreeView;