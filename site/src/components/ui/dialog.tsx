import * as React from "react"

const Dialog = ({ open, onOpenChange, children }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-card border border-primary/20 rounded-xl shadow-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={`text-2xl font-['Orbitron'] font-bold ${className}`}>
      {children}
    </h2>
  );
};

const DialogDescription = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={`text-muted-foreground mt-2 ${className}`}>
      {children}
    </p>
  );
};

const DialogFooter = ({ children, className = "" }: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex gap-3 justify-end mt-6 ${className}`}>
      {children}
    </div>
  );
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
