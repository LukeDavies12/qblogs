import { Play } from "@/data/types/logPlayTypes";
import React from 'react';

export type InputPropsPlay = {
  label: string;
  name: keyof Play;
  type: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  value?: number | string | boolean | null;
  disabled?: boolean;
};

export const FormInputPlay = ({ label, name, type, options, required, placeholder, onChange, value, disabled }: InputPropsPlay) => {
  const id = `${name}-input`;

  return (
    <div className="mb-4">
      {type !== 'checkbox' && (
        <label htmlFor={id} className="block text-sm mb-1 text-gray-700">
          {label}
        </label>
      )}
      {type === 'checkbox' ? (
        <>
          <label htmlFor={id} className="block text-sm mb-1 text-gray-700">{label}</label>
          <label
            htmlFor={id}
            className={`flex items-center w-full bg-white border rounded-md px-2 py-1 ${disabled
              ? 'border-neutral-200 bg-neutral-100 cursor-not-allowed'
              : 'border-neutral-300 cursor-pointer hover:bg-neutral-50'
              }`}
          >
            <input
              id={id}
              type="checkbox"
              name={name}
              onChange={onChange}
              required={required}
              className={`mr-2 h-5 w-5 accent-sky-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              disabled={disabled}
              checked={Boolean(value)}
            />
            <span
              className={`text-xs select-none ${disabled ? 'text-neutral-400' : 'text-gray-700'
                }`}
            >
              {label}
            </span>
          </label>
        </>
      ) : type === 'select' ? (
        <select
          id={id}
          name={name}
          onChange={onChange}
          required={required}
          value={value as string}
          disabled={disabled}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          onChange={onChange}
          placeholder={placeholder}
          value={value as string}
          disabled={disabled}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          value={value as string | number}
          disabled={disabled}
          {...(type === 'number' ? { min: name === 'down' ? 1 : undefined, max: name === 'down' ? 4 : undefined } : {})}
        />
      )}
    </div>
  );
};