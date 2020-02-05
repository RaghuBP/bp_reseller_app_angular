import { User } from './user';
import { OrderItem } from './orderItem';

export class Order{
  id: number;
  resellerId: string;
  reseller: User;
  deliveryStaff: User;
  orderTime: string;
  deliveredTime: string;
  items: OrderItem[];
  status: string;
}
