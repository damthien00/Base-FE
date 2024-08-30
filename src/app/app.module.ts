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
@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationMiddlewareService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
