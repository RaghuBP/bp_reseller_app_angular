import { User } from './user';

export class ResellerSales {
  id?: number;
  resellerId?: string;
  quantity?: string;
  reseller?: User;
  soldTime?: string;

  constructor(id?: number, resellerId?: string,
              quantity?: string, reseller?: User,
              soldTime?: string){

    this.id = id;
    this.resellerId = resellerId;
    this.quantity = quantity;
    this.reseller = reseller;
    this.soldTime = soldTime;
  }
}
