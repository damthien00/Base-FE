import { FunctionService } from 'src/app/core/utils/function.utils';
import { NumberFormatPipe } from 'src/app/shared/pipes/numberFormat.pipe';
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
import { ActivatedRoute, Router } from '@angular/router';
import { OptionsFilterProductVariant } from 'src/app/core/DTOs/stock-in/optionFilterProductVariant';
import { StockInService } from 'src/app/core/services/stock-in.service';
import { WarrantyPolicyService } from 'src/app/core/services/warranty-policy.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-branch-receiving',
  templateUrl: './branch-receiving.component.html',
  styleUrl: './branch-receiving.component.scss',
  providers: [MessageService]
})
export class BranchReceivingComponent {
  imageUrl: string = environment.imageUrl;
  @ViewChild('searchInput') searchInput!: ElementRef;
  items: MenuItem[] | undefined;
  datas: any;
  nodes!: any[];
  selectedNodes: any;
  treeCategory: any[] = [];
  branch: any[] = [];
  activeBarcode: boolean = false;
  stockInReceipt: any;
  // filteredDatas: any;
  showProducts = false;
  showImeiTable = false;
  isValidForm: boolean = true;
  temporaryDiscountRate: number = 0;
  temporaryDiscountUnit: string = 'VND';
  public userCurrent: any;
  selectedBranch: any;
  ladingId!: number;
  recipientNote!: string;
  totalQuantity!: number;
  totalQuantity2!: number;
  totalQuantityProduct!: number;
  displayConfirmation: boolean = false; 

  displayDiscountModal = false;
  optionsFilterProduct: OptionsFilterProduct = new OptionsFilterProduct();
  frameNumber: any;
  engineNumber: any;
  displayedProducts: any;
  displayedProducts2: any;
  public url = environment.url;
  ladingData: any = {};
  groupedByProductId: any[] = [];
  groupedByProductVariantId: any[] = [];

  imeiData: any[] = [];
  frameEngineData: any[] = [];
  filteredDatas: any[] = [];
  isAccept: boolean = false;

  onBarcode: boolean = false;
  constructor(
    private nodeService: NodeService,
    private productService: ProductService,
    private stockInService: StockInService,
    public functionService: FunctionService,
    private messageService: MessageService,
    private warrantyService: WarrantyPolicyService,
    private merchandiseService: MerchandiseService,
    private authService: AuthService,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
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
      { label: 'Chuyển hàng', route: '/inputtext' }
    ];
    this.datas = [
      {
        id: 1,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Cắt Cỏ',
        inputValue: '',
        serialNumbers: ['SK212/SM18'],
        purchasePrice: null,
        unit: 'Cái',
        price: 1200000,
        inventory: 5,
        totalPrice: 6000000,
      },
      {
        id: 2,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Phun Thuốc',
        serialNumbers: [],
        purchasePrice: null,
        inputValue: '',
        unit: 'Bộ',
        price: 800000,
        inventory: 7,
        totalPrice: 5600000,
      },
      {
        id: 3,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Xới Đất',
        serialNumbers: ['SK314/SM28', 'SK315/SM29'],
        purchasePrice: null,
        inputValue: [],
        unit: 'Cái',
        inventory: 3,
        price: 1500000,
        totalPrice: 4500000,
      },
      {
        id: 4,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Bơm Nước',
        serialNumbers: [],
        purchasePrice: null,
        inputValue: '',
        unit: 'Cái',
        inventory: 2,
        price: 950000,
        totalPrice: 1900000,
      },
      {
        id: 5,
        productImage:
          'http://static.sieuthimaynongnghiep.vn/w500/Uploaded/2018_06_20/p1177l4018slide_QQVH.jpg',
        productName: 'Máy Nghiền Bột',
        serialNumbers: [],
        purchasePrice: null,
        inputValue: '',
        unit: 'Cái',
        inventory: 8,
        price: 2500000,
        totalPrice: 20000000,
      },
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

    this.CallSnaphot();
    this.FillDataById();
  }

  CallSnaphot(): void {
    this.ladingId = +this.route.snapshot.paramMap.get('id')!;
  }

  showConfirmDialog(): void {
    this.displayConfirmation = true;
  }

  hideConfirmDialog(): void {
    this.displayConfirmation = false;
  }

