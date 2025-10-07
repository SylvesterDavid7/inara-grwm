import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Copy, Facebook, Twitter, Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const ShareModal = ({ isOpen, onClose, shareableLink }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div style={{ zIndex: 9999 }}>
        <Modal isOpen={isOpen} onClose={onClose} title="Share Your Skincare Scorecard">
        <div>
            <p className="font-body text-muted-foreground mb-4">
            Your personalized scorecard has been saved. Share the link below with friends, family, or your dermatologist.
            </p>
            
            <div className="flex items-center space-x-2 mb-6">
            <input 
                type="text" 
                readOnly 
                value={shareableLink} 
                className="flex-grow p-2 border border-border rounded-md bg-background text-foreground font-data"
            />
            <Button onClick={handleCopy} variant="outline" size="icon" className="hover:bg-muted w-10">
                {isCopied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            </div>

            <div className="flex justify-center space-x-4">
            <Button variant="outline" size="icon" asChild className="hover:bg-muted">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-[#1877F2]" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild className="hover:bg-muted">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent('Check out my personalized skincare scorecard!')}`} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild className="hover:bg-muted">
                <a href={`mailto:?subject=${encodeURIComponent('My Skincare Scorecard')}&body=${encodeURIComponent(`I wanted to share my personalized skincare scorecard with you: ${shareableLink}`)}`}>
                <Mail className="h-5 w-5 text-[#D44638]" />
                </a>
            </Button>
            </div>
        </div>
        </Modal>
    </div>
  );
};

export default ShareModal;
