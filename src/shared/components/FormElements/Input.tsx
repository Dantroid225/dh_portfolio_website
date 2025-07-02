import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  name,
  id,
  required = false,
  disabled = false,
  className = '',
  onChange,
  onBlur,
  onFocus,
}) => {
  const baseClasses = 'input';
  const disabledClasses = disabled ? 'input--disabled' : '';

  const inputClasses = `${baseClasses} ${disabledClasses} ${className}`.trim();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      id={id}
      required={required}
      disabled={disabled}
      className={inputClasses}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export default Input;
