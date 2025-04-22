import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface InvitationModalProps {
  onClose: () => void;
}

export default function InvitationModal({ onClose }: InvitationModalProps) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  
  const handleOptionSelect = (option: string) => {
    // In a real implementation, this would navigate to the appropriate form
    console.log(`Selected option: ${option}`);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-serif font-medium text-primary text-center">
          美しい日本を広げよう。
        </DialogTitle>
        <DialogDescription className="text-center mb-4">
          あなたも日本の魅力を共有しませんか？
        </DialogDescription>
        
        <div className="space-y-3">
          <Button 
            className="w-full py-6 bg-primary text-white"
            onClick={() => handleOptionSelect("foreigners")}
          >
            Post for Foreigners
          </Button>
          <Button 
            className="w-full py-6 bg-accent text-white"
            onClick={() => handleOptionSelect("japanese")}
          >
            日本人に伝えたい
          </Button>
          <Button 
            variant="outline" 
            className="w-full py-6 border border-gray-300 text-gray-600"
            onClick={() => handleOptionSelect("watch")}
          >
            Just Watch
          </Button>
        </div>
        
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
