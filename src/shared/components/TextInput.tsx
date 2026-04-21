import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, id, ...props }: TextInputProps) {
  const htmlFor = id ?? props.name;

  return (
    <label className="field" htmlFor={htmlFor}>
      <span>{label}</span>
      <input id={htmlFor} {...props} />
      {error ? <small role="alert">{error}</small> : null}
    </label>
  );
}
