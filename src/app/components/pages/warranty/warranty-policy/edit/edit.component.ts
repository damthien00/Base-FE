import { WarrantyPolicyService } from './../../../../../core/services/warranty-policy.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
    providers: [MessageService],
})
export class EditComponent implements OnInit {
    @Output() warrantyPolicyCreated = new EventEmitter<any>();
    @Output() loadWarrantyPolicies = new EventEmitter<any>();
    displayModal: boolean = false;
    warrantyPolicy: any;
    optionsTime: any[] = [
        { name: 'Ngày', value: 1 },
        { name: 'Tuần', value: 2 },
        { name: 'Tháng', value: 3 },
        { name: 'Quý', value: 4 },
        { name: 'Năm', value: 5 },
    ];
    selectedTime: any;
    updateWarrantyPolicyForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private warrantyPolicyService: WarrantyPolicyService,
        private messageService: MessageService
    ) {
        this.updateWarrantyPolicyForm = this.formBuilder.group({
            name: [null, Validators.required],
            term: [
                null,
                [Validators.required, Validators.min(0)], // Sửa tại đây
            ],
            termType: [this.optionsTime[0]],
        });
    }

    nonNegativeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            // Kiểm tra nếu giá trị là một số và nhỏ hơn 0
            return typeof value === 'number' && value < 0
                ? { negative: true } // Trả về lỗi nếu số âm
                : null; // Trả về null nếu hợp lệ
        };
    }
    initializeForm() {
        this.updateWarrantyPolicyForm = this.formBuilder.group({
            id: [this.warrantyPolicy?.id, [Validators.required]],
            name: [this.warrantyPolicy?.name, Validators.required],
            term: [this.warrantyPolicy?.term, Validators.required],
            termType: [this.warrantyPolicy?.termType],
        });
        this.setTermType();
    }

    setTermType() {
        const selectedTermType = this.optionsTime.find((termType) => {
            return termType.value === this.warrantyPolicy.termType;
        });

        this.updateWarrantyPolicyForm.patchValue({
            ...this.warrantyPolicy,
            termType: selectedTermType,
        });
    }

    ngOnInit() {
        this.selectedTime = this.optionsTime[0];
    }

    showModalDialog(warrantyPolicy): void {
        this.warrantyPolicy = warrantyPolicy;
        this.displayModal = true;
        this.initializeForm();
    }

    onSubmit() {
        console.log(1);
        console.log(this.updateWarrantyPolicyForm);

        if (this.updateWarrantyPolicyForm.valid) {
            const formData = {
                id: this.updateWarrantyPolicyForm.value.id,
                name: this.updateWarrantyPolicyForm.value.name,
                term: this.updateWarrantyPolicyForm.value.term,
                termType: this.updateWarrantyPolicyForm.value.termType.value,
            };
            this.warrantyPolicyService.updateWarrantyPolicy(formData).subscribe(
                (response) => {
                    this.displayModal = false;
                    this.updateWarrantyPolicyForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Sửa chính sách bảo hành thành công',
                    });
                    this.loadWarrantyPolicies.emit();
                },
                (error) => {
                    // Xử lý khi lỗi
                    console.error('Error creating warrantyPolicies:', error);
                }
            );
        } else {
            this.updateWarrantyPolicyForm.markAllAsTouched();
        }
    }
}
