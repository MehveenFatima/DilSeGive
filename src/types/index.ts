// Shared data types used across the DilSeGive frontend.

export interface User {
  id: string;
  name: string;
  email: string;
  /** donor, ngo or admin (case varies between demo data and the API) */
  role: string;
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
  /** Overall verification result: Verified, Suspicious or Fraud Risk */
  verificationStatus?: string;
  verification?: { status?: string };
  status?: string;
}
