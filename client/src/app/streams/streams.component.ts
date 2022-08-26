import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteStreamDialog } from './delete-stream-dialog';

import { OceanOSService } from '../services/ocean-os.service';
import { Stream } from '../model/stream';


@Component({
  selector: 'oos-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent {
    @Output() onSelectTag = new EventEmitter<Stream[]>();
    @Input() selected: Array<Stream> = [];
    currentStream: Stream = new Stream({ content: { description: ""}});
    update:boolean = false;
    personalStreams: Observable<Stream[]>;
    publicStreams: Observable<Stream[]>;
    peopleStreams: Observable<Stream[]>;
    selectedStreams: Observable<Stream[]>;


    constructor(private oos: OceanOSService, private dialog:MatDialog) {

        this.selectedStreams = this.oos.selectedStreams();
        this.personalStreams = this.oos.unselectedStreams().pipe( map(ss => ss.filter( s => s.type === "PERSONAL")) );
        this.publicStreams = this.oos.unselectedStreams().pipe( map(ss => ss.filter( s => s.type === 'PUBLIC')) );
        this.peopleStreams = this.oos.unselectedStreams().pipe( map(ss => ss.filter( s => s.type === 'PEOPLE')) );

        this.selectedStreams.subscribe( (ts:Stream[]) => this.onSelectTag.emit(ts ) );
    }
    
    ngOnChanges(changes: SimpleChanges) {
        const previous = changes['selected'].previousValue || [];
        const current = changes['selected'].currentValue;
        // TODO: This is a flickery mechanism to show the selected tags
        // it assumes the array with the same length are equal, and because the tag selection
        // sends a new event it has the potential of an infine loop
        if (((current.length != previous.length))) {
            this.selected.map( (s:Stream) => this.oos.initStreamSelection(current) )
        } 
    }

    deleteStream(stream:Stream) {
        const dialogRef = this.dialog.open(DeleteStreamDialog, {
            width: '350px',
            data: {stream: stream.name },
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.oos.deleteStream(stream).then( () => console.log(stream.name + " deleted") );
          });    
    }

    newStream(type:string) {
        const streamName = this.currentStream.name.toLocaleUpperCase();
        const contentType = (type:string) => {
            switch (type) {
                case "PERSONAL": return {};
                case "PUBLIC": return { description: this.currentStream.content.description }
            };
            return {};
        }

        const stream:Stream = new Stream({ 
            name: streamName, 
            content: contentType(type), 
            color: this.oos.getStreamStyle(type).color, 
            icon: this.oos.getStreamStyle(type).icon, 
            type: type, 
        }); 
        this.oos.putStream(stream);
    }
    
    selectStream(stream:Stream) {
        this.oos.selectStream(stream);
    }

    unselectStream(stream:Stream) {
        if (!stream.type.endsWith("_TYPE")) this.oos.unselectStream(stream);
    }

}
