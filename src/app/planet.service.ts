import { Injectable } from '@angular/core';
import { Object3D } from 'three';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private model!: Object3D;

  constructor() { }

  getModel(): Promise<Object3D> {
    // Create the wrapper 3d model that will contain all real graphic parts.
    this.model = new Object3D();

    return Promise.resolve(this.model);
  }
}
