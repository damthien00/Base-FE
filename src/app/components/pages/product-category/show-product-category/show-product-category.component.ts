import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/categories';
import { MenuItem } from 'primeng/api';
import { TreeNode } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-show-product-category',
    templateUrl: './show-product-category.component.html',
    styleUrls: ['./show-product-category.component.css'],
})
export class ShowProductCategoryComponent implements OnInit {
    categoryId: number = 0;
    categoryName: string = '';
    parentCategoryName: string = '';
    selectedCategory: TreeNode | null = null;
    parentCategories: TreeNode[] | null = null;
    categorieandchild: TreeNode[] = [];
    categories: any[] = [];
    categoriess: Category = new Category();
    selectedCategoryId!: number;
    isCategorySelected: boolean = false;


    treeOptions!: TreeNode[];
    selectCategory: any = {};
    selectedParentId: number = 0;

    nodes!: any[];
    selectedNodes: any;
    pageSize: number = 30;
    pageNumber: number = 1;
    totalRecordsCount: number = 0;
    currentPageReport: string = '';
    searchTerm: string = '';
    filteredCategories: any[] = [];
    isSubmitting: boolean = false;
    savingInProgress = false;

    showDialog = false;
    showDialogs = false;
    messages: any[] = [];
    errorMessage!: string;
    errorMessageTree: string | null = null;
    showNameError: boolean = false;
    showNameError2: boolean = false;
    showNameError3: boolean = false;
    showNameError4: boolean = false;
    showNameError5: boolean = false;
    notify: any;
    isChecked: boolean = false;
    updateSuccess: boolean = false;
    loadingTableData: boolean = false;
    value: string | undefined;
    checked: boolean = true;
    keySearch: string = '';
    dataLoaded: boolean = false;
    cols: any[] = [];
    items: MenuItem[] | undefined;

    constructor(private categoryService: CategoryService) { }

