import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'default';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          background: 'bg-red-500/20',
          border: 'border-red-500/30',
          iconColor: 'text-red-400',
          confirmButton: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          background: 'bg-yellow-500/20',
          border: 'border-yellow-500/30', 
          iconColor: 'text-yellow-400',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          background: 'bg-white/20',
          border: 'border-white/30',
          iconColor: 'text-blue-400',
          confirmButton: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${styles.background} backdrop-blur-md ${styles.border} shadow-xl max-w-md`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
              <DialogTitle className="text-white text-lg">
                {title}
              </DialogTitle>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <DialogDescription className="text-white/90 text-base leading-relaxed py-4">
          {description}
        </DialogDescription>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`${styles.confirmButton} text-white`}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;