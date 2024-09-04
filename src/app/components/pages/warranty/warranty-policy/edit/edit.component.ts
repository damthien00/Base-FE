import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
    @Input() categoryId!: number;
    displayModal: boolean = false;
    @Output() warrantyPolicyUpdated = new EventEmitter<any>();
    constructor() {}

    ngOnInit() {}
    showModalDialog(): void {
        this.displayModal = true;
    }
}
