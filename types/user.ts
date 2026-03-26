export type PublisherRole = "ROLE_USER" | "ROLE_ADMIN";
export type PublisherStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface Publisher {
  id: string;
  email: string;
  name: string;

  role: PublisherRole;
  status: PublisherStatus;
  createdAt: string;
  profileImage?: string;
}
