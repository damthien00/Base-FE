// Trong file admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import roleConstant from '../constants/role.constant';


@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private roles = roleConstant;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.hasRole(this.roles.admin)||this.authService.hasRole(this.roles.master)) {
      return true;
    } else {
      this.router.navigate(['/admin/auth/login']);
      return false;
    }
  }

}
