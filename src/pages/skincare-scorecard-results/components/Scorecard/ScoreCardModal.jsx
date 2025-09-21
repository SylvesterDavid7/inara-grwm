import React, { useState, useRef, useEffect } from 'react';
import FlippableCard from './FlippableCard';
import ScoreCard from './ScoreCard';
import ScoreCardBack from './ScoreCardBack';
import AppIcon from '../../../../components/AppIcon';
import { toPng } from 'html-to-image';

const cardAvatars = [
    "/Inara Smiley Black.svg",
    "/Inara Smiley.svg",
    // "/Asset 1.svg",
    // "/Asset 2.svg",
    // "/Asset 3.svg",
    // "/Asset 4.svg",
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png",
    "/6.png",
    "/7.png",
    "/8.png",
    // "/9.png",
    "/10.png",
    "/11.png",
    "/12.png",
    "/13.png",
    "/14.png",
    "/15.png",
  ];

  const cuteNames = [ 
    "Dapper Dragonfly", "Pixel Piglet", "Sparkle Squirrel", "Happy Hippo", "Cheery Chameleon",
    "Gigglesaurus Rex", "Wiggle Worm", "Snuggle Bug", "Bouncy Bunny", "Fluffy Fawn",
    "Zippy Zebra", "Chirpy Chipmunk", "Puddle Panda", "Sunny Seal", "Twinkle Turtle",
    "Muffin Mouse", "Wobbly Walrus", "Cuddly Koala", "Giddy Giraffe", "Peppy Penguin",
    "Pinky Puffin", "Sprinkle Sloth", "Sassy Seahorse", "Nibble Narwhal", "Dizzy Donkey",
    "Button Bat", "Scooter Skunk", "Bubbly Bear", "Tickle Tiger", "Pogo Pony",
    "Marshmallow Mole", "Huggy Hedgehog", "Fizzy Ferret", "Breezy Bee", "Quirky Quokka",
    "Loopy Llama", "Snazzy Snail", "Jolly Jackal", "Perky Parrot", "Bouncy Beetle",
    "Silly Starfish", "Cookie Cat", "Cupcake Crab", "Zany Zebrafinch", "Merry Meerkat",
    "Choco Chinchilla", "Noodle Newt", "Bubbly Batfish", "Toffee Toad", "Peachy Pup",
    "Jiggly Jellyfish", "Kooky Kangaroo", "Sugar Sparrow", "Sunny Swallow", "Poppet Pika",
    "Glitter Goose", "Tizzy Tortoise", "Hoppy Hare", "Chubby Cheetah", "Goofy Goat",
    "Sprouty Sprig", "Shimmer Sheep", "Cloudy Calf", "Snappy Sealion", "Doodle Duckling",
    "Velvet Vole", "Tiny Tamarin", "Pudding Puff", "Nifty Numbat", "Pearly Peacock",
    "Slinky Shrew", "Puddle Pup", "Nuzzle Nene", "Jumpy Jackrabbit", "Smiley Salamander",
    "Waffle Weasel", "Tater Tot Tiger", "Sunny Sunbird", "Pickle Parakeet", "Biscuit Bear",
    "Choco Chipmunk", "Spunky Spider", "Twirly Toucan", "Bouncy Bluebird", "Peppy Puffball",
    "Sprinkle Seal", "Mango Monkey", "Twisty Tadpole", "Skippy Skunk", "Jolly Jellybean",
    "Fluffy Fox", "Wiggles Wombat", "Honey Hamster", "Cheeky Chickadee", "Popcorn Panda",
    "Frolic Frog", "Glowy Gecko", "Snappy Squirrel", "Toasty Tamarin", "Boop Bat",
    "Prancy Pony", "Glitzy Goldfish", "Breezy Budgie", "Snazzy Starling", "Tango Toad",
    "Giggle Goose", "Snuggle Seal", "Squishy Squid", "Bubbly Bunny", "Cherry Chipmunk",
    "Happy Hedgehog", "Merry Mongoose", "Nifty Nightjar", "Doodle Dolphin", "Sugar Swan",
    "Fizzy Finch", "Pipsqueak Pup", "Peppy Parakeet", "Bubbly Bumblebee", "Snicker Snake",
    "Snappy Seahorse", "Whimsy Whale", "Tippy Tapir", "Twinkle Tamarin", "Giddy Guinea Pig",
    "Wobble Wagtail", "Puffy Puffin", "Snazzy Starfish", "Frothy Flamingo", "Cheery Cricket",
    "Puddle Platypus", "Fuzzy Ferret", "Bouncy Badger", "Puffball Penguin", "Chirpy Chough",
    "Peppy Panther", "Happy Hummingbird", "Snuggle Swan", "Giggly Gazelle", "Cinnamon Seal"
    ];

const ScoreCardModal = ({ isOpen, onClose, analysis }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [cuteName, setCuteName] = useState('');
  const [cardImage, setCardImage] = useState('');

  useEffect(() => {
    if (isOpen) {
        const randomCuteName = cuteNames[Math.floor(Math.random() * cuteNames.length)];
        const randomAvatar = cardAvatars[Math.floor(Math.random() * cardAvatars.length)];
        setCuteName(randomCuteName);
        setCardImage(randomAvatar);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDownload = () => {
    const node = isFlipped ? backRef.current : frontRef.current;
    if (node) {
      if (isFlipped) {
        node.style.transform = 'none';
      }

      toPng(node, { pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'skincare-scorecard.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('oops, something went wrong!', err);
        })
        .finally(() => {
          if (isFlipped) {
            node.style.transform = '';
          }
        });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Skincare Scorecard',
        text: 'Check out my skincare scorecard from Inara!',
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Share not supported on this browser, do it the old way.');
    }
  };

  const cardData = {
    score: analysis?.overallScore?.score,
    verdict: analysis?.overallScore?.rating,
    cuteName: cuteName,
    cardImage: cardImage,
    result: {
        issues: analysis?.ingredientCompatibility?.conflicts?.map(conflict => ({
            title: `Conflict: ${conflict.ingredients.join(' & ')}`,
            details: conflict.message,
            risk: conflict.severity,
        }))
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center">
            <div className="relative w-[350px] h-[500px]">
                <FlippableCard
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                    frontRef={frontRef}
                    backRef={backRef}
                    frontContent={<ScoreCard {...cardData} />}
                    backContent={<ScoreCardBack {...cardData} />}
                />
                <button onClick={onClose} className="absolute top-[-10px] right-[-10px] bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center text-white/80 hover:text-white text-xl z-10">&times;</button>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <button onClick={handleDownload} className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg font-bold">
                    <AppIcon name="Download" size={16} />
                    <span>Download</span>
                </button>
                <button onClick={handleShare} className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg font-bold">
                    <AppIcon name="Share2" size={16} />
                    <span>Share</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default ScoreCardModal;
