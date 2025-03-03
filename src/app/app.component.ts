import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  title = 'post-it';

  ngOnInit(): void {
    initFlowbite();
  }
}
