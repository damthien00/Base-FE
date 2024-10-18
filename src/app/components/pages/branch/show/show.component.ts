import { BranchService } from './../../../../core/services/branch.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { OptionsFilterBranch } from 'src/app/core/DTOs/branch/optionsFilterBranchs';
import { catchError, of } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';

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

    constructor(
        private branchService: BranchService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.items = [{ label: 'Danh sách chi nhánh' }];
        this.loadBranchs();
    }

    loadBranchs() {
        if (this.keySearch) {
            this.optionsFilterBranch.name = this.keySearch;
        }
        if (this.keySearch == '') {
            this.optionsFilterBranch.name = null;
        }
        this.branchService
            .getBranchs(this.optionsFilterBranch)
            // .pipe(
            //     catchError((error) => {
            //         if (error.status === 403) {
            //             this.toastService.showError(
            //                 'Chú ý',
            //                 'Bạn không có quyền truy cập!'
            //             );
            //         }
            //         return of(null); // Trả về giá trị null để tiếp tục dòng chảy của Observable
            //     })
            // )
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
