import { Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';

import { User } from '../model/user';
import { ResellerService } from '../services/reseller.service';

@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrls: ['./reseller.component.css']
})
export class ResellerComponent implements OnInit {

  resellers: User[];
  showDeleteSuccessMessage: string;
  tableColumns: string[] = ['name', 'edit', 'delete'];

  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private resellerService: ResellerService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
   this.getResellers();
  }

  ngAfterViewInit(){
    this.paginator.page.
      pipe(
        tap(() => {
          this.getResellers();
        })
      ).subscribe();
    this.dataSource.sort = this.sort;
  }

  getResellers() : void {
    console.log('Inside getResellers');
    this.resellerService.getResellersPaged(this.paginator.pageIndex).
      subscribe(
        data => {
          console.log(data);
          this.resellers = data['content'];
          this.dataSource.data = this.resellers;
          this.paginator.length = data['totalElements'];
          this.paginator.pageSize = data['numberOfElements'];
          console.log(`Paginator is  ${this.paginator.length} and size is ${this.paginator.pageSize}`);
        }
      );
  }

  // This returns list of resellers
  getResellers1() : void {
    this.resellerService.getResellers().
      subscribe(resellers => this.resellers = resellers);
  }

  getResellerDetails(reseller: User) {
    console.log('Inside getResellerDetails');
    this.resellerService.setter(reseller);
    this.router.navigate(['/reseller/details']);
  }

  addNewReseller() : void {
    console.log('Inside addNewReseller');
    this.resellerService.setter(new User());
    this.router.navigate(['/reseller/add']);
  }

  editReseller(reseller: User) {
    console.log('Inside editReseller');
    this.resellerService.setter(reseller);
    this.router.navigate(['/reseller/edit']);
  }

  deleteReseller(reseller: User) {
    console.log('Inside delete reseller');
    this.resellerService.deleteReseller(reseller).
      subscribe(() => this.getResellers());
    this.showDeleteSuccessMessage = "true";
  }

  goBack(): void{
    this.location.back();
  }
}
