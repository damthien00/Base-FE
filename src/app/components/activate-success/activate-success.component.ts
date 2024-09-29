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
        this.warrantyId = Number(this.route.snapshot.paramMap.get('id'));
        this.warrantyService
            .getWarrantyById(this.warrantyId)
            .subscribe((data) => {
                this.warrantyById = data.data.items[0];
            });
    }

    getWarrantyById() {}
}
