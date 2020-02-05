import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';

import { Flask } from '../model/flask';
import { FlaskService } from '../services/flask.service';

@Component({
  selector: 'app-flasks-list',
  templateUrl: './flasks-list.component.html',
  styleUrls: ['./flasks-list.component.css']
})
export class FlasksListComponent implements OnInit {

  flasks: Flask[];
  flask: Flask;
  viewName: string = "list";
  showDeleteSuccessMessage: string;

  tableColumns: string[] = ['name', 'edit', 'delete'];

  dataSource = new MatTableDataSource<Flask>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private flaskService: FlaskService,
    private router: Router,
    private location: Location)  { }

  ngOnInit() {
    this.getFlasks();
  }

  ngAfterViewInit(){
    this.paginator.page.
      pipe(
        tap(() => {
          this.getFlasks();
        })
      ).subscribe();
    this.dataSource.sort = this.sort;
  }

  getFlasks(): void {
    console.warn('Inside getFlasks');
    this.flaskService.getFlasksPaged(this.paginator.pageIndex).
      subscribe(
        data => {
          console.log(data);
          this.flasks = data['content'];
          this.dataSource.data = this.flasks;
          this.paginator.length = data['totalElements'];
          this.paginator.pageSize = data['numberOfElements'];
          console.log(`Paginator is  ${this.paginator.length} and size is ${this.paginator.pageSize}`);
        }
      );
    console.warn(this.flasks);
  }

  getFlasks1(): void {
    console.warn('Inside getFlasks');
    this.flaskService.getFlasks().
      subscribe(flasks => this.flasks = flasks);
    console.warn(this.flasks);
  }

  addFlask(){
    console.log('Inside addFlask()');
    this.flask = new Flask();
    this.flaskService.setter(this.flask);
    this.router.navigate(['/flasks/add']);
  }

  editFlask(flask: Flask){
    console.log('Inside EditFlask()');
    this.flaskService.setter(flask);
    this.router.navigate(['/flasks/edit']);
  }

  deleteFlask(flask: Flask){
    console.log(`Inside deleteFlask with id ${flask.id}`);
    this.flaskService.deleteFlask(flask).
      subscribe(() => this.getFlasks());
    this.showDeleteSuccessMessage = "true";
  }

  getFlaskDetails(flask: Flask): void{
    console.log('Inside Flask Details');
    console.log(`${flask}`);
    this.flaskService.setter(flask);
    this.router.navigate(['/flasks/details']);
  }

  goBack(): void{
    this.location.back();
  }
}
