import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { FunctionService } from 'src/app/core/utils/function.utils';
import {
    Component,
    ViewChild,
    OnInit,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
    templateUrl: './create.component.html',
    providers: [MessageService],
})
export class CreateComponent implements OnInit {
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;
    valSwitch: boolean = false;

    items1: MenuItem[];

    maxImages: number = 9;
    base64_FileImage: string | null = null;
    base64_FileIamges: { file: File; preview: string }[] = [];
    createProductForm: FormGroup;
    selectedVariants: any[] = [];

    displayImagesModal: boolean = false;

    uploadedFiles: any[] = [];

    selectedFiles: boolean[] = [];

    currentVariant: any;

    selectedImageIndex: number | null = null;
    selectedImage: any;
    options: any;
    selectedOption: any;
    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        public functionService: FunctionService,
        private messageService: MessageService
    ) {
        this.createProductForm = this.fb.group({
            product_name: [''],
            product_sku: [''],
            product_barcode: [''],
            product_weight: [''],
            product_weight_unit: [''],
            product_unit: [''],
            category_id: [''],
            brand_id: [''],
            tags: [''],
            isSaleAllowed: [''],
            product_retail_price: [0], // Giá bán lẻ mặc định là 0
            product_import_price: [0], // Giá nhập mặc định là 0
            product_wholesale_price: [0], // Giá buôn mặc định là 0
            product_initial_stock: [0], // Giá buôn mặc định là 0
            product_cost_price: [0], // Giá buôn mặc định là 0
            attributes: this.fb.array([]), // Array để lưu trữ các thuộc tính sản phẩm
        });
    }

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Components' },
            { label: 'Form' },
            { label: 'InputText', route: '/inputtext' },
        ];
    }

    ngAfterViewInit() {
        // Nếu có sự thay đổi nào đó cần phải kiểm tra lại
        this.cdr.detectChanges();
    }
}
