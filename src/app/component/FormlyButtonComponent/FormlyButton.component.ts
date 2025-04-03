import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'formly-button',
  templateUrl: './FormlyButton.component.html',
  styleUrls: ['./FormlyButton.component.css'], // Optional: Add styles
})
export class FormlyButtonComponent extends FieldType<FieldTypeConfig> {

  // Optional: Add any additional properties or methods you need for your button component
  constructor(private formsService: FormsService) {
    super();
  }

  onClick() {
    if(this.field && this.field.key) {
      this.formsService.publishEvent((this.field.key as string) + 'Clicked');
    }
  }
}