  FillDataById(): void {
    const id = this.ladingId; // Lấy ID từ URL
    this.httpClient.get(`${this.url}/api/bill-of-lading/get-by-id?Id=${id}`)
      .subscribe((response: any) => {
        if (response && response.data) {
          this.ladingData = response.data; // Gán dữ liệu vào biến `ladingData`
          this.isAccept = this.ladingData.iAccepted === 'accept';
          const groupedProducts = this.groupProductsByVariant(this.ladingData.inventoryStockDetailProductImeis);
          this.displayedProducts = groupedProducts; 

          const groupedProducts2 = this.groupProductsByVariant2(this.ladingData.billOfLadingProductNormals);
          this.displayedProducts2 = groupedProducts2; 

          this.totalQuantity = this.calculateTotalQuantity(groupedProducts);
          this.totalQuantity2 = this.calculateTotalQuantity(groupedProducts2);
          this.totalQuantityProduct = this.totalQuantity + this.totalQuantity2;
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  groupProductsByVariant(products: any[]): any[] {
    const productMap = new Map<string, any>();
  
    products.forEach(product => {
      const key = `${product.productId}-${product.productVariantId}`;
      if (productMap.has(key)) {
        const existingProduct = productMap.get(key);
        existingProduct.quantity += 1;
        existingProduct.totalAmountVariant = existingProduct.quantity * existingProduct.productVariantPrice;
        existingProduct.totalAmountProduct = existingProduct.quantity * existingProduct.productPrice;
      }
      else {
        productMap.set(key, { 
          productId: product.productId, 
          productVariantId: product.productVariantId,
          productName: product.productName,
          productVariantName: product.productVariantName,
          productImage: product.productImage,
          productVariantImage: product.productVariantImage,
          productPrice: product.productPrice,
          productVariantPrice: product.productVariantPrice,
          totalAmountProduct: product.productPrice,
          totalAmountVariant: product.productVariantPrice,
          quantity: 1
        });
      }
    });
  
    return Array.from(productMap.values()); // Convert map values to an array
  }

  groupProductsByVariant2(products: any[]): any[] {
    const productMap = new Map<string, any>();
  
    products.forEach(product => {
      const key = `${product.productId}-${product.productVariantId}`;
      if (productMap.has(key)) {
        const existingProduct = productMap.get(key);
        existingProduct.quantity += 1;
        existingProduct.totalAmountVariant = existingProduct.quantity * existingProduct.productVariantPrice;
        existingProduct.totalAmountProduct = existingProduct.quantity * existingProduct.productPrice;
      }
      else {
        productMap.set(key, { 
          productId: product.productId, 
          productVariantId: product.productVariantId,
          productName: product.productName,
          productVariantName: product.productVariantName,
          productImage: product.productImage,
          productVariantImage: product.productVariantImage,
          productPrice: product.productPrice,
          productVariantPrice: product.productVariantPrice,
          totalAmountProduct: product.productPrice,
          totalAmountVariant: product.productVariantPrice,
          quantity: product.quantity
        });
      }
    });
  
    return Array.from(productMap.values()); // Convert map values to an array
  }

  calculateTotalQuantity(products: any[]): number {
    return products.reduce((total, product) => total + product.quantity, 0);
  }

  
  onConfirm(): void {
    this.ladingData.iAccepted = 'accept'; // Gán giá trị "accept" cho iAccepted
    this.onSubmitUpdate();
  }

  // Hàm được gọi khi người dùng nhấn "Hủy"
  onReject(): void {
    this.ladingData.iAccepted = 'reject'; // Gán giá trị "reject" cho iAccepted
    this.onSubmitUpdate(false); // Chỉ gọi API đầu tiên khi reject
  }

  onSubmitUpdate(callSecondApi: boolean = true): void {
    // Tạo dữ liệu cho API /api/bill-of-lading/confilm
    const updateLadingData = {
      id: this.ladingId,
      iAccepted: this.ladingData.iAccepted,
      recipientNote: this.recipientNote,
      inventoryStockDetailProductImeis: this.ladingData.inventoryStockDetailProductImeis.map((item: any) => ({
        productId: item.productId,
        productVarriantId: item.productVariantId,
        productName: item.productName,
        productVarriantName: item.productVarriantName,
        inventoryStockDetailProductImeiId: item.id
      })),
      fromBranchId: this.ladingData.fromBranchId,
      toBranchId: this.ladingData.toBranchId,
      fromBranchName: this.ladingData.fromBranchName,
      toBranchName: this.ladingData.toBranchName,
      updateInvenRequests: this.ladingData.billOfLadingProductNormals.map((item: any) => ({
        productId: item.productId,
        productVarriantId: item.productVariantId,
        productName: item.productName,
        productVarriantName: item.productVarriantName,
        quantity: item.quantity
      }))
    };

    // Tạo dữ liệu cho API /api/inventory-stock-detail-product-imei/update-branch
    const inventoryUpdateData = {
      inventoryStockDetailProductImeiIds: this.ladingData.inventoryStockDetailProductImeis.map((item: any) => item.id),
      branchId: this.ladingData.toBranchId,
      branchName: this.ladingData.toBranchName
    };

    // Gọi API /api/bill-of-lading/confilm
    this.httpClient.put(`${this.url}/api/bill-of-lading/confilm`, updateLadingData)
      .subscribe(
        (response1) => {
          console.log('Cập nhật bill of lading thành công', response1);
          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: 'Cập nhật thành công',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/pages/stock-transfer']);
          }, 3000);

          // Chỉ gọi API thứ hai nếu người dùng nhấn "Xác nhận" (callSecondApi = true)
          if (callSecondApi) {
            this.httpClient.put(`${this.url}/api/inventory-stock-detail-product-imei/update-branch`, inventoryUpdateData)
              .subscribe(
                (response2) => {
                  console.log('Cập nhật inventory thành công', response2);
                  // this.messageService.add({
                  //   severity: 'success',
                  //   summary: '',
                  //   detail: 'Nhận hàng thành công',
                  //   life: 3000
                  // });
                  // setTimeout(() => {
                  //   this.router.navigate(['/pages/stock-transfer']);
                  // }, 3000);
                  this.hideConfirmDialog(); // Ẩn dialog sau khi cập nhật thành công
                },
                (error2) => {
                  console.error('Lỗi cập nhật inventory', error2);
                }
              );
          } else {
            this.hideConfirmDialog(); // Ẩn dialog sau khi từ chối
            this.messageService.add({
              severity: 'error',
              summary: '',
              detail: 'Bạn đã hủy chuyển hàng',
            });
            setTimeout(() => {
              this.router.navigate(['/pages/stock-transfer']);
            }, 1000);
          }
        },
        (error1) => {
          console.error('Lỗi cập nhật bill of lading', error1);
        }
      );
  }
  
}
