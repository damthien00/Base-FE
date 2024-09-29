import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { Page } from '../core/enums/page.enum';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css'],
})
export class AppTopBarComponent {
    items!: MenuItem[];
    tieredItems: MenuItem[] = [];
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    items1: MenuItem[] | undefined;
    public userCurrent: any;
    showDropdown: boolean = false;
    public baseImageUrl = environment.url;

    @ViewChild('userInfo') userInfo!: ElementRef;
    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
    }

    ngOnInit() {
        this.items1 = [
            {
                label: 'Calendar',
                icon: 'pi pi-calendar',
                command: () => {
                    /* Your logic here */
                },
            },
            {
                label: 'Profile',
                icon: 'pi pi-user',
                command: () => {
                    /* Your logic here */
                },
            },
            {
                label: 'Settings',
                icon: 'pi pi-cog',
                routerLink: '/documentation',
            },
        ];
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const searchContainer = document.querySelector('.dropdown-user-info');
        const boxContainer = document.querySelector('.user-info');

        if (
            searchContainer &&
            !searchContainer.contains(target) &&
            !boxContainer.contains(target)
        ) {
            console.log(1);
            this.showDropdown = false;
        }
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    sfdf() {
        console.log(1);
    }

    handleLogOut() {
        this.authService.logout().subscribe((res) => {
            if (res.status == true) {
                this.authService.setAuthTokenLocalStorage(null);
                this.router.navigate([Page.Login]);
            }
        });
    }
}
