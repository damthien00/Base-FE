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
import { Router } from '@angular/router';
import { OptionsFilterProductVariant } from 'src/app/core/DTOs/stock-in/optionFilterProductVariant';
import { StockInService } from 'src/app/core/services/stock-in.service';
import { WarrantyPolicyService } from 'src/app/core/services/warranty-policy.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';

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
  selector: 'app-branch-transfer',
  templateUrl: './branch-transfer.component.html',
  styleUrl: './branch-transfer.component.scss',
  providers: [MessageService],
})
export class BranchTransferComponent implements OnInit {
  imageUrl: string = environment.imageUrl;
  @ViewChild('searchInput') searchInput!: ElementRef;
  items: MenuItem[] | undefined;
  datas: any;
  nodes!: any[];
  selectedNodes: any;
  treeCategory: any[] = [];
  warrantyOptions: any[] = [];
  activeBarcode: boolean = false;
  stockInReceipt: any;
  filteredDatas: any;
  showProducts = false;
  showImeiTable = false;
  isValidForm: boolean = true;
  temporaryDiscountRate: number = 0;
  temporaryDiscountUnit: string = 'VND';

  displayDiscountModal = false;
  optionsFilterProduct: OptionsFilterProduct = new OptionsFilterProduct();
  frameNumber: any;
  engineNumber: any;

  imeiData: any[] = [];
  frameEngineData: any[] = [];

  onBarcode: boolean = false;
  constructor(
    private nodeService: NodeService,
    private productService: ProductService,
    private stockInService: StockInService,
    public functionService: FunctionService,
    private messageService: MessageService,
    private warrantyService: WarrantyPolicyService,
    private merchandiseService: MerchandiseService,
    private router: Router
  ) {
    this.nodeService.getFiles().then((files) => (this.nodes = files));
  }

  ngOnInit() {
    this.items = [
      { label: 'Kho hàng' },
      { label: 'Chuyển hàng', route: '/inputtext' },
      { label: 'Tạo phiếu chuyển hàng', route: '/inputtext' },
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

    this.loadWarrantyPolicies()
  }

  // onProductSearch(event: Event): void {
  //     const input = event.target as HTMLInputElement;
  //     const searchTerm = input.value.toLowerCase();

  //     // Lọc dữ liệu dựa trên từ khóa tìm kiếm

  //     this.optionsFillerProduct.KeyWord = searchTerm;
  //     this.loadProducts();
  // }

  loadWarrantyPolicies() {
    this.warrantyService.getWarrantyPolicies().subscribe((response: any) => {
      this.warrantyOptions = response.data.items.map((option: any) => {
        return {
          ...option,
          shortenedName: this.shortenName(option.name, 30) // Giới hạn độ dài tên
        };
      });
    });
  }

  shortenName(name: string, maxLength: number): string {
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + '...'; // Cắt ngắn và thêm ...
    }
    return name;
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
            warrantyPolicyId: item.warrantyPolicyId,
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
          warrantyPolicyId: item.warrantyPolicyId,
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

  async fetchProductImeiData(productId: number, productVariantId: number, branchId: number) {
    try {
      const response = await this.merchandiseService.getProductDetails(productId, productVariantId, branchId).toPromise();
      const items = response.data.items;
      this.frameEngineData = items;
    } catch (error) {
      console.error('Error fetching product IMEI data', error);
    }
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
    console.log(existingDetail);

    if (existingDetail) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng và tổng giá
      existingDetail.quantity += 1;
      existingDetail.total =
        existingDetail.quantity * existingDetail.price;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào inventoryStockInDetails
      const newDetail = {
        productId: item.productId,
        productImage: item.productImage,
        productName: item.productName,
        productVariantId: item.productVariantId,
        warrantyPolicyId: item.warrantyPolicyId,
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
      this.fetchProductImeiData(item.productId, item.productVariantId, item.warrantyPolicyId);
    }

    // Cập nhật lại các giá trị liên quan
    this.updatePaymentInfo();
    this.showProducts = false;
    this.searchInput.nativeElement.value = '';
    console.log(this.stockInReceipt);
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
      totalPrice - this.stockInReceipt.totalDiscountAmount;

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
    console.log(this.stockInReceipt);
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
    console.log(this.stockInReceipt.totalDiscountAmount);
    console.log(this.stockInReceipt);
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
          const productImeis =
            product.productImeis?.map((imei) => ({
              ...imei,
              type: 1,
            })) || [];
          return {
            productId: product.productId,
            productVariantId: product.productVariantId,
            productName: product.productName,
            productCode: product.productCode,
            productImage: product.productImage,
            unit: product.unit,
            price: product.price,
            quantity: product.quantity,
            totail: product.total,
            code: 'string',
            inventoryStockDetailProductImeis: productImeis,
          };
        }
      );

      const formData = {
        supplierId: 1,
        supplierName: 'string',
        subQuantity: this.stockInReceipt.inventoryStockInDetails.length,
        totalDiscount: this.stockInReceipt.totalDiscountAmount,
        branchId: 6,
        branchName: 'string',
        total: this.stockInReceipt.customerPayment,
        version: 0,
        code: 'string',
        note: this.stockInReceipt.note,
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
    }
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
      this.nodeService.getFiles().then((files) => (this.nodes = files));
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
}
