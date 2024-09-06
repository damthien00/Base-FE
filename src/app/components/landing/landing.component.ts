// import { Customer } from './../../model/customer';
import { CustomerService } from 'src/app/core/services/customer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Product } from 'src/app/core/models/order';
import { ProductService } from 'src/app/core/services/product.service';
import { AutoComplete } from 'primeng/autocomplete';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

export class Customer {
    id?: number;
    code?: string;
    name?: string;
    phoneNumber?: string;
    email?: string;
    dayOfBirth?: Date;
    gender?: string;
    linkAvarta?: string;
    storeId?: number;
    storeName?: string;
    customerGroupId?: number;
    customerGroupName?: string;
    customerRankId?: number;
    customerRankName?: string;
    wardId?: number;
    cityName?: string;
    districtName?: string;
    wardName?: string;
    addressDetail?: string;
    referenceId?: number;
    referenceCode?: string;
    isDeleted?: number;
    version?: number;
    base64_image?: string;
}

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

export interface Order {
    orderId: number;
    createdAt: string; // Hoặc kiểu dữ liệu bạn đang sử dụng cho ngày giờ
    updatedAt: string; // Hoặc kiểu dữ liệu bạn đang sử dụng cho ngày giờ
    customer: Customer;
    products: Product[];
    paymentInfo: PaymentInfo;
    totalQuantity: number;
    totalAmount: number;
}

interface Unit {
    name: string;
    code: string;
}

interface PaymentInfo {
    totalAmount: number;
    discountAmount: number;
    amountPaid: number;
    amountPaidByCustomer: number;
    moneyReturn: number;
}

interface SuggestedAmount {
    id: number;
    value: number;
    label: string;
}

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css'],
    providers: [ConfirmationService, MessageService],
})
export class LandingComponent implements OnInit {
    @ViewChild('autoComplete') autoComplete!: AutoComplete;
    @ViewChild('autoCompleteCustomer') autoCompleteCustomer!: AutoComplete;
    //Product
    products!: Product[];
    filteredProducts: Product[] = [];
    optionsFillerProduct: OptionsFilterProduct = new OptionsFilterProduct();
    pageSize = 30;
    pageNumber = 1;
    totalRecords = 20;
    selectedProductAdvanced: Product;

    //Customer
    customers: Customer[];
    filteredCustomers: Customer[] = [];
    optionsFillerCustomer: OptionsFilterProduct = new OptionsFilterProduct();
    // selectedCustomer: Customer | null = null;
    selectedCustomerAdvanced: Customer;

    //Interface
    items: MenuItem[] | undefined;
    visibleSidebar2: boolean | undefined;
    suggestedAmounts: SuggestedAmount[] = [];
    first: number = 0;
    rows: number = 10;

    //Unit
    units: Unit[] | undefined;
    selectedUnit: Unit | undefined;

