export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  viewAllLink?: string;
}

export interface EmployeeStatus {
  label: string;
  count: number;
  color: string;
  percentage: number;
}