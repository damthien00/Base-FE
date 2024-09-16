import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'empty',
                loadChildren: () =>
                    import('./empty/emptydemo.module').then(
                        (m) => m.EmptyDemoModule
                    ),
            },
            {
                path: 'products/show-product',
                loadChildren: () =>
                    import('./products/show-product/show-product.module').then(
                        (m) => m.ShowProductModule
                    ),
            },
            {
                path: 'warehouse/stock-in',
                loadChildren: () =>
                    import('./warehouse/stock-in/show/show.module').then(
                        (m) => m.ShowModule
                    ),
            },
            {
                path: 'warehouse/stock-in/create',
                loadChildren: () =>
                    import('./warehouse/stock-in/create/create.module').then(
                        (m) => m.CreateModule
                    ),
            },
            {
                path: 'stock-transfer',
                loadChildren: () =>
                    import(
                        './warehouse/stock-transfer/stock-transfer.module'
                    ).then((m) => m.StockTransferModule),
            },
            {
                path: 'branch',
                loadChildren: () =>
                    import('./branch/show/show.module').then(
                        (m) => m.ShowModule
                    ),
            },

            {
                path: 'warranty/warranty-certificate',
                loadChildren: () =>
                    import(
                        './warranty/warranty-certificate/warranty-certificate.module'
                    ).then((m) => m.WarrantyCertificateModule),
            },
            {
                path: 'warranty/warranty-request',
                loadChildren: () =>
                    import('./warranty/warranty-request/show/show.module').then(
                        (m) => m.ShowModule
                    ),
            },
            {
                path: 'warranty/warranty-policy',
                loadChildren: () =>
                    import('./warranty/warranty-policy/show/show.module').then(
                        (m) => m.ShowModule
                    ),
            },

            {
                path: 'products/create-product',
                loadChildren: () =>
                    import(
                        './products/create-product/create-product.module'
                    ).then((m) => m.CreateProductModule),
            },
            {
                path: 'products/update-product/:id',
                loadChildren: () =>
                    import(
                        './products/update-product/update-product.module'
                    ).then((m) => m.UpdateProductModule),
            },
            {
                path: 'product-category/show',
                loadChildren: () =>
                    import(
                        './product-category/show-product-category/show-product-category.module'
                    ).then((m) => m.ShowProductCategoryModule),
            },
            {
                path: 'brand/show-brand',
                loadChildren: () =>
                    import('./brand/brand.module').then((m) => m.BrandModule),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
