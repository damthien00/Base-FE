import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { OptionsFilterBranch } from 'src/app/core/DTOs/branch/optionsFilterBranchs';
import { OptionsFilterInventoryProduct } from 'src/app/core/DTOs/inventory-product/optionsFilterInventoryProduct';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { NodeService } from 'src/app/core/services/node.service';
import { ProductService } from 'src/app/core/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventory-company',
  templateUrl: './inventory-company.component.html',
  styleUrls: ['./inventory-company.component.css']
})
export class InventoryCompanyComponent implements OnInit {

    imageUrl = environment.imageUrl;
    optionsFillerProduct: OptionsFilterProduct = new OptionsFilterProduct();
    optionsFilterBranch: OptionsFilterBranch = new OptionsFilterBranch();
    optionsFilterInventoryProduct: OptionsFilterInventoryProduct =
        new OptionsFilterInventoryProduct();
    selectedNodes: any;
    pageSize: number = 10;
    pageNumber: number = 1;
    totalRecordsCount: any;
    expandedRows = {};
    data: any;
    keyWord: any;

    expandAll() {
        this.expandedRows = this.products.reduce(
            (acc, p) => (acc[p.id] = true) && acc,
            {}
        );
    }

    collapseAll() {
        this.expandedRows = {};
    }

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: any[] = [];

    product: any = {};

    selectedProducts: any[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    name:any;

    totalRecords = 20;
    treeCategory: any[] = [];
    branchs: any[] = [];
    selectedBranch: any;
    brandIdSelected: any;
    userCurrent: any;
    constructor(
        private productCateogryService: CategoryService,
        private productService: ProductService,
        private messageService: MessageService,
        private nodeService: NodeService,
        private branchService: BranchService,
        private authService: AuthService
    ) {
        this.optionsFillerProduct.pageIndex = this.pageNumber;
        this.optionsFillerProduct.pageSize = this.pageSize;
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
    }

    async ngOnInit() {
        this.items = [
            { label: 'Kho', route: '/products/inventory-company' },
            { label: 'Danh sách tồn kho công ty' },
        ];

        this.loadBranchs();
        console.log(this.branchs);
        const branch = this.branchs.find(
            (branch) => branch.id === this.userCurrent.branchId
        );
        console.log(branch);

        if (branch) {
            console.log(branch);

            this.brandIdSelected = branch;
        } else {
            console.log('');
        }

        //  || this.brandIdSelected;
        this.loadProduct();

        // this.loading = true;
        // let response = await this.productService.FilterProduct(
        //     this.optionsFillerProduct
        // );
        // let responseGetTreeCategory =
        //     await this.productCateogryService.getTreeCategory();
        // // this.loading = false;
        // console.log(responseGetTreeCategory);
        // this.products = response.data;
        // this.totalRecords = response.totalRecordsCount;
        // console.log(b);

        // this.brandIdSelected = this.userCurrent.branchId;
    }

    loadBranchs() {
        this.branchService
            .getBranchs(this.optionsFilterBranch)
            .subscribe((data) => {
                this.branchs = data.data.items;
                // this.branchs.unshift({ name: 'Chọn chi nhánh', id: 'null' });
            });
    }

    loadProduct() {
        //this.optionsFilterInventoryProduct.branchId = this.brandIdSelected?.id || this.brandIdSelected;
        this.optionsFilterInventoryProduct.pageIndex = this.pageNumber;
        this.optionsFilterInventoryProduct.pageSize = this.pageSize;
        //this.optionsFilterInventoryProduct.branchId = this.userCurrent.branchId;


        this.productService
            .getInventoryCompany(this.optionsFilterInventoryProduct)
            .subscribe((response) => {
                this.products = response.data.items;
                this.data = response.data;
                this.totalRecordsCount = response.data.totalRecords;
            });
    }

    searchBranch() {
        this.optionsFilterInventoryProduct.keyWord = this.keyWord ? this.keyWord : null;
        this.loadProduct();
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    onClear() {
        this.optionsFillerProduct.CategoryId = null;
        let label = document.querySelector(
            '.category-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = 'Chọn danh mục';
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    onRowExpand(event: TableRowExpandEvent) {
        this.messageService.add({
            severity: 'info',
            summary: 'Product Expanded',
            detail: event.data.name,
            life: 3000,
        });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({
            severity: 'success',
            summary: 'Product Collapsed',
            detail: event.data.name,
            life: 3000,
        });
    }
    async EvenFilter() {
        this.optionsFillerProduct.pageIndex = 1;
        // this.loading = true;
        await this.productService
            .FilterProduct(this.optionsFillerProduct)
            .then((response) => {
                this.products = response.data;
                this.totalRecords = response.totalRecordsCount;
                //   for (let index = 0; index < this.products.length; index++) {
                //     this.showAllVariants.set(this.products[index].id, this.products[index].productVariants.length > 3 ? 1 : 0);
                //    }
            });
        // this.loading = false;
    }

    checkStartPriceValue() {
        if (this.optionsFillerProduct.StartPrice != null) {
            if (this.optionsFillerProduct.StartPrice < 1000) {
                this.optionsFillerProduct.StartPrice = null;
            }
        }
    }
    checkEndPriceValue() {
        if (this.optionsFillerProduct.EndPrice != null) {
            if (this.optionsFillerProduct.EndPrice < 1000) {
                this.optionsFillerProduct.EndPrice = null;
            }
        }
    }

    //Paganation
    onPageChange(event: any): void {
        console.log(event);

        this.pageSize = event.rows;
        this.pageNumber = event.page + 1;
        this.loadProduct();
    }

    goToPreviousPage(): void {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.loadProduct();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
        if (this.pageNumber < lastPage) {
            this.pageNumber++;
            this.loadProduct();
        }
    }

    get startRecord(): number {
        return (this.pageNumber - 1) * this.pageSize + 1;
    }

    get endRecord(): number {
        // Tính toán số bản ghi kết thúc (không vượt quá tổng số bản ghi)
        const calculatedEnd = (this.pageNumber - 1 + 1) * this.pageSize;
        return calculatedEnd > this.totalRecordsCount
            ? this.totalRecordsCount
            : calculatedEnd;
    }


}
