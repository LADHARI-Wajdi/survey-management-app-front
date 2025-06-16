// shared/directives/debounce-click.directive.ts
import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]',
  standalone: true
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500;
  @Output() appDebounceClick = new EventEmitter<any>();
  
  private clicks = new Subject<any>();
  private subscription: Subscription | undefined;

  constructor() { }

  ngOnInit(): void {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(event => {
      this.appDebounceClick.emit(event);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}