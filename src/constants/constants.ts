import { LaptopStatus } from "@/types/types";

// Status filter options
export const statusOptions = [
  { value: "all", label: "All Status" },
  { value: LaptopStatus.AVAILABLE, label: "Available" },
  { value: LaptopStatus.ASSIGNED, label: "Assigned" },
  { value: LaptopStatus.RETURNED, label: "Returned" },
  { value: LaptopStatus.RETIRED, label: "Retired" },
];

export const brandOptions = [
  { value: "Dell", label: "Dell" },
  { value: "HP", label: "HP" },
  { value: "Lenovo", label: "Lenovo" },
  { value: "Apple", label: "Apple" },
];

export const ramOptions = [
  { value: "4GB", label: "4GB" },
  { value: "8GB", label: "8GB" },
  { value: "16GB", label: "16GB" },
  { value: "32GB", label: "32GB" },
];

export const romOptions = [
  { value: "128GB", label: "128GB" },
  { value: "256GB", label: "256GB" },
  { value: "512GB", label: "512GB" },
  { value: "1TB", label: "1TB" },
];

export const osOptions = [
  { value: "Windows 10", label: "Windows 10" },
  { value: "Windows 11", label: "Windows 11" },
  { value: "macOS", label: "macOS" },
  { value: "Linux", label: "Linux" },
];

export const departmentOptions = [
  { value: "HR", label: "HR" },
  { value: "Finance", label: "Finance" },
  { value: "IT", label: "IT" },
  { value: "Marketing", label: "Marketing" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Administration", label: "Administration" },
  { value: "Technical", label: "Technical" },
  { value: "Investment", label: "Investment" },
  { value: "Project Management", label: "Project Management" },
];
