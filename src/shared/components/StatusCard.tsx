interface StatusCardProps {
  title: string;
  body: string;
  tone?: "neutral" | "success" | "warning";
}

export function StatusCard({ title, body, tone = "neutral" }: StatusCardProps) {
  return (
    <article className={`status-card status-${tone}`}>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}
