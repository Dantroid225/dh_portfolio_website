import React from 'react';

interface TextAreaProps {
  placeholder?: string;
  value?: string;
  name?: string;
  id?: string;
  rows?: number;
  cols?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  value,
  name,
  id,
  rows = 4,
  cols,
  required = false,
  disabled = false,
  className = '',
  onChange,
  onBlur,
  onFocus,
}) => {
  const baseClasses = 'textarea';
  const disabledClasses = disabled ? 'textarea--disabled' : '';

  const textareaClasses =
    `${baseClasses} ${disabledClasses} ${className}`.trim();

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      name={name}
      id={id}
      rows={rows}
      cols={cols}
      required={required}
      disabled={disabled}
      className={textareaClasses}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export default TextArea;
