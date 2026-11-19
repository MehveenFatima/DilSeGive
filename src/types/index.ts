// Shared data types used across the DilSeGive frontend.

export type UserRole = "donor" | "ngo" | "admin" | "Donor" | "NGO" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  ngoName?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: string;
  ngoName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Proof of expense uploaded by an NGO and scored by the verification step. */
export interface Proof {
  id: string | number;
  image?: string;
  description?: string;
  amount?: number;
  score: number;
  createdAt?: string;
  txHash?: string;
}

export interface CampaignExpense {
  amount: number;
  purpose: string;
  date: string;
}

export interface CampaignUpdate {
  date: string;
  text: string;
}

/**
 * A fundraising campaign. Static sample data uses goalAmount/raisedAmount/ngoName,
 * while the API uses goal/raised/ngo, so both spellings are optional here.
 */
export interface Campaign {
  id: string;
  _id?: string;
  title: string;
  description: string;
  overview?: string;
  ngoName?: string;
  ngo?: string;
  location: string;
  category: string;
  image: string;
  goalAmount?: number;
  raisedAmount?: number;
  goal?: number;
  raised?: number;
  donors?: number;
  updates?: Array<string | CampaignUpdate>;
  proofImages?: string[];
  proofLinks?: string[];
  proofs?: Proof[];
  transparency?: CampaignExpense[];
  isAIVerified?: boolean;
  status?: string;
}
