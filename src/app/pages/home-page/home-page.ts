import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  title = 'Everyday Market App';
  angularVersion = VERSION.full;
}

