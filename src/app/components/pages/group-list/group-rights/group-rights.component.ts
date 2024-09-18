import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrl: './group-rights.component.scss'
})
export class GroupRightsComponent implements OnInit {
  Roles: any;

  pageIndex: number = 1;
  pageSize: number = 30;
  WordSearch: string = "";
  totalRecordsCount: number = 0;
  name: string = '';

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    // this.authenticationService.GetAllRoleGroup(this.PageSize, this.PageIndex, this.WordSearch).subscribe((response: any) => {
    //   this.Roles = response.data;
    //   this.totalRecordsCount = response.totalRecordsCount;
    // });
  }
  onPageChange(event: any) {
    this.pageSize = event.rows;
    this.pageIndex = event.page + 1;

    // this.authenticationService.GetAllRoleGroup(this.PageSize, this.PageIndex, this.WordSearch).subscribe((response: any) => {
    //   this.Roles = response.data;
    //   this.totalRecordsCount = response.totalRecordsCount;
    // });
  }
  ClickFilter() {
    // this.authenticationService.GetAllRoleGroup(this.PageSize, this.PageIndex, this.WordSearch).subscribe((response: any) => {
    //   this.Roles = response.data;
    //   this.totalRecordsCount = response.totalRecordsCount;
    // });
  }
  blurInputSearchName(event: any) {
    this.WordSearch = event.target.value;
  }
  redirectToUpdateCustomerPage(roleGroupId: number): void {
    this.router.navigate(['/update-decentralization', roleGroupId]);
  }

  onNameChange(event: any): void {
    if (event.trim() === '') {
      const selectedRole = this.Roles.find((role:any) => role.name === this.name);
      if (selectedRole) {
        this.name = selectedRole.name;
      }
    }
  }
}
