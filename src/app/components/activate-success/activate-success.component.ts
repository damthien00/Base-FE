import { Component, OnInit } from '@angular/core';
import { WarrantyService } from 'src/app/core/services/warranty.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-activate-success',
    templateUrl: './activate-success.component.html',
    styleUrls: ['./activate-success.component.css'],
    providers: [MessageService],
})
export class ActivateSuccessComponent implements OnInit {
    userCurrent: any;
    constructor(
        private warrantyService: WarrantyService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private authService: AuthService
    ) {
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
            console.log(this.userCurrent);
        });
    }
    warrantyById: any;
    warrantyId: number | null = null;
    warrantyInfos: any;
    ngOnInit() {
        // Lấy dữ liệu từ local storage
        const warrantiesData = localStorage.getItem('lastCreatedWarranties');
        if (warrantiesData) {
            this.warrantyById = JSON.parse(warrantiesData);
            console.log(this.warrantyById);
            localStorage.removeItem('lastCreatedWarranties');
        }
    }

    getWarrantyById() {}

    warrantyRequest() {
        // console.log(data);
        // const formData = new FormData();
        // formData.append('Code', '');
        // formData.append('CustomerId', data.customer.id.toString());
        // formData.append('CustomerName', data.customer.name);
        // formData.append('PhoneNumber', data.customer.phoneNumber);
        // formData.append('BranchId', this.userCurrent.branchId);
        // formData.append('BranchName', this.userCurrent.branchName);
        // formData.append('TotalQuantity', '1');
        // this.warrantyInfos = {
        //     id: data.id,
        //     dueDate: '',
        // };
        // const warrantyInfosJson = JSON.stringify(this.warrantyInfos);
        // formData.append('WarrantyInfos', warrantyInfosJson);
        // this.warrantyService.createWarrantyClaim(formData).subscribe(
        //     (item) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Thành công',
        //             detail: 'Tạo phiếu bảo hành hàng lỗi thành công',
        //         });
        //     },
        //     (error) => {
        //         console.error('Error:', error);
        //     }
        // );
    }
}
