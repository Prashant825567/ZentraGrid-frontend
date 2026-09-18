/**
 * Formatting helpers for ZentraGrid storage metrics and timestamps
 */

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i < 0) return '0 B';
  const idx = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, idx)).toFixed(dm))} ${sizes[idx]}`;
}

export function formatRelativeTime(
  dateStr: string | null | undefined
): { relative: string; full: string } {
  if (!dateStr) {
    return {
      relative: 'Never',
      full: 'Never used',
    };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return {
      relative: 'Never',
      full: 'Invalid date',
    };
  }

  const full = date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const now = Date.now();
  const diffMs = now - date.getTime();

  if (diffMs < 0) {
    return { relative: 'Just now', full };
  }

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 45) return { relative: 'Just now', full };

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return { relative: `${minutes}m ago`, full };

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { relative: `${hours}h ago`, full };

  const days = Math.floor(hours / 24);
  if (days < 30) return { relative: `${days}d ago`, full };

  const months = Math.floor(days / 30);
  if (months < 12) return { relative: `${months}mo ago`, full };

  const years = Math.floor(months / 12);
  return { relative: `${years}y ago`, full };
}

export function getQuotaColor(percent: number): {
  badgeClass: string;
  barClass: string;
} {
  if (percent >= 90) {
    return {
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      barClass: 'bg-rose-500',
    };
  }
  if (percent >= 70) {
    return {
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      barClass: 'bg-amber-400',
    };
  }
  return {
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    barClass: 'bg-gradient-to-r from-emerald-500 to-[#FF4FD8]',
  };
}
