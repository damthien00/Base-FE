import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { ValidationService } from 'src/app/core/utils/validation.utils';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
    @Output() bracnchCreated = new EventEmitter<any>();
    displayModal: boolean = false;
    optionsTime: any[] = [
        { name: 'Ngày', value: 'day' },
        { name: 'Tháng', value: 'month' },
        { name: 'Năm', value: 'year' },
        { name: 'Quý', value: 'quarter' },
        { name: 'Tuần', value: 'week' },
    ];
    selectedTime: any;
    createBranchForm: FormGroup;

    countries: any[] | undefined;
    selectedCountry: string | undefined;
    filterValue: string | undefined = '';
    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService
    ) {
        this.createBranchForm = this.formBuilder.group({
            branch_name: [null, Validators.required],

            phone_number: [null, Validators.required],
            email: [
                null,
                Validators.required,
                ,
                this.validationService.validateEmail,
            ],
            address: [null, Validators.required],
            district: [null, Validators.required],
            ward: [null, Validators.required],
        });
    }

    ngOnInit() {
        this.selectedTime = this.optionsTime[0];
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' },
        ];
    }

    showModalDialog(): void {
        this.displayModal = true;
    }
    resetFunction(options: DropdownFilterOptions) {
        options.reset();
        this.filterValue = '';
    }

    customFilterFunction(event: KeyboardEvent, options: DropdownFilterOptions) {
        options.filter(event);
    }
    onSubmit() {
        if (this.createBranchForm.valid) {
            // Xử lý submit form ở đây...
        }
    }
}