    ngOnInit(): void {
        this.loadCategories();
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Components' },
            { label: 'Form' },
            { label: 'InputText', route: '/inputtext' },
        ];
    }

    loadCategories(): void {
        this.categoryService.getCategoryAll().subscribe((data) => {
            this.categories = data.data;
        });
    }

    getCategoriesAndChild() {
        this.categoryService.getCategoriesAndChild()
            .subscribe(response => {
                // Chuyển đổi dữ liệu API thành TreeNode
                this.categorieandchild = response;
            });
    }


    async getCategorieAll() {
        try {
            const response = await this.categoryService.getCategoryAll().toPromise();
            this.categories = response.data;
            this.treeOptions = this.createCategoryTree(this.categories);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    createCategoryTree(categories: any[], parentId: number = 0): TreeNode[] {
        const treeNodes: TreeNode[] = [];
        const filteredCategories = categories.filter(category => category.parentId === parentId);

        filteredCategories.forEach(category => {
            const treeNode: TreeNode = {
                label: category.name,
                data: category.id,
                children: this.createCategoryTree(categories, category.id)
            };
            treeNodes.push(treeNode);
        });

        return treeNodes;
    }

    onTreeSelectFocus() {
        // Chỉ tải dữ liệu khi `TreeSelect` được chọn và dữ liệu chưa được tải trước
        if (!this.dataLoaded) {
            this.getCategoriesAndChild();
        }
    }

    getAllSubcategoriesRecursive(parentCategory: TreeNode) {
        this.categoryService.getSubcategories(parentCategory.data.id)
            .subscribe(
                response => {
                    parentCategory.children = response.data.map((category: any) => this.mapToTreeNode(category));
                    // Lặp lại cho tất cả các danh mục con
                    if (parentCategory.children) {
                        parentCategory.children.forEach(childCategory => {
                            this.getAllSubcategoriesRecursive(childCategory);
                        });
                    }
                },
                error => {
                    console.error('Error fetching subcategories:', error);
                }
            );
    }

    mapToTreeNode(category: any): TreeNode {
        return {
            label: category.name,
            data: category,
            leaf: !category.children,
            children: undefined // Khởi tạo children là null, sẽ được cập nhật sau
        };
    }

    onNodeSelect(event: any) {
        const selectedNode = event.node;
        this.selectedCategory = selectedNode; // Cập nhật selectedCategory với node được chọn
        if (!selectedNode.data.parentId) {
            // Nếu là danh mục cha, kiểm tra xem danh sách danh mục cháu đã được tải chưa
            if (!selectedNode.children) {
                this.getAllSubcategoriesRecursive(selectedNode);
            }
        }
    }

    onNodeUnselect(event: any) {
        const unselectedNode = event.node;
        if (this.selectedCategory === unselectedNode) {
            this.selectedCategory = null; // Reset selectedCategory nếu node bị bỏ chọn là node hiện tại
        }
        unselectedNode.children = null; // Clear children when a node is unselected
    }

    openDialog() {
        this.showDialog = true;
        this.getCategoriesAndChild();
    }

    closeDialog(categoryForm: NgForm) {
        this.showDialog = false;
        categoryForm.reset()
        this.checked = true;
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
        this.showNameError5 = false;
    }

    async onSubmitAdd(categoryForm: NgForm) {
        if (this.savingInProgress) {
          return;
        }
        if (categoryForm.controls['name'].invalid || categoryForm.controls['name'].value.trim() === "") {
          this.showNameError = true;
          return;
        } else {
          this.showNameError = false;
        }
    
        const trimmedName = this.categoriess.name.replace(/\s/g, '');
        if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
          this.showNameError4 = true;
          return;
        }
    
        if (this.categoriess.description && this.categoriess.description.length > 500) {
          this.showNameError3 = true;
          return;
        }
    
        let str = this.categoriess.name;
        str = str.trim().replace(/\s+/g, ' ');
        console.log(str);
    
        if (this.selectedCategory) {
          // parentId = this.selectedCategory.data.id; // Cập nhật parentId dựa trên selectedCategory
    
          // Kiểm tra cấp độ của danh mục hiện tại
          let currentNode = this.selectedCategory;
          let level = 1; // Cấp độ khởi đầu là 1 (danh mục cha)
    
          // Tính toán cấp độ bằng cách duyệt ngược lên cây danh mục
          while (currentNode.parent) {
            currentNode = currentNode.parent;
            level++;
          }
    
          // Kiểm tra nếu cấp độ đạt đến cấp 5 hoặc cao hơn
          if (level >= 5) {
            this.showNameError5 = true;
            return;
          }
        }
    
        try {
          const response = await this.categoryService.CheckCategoryExistence(str).then();
          if (response.statusCode === 200) {
            this.showNameError2 = true;
            // return;
          } else {
            this.showNameError2 = false;
            if (!this.checked) {
              this.categoriess.status = 0; // true tương ứng với 0
            } else {
              this.categoriess.status = 1; // false tương ứng với 1
            }
    
            this.categoriess.parentId = 0;
    
            if (this.selectedCategory) {
              this.categoriess.parentId = this.selectedCategory.data.id;
            }
    
            const response = await this.categoryService.createCategory(this.categoriess).toPromise();
            console.log('Danh mục được tạo thành công:', response);
            console.log(this.categoriess)
            categoryForm.reset();
            this.checked = true;
            this.closeDialog(categoryForm);
            this.messages = [{
              severity: 'success',
              summary: 'Thành công',
              detail: 'Danh mục đã được thêm thành công',
              life: 3000
            }];
            this.getCategoriesAndChild()
            this.loadCategories();
    
            // Tắt các thông báo lỗi
            this.showNameError = false;
            this.showNameError2 = false;
            this.showNameError3 = false;
            this.showNameError4 = false;
            this.showNameError5 = false;
          }
        } catch (error) {
          this.errorMessage = 'Tạo danh mục thất bại. Vui lòng thử lại sau.';
          console.error('Đã xảy ra lỗi khi tạo danh mục:', error);
          this.closeDialog(categoryForm);
          this.messages = [{
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Thêm danh mục thất bại',
            life: 3000 // Đặt thời gian sống của thông báo là 3000 miligiây (tương đương 2 giây)
          }];
          this.showNameError = false;
          this.showNameError2 = false;
          this.showNameError3 = false;
          this.showNameError4 = false;
          this.showNameError5 = false;
        } finally {
          this.savingInProgress = false;
        }
      }
}
