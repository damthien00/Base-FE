import { WarrantyService } from 'src/app/core/services/warranty.service';
import { StockInService } from './../../../../../core/services/stock-in.service';
import { FunctionService } from 'src/app/core/utils/function.utils';
import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NodeService } from 'src/app/core/services/node.service';
import { ProductService } from 'src/app/core/services/product.service';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { BranchService } from 'src/app/core/services/branch.service';
import { OptionsFilterBranch } from 'src/app/core/DTOs/branch/optionsFilterBranchs';
import { CustomerService } from 'src/app/core/services/customer.service';
import { OptionsFilterCustomer } from 'src/app/core/models/customer';
import { dA } from '@fullcalendar/core/internal-common';

export interface WarehouseReceipt {
    id?: number;
    code: string;
    warehouseId: number;
    warehouseName: string;
    productId: number;
    productName: string;
    quantity: number;
    note?: string;
    createdDate: Date;
    createdBy: string;
}

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
    providers: [MessageService],
})
export class CreateComponent implements OnInit {
    imageUrl: string = environment.imageUrl;
    @ViewChild('searchInput') searchInput!: ElementRef;
    items: MenuItem[] | undefined;
    nodes!: any[];
    selectedNodes: any;
    treeCategory: any[] = [];
    base64_FileImages: any;
    activeBarcode: boolean = false;
    files: any;
    stockInReceipt: any;
    filteredDatas: any;
    showProducts = false;
    isValidForm: boolean = true;
    temporaryDiscountRate: number = 0;
    temporaryDiscountUnit: string = 'VND';
    optionsFilterBranch: OptionsFilterBranch = new OptionsFilterBranch();
    optionsFilterCustomer: OptionsFilterCustomer = new OptionsFilterCustomer();
    displayDiscountModal = false;
    optionsFilterProduct: OptionsFilterProduct = new OptionsFilterProduct();
    frameNumber: any;
    engineNumber: any;

    onBarcode: boolean = false;

    productList: any;

    items1: any[] | undefined;

    selectedItem: any;

    suggestions: any[] | undefined;

    branchs: any[];
    customers: any[];

    selectedBranchId: any;
    listCart: any[] = [];
    warrantyId: any;
    note: any = '';
    warrantyIds: number[] = [];