    //Order
    selectedOrder: Order | null = null;
    orders: Order[] = [];
    paymentInfo: PaymentInfo = {
        totalAmount: 0,
        discountAmount: 0,
        amountPaid: 0,
        amountPaidByCustomer: 0,
        moneyReturn: 0,
    };
    paymentMethod: string = 'cash';
    selectedOption: any;
    currentDateTime = new Date().toISOString();

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public layoutService: LayoutService,
        public router: Router,
        private productService: ProductService,
        private customerService: CustomerService
    ) {
        this.suggestedAmounts = [];
        this.units = [
            { name: '%', code: '%' },
            { name: 'VND', code: 'VND' },
        ];
        this.optionsFillerProduct.pageIndex = this.pageNumber;
        this.optionsFillerProduct.pageSize = this.pageSize;
    }

    async ngOnInit() {
        this.orders = [
            {
                orderId: 1,
                createdAt: this.currentDateTime,
                updatedAt: this.currentDateTime,
                paymentInfo: {
                    totalAmount: 0,
                    discountAmount: 0,
                    amountPaid: 0,
                    amountPaidByCustomer: 0,
                    moneyReturn: 0,
                },
                customer: {},
                products: [],
                totalQuantity: 0,
                totalAmount: 0,
            },
        ];
        this.selectedOrder = this.orders[0];
        if (this.units.length > 0) {
            this.selectedUnit = this.units[0];
        }

        this.paymentMethod = this.paymentMethod;
        this.paymentInfo.moneyReturn = this.paymentInfo.moneyReturn;

        // Call API Products
        let resProducts = await this.productService.FilterProduct(
            this.optionsFillerProduct
        );
        this.products = resProducts.data;

        // Call API Customers;
        let resCustomers = await this.customerService.filterCustomers(
            this.optionsFillerCustomer
        );
        this.customers = resCustomers.data;
        // console.log(this.customers);
    }

    visible: boolean = false;
    // showDialog() {
    //     this.visible = true;
    // }

    //Event
    // confirm(event: Event, message: string, acceptCallback: () => void, rejectCallback: () => void) {

    //     this.confirmationService.confirm({
    //         target: event.target as EventTarget,
    //         message: message,
    //         icon: 'pi pi-exclamation-circle',
    //         acceptIcon: 'pi pi-check mr-1',
    //         rejectIcon: 'pi pi-times mr-1',
    //         acceptLabel: 'Confirm',
    //         rejectLabel: 'Cancel',
    //         rejectButtonStyleClass: 'p-button-outlined p-button-sm',
    //         acceptButtonStyleClass: 'p-button-sm',
    //         accept: acceptCallback,
    //         reject: rejectCallback
    //     });
    // }

    //Products
    filterProducts(event: AutoCompleteCompleteEvent) {
        let filtered: Product[] = [];
        let query = event.query.toLowerCase();
        console.log(query);

        // Kiểm tra nếu không có ký tự đầu vào, hiển thị tất cả sản phẩm
        if (query === 'all') {
            console.log(this.products);
            this.filteredProducts = this.products;
        } else {
            for (let product of this.products) {
                if (product.name.toLowerCase().includes(query)) {
                    filtered.push(product);
                }
            }
            this.filteredProducts = filtered;
        }
        // this.autoComplete.show();
    }

    showAllProducts() {
        this.filteredProducts = this.products;
        this.autoComplete.show();
    }

    deleteProduct(index: number) {
        if (this.selectedOrder) {
            this.selectedOrder.products.splice(index, 1);
            this.updateTotals();
        }
    }

    //Customer
    showAllCustomers() {
        this.filteredCustomers = this.customers;
        this.autoCompleteCustomer.show(); // Mở dropdown của p-autoComplete
    }

    filterCustomers(event: AutoCompleteCompleteEvent) {
        let filtered: Customer[] = [];
        let query = event.query.toLowerCase();

        for (let customer of this.customers) {
            if (customer.name.toLowerCase().includes(query)) {
                filtered.push(customer);
            }
        }
        this.filteredCustomers = filtered;
    }

    onPageChange(event: PageEvent) {
        this.first = event.first;
        this.rows = event.rows;
    }

    deleteSelectCustomer() {
        this.selectedCustomerAdvanced = null;
    }

    //Orders
    addOrder() {
        const newOrder: Order = {
            orderId:
                this.orders.length > 0
                    ? this.orders[this.orders.length - 1].orderId + 1
                    : 1,
            createdAt: this.currentDateTime,
            updatedAt: '',
            customer: {},
            products: [],
            paymentInfo: {
                totalAmount: this.paymentInfo.totalAmount,
                discountAmount: this.paymentInfo.discountAmount,
                amountPaid: 0,
                amountPaidByCustomer: 0,
                moneyReturn: 0,
            },
            totalQuantity: 0,
            totalAmount: 0,
        };
        this.orders.push(newOrder);
        this.selectedOrder = newOrder;

        this.updatePaymentInfo();
    }

    deleteOrder(orderIndex: number) {
        // console.log(orderIndex);
        if (this.orders.length === 1 && orderIndex === 0) {
            this.orders[orderIndex].orderId = 1;
            this.orders[orderIndex].customer = {
                // customerId: 0,
                // customerName: '',
                // customerPhone: '',
                // customerAddress: ''
            };
            this.orders[orderIndex].products = [];
            console.log(
                'Cannot delete the last order. Resetting orderId to 1.'
            );
        } else {
            this.orders.splice(orderIndex, 1);
            if (this.orders.length > 0) {
                this.selectedOrder =
                    orderIndex > 0
                        ? this.orders[orderIndex - 1]
                        : this.orders[orderIndex];
            } else {
                this.selectedOrder = null;
            }
        }
        this.updatePaymentInfo();
        // this.visible = false;
    }

    onOrderClick(order: Order) {
        console.log(order);
        this.selectedOrder = order;
        this.updatePaymentInfo();
    }

    addCustomerToOrder(customer: Customer) {
        // Assuming this.selectedOrder is of type Order or undefined
        if (this.selectedOrder) {
            let updatedOrder: Order = {
                ...this.selectedOrder,
                customer: customer,
                // Ensure orderId is assigned a valid number
                orderId: this.selectedOrder.orderId || 0, // Replace 0 with a default value if needed
                // Include other properties as needed
            };

            this.selectedOrder = updatedOrder;
            // Now this.selectedOrder should have a valid orderId
        }

        console.log(this.selectedCustomerAdvanced);
        console.log(this.selectedOrder);
        this.autoCompleteCustomer.hide();
    }

    addProductToOrder(product: Product) {
        if (this.selectedOrder) {
            let existingProduct = this.selectedOrder.products.find(
                (p) => p.id === product.id
            );
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                let newProduct = {
                    ...product,
                    quantity: 1,
                };
                this.selectedOrder.products.push(newProduct);
            }
        }
        this.updateTotals();
        this.filteredProducts = null;
        this.selectedProductAdvanced = null;
        this.autoComplete.hide();

        // this.suggestPaymentAmounts(this.paymentInfo.amountPaid);
        // console.log(this.roundedAmounts);
    }

    //Payment
    payment() {
        console.log(this.selectedOrder);
    }

    updateTotals() {
        if (this.selectedOrder) {
            this.selectedOrder.totalQuantity =
                this.selectedOrder.products.length;
            this.selectedOrder.totalAmount = this.selectedOrder.products.reduce(
                (total, product) => total + product.price * product.quantity,
                0
            );
            this.updatePaymentInfo();
        }
    }

    updatePaymentInfo() {
        if (this.selectedOrder) {
            this.paymentInfo.totalAmount = this.selectedOrder.totalAmount;
            this.calculateTotal();
            this.calculateChange();
        }
    }

    calculateTotal() {
        if (this.selectedOrder) {
            const discountValue = this.paymentInfo.discountAmount;
            if (this.selectedUnit?.code === '%') {
                this.paymentInfo.amountPaid =
                    this.selectedOrder.totalAmount -
                    this.selectedOrder.totalAmount * (discountValue / 100);
            } else if (this.selectedUnit?.code === 'VND') {
                this.paymentInfo.amountPaid =
                    this.selectedOrder.totalAmount - discountValue;
            }
        }
        this.calculateChange();
        this.suggestPaymentAmounts();
        console.log(this.suggestedAmounts);
    }

    calculateChange() {
        if (this.selectedOrder) {
            this.paymentInfo.moneyReturn =
                this.paymentInfo.amountPaidByCustomer -
                this.paymentInfo.amountPaid;
        }
    }
    // selectedCustomer
    handlePaymentChange(event: any) {
        const amountPaidByCustomer = parseFloat(event);
        this.paymentInfo.amountPaidByCustomer = amountPaidByCustomer;
        this.calculateChange();
    }

    handleSelectOptionChange() {
        // Lấy giá trị đã chọn từ mảng suggestedAmounts
        const selectedAmount = this.suggestedAmounts.find(
            (item: any) => item.id === this.selectedOption.id
        ).value;
        if (selectedAmount !== undefined) {
            // Cập nhật paymentInfo.amountPaidByCustomer với giá trị đã chọn
            this.paymentInfo.amountPaidByCustomer = selectedAmount;
        }
        this.updatePaymentInfo();
    }

    suggestPaymentAmounts() {
        if (this.selectedOrder) {
            console.log(this.paymentInfo.amountPaid);
            const totalAmount = this.paymentInfo.amountPaid;
            this.suggestedAmounts = this.getSuggestedAmounts(totalAmount);
            console.log('Suggested payment amounts:', this.suggestedAmounts);
        }
    }

    getSuggestedAmounts(amount: number): any[] {
        const suggestions = [];
        const increments = [1000, 5000, 10000, 50000]; // Các bước làm tròn
        let idCounter = 1; // Biến đếm để tạo id duy nhất

        increments.forEach((increment) => {
            const suggestedAmount = Math.ceil(amount / increment) * increment;
            suggestions.push({
                id: idCounter++, // Tăng biến đếm và sử dụng làm id
                label: `${suggestedAmount.toLocaleString()}`,
                value: suggestedAmount,
            });
        });

        return suggestions;
    }

    // printOrder(selectedOrders: any) {
    //     const ordersWithPrice = selectedOrders.filter((order: any) => order.unitPrice > 0);
    //     const customerOrder = selectedOrders[0]; // Assuming all selected orders are from the same customer
    //     if (ordersWithPrice.length === selectedOrders.length) {
    //       this.printData.customerName = customerOrder.customerName;
    //       this.printData.phone = customerOrder.phone;
    //       this.printData.paymentDate = new Date();
    //       this.printData.orders = selectedOrders;
    //       this.printData.totalAmount = selectedOrders.reduce((sum: any, item: any) => sum + item.totalPrice, 0);
    //       this.printData.totalPaid = selectedOrders.reduce((sum: any, item: any) => sum + item.paid, 0);
    //       this.printData.paymentRequestTotal = selectedOrders.reduce((sum: any, item: any) => sum + item.paymentRequest, 0);

    //       setTimeout(() => {
    //         const printContent = document.getElementById('print-section')!.innerHTML;
    //         const printWindow = window.open('', '_blank');
    //         printWindow!.document.open();
    //         printWindow!.document.write(`
    //           <html>
    //           <head>
    //             <title>Print</title>
    //             <style>
    //               /* Add any styles you want for the print page here */
    //               .print-header {
    //                 text-align: center;
    //                 margin-bottom: 20px;
    //               }
    //               table {
    //                 width: 100%;
    //                 border-collapse: collapse;
    //               }
    //               th, td {
    //                 border: 1px solid #000;
    //                 padding: 8px;
    //                 text-align: left;
    //               }
    //               th {
    //                 background-color: #f2f2f2;
    //               }
    //             </style>
    //           </head>
    //           <body onload="window.print(); window.close();">
    //             ${printContent}
    //           </body>
    //           </html>
    //         `);
    //         printWindow!.document.close();
    //       }, 500);
    //     } else {
    //       alert('Vui lòng cập nhật đơn giá cho các đơn hàng trước khi in phiếu đề nghị thanh toán.');
    //     }

    // }
}
