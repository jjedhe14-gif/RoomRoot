import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BadgeCheck,
  Ban,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flag,
  Mail,
  MessagesSquare,
  PencilLine,
  PlusCircle,
  Shield,
  ShieldCheck,
  ToggleRight,
  Trash2,
  UserCog,
  UserPlus,
  Wrench,
} from 'lucide-react';
import type { Tone } from './status';

export interface ActionMeta {
  icon: LucideIcon;
  tone: Tone;
  /** Short caption used by the activity timeline. */
  caption: string;
}

const ACTION_META: Record<string, ActionMeta> = {
  USER_REGISTERED: { icon: UserPlus, tone: 'green', caption: 'New account' },
  USER_VERIFIED: { icon: BadgeCheck, tone: 'teal', caption: 'Email verified' },
  USER_STATUS_CHANGED: { icon: UserCog, tone: 'amber', caption: 'Account status changed' },
  USER_PROFILE_UPDATED: { icon: PencilLine, tone: 'slate', caption: 'Profile updated' },
  ADMIN_ACTION: { icon: Shield, tone: 'violet', caption: 'Admin action' },
  OTP_REQUESTED: { icon: Mail, tone: 'blue', caption: 'Code requested' },
  OTP_VERIFIED: { icon: ShieldCheck, tone: 'green', caption: 'Code verified' },
  LISTING_CREATED: { icon: PlusCircle, tone: 'blue', caption: 'Listing created' },
  LISTING_UPDATED: { icon: PencilLine, tone: 'slate', caption: 'Listing updated' },
  LISTING_STATUS_CHANGED: { icon: ToggleRight, tone: 'amber', caption: 'Listing moderated' },
  LISTING_DELETED: { icon: Trash2, tone: 'red', caption: 'Listing deleted' },
  APPLICATION_CREATED: { icon: ClipboardList, tone: 'teal', caption: 'Application submitted' },
  APPLICATION_STATUS_CHANGED: { icon: CheckCircle2, tone: 'green', caption: 'Application updated' },
  REPORT_CREATED: { icon: Flag, tone: 'amber', caption: 'Report filed' },
  REPORT_STATUS_CHANGED: { icon: ShieldCheck, tone: 'violet', caption: 'Report moderated' },
  CONVERSATION_CREATED: { icon: MessagesSquare, tone: 'blue', caption: 'Conversation started' },
  SERVICE_REQUEST_CREATED: { icon: Wrench, tone: 'amber', caption: 'Service requested' },
  SERVICE_REQUEST_STATUS_CHANGED: { icon: ToggleRight, tone: 'amber', caption: 'Service request updated' },
};

export function actionMeta(action?: string | null): ActionMeta {
  if (action) {
    const match = ACTION_META[action.toUpperCase()];
    if (match) return match;
  }
  return { icon: Activity, tone: 'slate', caption: 'Platform event' };
}

/** Chip tone used on filter dropdowns / summaries. */
export function actionLabel(action?: string | null): string {
  if (!action) return '—';
  return action
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// Re-export icon used by "suspended" semantics in tables for convenience.
export const SuspendedIcon = Ban;
export const DetailIcon = FileText;
