import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { PlanetService } from './planet.service';

@Component({
  selector: 'app-root',
  template: '<div #host></div>'
})
export class AppComponent implements OnInit {
  @ViewChild('host') hostRef!: ElementRef<HTMLElement>;

  constructor(
    private engineService: EngineService,
    private planetService: PlanetService
  ) { }

  ngOnInit(): void {
    // Get 3D model to display.
    this.planetService.getModel()
      // Init three.js engine passing the host element and the 3D model.
      .then(model => this.engineService.init(this.hostRef.nativeElement, [model]));
  }

  @HostListener('window:resize')
  onResize(): void {
    // Update renderer layout on window resize.
    this.engineService.update();
  }
}
