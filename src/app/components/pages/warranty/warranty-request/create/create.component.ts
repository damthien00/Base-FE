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
import { OptionsFilterCustomer } from 'src/app/core/DTOs/customer/optionsFilterCustomers';
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
    warrantyInfos: any[] = [];
    fileName: string = 'No file chosen';
    value: string | undefined;
    statusList: any[] = [];
    keyWord: any;
    productCurrent: any;
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
        // Lấy dữ liệu từ Local Storage
        const warrantyRequestData = JSON.parse(
            localStorage.getItem('warrantyRequestData')
        );
        if (warrantyRequestData) {
            this.listCart.push(warrantyRequestData);
            this.selectedItem = warrantyRequestData.customer;
            this.onCustomerSelect('');
            localStorage.removeItem('warrantyRequestData');
        }

        this.items = [
            { label: 'Kho hàng' },
            { label: 'Bảo hành', route: '/inputtext' },
            { label: 'Tạo phiếu bảo hành', route: '/inputtext' },
        ];

        this.statusList = [
            { label: 'Mới tạo', value: 0 },
            { label: 'Đã tiếp nhận', value: 1 },
            { label: 'Đang sửa', value: 2 },
            { label: 'Đã sửa xong', value: 3 },
            { label: 'Đã trả khách', value: 4 },
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
            .getCustomers(this.optionsFilterCustomer)
            .subscribe((data) => {
                console.log(data);
                this.customers = data.data.items;
            });
    }

    search(event: AutoCompleteCompleteEvent) {
        console.log(event);
        this.optionsFilterCustomer.Keyword = event.query;
        this.loadCustomers();
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
                // this.loadProducts();
            } finally {
            }
        }
    }

    showProductList(): void {
        if (this.onBarcode) {
            this.showProducts = false;
        } else {
            this.showProducts = true;
            // this.loadProducts();
        }
    }

    // async loadProducts() {
    //     this.optionsFilterProduct.pageIndex = 1;
    //     this.optionsFilterProduct.pageSize = 10;
    //     let response = await this.productService.FilterProduct(
    //         this.optionsFilterProduct
    //     );

    //     let listP = [];

    //     response.data.forEach((item: any) => {
    //         if (item.productVariants && item.productVariants.length > 0) {
    //             item.productVariants.forEach((itemVariant) => {
    //                 listP.push({
    //                     productId: item.id,
    //                     productImage: itemVariant.linkImage, // Lấy hình ảnh từ itemVariant
    //                     productVariantId: itemVariant.id,
    //                     productName:
    //                         item.name +
    //                         '-' +
    //                         (itemVariant.valuePropeties1 || '') +
    //                         '-' +
    //                         (itemVariant.valuePropeties2 || ''),
    //                     productType: item.productType,
    //                     quantity: item.productType === 1 ? 0 : 1,
    //                     productCode: itemVariant.code || '', // Đảm bảo mã sản phẩm
    //                     price: itemVariant.price,
    //                     unit: item.unitName,
    //                     mass: itemVariant.sellCounts
    //                         ? itemVariant.sellCounts
    //                         : 0,
    //                     total:
    //                         item.productType === 1 ? 0 : itemVariant.price * 1,
    //                     frameNumber: '',
    //                     engineNumber: '',
    //                 });
    //             });
    //         } else {
    //             listP.push({
    //                 productId: item.id,
    //                 productImage:
    //                     item.productImages && item.productImages.length > 0
    //                         ? item.productImages[0].link
    //                         : null,
    //                 productName: item.name,
    //                 productType: item.productType,
    //                 quantity: item.productType === 1 ? 0 : 1,
    //                 productCode: item.code || '', // Đảm bảo mã sản phẩm
    //                 price: item.sellingPrice,
    //                 unit: item.unitName,
    //                 mass: item.mass,
    //                 total: item.productType === 1 ? 0 : item.sellingPrice * 1,
    //                 frameNumber: '',
    //                 engineNumber: '',
    //             });
    //         }
    //     });
    //     console.log(listP);

    //     this.filteredDatas = listP;

    //     // console.log(this.filteredDatas);
    // }

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
        console.log(item);

        const productExists = this.listCart.some(
            (cartItem) => cartItem.productCode === item.productCode
            // &&
            //        cartItem.f === item.serialNumber && // Điều kiện 1
            //  cartItem.warrantyCode === item.warrantyCode    // Điều kiện 2
        );

        if (!productExists) {
            this.listCart.push({ ...item, returnDate: null });
        } else {
            console.log('Sản phẩm đã có trong danh sách');
            this.messageService.add({
                severity: 'warn', // Mức độ của thông báo (success, info, warn, error)
                summary: 'Thông báo', // Tiêu đề của thông báo
                detail: 'Sản phẩm đã có trong danh sách', // Nội dung của thông báo
            });
        }
        this.showProducts = false;
        this.searchInput.nativeElement.value = '';
    }

    removeProduct(index: number) {
        // Kiểm tra nếu index hợp lệ
        if (index > -1 && index < this.listCart.length) {
            // Xóa sản phẩm tại index
            this.listCart.splice(index, 1);
        }
    }

    onCustomerSelect(event: any) {
        console.log(this.selectedItem);
        const customerId = this.selectedItem?.id;
        this.warrantyService
            .getWarrantyByCustomer(customerId)
            .subscribe((data) => {
                this.warrantyId = data.data.items[0]?.id;
                this.productList = data.data.items;
            });

        // this.listCart = [];
        // if(this.)
    }

    onSubmit() {
        // Kiểm tra tính hợp lệ của tên khách hàng
        if (!this.selectedItem || !this.selectedItem.name) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Tên khách hàng là bắt buộc.',
            });
            return;
        }

        // Kiểm tra tính hợp lệ của sản phẩm
        if (this.listCart.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Phải có ít nhất một sản phẩm trong danh sách yêu cầu.',
            });
            return;
        }
        if (!this.selectedBranchId || !this.selectedBranchId.name) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng chọn chi nhánh.',
            });
            return;
        }
        console.log(this.listCart);

        // for (const item of this.listCart) {
        //     if (!item.returnDate) {
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Lỗi',
        //             detail: `Sản phẩm "${item.product.name}${
        //                 '-' + item.productVariant?.valuePropeties1
        //             }${
        //                 '-' + item.productVariant?.valuePropeties2
        //             }" phải có ngày trả.`,
        //         });
        //         return;
        //     }
        // }
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
        console.log(this.listCart);
        this.warrantyInfos = this.listCart.map((item) => {
            return {
                id: item.warrantyProducts[0].warrantyId,
                statusRequest: 1,
                status: 0,
                dueDate: item.returnDate,
            };
        });

        const warrantyInfosJson = JSON.stringify(this.warrantyInfos);

        if (this.files && this.files.length > 0) {
            for (const file of this.files) {
                formData.append('AttachmentFiles', file);
            }
        }

        if (this.warrantyInfos && this.warrantyInfos.length > 0) {
            for (let i = 0; i < this.warrantyInfos.length; i++) {
                formData.append(
                    `WarrantyInfos[${i}].id`,
                    this.warrantyInfos[i].id
                );
                formData.append(
                    `WarrantyInfos[${i}].status`,
                    this.warrantyInfos[i].status
                );
                formData.append(
                    `WarrantyInfos[${i}].dueDate`,
                    this.warrantyInfos[i].dueDate
                );
            }
        }

        this.warrantyService.createWarrantyClaim(formData).subscribe(
            (item) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Tạo phiếu bảo hành thành công',
                });
                setTimeout(() => {
                    this.router.navigate(['/pages/warranty/warranty-request']);
                }, 1000);
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
        const files = event.target.files;
        const maxFileCount = 5; // Tối đa 5 file
        const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.bmp)$/i; // Các định dạng được phép
        const maxSize = 3 * 1024 * 1024; // 3MB
        if (files.length > maxFileCount) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: `Vui lòng chỉ chọn tối đa ${maxFileCount} file.`, // Nội dung của thông báo
            });
            // alert();
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Kiểm tra kích thước file
            if (file.size > maxSize) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: `File "${file.name}" vượt quá kích thước tối đa 3MB.`,
                });
                return;
            }

            if (!allowedExtensions.exec(file.name)) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: `File "${file.name}" không phải định dạng cho phép (jpeg, jpg, png, gif, bmp).`,
                });
                return;
            }
        }
        this.files = files;
    }
}
