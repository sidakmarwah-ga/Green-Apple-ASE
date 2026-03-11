export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  CANCELLED = "Cancelled",
  COMPLETE = "Complete",
  FAILED = "Failed",
  RETURNED = "Returned"
}

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];