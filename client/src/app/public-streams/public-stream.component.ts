import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, mergeMap, Observable, of } from "rxjs";
import { Drop } from "../model/drop";
import { Stream } from "../model/stream";
import { OceanOSService } from "../services/ocean-os.service";

@Component({
  selector: "oos-public-stream",
  templateUrl: "./public-stream.component.html",
  styleUrls: ["./public-stream.component.scss"],
})
export class PublicStreamComponent {
  stream$: Observable<Stream>;
  stream: Stream = new Stream();
  colors: { [key: string]: string } = { "background-color": "", color: "" };
  drops$: Observable<Drop[]> = of([]);
  streamsSelected: Map<string, Stream> = new Map();
  streamsAvailable: Map<string, Stream> = new Map();

  constructor(private oos: OceanOSService, private route: ActivatedRoute) {
    this.stream$ = this.route.paramMap.pipe(
      mergeMap((v) => this.oos.getStreamById(v.get("uid"), v.get("name")))
    );

    this.stream$.subscribe((s) => {
      this.stream = s;
      this.drops$ = this.getStream();
    });
  }

  unselectStream(stream: Stream) {
    if (this.streamsSelected.has(stream._id)) {
      this.streamsSelected.delete(stream._id);
    }
    this.drops$ = this.getStream();
  }

  selectStream(event: any) {
    const tag = event.option.value;
    if (!this.streamsSelected.has(tag._id)) {
      this.streamsSelected.set(tag._id, tag);
    }
    this.drops$ = this.getStream();
  }

  private getStream() {
    return this.oos
      .getPublicStream(this.stream.uid, [
        ...this.streamsSelected.keys(),
        this.stream._id,
      ])
      .pipe(
        map((ds) => {
          const dt = ds.map(
            (d) =>
              new Drop({
                ...d,
                streams: d.streams
                  .filter((s) => s.type != "PUBLIC")
                  .map(
                    (t) =>
                      new Stream({
                        ...t,
                        icon: this.oos.getStreamStyle(t.type)?.icon,
                        color: this.oos.getStreamStyle(t.type)?.color,
                      })
                  ),
              })
          );

          this.streamsAvailable.clear();

          dt.forEach((d) =>
            d.streams.forEach((s) => {
              if (s.type !== "PUBLIC" && !this.streamsSelected.get(s._id))
                this.streamsAvailable.set(s._id, s);
            })
          );

          return dt;
        })
      );
  }

  setColor(colors: { [key: string]: string }) {
    this.colors = colors;
  }
}
