export interface User {
    id: number;
    userName: string;
    normalizedUserName: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: string;
    lockoutEnabled: boolean;
    accessFailedCount: number;
    name: string;
    phoneNumber: string;
    email: string;
    branchId: number;
    branchName: string;
    avatarUrl: string;
    permissions: string[];
    roles: Role[];
    // roleNames: string[];
    address: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}

interface Permission {
    id: number;
    name: string;
    displayName: string;
    parentPermissionId: number;
    description: string;
    childrens: string[];
}

// export class UserModel implements User {
//     constructor(
//         public id: number,
//         public name: string,
//         public email: string // ... các thuộc tính khác của người dùng
//     ) {}
// }
