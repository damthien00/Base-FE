import { AddressService } from './../../../../core/services/address.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { BranchService } from 'src/app/core/services/branch.service';
import { ValidationService } from 'src/app/core/utils/validation.utils';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
    @Output() bracnchCreated = new EventEmitter<any>();
    @Output() loadBranchs = new EventEmitter<any>();
    displayModal: boolean = false;
    optionsTime: any[] = [
        { name: 'Ngày', value: 'day' },
        { name: 'Tháng', value: 'month' },
        { name: 'Năm', value: 'year' },
        { name: 'Quý', value: 'quarter' },
        { name: 'Tuần', value: 'week' },
    ];
    districts: any;
    selectedTime: any;
    createBranchForm: FormGroup;
    keyWord: any = '';
    countries: any[] | undefined;
    selectedDistrict: string | undefined = null;
    filterValue: string | undefined = '';
    wards: any;
    selectedWard: any;
    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        private addressService: AddressService,
        private branchService: BranchService
    ) {
        this.createBranchForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            phoneNumber: [
                null,
                [Validators.required, Validators.pattern(/^\d{10}$/)],
            ],
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                    ),
                ],
            ],
            address: [null, [Validators.required]],
            districtID: [null, [Validators.required]],
            wardID: [null, [Validators.required]],
            isActive: [null],
        });
    }

    validateEmailAsync(
        control: AbstractControl
    ): Promise<{ [key: string]: boolean } | null> {
        return new Promise((resolve) => {
            const emailRegex =
                /^(?=.*[a-zA-Z])[\w.-]*[a-zA-Z][\w.-]*@[a-zA-Z\d-]+(\.[a-zA-Z]{2,4})+$/;
            setTimeout(() => {
                if (control.value && !emailRegex.test(control.value)) {
                    resolve({ invalidEmail: true });
                } else {
                    resolve(null);
                }
            }, 1000); // Giả lập thời gian kiểm tra
        });
    }

    ngOnInit() {
        this.selectedTime = this.optionsTime[0];
        this.loadDistricts();
    }

    loadDistricts() {
        this.addressService.getDistricts(this.keyWord).subscribe((data) => {
            this.districts = data.data;
        });
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

    onDistrictChange(event) {
        const districtId = event.value.id;
        this.addressService.getWards(districtId).subscribe((data) => {
            this.wards = data.data;
        });
    }

    onSubmit() {
        if (this.createBranchForm.valid) {
            const formData = {
                name: this.createBranchForm.value.name,
                phoneNumber: this.createBranchForm.value.phoneNumber,
                email: this.createBranchForm.value.email,
                address: this.createBranchForm.value.address,
                districtID: this.createBranchForm.value.districtID.id,
                districtName: this.createBranchForm.value.districtID.name,
                cityID: this.createBranchForm.value.districtID.cityId,
                cityName: this.createBranchForm.value.districtID.cityName,
                wardID: this.createBranchForm.value.wardID.id,
                wardName: this.createBranchForm.value.wardID.name,
                isActive: this.createBranchForm.value.isActive ? 1 : 0,
            };
            this.branchService.createBranch(formData).subscribe(
                (response) => {
                    this.displayModal = false;
                    this.createBranchForm.reset();
                    this.loadBranchs.emit();
                },
                (error) => {
                    // Xử lý khi lỗi
                    console.error('Error creating branch:', error);
                }
            );
        } else {
        }
    }
}
