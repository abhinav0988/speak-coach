"use client";

import { type InputHTMLAttributes, useId } from "react";
import { CheckCircle2, type LucideIcon, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthPremiumInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
  label: string;
  icon: LucideIcon;
  state?: "default" | "success" | "error";
};

export function AuthPremiumInput({
  label,
  icon: Icon,
  state = "default",
  className,
  id: idProp,
  ...props
}: AuthPremiumInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  const hasValue = props.value !== undefined && props.value !== null && String(props.value).length > 0;

  return (
    <div className="auth-input-wrap">
      <Icon className="auth-input-icon h-5 w-5" aria-hidden />
      <input
        id={id}
        className={cn(
          "auth-input",
          state === "error" && "auth-input-error",
          state === "success" && hasValue && "auth-input-success",
          className
        )}
        placeholder=" "
        aria-invalid={state === "error"}
        {...props}
      />
      <label htmlFor={id} className="auth-input-label">
        {label}
      </label>
      {state === "success" && hasValue && (
        <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#22C55E]" aria-hidden />
      )}
      {state === "error" && (
        <XCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#EF4444]" aria-hidden />
      )}
    </div>
  );
}
