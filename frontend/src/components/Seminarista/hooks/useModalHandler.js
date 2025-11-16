import { useEffect } from 'react';

const useModalHandler = (showModal, modalId, closeModal) => {
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    if (showModal) {
      const modal = document.getElementById(modalId);
      const firstButton = modal?.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showModal, modalId, closeModal]);
};

export default useModalHandler;