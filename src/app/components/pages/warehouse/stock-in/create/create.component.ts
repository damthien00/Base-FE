import { OptionsFilterBranch } from './../../../../../core/DTOs/branch/optionsFilterBranchs';
import { StockInService } from './../../../../../core/services/stock-in.service';
import { FunctionService } from 'src/app/core/utils/function.utils';
import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { NodeService } from 'src/app/core/services/node.service';
import { ProductService } from 'src/app/core/services/product.service';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { OptionsFilterProductVariant } from 'src/app/core/DTOs/stock-in/optionFilterProductVariant';
import { AuthService } from 'src/app/core/services/auth.service';
import { OptionsFilterSupplier } from 'src/app/core/DTOs/supplier/OptionsFilterSupplier';

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
    datas: any;
    nodes!: any[];
    selectedNodes: any;
    isSubmitting: boolean = false;
    treeCategory: any[] = [];
    activeBarcode: boolean = false;
    stockInReceipt: any;
    filteredDatas: any;
    showProducts = false;
    isValidForm: boolean = true;
    temporaryDiscountRate: number = 0;
    temporaryDiscountUnit: string = 'VND';

    displayDiscountModal = false;
    optionsFilterProduct: OptionsFilterProduct = new OptionsFilterProduct();
    optionsFilterSupplier: OptionsFilterSupplier = new OptionsFilterSupplier();
    frameNumber: any;
    engineNumber: any;
    public userCurrent: any;
    supplierSelected: any;
    suppliers: any;
    onBarcode: boolean = false;
    constructor(
        private nodeService: NodeService,
        private productService: ProductService,
        private stockInService: StockInService,
        public functionService: FunctionService,
        private messageService: MessageService,
        private authService: AuthService,
        private router: Router
    ) {
        this.nodeService.getFiles().then((files) => (this.nodes = files));
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
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
    }

    // onProductSearch(event: Event): void {
    //     const input = event.target as HTMLInputElement;
    //     const searchTerm = input.value.toLowerCase();

    //     // Lọc dữ liệu dựa trên từ khóa tìm kiếm

    //     this.optionsFillerProduct.KeyWord = searchTerm;
    //     this.loadProducts();
    // }

    searchSupplier(data: any) {
        this.optionsFilterSupplier.nameOrPhone = data.query;
        this.stockInService
            .getSupplier(this.optionsFilterSupplier)
            .subscribe((data) => {
                this.suppliers = data.data;
            });
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
                const response = await this.productService.FilterProduct(
                    this.optionsFilterProduct
                );
                if (response.data.length > 0) {
                    console.log(response.data[0]);

                    const item = {
                        productId: response.data[0].id,
                        productImage: response.data[0].productImages[0].link,
                        productVariantId: 215,
                        productName: `${response.data[0].name}${
                            '-' +
                            response.data[0].productVariants[0].valuePropeties1
                        }${
                            '-' +
                            response.data[0].productVariants[0].valuePropeties2
                        }`,
                        productType: response.data[0].productType,
                        quantity: 1,
                        productCode: response.data[0].productVariants[0].code,
                        price: response.data[0].productVariants[0].price,
                        unit: response.data[0].unitName,
                        mass: response.data[0].mass,
                        total: response.data[0].productVariants[0].price,
                        frameNumber: '',
                        engineNumber: '',
                    };
                    this.addToCart(item);
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
        this.optionsFilterProduct.pageSize = 100000;

        let response = await this.productService.FilterProductView(
            this.optionsFilterProduct
        );

        let listP = [];

        response.data.forEach((item: any) => {
            if (item.productVariants && item.productVariants.length > 0) {
                item.productVariants.forEach((itemVariant) => {
                    listP.push({
                        productId: item.id,
                        name: item.name,
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
                        mass: itemVariant.quantity ? itemVariant.quantity : 0,
                        total:
                            item.productType === 1 ? 0 : itemVariant.price * 1,
                        frameNumber: '',
                        engineNumber: '',
                    });
                });
            } else {
                listP.push({
                    productId: item.id,
                    name: item.name,
                    productImage:
                        item.productImages && item.productImages.length > 0
                            ? item.productImages[0]?.link
                            : null,
                    productName: item.name,
                    productType: item.productType,
                    quantity: item.productType === 1 ? 0 : 1,
                    productCode: item.code || '', // Đảm bảo mã sản phẩm
                    price: item.sellingPrice,
                    unit: item.unitName,
                    mass: item.totalQuantity,
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

    onEnter(dataId: number) {
        const data = this.datas.find((p: any) => p.id === dataId);
        console.log(data);
        if (data && data.inputValue.trim()) {
            data.serialNumbers.push(data.inputValue.trim());
            data.inputValue = ''; // Clear input value for that product
        }
    }

    createWarehouseReceipt(receipt: WarehouseReceipt): void {
        // Gọi API để tạo phiếu nhập kho ở đây
        console.log('Phiếu nhập kho:', receipt);
        // Bạn có thể sử dụng HttpClient để gửi dữ liệu lên server
        // this.http.post('/api/warehouse-receipts', receipt).subscribe(response => {
        //   console.log('Tạo phiếu nhập kho thành công:', response);
        // }, error => {
        //   console.error('Lỗi khi tạo phiếu nhập kho:', error);
        // });
    }

    addToCart(item: any): void {
        console.log(item);
        // Kiểm tra xem sản phẩm đã có trong inventoryStockInDetails hay chưa
        const existingDetail = this.stockInReceipt.inventoryStockInDetails.find(
            (detail: any) => {
                console.log(detail, item);
                const isProductVariantIdExist =
                    detail.productVariantId !== undefined &&
                    item.productVariantId !== undefined;
                return (
                    detail.productId === item.productId &&
                    (!isProductVariantIdExist ||
                        detail.productVariantId === item.productVariantId)
                );
            }
        );
        if (existingDetail) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng và tổng giá
            // existingDetail.quantity += 1;
            // existingDetail.total =
            //     existingDetail.quantity * existingDetail.price;

            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: 'Sản phẩm đã có trong danh sách',
            });
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào inventoryStockInDetails
            const newDetail = {
                productId: item.productId,
                productImage: item.productImage,
                productName: item.productName,
                productVariantId: item.productVariantId,
                productType: item.productType,
                quantity: item.productType === 1 ? 0 : 1,
                productCode: item.productCode ? '' : '',
                price: item.price,
                unit: item.unit,
                total: item.productType === 1 ? 0 : item.price * 1,
                frameNumber: '',
                engineNumber: '',
            };
            this.stockInReceipt.inventoryStockInDetails.push(newDetail);
        }

        // Cập nhật lại các giá trị liên quan
        this.updatePaymentInfo();
        this.showProducts = false;
        this.searchInput.nativeElement.value = '';
    }

    updateTotal(data: any) {
        data.total = data.price * data.quantity;
        this.checkValidity();
        this.updatePaymentInfo();
    }

    updatePaymentInfo(): void {
        // Tính tổng số tiền
        const totalPrice = this.stockInReceipt.inventoryStockInDetails.reduce(
            (sum, detail) => sum + detail.total,
            0
        );

        // Cập nhật totalPrice
        this.stockInReceipt.totalPrice = totalPrice;

        // Giả sử bạn có logic tính chiết khấu dựa trên totalPrice
        // const discountAmount = this.calculateDiscount(totalPrice);

        // Cập nhật chiết khấu và tổng số tiền
        this.stockInReceipt.totalAmountPaid =
            totalPrice - Math.round(this.stockInReceipt.totalDiscountAmount);

        // Tính toán số tiền hoàn trả nếu khách hàng trả dư
        this.stockInReceipt.moneyReturn =
            this.stockInReceipt.customerPayment -
            this.stockInReceipt.totalAmountPaid;

        this.checkValidity();
    }

    calculateDiscount(totalPrice: number): number {
        // Giả sử bạn có logic tính chiết khấu, ví dụ 10% chiết khấu nếu totalPrice > 1000
        // if (totalPrice > 1000) {
        //     return totalPrice * 0.1; // 10% chiết khấu
        // }
        return 0;
    }

    removeProduct(index: number) {
        this.stockInReceipt.inventoryStockInDetails.splice(index, 1);
        this.updatePaymentInfo();
    }

    onDiscountOptionClick(unit: string) {
        this.temporaryDiscountUnit = unit;
    }

    openDiscountModal() {
        this.temporaryDiscountRate = this.stockInReceipt.discountRate;
        this.temporaryDiscountUnit = this.stockInReceipt.discountUnit;
        this.displayDiscountModal = true;
    }

    calculateTotalDiscount(): number {
        this.stockInReceipt.discountRate = this.temporaryDiscountRate;
        this.stockInReceipt.discountUnit = this.temporaryDiscountUnit;
        // Giả định bạn muốn tính toán giảm giá dựa trên tỷ lệ hoặc giá trị
        if (this.stockInReceipt.discountUnit === '%') {
            return (
                (this.stockInReceipt.totalPrice *
                    this.stockInReceipt.discountRate) /
                100
            );
        } else {
            return this.stockInReceipt.discountRate;
        }
    }

    saveDiscount() {
        this.stockInReceipt.totalDiscountAmount = this.calculateTotalDiscount();
        this.updatePaymentInfo();
        this.displayDiscountModal = false;
    }

    onEnterTest(product: any) {
        const imeiItem = {
            frameNumber: product.frameNumber,
            engineNumber: product.engineNumber,
        };
        // Nếu mảng productImeis chưa tồn tại, khởi tạo nó
        if (!product.productImeis) {
            product.productImeis = [];
        }

        // Đẩy đối tượng mới vào mảng productImeis
        product.productImeis.push(imeiItem);
        product.quantity = product.productImeis.length;
        product.total = product.quantity * product.price;
        this.updatePaymentInfo();
        // Xóa giá trị trong form sau khi đẩy vào mảng
        product.frameNumber = '';
        product.engineNumber = '';
        this.checkValidity();
    }

    removeImeiItem(product: any, index: number) {
        product.productImeis.splice(index, 1);
        product.quantity = product.productImeis.length;
        product.total = product.quantity * product.price;
        this.updatePaymentInfo();
    }

    onSubmit() {
        if (this.isSubmitting) return; // Nếu đang gửi, không làm gì cả
        this.isSubmitting = true; // Đặt biến trạng thái thành true
        this.stockInReceipt.inventoryStockInDetails.forEach((product) => {
            if (product.quantity == 0) {
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
                    } else {
                        imei.isValid = false;
                        delete imei.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
                    }
                });
            }
        });
        this.checkValidity();
        if (this.isValidForm) {
            const products = this.stockInReceipt.inventoryStockInDetails.map(
                (product) => {
                    console.log(product);
                    // let productNomal;
                    const productImeis =
                        product.productImeis?.map((imei) => ({
                            ...imei,
                            type: 1,
                            productId: product.productId,
                            productVariantId: product.productVariantId
                                ? product.productVariantId
                                : 1,
                            branchId: this.userCurrent.branchId,
                            branchName: this.userCurrent.branchName,
                        })) || [];

                    const createProductCodeNomalRequests = [
                        {
                            branchId: this.userCurrent.branchId,
                            branchName: this.userCurrent.branchName,
                            productId: product.productId,
                            productVariantId: product.productVariantId
                                ? product.productVariantId
                                : 1,
                            quantity: product.quantity,
                        },
                    ];

                    return {
                        productId: product.productId,
                        productVariantId: product.productVariantId
                            ? product.productVariantId
                            : 1,
                        productVariantName: product.productName,
                        productName: product.name || product.productName,
                        productCode: product.productCode,
                        productImage: product.productImage,
                        unit: product.unit,
                        price: product.price,
                        quantity: product.quantity,
                        totail: product.total,
                        code: 'string',
                        inventoryStockDetailProductImeis: productImeis,
                        createProductCodeNomalRequests,
                    };
                }
            );

            const formData = {
                supplierId: this.supplierSelected?.id || null,
                supplierName: this.supplierSelected?.name || null,
                subQuantity: this.stockInReceipt.inventoryStockInDetails.length,
                totalDiscount: this.stockInReceipt.totalDiscountAmount,
                branchId: this.userCurrent.branchId,
                branchName: this.userCurrent.branchName,
                total: this.stockInReceipt.customerPayment,
                version: 0,
                code: 'string',
                note: this.stockInReceipt.note,
                // createName: this.userCurrent.name,
                inventoryStockInDetails: products,
            };

            this.productService.createStockIn(formData).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Thêm phiếu kho thành công',
                    });

                    setTimeout(() => {
                        this.router.navigate(['/pages/warehouse/stock-in']);
                    }, 1000); // Thời gian trễ 2 giây
                },
                (error) => {
                    // Xử lý khi lỗi
                    console.error('Error creating inventoryStockIn:', error);
                }
            );
        } else {
            console.log('Form is invalid, please correct the errors.');
            this.isSubmitting = false;
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

    checkValidity() {
        if (this.stockInReceipt.inventoryStockInDetails.length === 0) {
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

        // Khởi tạo Set để kiểm tra trùng số khung và số máy
        const frameNumbers = new Set<string>(); // Set cho số khung
        const engineNumbers = new Set<string>(); // Set cho số máy
        const duplicateMessages: string[] = [];

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
                    // Kiểm tra số khung
                    if (imei.frameNumber) {
                        if (frameNumbers.has(imei.frameNumber)) {
                            imei.isValid = true;
                            imei.isValidMessage = `Số khung ${imei.frameNumber} đã tồn tại trong danh sách`;
                            duplicateMessages.push(imei.isValidMessage);
                        } else {
                            frameNumbers.add(imei.frameNumber);
                        }
                    }

                    // Kiểm tra số máy
                    if (imei.engineNumber) {
                        if (engineNumbers.has(imei.engineNumber)) {
                            imei.isValid = true;
                            imei.isValidMessage = `Số máy ${imei.engineNumber} đã tồn tại trong danh sách`;
                            duplicateMessages.push(imei.isValidMessage);
                        } else {
                            engineNumbers.add(imei.engineNumber);
                        }
                    }

                    // Kiểm tra cả hai số khung và số máy chưa được nhập
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
                    } else {
                        // Kiểm tra số khung và số máy đã tồn tại trong hệ thống chưa
                        this.stockInService
                            .checkExistEngineAndFrame(
                                imei.frameNumber,
                                imei.engineNumber
                            )
                            .subscribe(
                                (exists) => {
                                    if (exists.data) {
                                        imei.isValid = true;
                                        imei.isValidMessage =
                                            'Số khung hoặc số máy đã tồn tại';
                                        duplicateMessages.push(
                                            imei.isValidMessage
                                        );
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
                        delete imei.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
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

        // Hiển thị thông báo nếu có trùng lặp
        if (duplicateMessages.length > 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: duplicateMessages.join(', '),
            });
        }

        if (this.isValidForm) {
            // Form hợp lệ
        } else {
            // Form không hợp lệ
        }
    }
}
