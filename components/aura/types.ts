export type ScreenId = 'onboarding' | 'home' | 'voice' | 'profile';

export type ThemeMode = 'light' | 'dark';

export type ViewMode = 'interactive' | 'showcase';

export interface VitalsItem {
  id: string;
  time: string;
  title: string;
  status: 'done' | 'pending' | 'in-progress';
  tag?: string;
  color: string;
}

export interface ProtocolCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'heart-pulse' | 'activity' | 'pill' | 'moon';
  badgeBg: string;
  badgeTextColor: string;
}

export interface UserHealthProfile {
  name: string;
  avatarUrl: string;
  memberId: string;
  bloodType: string;
  allergies: string;
  bioAge: number;
  chronologicalAge: number;
  healthScore: number;
  streakDays: number;
  restingHr: number;
  sleepScore: number;
  glucoseLevel: number;
}
