export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';
export type OrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface Order {
  _id?: string;
  orderNumber: string;
  measurementId: any;
  status: OrderStatus;
  priority: OrderPriority;
  orderDate: Date | string;
  expectedDeliveryDate: Date | string;
  assignedTailor?: string;
  fabricProvided: boolean;
  fabricDetails?: string;
  specialInstructions?: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export const ORDER_STATUSES: { key: OrderStatus; value: string; severity: 'contrast' | 'secondary' | 'info' | 'warn' | 'success' | 'danger' }[] = [
  { key: 'PENDING', value: 'Pending', severity: 'warn' },
  { key: 'IN_PROGRESS', value: 'In Progress', severity: 'info' },
  { key: 'COMPLETED', value: 'Completed', severity: 'contrast' },
  { key: 'DELIVERED', value: 'Delivered', severity: 'success' },
  { key: 'CANCELLED', value: 'Cancelled', severity: 'danger' },
];

export const ORDER_PRIORITIES: { key: OrderPriority; value: string; severity: 'contrast' | 'secondary' | 'info' | 'warn' | 'success' | 'danger' }[] = [
  { key: 'LOW', value: 'Low', severity: 'secondary' },
  { key: 'NORMAL', value: 'Normal', severity: 'info' },
  { key: 'HIGH', value: 'High', severity: 'warn' },
  { key: 'URGENT', value: 'Urgent', severity: 'danger' },
];

export function getStatusStyle(status: string): { [key: string]: string } {
  const styles: Record<string, { [key: string]: string }> = {
    PENDING: { backgroundColor: '#FEF3C7', color: '#92400E' },       // Amber / Orange
    IN_PROGRESS: { backgroundColor: '#E0F2FE', color: '#075985' },   // Sky Blue
    COMPLETED: { backgroundColor: '#D1FAE5', color: '#065F46' },     // Emerald Green
    DELIVERED: { backgroundColor: '#F1F5F9', color: '#334155' },     // Slate Grey
    CANCELLED: { backgroundColor: '#FEE2E2', color: '#991B1B' },     // Red
  };
  return styles[status] || { backgroundColor: '#F1F5F9', color: '#334155' };
}
