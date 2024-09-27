// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//     name: 'numberFormat',
// })
// export class NumberFormatPipe implements PipeTransform {
//     transform(value: number, ...args: any[]): string {
//         if (value === null || value === undefined) {
//             return '';
//         }

//         // Định dạng số với dấu phân cách hàng nghìn là dấu phẩy và không có dấu phân cách thập phân
//         const formattedValue = value.toLocaleString('en-US', {
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//         });

//         // Thay dấu phân cách hàng nghìn (dấu phẩy) thành dấu chấm
//         return formattedValue.replace(/,/g, '.');
//     }
// }
