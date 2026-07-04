import type { Priority, Status, Sentiment } from '../lib/supabase';

const PRIORITY_STYLE: Record<Priority, string> = {
  low: 'bg-neutral-100 text-neutral-600',
  medium: 'bg-warning-100 text-warning-700',
  high: 'bg-error-100 text-error-700',
  critical: 'bg-error-500 text-white',
};

const STATUS_STYLE: Record<Status, string> = {
  submitted: 'bg-neutral-100 text-neutral-600',
  in_review: 'bg-primary-100 text-primary-700',
  assigned: 'bg-accent-100 text-accent-700',
  in_progress: 'bg-warning-100 text-warning-700',
  resolved: 'bg-success-100 text-success-700',
  rejected: 'bg-error-100 text-error-700',
};

const STATUS_LABEL: Record<Status, string> = {
  submitted: 'Submitted',
  in_review: 'In Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-neutral-400',
  medium: 'bg-warning-500',
  high: 'bg-error-500',
  critical: 'bg-error-600',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`badge ${PRIORITY_STYLE[priority]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[priority]}`} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SentimentTag({ sentiment }: { sentiment: Sentiment }) {
  const map: Record<Sentiment, { label: string; cls: string }> = {
    positive: { label: 'Positive', cls: 'bg-success-50 text-success-600' },
    neutral: { label: 'Neutral', cls: 'bg-neutral-100 text-neutral-500' },
    negative: { label: 'Negative', cls: 'bg-warning-50 text-warning-600' },
    frustrated: { label: 'Frustrated', cls: 'bg-error-50 text-error-600' },
  };
  const s = map[sentiment];
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export { STATUS_LABEL };
