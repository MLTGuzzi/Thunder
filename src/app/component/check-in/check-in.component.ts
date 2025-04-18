import { ChangeDetectionStrategy, Component, effect, Inject, inject, Input, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQueryResult, injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom, takeUntil } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormsService } from '../../services/forms.service';
import { Subject } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Aircraft, AircraftService } from '../../services/aircraft.service';

/*****************************************************
 * Left off here.  This component should get airplane data from the Aircraft service
 * and if it is not found, get it from ARLA.  
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'check-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyMaterialModule, FlexLayoutModule],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  @Input() onSubmitCallback: (model: Aircraft | null) => void = () => {};

  private destroy$ = new Subject<void>(); // Signal for cleanup
  form = new FormGroup({});
  model: Aircraft = { 
    id: '',
    tailNumber: '', 
    make: '', 
    model: '', 
    year: '', 
    serialNumber: '', 
    owners: [],
    workOrders: []
  };
  fields: FormlyFieldConfig[] = [] // Initial value for fields 
  aircraftQuery: CreateQueryResult<Aircraft | null, Error> | null = null;

  constructor(
      private formsService: FormsService,
      private aircraftService: AircraftService
    ) {

    // Initialize the form fields from the API
    this.fields = this.formsService.getCheckinForm() || [];

    // Subscribe to the query result and update the form model when data is available
    effect(() => {
      // ToDo - Map the response to the model
      this.form.reset(this.model);
    });

  }

  ngOnInit(): void {

    this.formsService.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event === 'searchButtonClicked') {
          // ToDo - Double check to see what makes a valid tail number.  Can it be
          // less than 3 characters?
          if(this.model.tailNumber && this.model.tailNumber.length > 3) {
          this.onSearchClick();
          }
        }
      });
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions and resources
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(model: any) {
    this.onSubmitCallback(this.model); // Call the callback with the model
    this.form.reset({});
  }

  onSearchClick(): void {
    const tailNumber = this.model.tailNumber?.toUpperCase() || '';

    this.aircraftService.getByTailNumberOrArla(tailNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe((aircraft) => {
        if (aircraft) {
          this.model = aircraft;
          this.form.reset(this.model);
        } else {
          console.error('Aircraft not found');
        }
      }
    );
  }

  onCancel(): void {
    this.form.reset({});
    this.onSubmitCallback(null); // Call the callback with the model
  }

}
