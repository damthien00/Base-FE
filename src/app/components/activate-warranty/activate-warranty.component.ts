import { Component, OnInit } from '@angular/core';
interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}
@Component({
    selector: 'app-activate-warranty',
    templateUrl: './activate-warranty.component.html',
    styleUrls: ['./activate-warranty.component.css'],
})
export class ActivateWarrantyComponent implements OnInit {
    countries: any[] | undefined;
    filteredCountries: any[] | undefined;
    constructor() {}
    products!: any[];
    ngOnInit() {}

    filterCountry(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.countries as any[]).length; i++) {
            let country = (this.countries as any[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredCountries = filtered;
    }
}
