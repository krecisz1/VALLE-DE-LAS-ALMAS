import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  Plus, 
  Heart, 
  User, 
  Baby, 
  Crown,
  UserPlus,
  X,
  Edit3,
  Trash2,
  PawPrint
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Memorial, FamilyRelation, Usuario } from '../App';

interface FamilyTreeProps {
  memorial: Memorial;
  currentUser: Usuario | null;
  relatedMemorials: { memorial: Memorial, relation: FamilyRelation }[];
  allMemorials: Memorial[];
  canEdit: boolean;
  onAddRelation: (relation: Omit<FamilyRelation, 'id' | 'dateCreated'>) => void;
  onRemoveRelation: (relationId: string) => void;
  onViewMemorial: (memorial: Memorial) => void;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({
  memorial,
  currentUser,
  relatedMemorials,
  allMemorials,
  canEdit,
  onAddRelation,
  onRemoveRelation,
  onViewMemorial
}) => {
  const [showAddRelationDialog, setShowAddRelationDialog] = useState(false);
  const [selectedMemorial, setSelectedMemorial] = useState<string>('');
  const [selectedRelationType, setSelectedRelationType] = useState<FamilyRelation['relationType']>('hijo');

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

  const getRelationColor = (relationType: FamilyRelation['relationType']) => {
    const colorMap = {
      'padre': 'bg-blue-50 border-blue-200',
      'madre': 'bg-pink-50 border-pink-200',
      'hijo': 'bg-green-50 border-green-200',
      'hija': 'bg-purple-50 border-purple-200',
      'hermano': 'bg-orange-50 border-orange-200',
      'hermana': 'bg-red-50 border-red-200',
      'abuelo': 'bg-yellow-50 border-yellow-200',
      'abuela': 'bg-yellow-50 border-yellow-200',
      'nieto': 'bg-indigo-50 border-indigo-200',
      'nieta': 'bg-pink-50 border-pink-200',
      'conyuge': 'bg-red-50 border-red-200',
      'pareja': 'bg-red-50 border-red-200',
      'mascota': 'bg-amber-50 border-amber-200'
    };
    return colorMap[relationType] || 'bg-gray-50 border-gray-200';
  };

  const getRelationLabel = (relationType: FamilyRelation['relationType']) => {
    const labelMap = {
      'padre': 'Padre',
      'madre': 'Madre',
      'hijo': 'Hijo',
      'hija': 'Hija',
      'hermano': 'Hermano',
      'hermana': 'Hermana',
      'abuelo': 'Abuelo',
      'abuela': 'Abuela',
      'nieto': 'Nieto',
      'nieta': 'Nieta',
      'conyuge': 'Cónyuge',
      'pareja': 'Pareja',
      'mascota': 'Mascota'
    };
    return labelMap[relationType] || relationType;
  };

  const handleAddRelation = () => {
    if (!currentUser || !selectedMemorial || !selectedRelationType) return;
    
    onAddRelation({
      fromMemorialId: memorial.id,
      toMemorialId: selectedMemorial,
      relationType: selectedRelationType,
      createdBy: currentUser.id
    });
    
    setSelectedMemorial('');
    setSelectedRelationType('hijo');
    setShowAddRelationDialog(false);
  };

  const availableMemorials = allMemorials.filter(m => 
    m.id !== memorial.id && 
    !relatedMemorials.some(rm => rm.memorial.id === m.id)
  );

  // Agrupar relaciones por tipo
  const groupedRelations = relatedMemorials.reduce((acc, item) => {
    const type = item.relation.relationType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {} as Record<string, { memorial: Memorial, relation: FamilyRelation }[]>);

  const relationOrder = ['padre', 'madre', 'conyuge', 'pareja', 'hermano', 'hermana', 'hijo', 'hija', 'abuelo', 'abuela', 'nieto', 'nieta', 'mascota'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl text-white mb-2 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            Árbol Genealógico
          </h3>
          <p className="text-white/70 text-sm">
            Conexiones familiares y vínculos especiales
          </p>
        </div>
        
        {canEdit && (
          <Dialog open={showAddRelationDialog} onOpenChange={setShowAddRelationDialog}>
            <DialogTrigger asChild>
              <Button 
                className="bg-teal-600 hover:bg-teal-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Relación
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
                    Seleccionar Persona/Mascota
                  </label>
                  <Select value={selectedMemorial} onValueChange={setSelectedMemorial}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un memorial..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMemorials.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex items-center gap-2">
                            <ImageWithFallback
                              src={m.fotoPrincipal}
                              alt={m.nombre}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span>{m.nombre} {m.apellidos}</span>
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
                      <SelectItem value="padre">Padre</SelectItem>
                      <SelectItem value="madre">Madre</SelectItem>
                      <SelectItem value="hijo">Hijo</SelectItem>
                      <SelectItem value="hija">Hija</SelectItem>
                      <SelectItem value="hermano">Hermano</SelectItem>
                      <SelectItem value="hermana">Hermana</SelectItem>
                      <SelectItem value="abuelo">Abuelo</SelectItem>
                      <SelectItem value="abuela">Abuela</SelectItem>
                      <SelectItem value="nieto">Nieto</SelectItem>
                      <SelectItem value="nieta">Nieta</SelectItem>
                      <SelectItem value="conyuge">Cónyuge</SelectItem>
                      <SelectItem value="pareja">Pareja</SelectItem>
                      <SelectItem value="mascota">Mascota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleAddRelation}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    disabled={!selectedMemorial || !selectedRelationType}
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
        )}
      </div>

      {/* Relaciones agrupadas */}
      {Object.keys(groupedRelations).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relationOrder.map(relationType => {
            const relations = groupedRelations[relationType];
            if (!relations || relations.length === 0) return null;
            
            return (
              <div key={relationType} className="space-y-3">
                <div className="flex items-center gap-2">
                  {getRelationIcon(relationType)}
                  <h4 className="text-white font-medium">
                    {getRelationLabel(relationType)}
                    {relations.length > 1 && `s (${relations.length})`}
                  </h4>
                </div>
                
                {relations.map(({ memorial: relatedMemorial, relation }) => (
                  <Card key={relation.id} className={`${getRelationColor(relation.relationType)} border-2 hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <ImageWithFallback
                          src={relatedMemorial.fotoPrincipal}
                          alt={relatedMemorial.nombre}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">
                            {relatedMemorial.nombre} {relatedMemorial.apellidos}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {relatedMemorial.tipo}
                            </Badge>
                            {relatedMemorial.ubicacion && (
                              <span className="text-xs text-gray-600">
                                {relatedMemorial.ubicacion}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewMemorial(relatedMemorial)}
                          className="text-xs"
                        >
                          Ver Memorial
                        </Button>
                        
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveRelation(relation.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h4 className="text-white text-lg mb-2">No hay relaciones familiares</h4>
            <p className="text-white/70 text-sm mb-4">
              {canEdit 
                ? "Agrega conexiones familiares para mostrar el árbol genealógico"
                : "Este memorial no tiene relaciones familiares registradas"
              }
            </p>
            {canEdit && (
              <Button 
                onClick={() => setShowAddRelationDialog(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Relación
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilyTree;