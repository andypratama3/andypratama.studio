import { facts, type FactId } from "@/content/facts";

export interface FactProps {
  id: FactId;
  className?: string;
  fallback?: React.ReactNode;
}

export function Fact({ id, className, fallback = null }: FactProps) {
  const fact = facts[id];

  if (!fact || fact.status === "unverified" || !fact.value) {
    return <>{fallback}</>;
  }

  if (className) {
    return <span className={className}>{fact.value}</span>;
  }

  return <>{fact.value}</>;
}
