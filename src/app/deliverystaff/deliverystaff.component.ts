import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate} from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { User } from '../model/user';
import { Address } from '../model/address';
import { ContactDetails } from '../model/contactDetails';
import { DeliverystaffService } from '../services/deliverystaff.service';

@Component({
  selector: 'app-deliverystaff',
  templateUrl: './deliverystaff.component.html',
  styleUrls: ['./deliverystaff.component.css']
})
export class DeliverystaffComponent implements OnInit {

  deliveryStaffs: User[];
  deliveryStaff: User;
  showDetails: string;
  showSuccessMessage: string;
  deliveryStaffForm: FormGroup;
  view: string;
  errorMsg: string;

  // Patterns - Validation
  textPattern = "[-\\w\\s]*";
  phoneNumberPattern = "([789]\\d{9})|(0\\d{10})";

  constructor(private deliveryStaffService: DeliverystaffService,
              private location: Location,
              private route: ActivatedRoute,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.deliveryStaff = this.deliveryStaffService.getter();
    console.log(`DeliveryStaff is ${this.deliveryStaff}`);
    const view = this.route.snapshot.paramMap.get('view');
    this.showView(view as string);
  }

  showView(view: string): void{
    this.view = view;
    if("details" == view){
      this.showDetails = "true";
    }else{
      this.prepareFormDetails();
      if("edit" == view){
        this.updateFormDetails();
      }
    }
  }

  prepareFormDetails() {
    console.log('Delivery Staff Component: Inside prepareFormDetails');
    this.deliveryStaffForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.textPattern)]],
      address: this.fb.group({
        addressLine1: ['', [Validators.required, Validators.pattern(this.textPattern)]],
        addressLine2: ['', [Validators.required, Validators.pattern(this.textPattern)]],
        buildingNumber: ['', [Validators.required, Validators.pattern(this.textPattern)]],
        city: ['', [Validators.required, Validators.pattern(this.textPattern)]],
        state: ['', [Validators.required, Validators.pattern(this.textPattern)]],
        zipCode: ['', [Validators.required, Validators.pattern("\\d{6}")]]
      }),
      contactDetails: this.fb.group({
        emailAddress: ['', [Validators.required, Validators.email]],
        primaryNumber: ['', [Validators.required, Validators.pattern(this.phoneNumberPattern)]],
        secondaryNumber: ['', [Validators.required, Validators.pattern(this.phoneNumberPattern)]]
      }),
      startDate: [this.deliveryStaff.startDate],
      endDate: [this.deliveryStaff.endDate]
    });
  }

  updateFormDetails(){
    this.deliveryStaffForm.patchValue({
      name: this.deliveryStaff.name,
      address: this.deliveryStaff.address,
      contactDetails: this.deliveryStaff.contactDetails,
      startDate: this.deliveryStaff.startDate,
      endDate: this.deliveryStaff.endDate
    });
  }

  onSubmit() {
    this.deliveryStaff = this.prepareSaveDeliveryStaff();
    if("edit" == this.view){
      console.log('Update Delivery Staff');
      this.deliveryStaffService.updateDeliveryStaff(this.deliveryStaff).
        subscribe(
          deliveryStaff => {
            this.deliveryStaff = deliveryStaff;
            this.showDetails = "true";
            this.showSuccessMessage = "true";
            this.deliveryStaffForm.reset();
        }, error => {
          console.log('HttpError', error);
          this.errorMsg = error.error.error.message;
        });
    }
    if("add" == this.view){
      console.log('Add Delivery Staff');
      this.deliveryStaffService.addDeliveryStaff(this.deliveryStaff).
        subscribe(
          deliveryStaff => {
            this.deliveryStaff = deliveryStaff;
            this.showDetails = "true";
            this.showSuccessMessage = "true";
            this.deliveryStaffForm.reset();
        }, error => {
          console.log('HttpError', error);
          this.errorMsg = error.error.error.message;
        });
    }

  }

  prepareSaveDeliveryStaff(): User {
    const formModel = this.deliveryStaffForm.value;
    const format="yyyy-MM-dd";
    const locale="en-US";
    const formattedDate = formatDate(Date.now(), format, locale);
    const saveDeliveryStaff: User = {
      id: this.deliveryStaff.id,
      name: formModel.name as string,
      address: formModel.address as Address,
      contactDetails: formModel.contactDetails as ContactDetails,
      startDate: formattedDate as string,
      endDate: formModel.endDate as string
    };
    return saveDeliveryStaff;
  }
  // Getter methods for Validation
  get name(){
    return this.deliveryStaffForm.get('name');
  }
  get address(){
    return this.deliveryStaffForm.get('address');
  }
  get line1(){
    return this.address.get('addressLine1');
  }
  get line2(){
    return this.address.get('addressLine2');
  }
  get buildingNumber(){
    return this.address.get('buildingNumber');
  }
  get city(){
    return this.address.get('city');
  }
  get state(){
    return this.address.get('state');
  }
  get zipCode(){
    return this.address.get('zipCode');
  }
  get contactDetails(){
    return this.deliveryStaffForm.get('contactDetails');
  }
  get email(){
    return this.contactDetails.get('emailAddress');
  }
  get primary(){
    return this.contactDetails.get('primaryNumber');
  }
  get secondary(){
    return this.contactDetails.get('secondaryNumber');
  }

  goBack(): void{
    this.location.back();
  }
}
