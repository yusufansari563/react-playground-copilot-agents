import { useMemo } from "react";
import { useParams } from "react-router-dom";

const descriptions: Record<string, string> = {
  usestate: "Stores local component state and triggers rerenders on update.",
  useeffect:
    "Runs side effects in response to render lifecycle and dependencies.",
  usememo: "Memoizes expensive computed values based on dependencies.",
  usecallback:
    "Memoizes function references to avoid unnecessary downstream renders.",
};

export function HookDetailPage() {
  const { hookName = "unknown" } = useParams();
  const description = useMemo(
    () =>
      descriptions[hookName.toLowerCase()] ??
      "No description yet. Add one as you learn this hook.",
    [hookName],
  );

  return (
    <section className="page">
      <h1>Hook: {hookName}</h1>
      <p className="panel">{description}</p>
    </section>
  );
}
