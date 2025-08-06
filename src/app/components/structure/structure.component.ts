import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ROW_ID } from '@shared/constants';
import { filter, map, startWith, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-structure',
  standalone: true,
  imports: [],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.scss'
})
export class StructureComponent {
private readonly router = inject(Router);
private readonly route = inject(ActivatedRoute);
rowId = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.route.snapshot.firstChild?.params?.[ROW_ID]),
      startWith(this.route.snapshot.firstChild?.params?.[ROW_ID]),
      distinctUntilChanged()
    )
  );
}
