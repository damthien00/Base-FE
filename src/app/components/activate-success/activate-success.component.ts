import { Component, OnInit } from '@angular/core';
import { WarrantyService } from 'src/app/core/services/warranty.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
        });
    }
    warrantyById: any;
    warrantyId: number | null = null;
    warrantyInfos: any;
    currentDate: string;
    ngOnInit() {
        this.currentDate = new Date().toLocaleDateString('vi-VN');
        const warrantiesData = localStorage.getItem('lastCreatedWarranties');
        if (warrantiesData) {
            this.warrantyById = JSON.parse(warrantiesData);
            console.log(this.warrantyById);
            // localStorage.removeItem('lastCreatedWarranties');
        }
    }

    getWarrantyById() { }

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

    calculateRemainingMonths(expirationDate: string): number {
        const currentDate = new Date();
        const expiration = new Date(expirationDate);

        // Calculate the difference in months
        const monthsDifference = (expiration.getFullYear() - currentDate.getFullYear()) * 12 + (expiration.getMonth() - currentDate.getMonth());

        return Math.max(monthsDifference, 0); // Ensure it's not negative
    }

    exportPDF() {
        const element = document.getElementById('transferNote');
        if (element) {
            element.style.display = 'block'; // Ensure element is visible

            // Clear previous content in the orders-table
            const ordersTableBody = element.querySelector('.orders-table tbody');
            ordersTableBody.innerHTML = '';

            this.warrantyById.forEach((item, index) => {
                const row = document.createElement('tr');

                // Product details
                const product = item.warrantyProducts[0];
                const remainingMonths = this.calculateRemainingMonths(product.expirationDate); // Get remaining months

                row.innerHTML = `
              <td>${index + 1}</td>
              <td>${product.productName} ${product.productVariantName}</td>
              <td>${item.productCode}</td>
              <td>${remainingMonths} tháng</td>
              <td>${new Date(product.expirationDate).toLocaleDateString('vi-VN')}</td>
            `;
                ordersTableBody.appendChild(row);
            });

            html2canvas(element, {
                scale: 1, // Increase scale for better quality
                useCORS: true, // Enable Cross-Origin Resource Sharing
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
    
                const imgWidth = pdf.internal.pageSize.getWidth(); // Full width of A4 page
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Start at (0,0) to fit full page
                pdf.save('Warranty_Activation.pdf');
    
                element.style.display = 'none'; // Hide element after saving
            });
        }
    }
}
