import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    isLoggedIn(): boolean {
        // Giả định rằng bạn lưu token trong localStorage sau khi người dùng đăng nhập thành công
        const token = localStorage.getItem('token');

        // Kiểm tra nếu token tồn tại và không rỗng
        if (token) {
            // Ở đây, bạn có thể thêm logic để kiểm tra token hợp lệ (ví dụ: không hết hạn)
            return true;
        }

        return false;
    }
}
