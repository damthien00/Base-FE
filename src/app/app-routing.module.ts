import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from 'src/app/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { userInfoGuardGuard } from './core/guards/user-info.guard';
import { aU } from '@fullcalendar/core/internal-common';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    canActivate: [userInfoGuardGuard],
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: '',
                            canActivate: [AdminGuard],
                            loadChildren: () =>
                                import(
                                    'src/app/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        {
                            path: 'dashboard',
                            canActivate: [AdminGuard],
                            loadChildren: () =>
                                import(
                                    'src/app/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        {
                            path: 'pages',
                            canActivate: [AdminGuard],
                            loadChildren: () =>
                                import('./components/pages/pages.module').then(
                                    (m) => m.PagesModule
                                ),
                        },
                    ],
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('src/app/components/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },
                {
                    path: 'landing',
                    loadChildren: () =>
                        import(
                            'src/app/components/landing/landing.module'
                        ).then((m) => m.LandingModule),
                },
                {
                    path: 'warranty-lookup',
                    loadChildren: () =>
                        import(
                            'src/app/components/pages/warranty/warranty-lookup/warranty-lookup.module'
                        ).then((m) => m.WarrantyLookupModule),
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
