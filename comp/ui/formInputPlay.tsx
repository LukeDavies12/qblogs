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
};

export const FormInputPlay = ({ label, name, type, options, required, placeholder, onChange }: InputPropsPlay) => {
  const id = `${name}-input`;

  if (type === 'checkbox') {
    return (
      <div className="flex items-center mb-2">
        <input
          id={id}
          type="checkbox"
          name={name}
          onChange={onChange}
          required={required}
          className="mr-2 h-4 w-4"
        />
        <label htmlFor={id} className="text-sm text-gray-700">{label}</label>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-sm mb-1 text-gray-700">{label}</label>
      {type === 'select' ? (
        <select
          id={id}
          name={name}
          onChange={onChange}
          required={required}
          className="text-sm w-full"
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
          className="text-sm w-full"
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="text-sm w-full"
          {...(type === 'number' ? { min: name === 'down' ? 1 : undefined, max: name === 'down' ? 4 : undefined } : {})}
        />
      )}
    </div>
  );
};