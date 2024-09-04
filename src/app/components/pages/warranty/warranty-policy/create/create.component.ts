import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
    @Output() warrantyPolicyCreated = new EventEmitter<any>();
    displayModal: boolean = false;
    optionsTime: any[] = [
        { name: 'Ngày', value: 'day' },
        { name: 'Tháng', value: 'month' },
        { name: 'Năm', value: 'year' },
        { name: 'Quý', value: 'quarter' },
        { name: 'Tuần', value: 'week' },
    ];
    selectedTime: any;
    createWarrantyPolicyForm: FormGroup;
    constructor(private formBuilder: FormBuilder) {
        this.createWarrantyPolicyForm = this.formBuilder.group({
            name: [null, Validators.required],
            warranty_period: [null, Validators.required],
            typeTime: '',
        });
    }

    ngOnInit() {
        this.selectedTime = this.optionsTime[0];
    }

    showModalDialog(): void {
        this.displayModal = true;
    }
}
