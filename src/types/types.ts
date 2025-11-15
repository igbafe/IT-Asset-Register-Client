// Authstate types
interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<Result>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  login: (email: string, password: string) => Promise<Result>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
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
  status: LaptopStatus;
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
}

export interface LaptopStore {
  laptops: LaptopDetails[];
  selectedLaptop: LaptopDetails | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLaptops: () => Promise<void>;
  getLaptopBySerial: (serialNumber: string) => Promise<void>;
  addLaptop: (data: Omit<LaptopDetails, "_id">) => Promise<Result>;
  updateLaptop: (
    serialNumber: string,
    updates: Partial<LaptopDetails>
  ) => Promise<void>;
  retireLaptop: (serialNumber: string, retirementNote?: string) => Promise<void>;
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
  updateCurrentUser: (id: string, updates: Partial<IUser>) => Promise<void>;
  returnCurrentUser: (id: string) => Promise<void>;
  getAllUsers: (id: string) => Promise<void>;
}
