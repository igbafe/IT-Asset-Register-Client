import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value?: string | ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;

  return (
    <div className="flex justify-between border-b py-2 text-sm">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium text-gray-400">{value}</span>
    </div>
  );
}
