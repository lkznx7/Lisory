import { api } from "@/lib/api";

export interface StoreSettings {
  storeName: string;
  description: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  seoTitle: string;
  seoDescription: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
}

export const AdminSettingsService = {
  async getSettings(): Promise<StoreSettings | null> {
    try {
      return await api.get<StoreSettings>("/api/admin/settings");
    } catch {
      return null;
    }
  },

  async saveSettings(settings: StoreSettings): Promise<boolean> {
    try {
      await api.put("/api/admin/settings", settings);
      return true;
    } catch {
      return false;
    }
  },

  async getProfile(): Promise<AdminProfile | null> {
    try {
      return await api.get<AdminProfile>("/api/admin/profile");
    } catch {
      return null;
    }
  },

  async saveProfile(profile: AdminProfile): Promise<boolean> {
    try {
      await api.put("/api/admin/profile", profile);
      return true;
    } catch {
      return false;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      await api.put("/api/admin/profile/password", { currentPassword, newPassword });
      return true;
    } catch {
      return false;
    }
  },
};
