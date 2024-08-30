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
                path: 'products/show',
                loadChildren: () =>
                    import('./products/show/show.module').then(
                        (m) => m.ShowModule
                    ),
            },
            {
                path: 'warehouse/stock-in',
                loadChildren: () =>
                    import('./warehouse/stock-in/stock-in.module').then(
                        (m) => m.StockInModule
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
                    import('./branch/branch.module').then(
                        (m) => m.BranchModule
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
                    import(
                        './warranty/warranty-request/warranty-request.module'
                    ).then((m) => m.WarrantyRequestModule),
            },
            {
                path: 'warranty/warranty-policy',
                loadChildren: () =>
                    import(
                        './warranty/warranty-policy/warranty-policy.module'
                    ).then((m) => m.WarrantyPolicyModule),
            },

            {
                path: 'products/create',
                loadChildren: () =>
                    import('./products/create/create.module').then(
                        (m) => m.CreateModule
                    ),
            },
            {
                path: 'product-category/show',
                loadChildren: () =>
                    import(
                        './product-category/show-product-category/show-product-category.module'
                    ).then((m) => m.ShowProductCategoryModule),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
