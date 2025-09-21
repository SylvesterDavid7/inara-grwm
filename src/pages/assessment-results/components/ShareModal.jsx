
import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Copy, Facebook, Twitter, Mail } from 'lucide-react';

const ShareModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shareableLink = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    // You might want to add a toast notification here to confirm the copy
    console.log('Link copied!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your Skincare Plan">
      <div>
        <p className="font-body text-muted-foreground mb-4">Share your personalized skincare plan with friends, family, or your dermatologist.</p>
        
        <div className="flex items-center space-x-2 mb-6">
          <input 
            type="text" 
            readOnly 
            value={shareableLink} 
            className="flex-grow p-2 border border-border rounded-md bg-background text-foreground font-data"
          />
          <Button onClick={handleCopy} variant="outline" size="icon" className="hover:bg-muted">
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" asChild className="hover:bg-muted">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5 text-[#1877F2]" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="hover:bg-muted">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent('Check out my personalized skincare plan!')}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="hover:bg-muted">
            <a href={`mailto:?subject=${encodeURIComponent('My Skincare Plan')}&body=${encodeURIComponent(`I wanted to share my personalized skincare plan with you: ${shareableLink}`)}`}>
              <Mail className="h-5 w-5 text-[#D44638]" />
            </a>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
