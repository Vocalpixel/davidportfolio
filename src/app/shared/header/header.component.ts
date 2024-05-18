import { Component } from '@angular/core';
import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

    protected readonly dateTimestampProvider = dateTimestampProvider;
}
