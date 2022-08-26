import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    stream: string;
}

@Component({
    selector: 'delete-stream-dialog',
    templateUrl: 'delete-stream-dialog.html',
})
export class DeleteStreamDialog {
    constructor(
        public dialogRef: MatDialogRef<DeleteStreamDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
    
    onNoClick(): void {
        this.dialogRef.close();
    }
}