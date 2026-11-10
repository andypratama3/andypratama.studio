import { facts, type FactId } from "@/content/facts";

export interface FactProps {
  id: FactId | (string & {});
  className?: string;
  fallback?: React.ReactNode;
}

export function Fact({ id, className, fallback = null }: FactProps) {
  const fact = (facts as Record<string, { value: string; status: string }>)[id];

  if (!fact || fact.status === "unverified") {
    return <>{fallback}</>;
  }

  if (className) {
    return <span className={className}>{fact.value}</span>;
  }

  return <>{fact.value}</>;
}
