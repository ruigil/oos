import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter, finalize, map, Observable, Subscription } from 'rxjs';
import { Tag } from '../model/tag';
import { User } from '../model/user';
import { OceanOSService } from '../services/ocean-os.service';

@Component({
  selector: 'oos-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

    public currencies:Array<any> = [ 
        {name: "Swiss Franc", value:"CHF"},
        {name: "Euro", value:"EUR"},
        {name: "Dollar", value:"USD"},
        {name: "Pound", value:"GBP"}
    ];
    public previews:Array<any> = [ 
        {name: "Day", value:"day"},
        {name: "Week", value:"week"},
        {name: "Month", value:"month"},
        {name: "Year", value:"year"}
    ];
    streams: Observable<Tag[]>;
    streamName: string = "";
    streamDescription: string = "";
    public timezones:Array<any> = ["Europe/Zurich","Europe/Lisbon","Europe/Paris","Europe/Berlin"];
    user: User = new User({ id: "oos", username: "oos"});
    btnDisabled: boolean = false;
    fileName: string = "";
    uploadProgress:number = 0;
    uploadSub: Subscription | null = null;

    constructor(
        private oos: OceanOSService,
        private router: Router,
        private http: HttpClient,
        private snackbar: MatSnackBar) { 
        
        this.oos.settings().subscribe( s => {
            this.user = s
        });
        this.streams = this.oos.tags().pipe( map (ts => ts.filter( t => t.type === 'STREAM') ) );
    }

    deleteStream(stream:Tag) {
        this.oos.deleteTag(stream)
    }
    addStream() {
        if (this.streamName !== "")
            this.oos.putTag( new Tag({ _id: `${this.streamName}_STREAM`, name: this.streamName, description: this.streamDescription, type: "STREAM", icon: this.oos.getTagIC('STREAM').icon, color: this.oos.getTagIC('STREAM').color}) );
    }

    saveSettings() {
        this.btnDisabled = true;
        this.oos.putSettings(this.user).then(
            (value) => {
                this.snackbar
                .open(`The settings were successfully saved`,"OK")
                .afterDismissed().subscribe( s => this.router.navigate(["home"]) );
            },
            (error) => { 
                this.snackbar
                .open(`The seetings were NOT saved. Error [${error}]`,'OK')
                .afterDismissed().subscribe( s => this.btnDisabled = false );
            }
        );
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
                    console.log("response")
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
}
