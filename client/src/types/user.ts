export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  photo_url: string | null;
  created_at: string;
}
