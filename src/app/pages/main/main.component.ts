import { Component, OnInit } from "@angular/core";
import {RoomComponent} from "./room/room.component";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  standalone: true,
  styleUrls: ["./main.component.css"],
  imports: [
    RoomComponent
  ]
})
export class MainComponent {

}
