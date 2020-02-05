import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

import { Order } from '../model/order';
import { User } from '../model/user';
import { Flask } from '../model/flask';
import { OrderItem } from '../model/orderItem';
import { PatchOrder } from '../model/patchOrder';
import { FlaskService } from '../services/flask.service';
import { OrderService } from '../services/order.service';
import { ResellerService } from '../services/reseller.service';
import { DeliverystaffService } from '../services/deliverystaff.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  order: Order;
  details: string;
  orderForm: FormGroup;
  resellers: User[];
  flasks: Flask[];
  showSuccessMessage: string;
  view: string;
  keys = Object.keys;
  deliveryStaffs: User[];
  isAssignDeliveryStaffView: boolean=false;
  errorMsg: string;
  
  constructor(private location: Location,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private orderService: OrderService,
              private resellerService: ResellerService,
              private flaskService: FlaskService,
              private deliveryService: DeliverystaffService) { }

  ngOnInit() {
    this.order = this.orderService.getter();
    console.log(`Order is ${this.order}`);
    const view = this.route.snapshot.paramMap.get('view');
    console.log(`Param map view is ${view}`);
    this.showView(view as string);
  }

  showView(view: string): void{
    this.view = view;
    if("details" == view){
      this.details = "true";
      this.preProcessOrderItems();
    }else{
      this.prepareFormDetails();
      if("edit" == view){
      this.preProcessOrderDetails();
      console.log('Edit mode');
      console.log(`Selected reseller id is ${this.order.reseller.id}`);
    }else if("assign" == view){
      console.log('Assign mode');
      this.preProcessOrderItems();
      this.assignDeliveryStaff();
    }
    }
  }

  prepareFormDetails(){
    console.log('Order Component: Inside Form details');
    this.getResellers();
    this.getFlasks();
    this.orderForm = this.fb.group({
        reseller: [this.resellers, Validators.required],
        items: this.fb.array([
          this.fb.control('')
        ])
      });

  }
  preProcessOrderDetails(){
    console.log(`Inside preProcessOrderItems: Order is ${this.order}`);
    this.orderForm.patchValue({
      reseller: this.order.reseller.id
    });

    this.updateItemsToForm(this.order.items);
  }

  updateItemsToForm(items: Array<OrderItem>){
    console.log(`Inside updateItemsToForm : Items length is ${items.length}`);
    // Remove the existing formArrays
    this.removeItem(0);
    for(let i=0; i<items.length; i++){
      let item = items[i];
      this.addItem();
      (<FormArray>this.orderForm.controls['items']).at(i).patchValue(item.flaskId);
    }
  }

  getResellers(){
    this.resellerService.getResellers().
      subscribe(resellers => this.resellers = resellers);
  }

  getFlasks(){
    this.flaskService.getFlasks().
      subscribe(flasks => this.flasks = flasks);
  }

  getDeliveryStaffs(){
    this.deliveryService.getDeliveryStaffs().
        subscribe(deliveryStaffs => this.deliveryStaffs = deliveryStaffs);
  }

  // Order details contains only the flask id; we want to display
  // the name instead..hence the logic
  preProcessOrderItems(){
    let items = this.order.items;
    // Iterate the orders and get the flaskname of each order and set to order
    items.map((item: OrderItem) => {
      console.log(`Inside setFlaskNameInOrderItem: ITem is ${item.flaskId}`);
      this.flaskService.getFlaskDetails(+(item.flaskId)).
          subscribe(flask => {
            item.flaskName = flask.name;
            },
            error => {
              console.log('HttpError', error);
              this.errorMsg = error.error.error.message;
          });
    });
  }

  onSubmit(){
    console.log('Inside onSubmit');
    this.errorMsg = "";
    this.prepareOrderFormSubmit();
    if(this.order.id == null){
      console.log(`Component: Add Order ${this.order}`);
      this.orderService.addOrder(this.order).
        subscribe(order => {
          this.order = order;
          this.preProcessOrderItems();
          this.setStatusField();

          //Common to both add and editOrder
          this.details = "true";
          this.showSuccessMessage = "true";
          this.orderForm.reset();
        }, error => {
          console.log('HttpError', error);
          this.errorMsg = error.error.error.message;
        });
    }else{
      console.log(`Component: Update Order ${this.order}`);
      this.orderService.updateOrder(this.order).
          subscribe(order => {
            this.order = order;
            this.preProcessOrderItems();
            this.setStatusField();

            // Common to both add and editOrder
            this.details = "true";
            this.showSuccessMessage = "true";
            this.orderForm.reset();
          }, error => {
            console.log('HttpError', error);
            this.errorMsg = error.error.error.message;
          })
    }

  }

  prepareOrderFormSubmit(){
    let formModel = this.orderForm.value;
    this.order.resellerId = formModel.reseller;
    const formItems = formModel.items as FormArray;
    console.log(`Submit: Items are ${formItems}`);
    let items: OrderItem[] = new Array();
    for(let i=0; i<formItems.length; i++){
      let item = new OrderItem();
      let formItem = formItems[i];
      console.log(`Inside prepareOrderFormSubmit: formItem is ${formItem}`);
      if(null != formItem && "" != formItem){
        item.flaskId = formItems[i];
        items.push(item);
      }
    }
    this.order.items = items;
    console.log(`Input values: ${this.order.resellerId}, ${this.order.items}`);
  }

  // For Form Array
  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.fb.control(''));
  }

  removeItem(i){
    this.items.removeAt(i);
  }

  // Assign the Delivery Staff
  assignDeliveryStaff(){
    console.log('Inside assignDeliveryStaff()');
    this.getDeliveryStaffs();
    this.orderForm = this.fb.group({
        deliveryStaff: [this.deliveryStaffs, Validators.required]
      });
    this.isAssignDeliveryStaffView = true;
  }

  updateDeliveryStaff(){
    console.log('Inside updateDeliveryStaff()');
    let formModel = this.orderForm.value;
    let deliveryStaffId = formModel.deliveryStaff;
    console.log(`Delviery staff id is ${deliveryStaffId}`);
    let patchOrder = new PatchOrder();
    patchOrder.deliveryStaffId = deliveryStaffId;
    this.partialUpdateOrder(patchOrder);
  }

  partialUpdateOrder(patchOrder: PatchOrder){
    this.errorMsg = "";
    console.log(`Component: Partial Update Order ${this.order}, ${patchOrder}`);
    this.orderService.partialUpdateOrder(this.order, patchOrder).
      subscribe(order => {
        this.order = order;
        this.preProcessOrderItems();
        this.setStatusField();
        this.isAssignDeliveryStaffView = false;
        this.details = "true";
      }, error => {
        console.log('HttpError', error);
        this.errorMsg = error.error.error.message;
      });

  }

  /*
    When then delivery staff is null, status is CREATED
    When the delivery staff is not null and deliveredTime is null, status is ASSIGNED
    When the deliveredTime is not null, status is DELIVERED
  */
  setStatusField(){
    if(!this.order.deliveryStaff){
      this.order.status = "CREATED";
    }if(this.order.deliveryStaff &&!this.order.deliveredTime){
      this.order.status = "ASSIGNED";
    }if(this.order.deliveredTime){
      this.order.status = "DELIVERED";
    }
  }

  markAsDelivered(){
    console.log('Order Component: Inside markAsDelivered()');
    let patchOrder = new PatchOrder();
    const format="yyyy-MM-dd'T'HH:MM:ss'Z'";
    const locale="en-US";
    const formattedDate = formatDate(Date.now(), format, locale);
    console.log(`Date is ${formattedDate}`);
    patchOrder.deliveredTime = formattedDate as string;
    this.partialUpdateOrder(patchOrder);
  }

  goBack(): void{
    this.location.back();
  }
}
