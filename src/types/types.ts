// Authstate types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  checkAuth: () => Promise<boolean>;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: () => boolean;
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
  purchaseDate: Date;
  endOfLifeDate?: Date;
  decommissionDate?: Date;
  decommissionNote?: string;
}

export interface LaptopUser {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  assignedDate: Date;
  returnedDate?: Date;
}

export enum LaptopStatus {
  AVAILABLE = "available", // Just added, not assigned yet
  ASSIGNED = "assigned", // Currently assigned to someone
  RETURNED = "returned", // Assignment is over, back in inventory
  DECOMMISSIONED = "decommissioned", // End of life, out of service
}

interface Result {
  success: boolean;
  message?: string;
  error?: string;
}

interface LaptopResponse {
  success: boolean;
  data?: LaptopQRCode | null;
  message?: string;
  error?: string;
}

export interface RecentActivity {
  _id: string;
  serialNumber: string;
  firstName: string;
  lastName: string;
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
    updates: Partial<LaptopDetails>,
  ) => Promise<Result>;
  retireLaptop: (
    serialNumber: string,
    retirementNote?: string,
  ) => Promise<Result>;
  getRecentActivities: () => RecentActivity[];
  setSelectedLaptop: (laptop: LaptopDetails | null) => void;
}

// Assignment types
interface IUser {
  firstName: string;
  lastName: string;
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
    firstName: string;
    lastName: string;
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
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    assignedDate: string;
  } | null;
  previousUser: {
    firstName: string;
    lastName: string;
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
  purchaseDate: Date;
  endOfLifeDate?: Date;
  decommissionDate?: Date;
  decommissionNote?: string;
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
  modalQRCode: LaptopQRCode | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchAllQRCodes: () => Promise<Result>;
  fetchQRCodeBySerial: (serialNumber: string) => Promise<LaptopResponse>;
  fetchModalQRCode: (serialNumber: string) => Promise<Result>;
  downloadQRCode: (serialNumber: string) => Promise<void>;
  clearError: () => void;
  setSelectedQRCode: (qrCode: LaptopQRCode | null) => void;
  resetSelectedQRCode: () => void;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Brand {
  _id?: string;
  brandName: string;
  models: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandState {
  brand: Brand[];
  loading: boolean;
  error: string | null;
  selectedBrand: Brand | null;

  createBrand: (brandName: string, models: string[]) => Promise<Result>;
  fetchBrands: () => Promise<Result>;
  fetchModelsByBrand: (brandName: string) => Promise<Result>;
  addModelToBrand: (brandName: string, model: string) => Promise<Result>;
  updateBrand: (brandName: string, newBrandName: string) => Promise<Result>;
  updateModelInBrand: (
    brandName: string,
    model: string,
    newModel: string,
  ) => Promise<Result>;
  removeModelFromBrand: (brandName: string, model: string) => Promise<Result>;
  deleteBrand: (brandName: string) => Promise<Result>;
  setBrand: (brands: Brand[]) => void;
}
