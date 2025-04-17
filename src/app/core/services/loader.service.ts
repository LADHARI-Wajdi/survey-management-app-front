// core/services/loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$: Observable<boolean> =
    this.loaderSubject.asObservable();

  constructor() {}

  show(): void {
    this.loaderSubject.next(true);
  }

  hide(): void {
    this.loaderSubject.next(false);
  }
}
