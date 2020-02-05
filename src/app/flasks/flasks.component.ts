import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Flask } from '../model/flask';
import { FlaskService } from '../services/flask.service';

@Component({
  selector: 'app-flasks',
  templateUrl: './flasks.component.html',
  styleUrls: ['./flasks.component.css']
})
export class FlasksComponent implements OnInit {

  flasks: Flask[];
  flask: Flask;
  viewName: string = "list";
  details: string;
  flaskForm: FormGroup;
  showSuccessMessage: string;

  textPattern = "[-\\w\\s]*";
  numberPattern = "[0-9]*";

  constructor(
    private flaskService: FlaskService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,) { }

  ngOnInit() {
    this.flask = this.flaskService.getter();
    const view = this.route.snapshot.paramMap.get('view');
    this.showView(view as string);
  }

  showView(view: string): void {
    this.viewName = view;
    if("details" == view){
      this.details = "true";
    }else{
      this.prepareFormDetails();
    }
  }

  getFlasks(): void {
    console.warn('Inside getFlasks');
    this.flaskService.getFlasks().
      subscribe(flasks => this.flasks = flasks);
    console.warn(this.flasks);
  }

  getFlaskDetails(id: string): void{
    console.log('Inside Flask Details');
    console.log(`${id}`);
    this.viewName = "details";
    this.flaskService.getFlaskDetails(+id).
      subscribe(flask => this.flask = flask);
    console.log(`Flask is ${this.flask}`);
  }

  addFlask(): void{
    console.log('Add New Flask');
    this.viewName ="add";
  }

  prepareFormDetails() {
    console.log('Inside prepareFormDetails()');
    this.flaskForm = this.fb.group({
      name: [this.flask.name, [Validators.required, Validators.pattern(this.textPattern)]],
      description: [this.flask.description, [Validators.required,  Validators.pattern(this.textPattern)]],
      //capacity: [this.flask.capacity, [Validators.required, Validators.pattern(this.numberPattern)]],
      capacity: [this.flask.capacity],
      teaCupsCapacity: [this.flask.teaCupsCapacity, [Validators.required, Validators.pattern(this.numberPattern)]],
      quantity: [this.flask.quantity, [Validators.required, Validators.pattern(this.numberPattern)]]
    });
  }

  onSubmit() {
    console.log('Inside OnSubmit');
    this.flask = this.prepareFlaskFormSubmit();
    if(this.flask.id == null){
      console.log(`Component: Add Flask ${this.flask}`);
      this.flaskService.addFlask(this.flask).
        subscribe(flask => this.flask = flask);
    }else{
      console.log(`Component: Update Flask ${this.flask}`);
      this.flaskService.updateFlask(this.flask).
        subscribe(flask => this.flask = flask);
    }
    this.details = "true";
    this.showSuccessMessage = "true";
    this.flaskForm.reset();
  }

  prepareFlaskFormSubmit(): Flask {
    let formModel = this.flaskForm.value;
    const saveFlask: Flask = {
      id: this.flask.id,
      name: formModel.name as string,
      description: formModel.description as string,
      capacity: formModel.capacity as string,
      teaCupsCapacity: formModel.teaCupsCapacity as string,
      quantity: formModel.quantity as string
    };
    return saveFlask;
  }

  // Getter methods
  get name(){
    return this.flaskForm.get('name');
  }
  get description() {
    return this.flaskForm.get('description');
  }
  get capacity() {
    return this.flaskForm.get('capacity');
  }
  get teaCupsCapacity() {
    return this.flaskForm.get('teaCupsCapacity');
  }
  get quantity(){
    return this.flaskForm.get('quantity');
  }

  goBack(): void{
    this.location.back();
  }
}
