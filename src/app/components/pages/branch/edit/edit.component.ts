import { OptionsFilterDistrict } from './../../../../core/DTOs/address/optionsFilterDistrict';
import { OptionsFilterBranch } from 'src/app/core/DTOs/branch/optionsFilterBranchs';
import { AddressService } from './../../../../core/services/address.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { DropdownFilterOptions } from 'primeng/dropdown';
import { BranchService } from 'src/app/core/services/branch.service';
import { ValidationService } from 'src/app/core/utils/validation.utils';
import { MessageService } from 'primeng/api';
import { dE } from '@fullcalendar/core/internal-common';
import { catchError, of } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
    providers: [MessageService],
})
export class EditComponent implements OnInit {
    // @Output() bracnchCreated = new EventEmitter<any>();
    @Output() loadBranchs = new EventEmitter<any>();
    displayModal: boolean = false;
    // optionsFilterDistrict = new OptionsFilterDistrict();
    optionsTime: any[] = [
        { name: 'Ngày', value: 'day' },
        { name: 'Tháng', value: 'month' },
        { name: 'Năm', value: 'year' },
        { name: 'Quý', value: 'quarter' },
        { name: 'Tuần', value: 'week' },
    ];
    districts: any;
    filterDistricts: any;
    selectedTime: any;
    updateBranchForm: FormGroup;
    keyWord: any = '';
    countries: any[] | undefined;
    selectedDistrict: string | undefined = null;
    filterValue: string | undefined = '';
    wards: any;
    selectedWard: any;
    branch: any;

    showModalDialog(branch: any): void {
        this.displayModal = true;
        this.branch = branch;
        this.initializeForm();
    }

    initializeForm() {
        this.updateBranchForm = this.formBuilder.group({
            id: [this.branch?.id, [Validators.required]],
            name: [this.branch?.name, [Validators.required]],
            phoneNumber: [
                this.branch?.phoneNumber,
                [Validators.required, Validators.pattern(/^\d{10}$/)],
            ],
            email: [
                this.branch?.email,
                [
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                    ),
                ],
            ],
            address: [this.branch?.address, [Validators.required]],
            isActive: [this.branch?.isActive == 1 ? true : false],
            districtID: [this.branch?.districtID, [Validators.required]],
            wardID: [this.branch?.wardID, [Validators.required]],
        });
        this.setDistrictAndWard();

        // this.loadWards(this.branch.districtID);
        // this.selectedOption.;
    }
    // districts: any[] | undefined;
    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        private addressService: AddressService,
        private branchService: BranchService,
        private messageService: MessageService,
        private toastService: ToastService
    ) {
        console.log(this.branch);
        this.updateBranchForm = this.formBuilder.group({
            id: [null, [Validators.required]],
            name: [null, [Validators.required]],
            phoneNumber: [
                null,
                [Validators.required, Validators.pattern(/^\d{10}$/)],
            ],
            email: [
                null,
                [
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                    ),
                ],
            ],
            address: [null, [Validators.required]],
            isActive: [false],
            districtID: [null, [Validators.required]],
            wardID: [null, [Validators.required]],
        });
    }

    setDistrictAndWard() {
        const selectedDistrict = this.districts.find((district) => {
            // console.log(district);

            return (
                district.id === this.branch.districtID &&
                district.cityId === this.branch.cityID
            );
        });
        this.addressService.getWards(selectedDistrict.id).subscribe((data) => {
            this.wards = data.data;
            const selectedWard = this.wards?.find(
                (ward) => ward.id === this.branch.wardID
            );
            this.updateBranchForm.patchValue({
                // ...this.branch,
                // isActive: [true],
                districtID: selectedDistrict,
                wardID: selectedWard,
            });
        });
    }

    loadWards(districtID: number) {
        this.addressService.getWards(districtID).subscribe((data) => {
            this.wards = data.data;
            this.updateBranchForm.patchValue({
                wardID: null,
            });
        });
    }

    onDistrictChange(event: any) {
        const districtId = event.value?.id;
        if (districtId) {
            this.loadWards(districtId);
        }
    }

    ngOnInit() {
        this.selectedTime = this.optionsTime[0];
        this.loadDistricts();
    }

    searchDistrict(event: AutoCompleteCompleteEvent) {
        this.keyWord = event.query;
        this.filterDistricts1();
    }

    filterDistricts1() {
        this.addressService.getDistricts(this.keyWord).subscribe((data) => {
            this.filterDistricts = data.data.map((item: any) => {
                console.log(item);
                return `${item.cityName}-${item.name}`;
            });
        });
    }

    loadDistricts() {
        this.addressService.getDistricts(this.keyWord).subscribe((data) => {
            this.districts = data.data;
        });
    }

    resetFunction(options: DropdownFilterOptions) {
        options.reset();
        this.filterValue = '';
    }

    customFilterFunction(event: KeyboardEvent, options: DropdownFilterOptions) {
        options.filter(event);
    }

    onSubmit() {
        if (this.updateBranchForm.valid) {
            const formData = {
                id: this.updateBranchForm.value.id,
                name: this.updateBranchForm.value.name,
                phoneNumber: this.updateBranchForm.value.phoneNumber,
                email: this.updateBranchForm.value.email,
                address: this.updateBranchForm.value.address,
                districtID: this.updateBranchForm.value.districtID.id,
                districtName: this.updateBranchForm.value.districtID.name,
                cityID: this.updateBranchForm.value.districtID.cityId,
                cityName: this.updateBranchForm.value.districtID.cityName,
                wardID: this.updateBranchForm.value.wardID.id,
                wardName: this.updateBranchForm.value.wardID.name,
                isActive: this.updateBranchForm.value.isActive ? 1 : 0,
            };
            this.branchService
                .updateBranch(formData)
                .pipe(
                    catchError((error) => {
                        if (error.status === 403) {
                            this.toastService.showError(
                                'Chú ý',
                                'Bạn không có quyền truy cập!'
                            );
                        }
                        return of(null); // Trả về giá trị null để tiếp tục dòng chảy của Observable
                    })
                )
                .subscribe(
                    (response) => {
                        this.displayModal = false;
                        this.updateBranchForm.reset();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Sửa chi nhánh thành công',
                        });
                        this.loadBranchs.emit();
                    },
                    (error) => {
                        // Xử lý khi lỗi
                        console.error('Error creating branch:', error);
                    }
                );
        } else {
            this.updateBranchForm.markAllAsTouched();
        }
    }
}
