import { NgModule } from '@angular/core';
import {
    HashLocationStrategy,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from 'src/app/components/notfound/notfound.component';
import { ProductService } from './core/services/product.service';
import { CountryService } from './core/services/country.service';
import { CustomerService } from './core/services/customer.service';
import { EventService } from './core/services/event.service';
import { IconService } from './core/services/icon.service';
import { NodeService } from './core/services/node.service';
import { PhotoService } from './core/services/photo.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationMiddlewareService } from 'src/app/core/interceptors/token.interceptor';
import { MessageService } from 'primeng/api';
import { ToastService } from './core/services/toast.service';
import { SharedModule } from './shared/modules/shared.module';
@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule, SharedModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        MessageService,
        ToastService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationMiddlewareService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
