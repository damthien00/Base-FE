import { Component, Injector, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuItem, MessageService } from 'primeng/api';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { NodeService } from 'src/app/core/services/node.service';

@Component({
    templateUrl: './show.component.html',
    styleUrl: './show.component.scss',
    providers: [MessageService],
})
export class ShowComponent implements OnInit {
    imageUrl: string = environment.url;
    optionsFillerProduct: OptionsFilterProduct = new OptionsFilterProduct();
    items: MenuItem[] | undefined;
    products: any[] = [];
    treeCategory: any[] = [];
    optionsStatus: any[] = [
      { name: 'Ẩn', value: 0 },
      { name: 'Hoạt động', value: 1 },
      { name: 'Hết hàng', value: 2 },
    ];
    showAllVariants: Map<number, number> = new Map<number, number>();
  
    checked: boolean = false;
    listchecked: boolean[] = [];
    statusFilter: any;
    optionsCategory!: any[];
  
    totalRecords = 20;
    pageSize = 30;
    pageNumber = 1;
    loading = false;
  
    selectedNodes: any;
  
    messages: any[] = [];
  
    showContent: boolean = false;
  
    showDiaLogDelete: boolean = false;
    productDelete!: any;
    DOMElementDelete: any;

    constructor(
        private productCateogryService: CategoryService,
        private productService: ProductService,
        private messageService: MessageService,
    ) {
        this.optionsFillerProduct.pageIndex = this.pageNumber;
        this.optionsFillerProduct.pageSize = this.pageSize;
    }

    async ngOnInit() {
        this.items = [
            { label: 'Sản phẩm', route: '/products/show' },
            { label: 'Danh sách sản phẩm' },
        ];
        this.loading = true;
        let response = await this.productService.FilterProduct(
          this.optionsFillerProduct
        );
        let responseGetTreeCategory =
          await this.productCateogryService.getTreeCategory();
        this.loading = false;
    
        this.treeCategory = responseGetTreeCategory.data;
        this.products = response.data;
        this.totalRecords = response.totalRecordsCount;
        for (let index = 0; index < this.products.length; index++) {
          this.showAllVariants.set(
            this.products[index].id,
            this.products[index].productVariants.length > 3 ? 1 : 0
          );
        }
    }

    toggleContent() {
        this.showContent = !this.showContent;
      }
    
