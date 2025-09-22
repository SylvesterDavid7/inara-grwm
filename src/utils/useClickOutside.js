import { useEffect } from 'react';

/**
 * Custom hook for handling clicks outside a specified element.
 * @param {React.RefObject} ref - The ref of the element to detect outside clicks for.
 * @param {Function} callback - The function to call when a click outside is detected.
 * @param {boolean} isOpen - Only runs the effect when the element is open/visible.
 */
const useClickOutside = (ref, callback, isOpen) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, isOpen]);
};

export default useClickOutside;
