import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { Copy, Facebook, Twitter, Mail, CheckCircle } from 'lucide-react';

const ShareOption = ({ id, label, checked, onChange, icon }) => (
    <label htmlFor={id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
      <Icon name={icon} className="h-5 w-5 text-accent" />
      <span className="flex-grow font-body text-sm text-foreground">{label}</span>
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
    </label>
  );

const ShareModal = ({ isOpen, onClose, shareableLink, shareOptions, onOptionChange, isSharedView }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{ zIndex: 9999 }}>
        <Modal isOpen={isOpen} onClose={onClose} title="Share Your Skincare Scorecard">
        <div>
            <p className="font-body text-muted-foreground mb-4">
            {isSharedView 
              ? "Share this personalized scorecard using the link below."
              : "Your personalized scorecard is ready. Choose what to include and share the link below."
            }
            </p>

            {!isSharedView && onOptionChange && (
              <div className="space-y-3 mb-6">
                <h4 className="font-heading text-sm font-medium text-foreground">Sharing Options</h4>
                <ShareOption 
                  id="includeScores"
                  label="Include Scores & Analysis"
                  icon="ClipboardList"
                  checked={shareOptions.includeScores}
                  onChange={(checked) => onOptionChange({ ...shareOptions, includeScores: checked })}
                />
                <ShareOption 
                  id="includeRecommendations"
                  label="Include Recommendations"
                  icon="Star"
                  checked={shareOptions.includeRecommendations}
                  onChange={(checked) => onOptionChange({ ...shareOptions, includeRecommendations: checked })}
                />
                <ShareOption 
                  id="includePhotos"
                  label="Include Progress Photos"
                  icon="Image"
                  checked={shareOptions.includePhotos}
                  onChange={(checked) => onOptionChange({ ...shareOptions, includePhotos: checked })}
                />
              </div>
            )}
            
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