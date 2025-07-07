import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DEFAULT_QUERY_PARAMS } from '@shared/constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  defaultQueryParams = DEFAULT_QUERY_PARAMS;
}
