import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize, map, Observable, Subscription } from 'rxjs';
import { Stream } from '../model/stream';
import { User } from '../model/user';
import { OceanOSService } from '../services/ocean-os.service';

@Component({
  selector: 'oos-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

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
    streams: Observable<Stream[]>;
    streamName: string = "";
    streamDescription: string = "";
    public timezones:Array<any> = ["Europe/Zurich","Europe/Lisbon","Europe/Paris","Europe/Berlin"];
    user: User = new User();
    btnDisabled: boolean = false;
    fileName: string = "";
    uploadProgress:number = 0;
    uploadSub: Subscription | null = null;

    constructor(
        private oos: OceanOSService,
        private router: Router,
        private http: HttpClient,
        private snackbar: MatSnackBar) { 
        
        this.oos.settings().subscribe( s => { this.user = s });
        this.streams = this.oos.streams().pipe( map (ts => ts.filter( t => t.type === 'STREAM') ) );
    }

    deleteStream(stream:Stream) {
        this.oos.deleteStream(stream)
    }

    addStream() {
        if (this.streamName !== "")
            this.oos.putStream( new Stream({ 
                _id: `${this.streamName}_STREAM`, 
                uid: this.user._id,
                name: this.streamName, 
                content: {
                    description: this.streamDescription,
                    skin: "oos"
                }, 
                type: "STREAM", 
                icon: this.oos.getStreamStyle('STREAM').icon, 
                color: this.oos.getStreamStyle('STREAM').color
            }));
        this.streamName = "";
        this.streamDescription = "";
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

    setStream(stream:Stream) {
        this.streamName = stream.name;
        this.streamDescription = stream.content.description;
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
            .pipe( finalize(() => this.reset()) )
            .subscribe( (event:any) => {
                if (event.type == HttpEventType.Response) {
                    //console.log("response")
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
