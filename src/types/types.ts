// Authstate types
interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;

  picture?: string;
  googleId?: string;
  authProvider?: "local" | "google" | "both";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<Result>;
  login: (email: string, password: string) => Promise<Result>;
  logout: () => void;

  loginWithGoogle: () => void;
  setTokenFromOAuth: (token: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  unlinkGoogle: () => Promise<Result>;
}

// laptop details
export interface LaptopDetails {
  currentUser?: LaptopUser | null;
  previousUser?: LaptopUser[];
  _id?: string;
  systemName: string;
  brand: string;
  model: string;
  serialNumber: string;
  ram: string;
  rom: string;
  os: string;
  status?: LaptopStatus;
  createdAt?: string;
  updatedAt?: string;
  retirementDate?: Date;
  retirementNote?: string;
}

export interface LaptopUser {
  fullName: string;
  email: string;
  department: string;
  assignedDate: Date;
  returnedDate?: Date;
}

export enum LaptopStatus {
  AVAILABLE = "available", // Just added, not assigned yet
  ASSIGNED = "assigned", // Currently assigned to someone
  RETURNED = "returned", // Assignment is over, back in inventory
  RETIRED = "retired", // End of life, out of service
}

interface Result {
  success: boolean;
  message?: string;
  error?: string;
}

export interface RecentActivity {
  _id: string;
  serialNumber: string;
  fullName: string;
  department: string;
  status: "current" | "previous";
  assignedDate: Date;
  returnedDate?: Date;
  laptopStatus: LaptopStatus;
}

export interface LaptopStore {
  laptops: LaptopDetails[];
  selectedLaptop: LaptopDetails | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLaptops: () => Promise<Result>;
  getLaptopBySerial: (serialNumber: string) => Promise<Result>;
  addLaptop: (data: Omit<LaptopDetails, "_id">) => Promise<Result>;
  updateLaptop: (
    serialNumber: string,
    updates: Partial<LaptopDetails>
  ) => Promise<Result>;
  retireLaptop: (
    serialNumber: string,
    retirementNote?: string
  ) => Promise<Result>;
  getRecentActivities: () => RecentActivity[];
  setSelectedLaptop: (laptop: LaptopDetails | null) => void;
}

// Assignment types
interface IUser {
  fullName: string;
  email: string;
  department: string;
  assignedDate?: string;
  returnedDate?: string;
}

interface ILaptop {
  _id: string;
  systemName: string;
  serialNumber: string;
  status: string;
  currentUser?: IUser | null;
  previousUser?: IUser[];
}

export interface AssignmentState {
  laptop: ILaptop | null;
  loading: boolean;
  error: string | null;
  assignLaptop: (id: string, user: IUser) => Promise<Result>;
  reassignLaptop: (id: string, user: IUser) => Promise<Result>;
  updateCurrentUser: (id: string, updates: Partial<IUser>) => Promise<Result>;
  returnCurrentUser: (id: string) => Promise<Result>;
  getAllUsers: (id: string) => Promise<Result>;
}

export interface Assignment {
  _id: string;
  systemName: string;
  serialNumber: string;
  currentUser: {
    fullName: string;
    email: string;
    department: string;
    assignedDate: string;
  } | null;
}

export interface AssignmentDetails {
  _id: string;
  systemName: string;
  serialNumber: string;
  currentUser: {
    fullName: string;
    email: string;
    department: string;
    assignedDate: string;
  } | null;
  previousUser: {
    fullName: string;
    email: string;
    department: string;
    assignedDate: string;
    returnedDate: string;
  }[];
}

// QR Code types
export interface LaptopQRCode {
  laptopId: string;
  serialNumber: string;
  systemName: string;
  brand: string;
  model: string;
  ram: string;
  rom: string;
  os: string;
  status: string;
  currentUser?: LaptopUser | null;
  previousUser?: LaptopUser[];
  retirementDate?: string;
  retirementNote?: string;
  createdAt: string;
  updatedAt: string;
  scanUrl: string;
  qrCode: string;
}

export interface QRCodeResponse {
  success: boolean;
  serialNumber?: string;
  scanUrl?: string;
  qrCode?: string;
  count?: number;
  data?: LaptopQRCode[];
  message?: string;
}

export interface SingleQRCodeResponse {
  success: boolean;
  data?: LaptopQRCode;
  message?: string;
}

export interface LaptopQRState {
  // State
  qrCodes: LaptopQRCode[];
  selectedQRCode: LaptopQRCode | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchAllQRCodes: () => Promise<Result>;
  fetchQRCodeBySerial: (serialNumber: string) => Promise<Result>;
  downloadQRCode: (serialNumber: string) => Promise<void>;
  clearError: () => void;
  setSelectedQRCode: (qrCode: LaptopQRCode | null) => void;
}
