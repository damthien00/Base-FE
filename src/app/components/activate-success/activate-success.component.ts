import { Component, OnInit } from '@angular/core';
import { WarrantyService } from 'src/app/core/services/warranty.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-activate-success',
    templateUrl: './activate-success.component.html',
    styleUrls: ['./activate-success.component.css'],
})
export class ActivateSuccessComponent implements OnInit {
    constructor(
        private warrantyService: WarrantyService,
        private route: ActivatedRoute
    ) {}
    warrantyById: any;
    warrantyId: number | null = null;
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
}
