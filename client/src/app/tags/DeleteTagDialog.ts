import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    tag: string;
}

@Component({
    selector: 'delete-tag-dialog',
    templateUrl: 'delete-tag-dialog.html',
})
export class DeleteTagDialog {
    constructor(
        public dialogRef: MatDialogRef<DeleteTagDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
    
    onNoClick(): void {
        this.dialogRef.close();
    }
}