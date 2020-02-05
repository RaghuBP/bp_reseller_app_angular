import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';

import { User } from '../model/user';
import { DeliverystaffService } from '../services/deliverystaff.service';

@Component({
  selector: 'app-deliverystaff-list',
  templateUrl: './deliverystaff-list.component.html',
  styleUrls: ['./deliverystaff-list.component.css']
})
export class DeliverystaffListComponent implements OnInit {

  deliveryStaffs: User[];
  deliveryStaff: User;
  showDeleteSuccessMessage: string;

  tableColumns: string[] = ['name', 'edit', 'delete'];

  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private deliverystaffService: DeliverystaffService,
              private location: Location,
              private router: Router) { }

  ngOnInit() {
    this.getDeliveryStaffs();
  }

  ngAfterViewInit(){
    this.paginator.page.
      pipe(
        tap(() => {
          this.getDeliveryStaffs();
        })
      ).subscribe();
    this.dataSource.sort = this.sort;
  }

  getDeliveryStaffs(): void {
    console.log('Get Delivery staffs');
    this.deliverystaffService.getDeliveryStaffsPaged(this.paginator.pageIndex).
      subscribe(
        data => {
          console.log(data);
          this.deliveryStaffs = data['content'];
          this.dataSource.data = this.deliveryStaffs;
          this.paginator.length = data['totalElements'];
          this.paginator.pageSize = data['numberOfElements'];
          console.log(`Paginator is  ${this.paginator.length} and size is ${this.paginator.pageSize}`);
        }
      );
      console.log(this.deliveryStaffs);
  }

  getDeliveryStaffs1(): void {
    console.log('Get Delivery staffs');
    this.deliverystaffService.getDeliveryStaffs().
      subscribe(deliveryStaffs => this.deliveryStaffs = deliveryStaffs);
      console.log(this.deliveryStaffs);
  }

  getDeliveryStaffDetails(deliveryStaff: User): void{
    console.log(`Inside getDeliveryStaffDetails ${deliveryStaff}`);
    this.deliverystaffService.setter(deliveryStaff);
    this.router.navigate(['deliverystaffs/details']);
  }

  addDeliveryStaff() {
    console.log('Inside addDeliveryStaff');
    this.deliveryStaff = new User();
    this.deliverystaffService.setter(this.deliveryStaff);
    this.router.navigate(['deliverystaffs/add']);
  }

  editDeliveryStaff(deliveryStaff: User) {
    console.log(`Inside editDeliveryStaff ${deliveryStaff}`);
    this.deliverystaffService.setter(deliveryStaff);
    this.router.navigate(['deliverystaffs/edit']);
  }

  deleteDeliveryStaff(deliveryStaff: User){
    console.log(`Inside deleteDeliveryStaff ${deliveryStaff}`);
    this.deliverystaffService.deleteDeliveryStaff(deliveryStaff).
      subscribe();
    this.showDeleteSuccessMessage = "true";
    this.getDeliveryStaffs();
  }

  goBack(): void{
    this.location.back();
  }

}