    value: string | undefined;
    constructor(
        private nodeService: NodeService,
        private productService: ProductService,
        private stockInService: StockInService,
        public functionService: FunctionService,
        private messageService: MessageService,
        private branchService: BranchService,
        private customerService: CustomerService,
        private warrantyService: WarrantyService,
        private router: Router
    ) {
        this.nodeService.getFiles().then((files) => (this.nodes = files));
    }

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Nhập kho', route: '/inputtext' },
            { label: 'Tạo phiếu nhập kho', route: '/inputtext' },
        ];
        this.stockInReceipt = {
            supplierId: '',
            // subquantity: '',
            // subtotal: '',
            note: '',
            inventoryStockInDetails: [],
            createdAt: new Date().toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),

            totalPrice: 0, // Tổng số tiền phải trả cho tất cả các sản phẩm/dịch vụ
            totalDiscountAmount: 0, // Tổng số tiền giảm giá đã được áp dụng
            totalAmountPaid: 0, // Tổng số tiền khách hàng đã thanh toán
            customerPayment: 0, // Số tiền mà khách hàng đã thanh toán trong lần giao dịch hiện tại
            moneyReturn: 0, // Số tiền phải trả lại cho khách hàng nếu họ thanh toán dư
            discountRate: 0, // Giá trị giảm giá (có thể là phần trăm (%) hoặc số tiền cụ thể)
            discountUnit: 'VND', // Đơn vị của giá trị giảm giá, ví dụ như 'VND' hoặc '%'
            paymentMethod: 'cash', // Phương thức thanh toán mà khách hàng sử dụng (ví dụ: 'cash', 'credit')
        };
        this.loadBranchs();
        this.loadCustomers();
    }

    loadBranchs() {
        this.branchService
            .getBranchs(this.optionsFilterBranch)
            .subscribe((data) => {
                this.branchs = data.data.items;
            });
    }

    loadCustomers() {
        this.customerService
            .filterCustomers(this.optionsFilterCustomer)
            .subscribe((data) => {
                console.log(data);
                this.customers = data.data;
            });
    }

    search(event: AutoCompleteCompleteEvent) {
        this.customers = this.customers.map((item) => item);
    }

    async onProductSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        const searchTerm = input.value.toLowerCase();
        if (this.onBarcode) {
            this.optionsFilterProduct.pageIndex = 1;
            this.optionsFilterProduct.pageSize = 1;
            this.optionsFilterProduct.KeyWord = '';
            this.optionsFilterProduct.Barcode = searchTerm.toLowerCase();
            try {
                const response =
                    await this.stockInReceipt.FilterProductVariants(
                        this.optionsFilterProduct
                    );
                if (response.data.length > 0) {
                    console.log(response.data);
                    this.addToCart(response.data[0]);
                } else {
                    // Hiển thị thông báo sản phẩm không tồn tại
                    this.messageService.add({
                        severity: 'success',
                        summary: '',
                        detail: 'Sản phẩm không tồn tại',
                    });
                }
            } finally {
            }
        } else {
            this.optionsFilterProduct.pageIndex = 1;
            this.optionsFilterProduct.pageSize = 10;
            this.optionsFilterProduct.KeyWord = searchTerm.toLowerCase();
            this.optionsFilterProduct.Barcode = null;
            try {
                // const response =
                //     await this.productService.SearchProductVariants(
                //         this.optionsFillerProduct
                //     );
                // this.filteredDatas = response.data;
                this.loadProducts();
            } finally {
            }
        }
    }

    showProductList(): void {
        if (this.onBarcode) {
            this.showProducts = false;
        } else {
            this.showProducts = true;
            this.loadProducts();
        }
    }

    async loadProducts() {
        this.optionsFilterProduct.pageIndex = 1;
        this.optionsFilterProduct.pageSize = 10;
        let response = await this.productService.FilterProduct(
            this.optionsFilterProduct
        );

        let listP = [];

        response.data.forEach((item: any) => {
            if (item.productVariants && item.productVariants.length > 0) {
                item.productVariants.forEach((itemVariant) => {
                    listP.push({
                        productId: item.id,
                        productImage: itemVariant.linkImage, // Lấy hình ảnh từ itemVariant
                        productVariantId: itemVariant.id,
                        productName:
                            item.name +
                            '-' +
                            (itemVariant.valuePropeties1 || '') +
                            '-' +
                            (itemVariant.valuePropeties2 || ''),
                        productType: item.productType,
                        quantity: item.productType === 1 ? 0 : 1,
                        productCode: itemVariant.code || '', // Đảm bảo mã sản phẩm
                        price: itemVariant.price,
                        unit: item.unitName,
                        mass: itemVariant.sellCounts
                            ? itemVariant.sellCounts
                            : 0,
                        total:
                            item.productType === 1 ? 0 : itemVariant.price * 1,
                        frameNumber: '',
                        engineNumber: '',
                    });
                });
            } else {
                listP.push({
                    productId: item.id,
                    productImage:
                        item.productImages && item.productImages.length > 0
                            ? item.productImages[0].link
                            : null,
                    productName: item.name,
                    productType: item.productType,
                    quantity: item.productType === 1 ? 0 : 1,
                    productCode: item.code || '', // Đảm bảo mã sản phẩm
                    price: item.sellingPrice,
                    unit: item.unitName,
                    mass: item.mass,
                    total: item.productType === 1 ? 0 : item.sellingPrice * 1,
                    frameNumber: '',
                    engineNumber: '',
                });
            }
        });
        console.log(listP);

        this.filteredDatas = listP;

        // console.log(this.filteredDatas);
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const searchContainer = document.querySelector('.box-search');
        if (searchContainer && !searchContainer.contains(target)) {
            this.showProducts = false;
        }
    }

    onProductListClick(event: MouseEvent): void {
        this.showProducts = true; // Prevent the click event from hiding the product list
    }

    onNodeSelect(event: any) {
        console.log(event);
        // this.optionsFillerProduct.CategoryId = this.selectedNodes?.id;
        let label = document.querySelector(
            '.category-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = this.selectedNodes?.name || '';
        }
    }

    onClear() {
        // this.optionsFillerProduct.CategoryId = null;
        let label = document.querySelector(
            '.supplier-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = 'Chọn danh mục';
        }
    }

    addToCart(item: any): void {
        this.listCart.push({ ...item, returnDate: new Date() });
        console.log(this.listCart);
        this.showProducts = false;
        this.searchInput.nativeElement.value = '';
    }

    removeProduct(index: number) {
        this.stockInReceipt.inventoryStockInDetails.splice(index, 1);
        console.log(this.stockInReceipt);
    }

    onCustomerSelect(event: any) {
        const customerId = event.value.id;
        this.warrantyService
            .getWarrantyByCustomer(customerId)
            .subscribe((data) => {
                this.warrantyId = data.data.items[0].id;
                this.productList = data.data.items[0].warrantyProducts;
                console.log(this.productList);
            });
    }

    onSubmit() {
        // Log selected item and branch for debugging
        console.log(this.selectedItem);
        console.log(this.selectedBranchId);
        const formData = new FormData();
        formData.append('Code', '');
        formData.append('CustomerId', this.selectedItem.id.toString());
        formData.append('CustomerName', this.selectedItem.name);
        formData.append('PhoneNumber', this.selectedItem.phoneNumber);
        formData.append('BranchId', this.selectedBranchId.id.toString());
        formData.append('BranchName', this.selectedBranchId.name);
        formData.append('TotalQuantity', this.listCart.length.toString());
        formData.append('Note', this.note);
        if (this.files && this.files.length > 0) {
            for (const file of this.files) {
                formData.append('AttachmentFiles', file);
            }
        }

        this.warrantyIds = this.listCart.map((item) => {
            console.log(item);
            return item.warrantyId;
        });

        // Chuyển đổi từng warrantyId thành chuỗi trước khi thêm vào FormData
        this.warrantyIds.forEach((id) => {
            formData.append('WarrantyIds', id.toString());
        });

        this.warrantyService.createWarrantyClaim(formData).subscribe(
            (item) => {
                console.log('Success:', item);
            },
            (error) => {
                console.error('Error:', error);
            }
        );
    }

    checkValidity() {
        if (this.stockInReceipt.inventoryStockInDetails.length == 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Chú ý',
                detail: 'Phiếu nhập chưa có sản phẩm',
            });
            this.isValidForm = false;
            return;
        }

        // Kiểm tra giá trị thanh toán và tổng giảm giá
        if (
            this.stockInReceipt.customerPayment ===
            this.stockInReceipt.totalAmountPaid
        ) {
            this.stockInReceipt.isValidMoney = false;
            delete this.stockInReceipt.isMessageValidMoney;
        } else {
            this.stockInReceipt.isValidMoney = true;
            this.stockInReceipt.isMessageValidMoney =
                'Bằng tiền cần trả nhà cung cấp';
        }

        // Kiểm tra các sản phẩm và IMEI
        this.stockInReceipt.inventoryStockInDetails.forEach((product) => {
            if (product.quantity === 0) {
                product.isValid = true;
                product.isValidMessage = 'Số lượng > 0';
            } else {
                product.isValid = false;
                delete product.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
            }

            if (product.productImeis) {
                product.productImeis.forEach((imei) => {
                    if (!imei.frameNumber || !imei.engineNumber) {
                        imei.isValid = true;
                        if (!imei.frameNumber && !imei.engineNumber) {
                            imei.isValidMessage =
                                'Vui lòng nhập số khung và số máy';
                        } else if (!imei.frameNumber) {
                            imei.isValidMessage = 'Vui lòng nhập số khung';
                        } else if (!imei.engineNumber) {
                            imei.isValidMessage = 'Vui lòng nhập số máy';
                        }
                        console.log(imei.frameNumber, imei.engineNumber);
                    } else {
                        // if (!imei.isValid) {
                        this.stockInService
                            .checkExistEngineAndFrame(
                                imei.frameNumber,
                                imei.engineNumber
                            )
                            .subscribe(
                                (exists) => {
                                    console.log(exists);
                                    if (exists.data) {
                                        imei.isValid = true;
                                        imei.isValidMessage =
                                            'Số khung hoặc số máy đã tồn tại';
                                    } else {
                                        imei.isValid = false;
                                        delete imei.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
                                    }
                                },
                                (error) => {
                                    console.error(
                                        'Error checking engine and frame number:',
                                        error
                                    );
                                }
                            );
                        // imei.isValid = false;
                        delete imei.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
                        // }
                    }
                });
            }
        });

        // Kiểm tra tính hợp lệ của form
        this.isValidForm =
            this.stockInReceipt.inventoryStockInDetails?.every((product) => {
                // Kiểm tra số lượng sản phẩm
                if (product.quantity === 0) {
                    return false;
                }

                // Kiểm tra IMEI nếu có
                if (product.productImeis) {
                    return product.productImeis.every((imei) => !imei.isValid);
                }

                // Kiểm tra tính hợp lệ của sản phẩm
                return !product.isValid;
            }) && !this.stockInReceipt.isValidMoney;

        if (this.isValidForm) {
            console.log('Form is valid and ready to submit.');
        } else {
            console.log('Form is not valid. Please check the errors.');
        }
    }

    onBarcodeClick() {
        this.activeBarcode = !this.activeBarcode;
        if (this.onBarcode) {
            this.messageService.add({
                severity: 'success',
                summary: '',
                detail: 'Chuyển sang chế độ thường',
            });
        } else {
            this.messageService.add({
                severity: 'success',
                summary: '',
                detail: 'Chuyển sang chế độ barcode',
            });
        }
        this.onBarcode = !this.onBarcode;
    }
    // onToggleActiveBarcode() {}

    onClearBranch() {
        this.selectedBranchId = '';
    }

    onImageSelected(event: any): void {
        const maxFileSize = 3 * 1024 * 1024;
        const maxAllowedImages = 9;
        this.files = event.target.files;
        // const files: FileList = event.target.files;

        // console.log(files);

        // if (files.length > 0) {
        //     // this.showNameError = false;
        // }
        // const totalImages = this.base64_FileImages?.length + files.length;
        // if (totalImages > maxAllowedImages) {
        //     // this.messages = [
        //     //     {
        //     //         severity: 'warn',
        //     //         summary: 'Số lượng ảnh vượt quá giới hạn',
        //     //         detail: `Chỉ được phép tải lên tối đa ${maxAllowedImages} ảnh`,
        //     //         life: 3000,
        //     //     },
        //     // ];
        //     return;
        // }

        // for (let i = 0; i < files.length; i++) {
        //     const file = files[i];
        //     if (file.size > maxFileSize) {
        //         // this.messages = [
        //         //     {
        //         //         severity: 'warn',
        //         //         summary: 'Ảnh > 3MB',
        //         //         detail: 'Ảnh tải lên không được lớn hơn 3MB',
        //         //         life: 3000,
        //         //     },
        //         // ];
        //         return;
        //     }

        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         const base64String = reader.result as string;
        //         this.base64_FileImages.push({ file, preview: base64String });
        //         // (
        //         //    this.c
        //         // ).push(this.fb.control(base64String.split(',')[1]));
        //     };
        //     reader.readAsDataURL(file);
        // }
        // this.imageInput.nativeElement.value = '';
    }
}
