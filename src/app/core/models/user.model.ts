export interface User {
    id: number;
    name: string;
    email: string;
    // ... các thuộc tính khác của người dùng
}

export class UserModel implements User {
    constructor(
        public id: number,
        public name: string,
        public email: string // ... các thuộc tính khác của người dùng
    ) {}
}
