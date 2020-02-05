import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { User } from '../model/user';
import { Address } from '../model/address';
import { ContactDetails } from '../model/contactDetails';
import { ResellerService } from '../services/reseller.service';

@Component({
  selector: 'app-reseller-details',
  templateUrl: './reseller-details.component.html',
  styleUrls: ['./reseller-details.component.css']
})
export class ResellerDetailsComponent implements OnInit {

  reseller: User;
  newReseller = true;
  showDetails: string;
  resellerForm: FormGroup;
  showSuccessMessage: string;
  view: string;
  errorMsg: string;

  // Patterns - Validation
  textPattern = "[-\\w\\s]*";
  phoneNumberPattern = "[789]\\d{9}\|(0\\d{10})";

  constructor(private resellerService: ResellerService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.showView();
  }

  showView(): void {

    const view = this.route.snapshot.paramMap.get('view');
    this.view = view as string;
    this.reseller = this.resellerService.getter();
    if("details" == view){
      this.showDetails = "true";
    }else{
      this.prepareFormDetails();
      if("edit" == view){
          this.updateFormDetails();
      }
    }
  }

  getResellerDetails(id: string) : void {
    console.log("Reseller Detail");
    console.log(`id is ${id}`);
    this.resellerService.getResellerDetails(id).
      subscribe(reseller => this.reseller = reseller);
  }

  prepareFormDetails() {
    console.log('Reseller component: Inside prepareFormDetails');
    this.resellerForm = this.fb.group({
      name: [this.reseller.name, [Validators.required, Validators.pattern(this.textPattern)]],
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
      endDate: ['']
    });
  }

  updateFormDetails(){
    this.resellerForm.patchValue({
      name: this.reseller.name,
      address: this.reseller.address,
      contactDetails: this.reseller.contactDetails,
      endDate: this.reseller.endDate
    });
  }

  onSubmit() {
    this.errorMsg = "";
    this.reseller = this.prepareSaveReseller();
    if("add" == this.view){
      console.log('Add Reseller');
      this.resellerService.addReseller(this.reseller).
        subscribe(
          reseller => {
            console.log("Add / Edit Reseller: Success");
            this.reseller = reseller;
            this.showSuccessMessage = "true";
            this.showDetails = "true";
            this.resellerForm.reset();
          },
          error => {
            console.log('HttpError', error);
            this.errorMsg = error.error.error.message;
          }
        );
    }
    if("edit" == this.view){
      console.log('Update Reseller');
      this.resellerService.updateReseller(this.reseller).
        subscribe(reseller => {
          this.reseller = reseller;
          this.showSuccessMessage = "true";
          this.showDetails = "true";
          this.resellerForm.reset();
        },
        error => {
          console.log('HttpError', error);
          this.errorMsg = error.error.error.message;
        }
      );
    }
    console.log('Add Reseller: OnSubmit()');

  }

  prepareSaveReseller(): User {
    const formModel = this.resellerForm.value;
  
    const format="yyyy-MM-dd";
    const locale="en-US";
    const formattedDate = formatDate(Date.now(), format, locale);
    console.warn(`Date is ${formattedDate}`);
    const saveReseller: User = {
      id: this.reseller.id,
      name: formModel.name as string,
      address: formModel.address as Address,
      contactDetails: formModel.contactDetails as ContactDetails,
      startDate: formattedDate as string,
      endDate: formModel.endDate as string
    };
    return saveReseller;
  }

  // Getter methods for Validation
  get name(){
    return this.resellerForm.get('name');
  }
  get address(){
    return this.resellerForm.get('address');
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
    return this.resellerForm.get('contactDetails');
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
