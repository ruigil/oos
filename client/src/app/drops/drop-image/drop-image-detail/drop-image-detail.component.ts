import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, Subscription, take, finalize, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeService } from '../../../services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from '../../../model/drop';
import { Stream } from '../../../model/stream';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'oos-photo-detail',
  templateUrl: './drop-image-detail.component.html',
  styleUrls: ['./drop-image-detail.component.scss']
})
export class DropImageDetailComponent implements AfterViewInit {

    drop:Drop = new Drop({ content: { filename: "", mimetype: "", originalname: ""} });
    recurrences: Array<{ key: string, value: string }> = [];
    btnDisabled: boolean = false; 
    dateISO: string = "";
    tin:any = null;
    fileName: string = "";
    uploadProgress:number = 0;
    uploadSub: Subscription | null = null;
    field = new FormControl('', [
        Validators.required,
    ]);    
    
    constructor(
        private oos: OceanOSService, 
        private route: ActivatedRoute, 
        private router: Router, 
        private dts: DateTimeService,
        private snackbar: MatSnackBar,
        private http: HttpClient) { 

        this.recurrences = this.dts.getRecurrences();
        combineLatest([this.oos.streams(),this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {
            let id:string = v[2].get("id") || "new";
            this.drop = id === 'new' ? new Drop({ 
                _id: "new",
                name: "", 
                type: "IMAGE_TYPE",
                content: { description: "", filename: "", mimetype: "", originalname: ""},
                recurrence: "none",
                streams: [this.oos.getStreamByType("IMAGE_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

            this.dateISO = this.dts.getDateISO(this.drop.date);
            this.fileName = this.drop.content!.originalname;

        });
    }
    ngAfterViewInit(): void {
        //this.tin = new Typester({ el: document.querySelector('[contenteditable]') });
    }


    onFileSelected(event:any) {

        const file:File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("file", file);

            this.uploadSub = this.http.post("/api/upload", formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe( finalize(() => this.reset()))
            .subscribe( (event:any) => {
                if (event.type == HttpEventType.Response) {
                    this.drop.content = { ...this.drop.content, filename: event.body.filename, mimetype: event.body.mimetype, originalname: event.body.originalname }
                }
                if (event.type == HttpEventType.UploadProgress) {
                  this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                }
            })        
        }
    }   
    
    cancelUpload() {
        this.uploadSub!.unsubscribe();
        this.reset();
    }

    reset() {
        this.uploadProgress = 0;
        this.uploadSub = null;
    }     

    dropData(id:string) {
        const op = id ? "updated" :"added";
        const type = "photo";
        this.btnDisabled = true;
        this.drop.date = this.dts.getTimestamp(this.dateISO);
        this.drop.name = this.drop.name === "" ? this.drop.content.split('\n')[0] : this.drop.name;
        this.oos.putDrop(this.drop).then(
            (value) => {
                this.snackbar
                .open(`The ${type} was successfully ${op}`,"OK")
                .afterDismissed().subscribe( s => this.router.navigate(["home"]) );
            },
            (error) => { 
                this.snackbar
                .open(`The ${type} was NOT ${op}. Error [${error}]`,'OK')
                .afterDismissed().subscribe( s => this.btnDisabled = false );
            }
        );
    }

    selectedStreams(streams: Array<Stream>) {
        this.drop.streams = streams;
    }

}
