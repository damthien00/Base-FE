import { BranchService } from './../../../../core/services/branch.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { OptionsFilterBranch } from 'src/app/core/DTOs/branch/optionsFilterBranchs';

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.css'],
})
export class ShowComponent implements OnInit {
    @ViewChild('createModal') createModal!: CreateComponent;
    @ViewChild('editModal') editModal!: EditComponent;
    items: MenuItem[] | undefined;
    optionsFilterBranch: OptionsFilterBranch = new OptionsFilterBranch();
    branchs: any[] = [];
    keySearch: any;
    pageSize: number;
    pageNumber: number;
    totalRecordsCount: number;

    constructor(private branchService: BranchService) {}

    ngOnInit() {
        this.items = [{ label: 'Danh sách chi nhánh' }];
        this.loadBranchs();
    }

    loadBranchs() {
        console.log(this.keySearch);
        if (this.keySearch) {
            this.optionsFilterBranch.name = this.keySearch;
        }
        this.branchService
            .getBranchs(this.optionsFilterBranch)
            .subscribe((data) => {
                this.branchs = data.data.items;
            });
    }

    onPageChange(event: any): void {
        this.pageSize = event.rows;
        this.pageNumber = event.page + 1;
        this.loadBranchs();
    }

    goToPreviousPage(): void {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.loadBranchs();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
        if (this.pageNumber < lastPage) {
            this.pageNumber++;
            this.loadBranchs();
        }
    }

    onBranchCreated(newBranch: any): void {
        // this.categories.push(newBranch);
    }
    onBranchUpdated(updatedBranch: any): void {
        // const index = this.categories.findIndex(
        //     (category) => category.id === updatedCategory.id
        // );
        // if (index !== -1) {
        //     this.categories[index] = updatedCategory;
        // }
    }

    openCreateModal(): void {
        this.createModal.showModalDialog();
    }

    openEditModal(branch: any): void {
        console.log(branch);
        // this.editModal.categoryId = category.id;
        this.editModal.showModalDialog(branch);
    }
}
