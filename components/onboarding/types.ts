export interface OnboardingData {
  fullName: string;
  email: string;
  password?: string;
  roles: string[];
  wilaya: string;
  experience: string;
  bio: string;
  avatarUrl: string;
  avatarFileName?: string;
  avatarFile?: File;
  selectedPlan?: string;
  equipment?: string[];
}
