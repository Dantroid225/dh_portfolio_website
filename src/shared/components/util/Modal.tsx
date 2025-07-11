import React from 'react';
import Backdrop from './Backdrop';

interface ModalProps {
  show: boolean;
  onCancel: () => void;
  header?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  show,
  onCancel,
  header,
  footer,
  children,
  className = '',
  headerClass = '',
  contentClass = '',
  footerClass = '',
}) => {
  if (!show) return null;

  return (
    <>
      <Backdrop show={show} onClick={onCancel} />
      <div className={`modal ${className}`.trim()}>
        {header && (
          <header className={`modal__header ${headerClass}`.trim()}>
            <h2>{header}</h2>
          </header>
        )}
        <div className={`modal__content ${contentClass}`.trim()}>
          {children}
        </div>
        {footer && (
          <footer className={`modal__footer ${footerClass}`.trim()}>
            {footer}
          </footer>
        )}
      </div>
    </>
  );
};

export default Modal;