      onClear() {
        this.optionsFillerProduct.CategoryId = null;
        let label = document.querySelector(
          '.show-product-component p-treeSelect .p-treeselect-label'
        );
        if (label) {
          label.innerHTML = 'Danh mục';
        }
      }
      onNodeUnselect(event: any) {
        const unselectedNode = event.node;
        console.log(unselectedNode);
      }
      onNodeSelect() {
        this.optionsFillerProduct.CategoryId = this.selectedNodes.id;
        let label = document.querySelector(
          '.show-product-component p-treeSelect .p-treeselect-label'
        );
        if (label) {
          label.innerHTML = this.selectedNodes.name;
        }
      }
      closeDiaLogDelete() {
        this.showDiaLogDelete = false;
        this.DOMElementDelete = null;
        this.productDelete = null;
      }
      openDiaLogDelete($event: Event, product: any) {
        this.showDiaLogDelete = true;
        this.DOMElementDelete = $event.target as any;
        this.productDelete = product;
      }
      async ClickDelete() {
        this.loading = true;
        await this.productService
          .deletProduct(this.productDelete.id)
          .then(async () => {
            this.messages = [
              {
                severity: 'success',
                summary: 'Thành công',
                detail: 'Xóa sản phẩm thành công',
                life: 3000,
              },
            ];
            let response = await this.productService.getProducts(
              this.pageSize,
              this.pageNumber
            );
            this.products = response.data;
            this.totalRecords = response.totalRecordsCount;
          })
          .catch(() => {
            this.messages = [
              {
                severity: 'error',
                summary: 'Thất bại',
                detail: 'Có lỗi xảy ra',
                life: 3000,
              },
            ];
          })
          .finally(() => {
            this.loading = false;
            this.closeDiaLogDelete();
          });
      }
      async ClickChangeStatus($event: Event, product: any) {
        if ($event) {
          await this.productService.ChangeStatusProduct(product.id).then(() => {
            product.status = product.status === 1 ? 0 : 1;
            let elementButtonStatus = $event.target as any;
            elementButtonStatus.innerText =
              elementButtonStatus.innerText === 'Ẩn' ? 'Hoạt động' : 'Ẩn';
            let listProduct_Status =
              elementButtonStatus.parentElement.parentElement.querySelectorAll(
                '.n-product-status > div'
              );
            listProduct_Status.forEach(async (element: any) => {
              if (element.innerText !== 'Hết hàng') {
                element.style['background-color'] =
                  elementButtonStatus.innerText === 'Ẩn' ? '#50f595' : '#d9d9d9';
                element.innerText =
                  elementButtonStatus.innerText === 'Ẩn' ? 'Hoạt động' : 'Ẩn';
              }
            });
          });
        }
      }
      async EvenFilter() {
        this.optionsFillerProduct.Status = this.statusFilter
          ? this.statusFilter.value
          : null;
        this.optionsFillerProduct.pageIndex = 1;
    
        this.loading = true;
        await this.productService
          .FilterProduct(this.optionsFillerProduct)
          .then((response) => {
            this.products = response.data;
            this.totalRecords = response.totalRecordsCount;
            for (let index = 0; index < this.products.length; index++) {
              this.showAllVariants.set(
                this.products[index].id,
                this.products[index].productVariants.length > 3 ? 1 : 0
              );
            }
          });
        this.loading = false;
      }
      async SectionMainHead_Click_All(event: Event) {
        const oldheadactive = document.querySelector(
          '.show-product-component .section-main-head .head-active'
        ) as any;
        oldheadactive.className = '';
        const newheadactive = event.target as any;
        newheadactive.className = 'head-active';
    
        this.loading = true;
        let response = await this.productService.getProducts(this.pageSize, 1);
        this.loading = false;
    
        this.products = response.data;
        this.totalRecords = response.totalRecordsCount;
        for (let index = 0; index < this.products.length; index++) {
          this.showAllVariants.set(
            this.products[index].id,
            this.products[index].productVariants.length > 3 ? 1 : 0
          );
        }
      }
      async SectionMainHead_Click_Status1(event: Event) {
        const oldheadactive = document.querySelector(
          '.show-product-component .section-main-head .head-active'
        ) as any;
        oldheadactive.className = '';
        const newheadactive = event.target as any;
        newheadactive.className = 'head-active';
    
        this.optionsFillerProduct = new OptionsFilterProduct();
        this.optionsFillerProduct.Status = 1;
        this.optionsFillerProduct.pageSize = this.pageSize;
    
        this.loading = true;
        let response = await this.productService.FilterProduct(
          this.optionsFillerProduct
        );
        this.loading = false;
    
        this.products = response.data;
        this.totalRecords = response.totalRecordsCount;
        for (let index = 0; index < this.products.length; index++) {
          this.showAllVariants.set(
            this.products[index].id,
            this.products[index].productVariants.length > 3 ? 1 : 0
          );
        }
      }
      async SectionMainHead_Click_Status0(event: Event) {
        const oldheadactive = document.querySelector(
          '.show-product-component .section-main-head .head-active'
        ) as any;
        oldheadactive.className = '';
        const newheadactive = event.target as any;
        newheadactive.className = 'head-active';
    
        this.optionsFillerProduct = new OptionsFilterProduct();
        this.optionsFillerProduct.Status = 0;
        this.optionsFillerProduct.pageSize = this.pageSize;
    
        this.loading = true;
        let response = await this.productService.FilterProduct(
          this.optionsFillerProduct
        );
        this.loading = false;
    
        this.products = response.data;
        this.totalRecords = response.totalRecordsCount;
        for (let index = 0; index < this.products.length; index++) {
          this.showAllVariants.set(
            this.products[index].id,
            this.products[index].productVariants.length > 3 ? 1 : 0
          );
        }
      }
      async SectionMainHead_Click_Status2(event: Event) {
        const oldheadactive = document.querySelector(
          '.show-product-component .section-main-head .head-active'
        ) as any;
        oldheadactive.className = '';
        const newheadactive = event.target as any;
        newheadactive.className = 'head-active';
    
        this.optionsFillerProduct = new OptionsFilterProduct();
        this.optionsFillerProduct.Status = 2;
        this.optionsFillerProduct.pageSize = this.pageSize;
    
        this.loading = true;
        let response = await this.productService.FilterProduct(
          this.optionsFillerProduct
        );
        this.loading = false;
    
        this.products = response.data;
        this.totalRecords = response.totalRecordsCount;
        for (let index = 0; index < this.products.length; index++) {
          this.showAllVariants.set(
            this.products[index].id,
            this.products[index].productVariants.length > 3 ? 1 : 0
          );
        }
      }
      async onPageChange(event: any) {
        this.optionsFillerProduct.pageSize = event.rows;
        this.pageSize = event.rows;
        this.optionsFillerProduct.pageIndex = event.page + 1;
    
        this.loading = true;
        let response = await this.productService.FilterProduct(
          this.optionsFillerProduct
        );
        this.loading = false;
    
        this.products = response.data;
        this.totalRecords = response.totalRecordsCount;
        for (let index = 0; index < this.products.length; index++) {
          this.showAllVariants.set(
            this.products[index].id,
            this.products[index].productVariants.length > 3 ? 1 : 0
          );
        }
      }
      toggleShowAllVariants(index: number) {
        this.showAllVariants.set(
          index,
          this.showAllVariants.get(index) === 1 ? 2 : 1
        );
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
      totalSellCount(arr: any) {
        return arr.reduce((accumulator: number, currentItem: any) => {
          return accumulator + currentItem.sellCounts;
        }, 0);
      }
}
