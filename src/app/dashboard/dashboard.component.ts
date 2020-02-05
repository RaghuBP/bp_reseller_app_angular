import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { ResellerService } from '../services/reseller.service';
import { DeliverystaffService } from '../services/deliverystaff.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: User[];

  constructor(
    private resellerService: ResellerService,
    private deliverystaffService: DeliverystaffService
  ) { }

  ngOnInit() {
  }

  getResellers(): void {
    console.log('Get Resellers');
    this.resellerService.getResellers().
      subscribe(users => this.users = users);
      console.log(this.users);
  }

  getDeliveryStaffs(): void {
    console.log('Get Delivery staffs');
    this.deliverystaffService.getDeliveryStaffs().
      subscribe(users => this.users = users);
      console.log(this.users);
  }
}
