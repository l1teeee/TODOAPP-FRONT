export interface Profile {
  id: string;
  email: string;
  displayName: string | null;
  timezone: string;
  emailNotifications: boolean;
}
