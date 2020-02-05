import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { tap } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ResellerSales } from '../model/resellerSales';
import { PagedResponse } from '../model/pagedResponse';
import { User } from '../model/user';
import { ResellerDashboard } from '../model/resellerDashboard';
import { ResellerSalesService } from '../services/reseller-sales.service';
import { RSDataService } from '../services/reseller-sales.service';
import { ResellerService } from '../services/reseller.service';

@Component({
  selector: 'app-reseller-sales',
  templateUrl: './reseller-sales.component.html',
  styleUrls: ['./reseller-sales.component.css']
})
export class ResellerSalesComponent implements OnInit {

  resellerSales: ResellerSales[];
  resellerId: string = null;
  tableColumns: string[] = ['reseller', 'quantity', 'timeSold'];
  page: number = 0;
  length: number;
  numberOfElements: number;
  addSalesView: boolean = false;
  sale: ResellerSales;

  dataSource = new MatTableDataSource<ResellerSales>();

  resellerSalesForm: FormGroup;
  resellers: User[];

  resellerSalesDashboard: ResellerDashboard[];
  dashboardTableColumns: string[] = ['reseller', 'flaskCapacity', 'leftTeaStock', 'teaSold'];
  dashboardView: boolean = false;
  salesView: boolean = true;

  numberPattern = "[0-9]*";

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private location: Location,
              private fb: FormBuilder,
              private resellerSalesService: ResellerSalesService,
              private resellerService: ResellerService) { }

  ngOnInit() {
    this.getResellerSales();

  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.getResellerSales())
      ).subscribe();
        //this.dataSource.paginator = this.paginator;
  }

  getResellerSales() {
    this.resellerId = null;

      this.resellerSalesService.getResellerSales(this.resellerId, this.paginator.pageIndex).subscribe(
        data => {
          console.log(data);
          this.dataSource.data = data['content'];
          this.paginator.length = data['totalElements'];
          this.paginator.pageSize = data['numberOfElements'];
          //this.dataSource.paginator = this.paginator;
          console.log(`Paginator is  ${this.paginator.length} and size is ${this.paginator.pageSize}`);
        },
        (error) => {
          console.log(error.error.message);
        }
      )

    console.log(`Inside getResellerSales Response is ${this.resellerSales}`);
  }

  loadResellerSales(){
    this.resellerId = null;
    console.log(`Inside getResellerSales Response is ${this.resellerSales}`);
  }

  addSales() : void {
    console.log('Inside addSales()');
    this.sale = new ResellerSales();
    this.addSalesView = true;
    this.prepareFormDetails();
  }

  prepareFormDetails() {
    console.log('Add Sales: Inside prepareFormDetails');
    this.getResellers();
    this.resellerSalesForm = this.fb.group({
      reseller: [this.resellers, Validators.required],
      quantity: [this.sale.quantity, [Validators.required, Validators.pattern(this.numberPattern)]]
    });
  }

  getResellers(){
    this.resellerService.getResellers().
      subscribe(resellers => this.resellers = resellers);
  }

  onSubmit(){
    console.log('Add Sales: onSubmit()');
    let formModel = this.resellerSalesForm.value;
    const saveSales: ResellerSales = {
      resellerId: formModel.reseller,
      quantity: formModel.quantity as string
    };
    this.resellerSalesService.addSales(saveSales).
      subscribe(sale => this.sale = sale);
    this.addSalesView = false;
    this.dashboardView = false;
    this.salesView = true;
    this.getResellerSales();
  }

  cancelForm() {
    console.log('Inside Cancel Form');
    this.addSalesView = false;
    this.resellerSalesForm.reset();
  }

  viewSummary(){
    this.resellerSalesService.getResellerSalesSummary().
    subscribe(resellerSalesDashboard => this.resellerSalesDashboard = resellerSalesDashboard);
    this.dashboardView = true;
    this.salesView = false;
  }

  viewSales(){
    this.getResellerSales();
    this.dashboardView = false;
    this.salesView = true;
  }

  goBack(): void{
    this.location.back();
  }
}
