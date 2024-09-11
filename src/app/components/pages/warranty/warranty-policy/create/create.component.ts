import { WarrantyPolicyService } from './../../../../../core/services/warranty-policy.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
    providers: [MessageService],
})
export class CreateComponent implements OnInit {
    @Output() warrantyPolicyCreated = new EventEmitter<any>();
    @Output() loadWarrantyPolicies = new EventEmitter<any>();
    displayModal: boolean = false;
    optionsTime: any[] = [
        { name: 'Ngày', value: 1 },
        { name: 'Tuần', value: 2 },
        { name: 'Tháng', value: 3 },
        { name: 'Quý', value: 4 },
        { name: 'Năm', value: 5 },
    ];
    selectedTime: any;
    createWarrantyPolicyForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private warrantyPolicyService: WarrantyPolicyService,
        private messageService: MessageService
    ) {
        this.createWarrantyPolicyForm = this.formBuilder.group({
            name: [null, Validators.required],
            term: [null, Validators.required],
            termType: [this.optionsTime[0]],
        });
    }

    ngOnInit() {
        this.selectedTime = this.optionsTime[0];
    }

    showModalDialog(): void {
        this.displayModal = true;
    }

    onSubmit() {
        if (this.createWarrantyPolicyForm.valid) {
            const formData = {
                name: this.createWarrantyPolicyForm.value.name,
                term: this.createWarrantyPolicyForm.value.term,
                termType: this.createWarrantyPolicyForm.value.termType.value,
            };
            this.warrantyPolicyService.createWarrantyPolicy(formData).subscribe(
                (response) => {
                    this.displayModal = false;
                    this.createWarrantyPolicyForm.reset({
                        termType: this.optionsTime[0], // Đặt giá trị mặc định cho termType là phần tử đầu tiên trong optionsTime
                    });
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Thêm chính sách bảo hành thành công',
                    });
                    this.loadWarrantyPolicies.emit();
                },
                (error) => {
                    // Xử lý khi lỗi
                    console.error('Error creating warrantyPolicies:', error);
                }
            );
        } else {
            this.createWarrantyPolicyForm.markAllAsTouched();
        }
    }
}
