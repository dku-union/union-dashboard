export type PublisherStatus = "active" | "suspended" | "pending";

export interface Publisher {
  id: string;
  email: string;
  name: string;
  organization: string;
  status: PublisherStatus;
  createdAt: string;
  profileImage?: string;
}
