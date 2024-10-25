import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { WarrantyClaimsService } from 'src/app/core/services/warranty-claims.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
    providers: [MessageService],
})
export class EditComponent implements OnInit {
    items: MenuItem[] | undefined;
    id: any;
    optionsStatus: any;
    warrantyClaimId: any;
    selectedStatus: any;
    constructor(
        private route: ActivatedRoute,
        private warrantyClaimsService: WarrantyClaimsService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Bảo hành', route: '/inputtext' },
            { label: 'Cập nhật yêu cầu bảo hành', route: '/inputtext' },
        ];
        this.optionsStatus = [
            { label: 'Mới tạo', value: 0 },
            { label: 'Đã tiếp nhận', value: 1 },
            { label: 'Đang sửa', value: 2 },
            { label: 'Đã sửa xong', value: 3 },
            { label: 'Đã trả khách', value: 4 },
        ];
        this.route.paramMap.subscribe((params) => {
            this.id = params.get('id'); // 'id' là tên tham số trong route
        });
        this.loadWarrantyClaim();
    }

    loadWarrantyClaim() {
        console.log(this.id);

        this.warrantyClaimsService
            .getWarrantyClaimById(this.id)
            .subscribe((warrantyClaim) => {
                this.warrantyClaimId = warrantyClaim.data;
                console.log(this.warrantyClaimId);
                this.selectedStatus = this.warrantyClaimId.status;
            });
    }
    onStatusChange(event: any) {
        console.log(event);

        console.log('Selected Status:', this.selectedStatus);
        // Hoặc bạn có thể xử lý dữ liệu khác ở đây
        this.selectedStatus = event.value;
    }
    updateStatus() {
        console.log(this.selectedStatus.value);

        const formData = {
            id: this.warrantyClaimId.id,
            status: this.selectedStatus,
        };
        this.warrantyClaimsService
            .updateWarrantyClaimsStatus(formData)
            .subscribe((item) => {
                console.log(item);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm phiếu kho thành công',
                });
                setTimeout(() => {
                    this.router.navigate(['/pages/warranty/warranty-request']);
                }, 1000); // Thời gian trễ 2 giây
            });
    }
}
