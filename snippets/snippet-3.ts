import { Injectable } from '@angular/core';
import { Mesh, MeshBasicMaterial, Object3D, SphereBufferGeometry, Texture, TextureLoader } from 'three';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private model!: Object3D;
  private planet!: Mesh;
  private clouds!: Mesh;

  constructor() { }

  getModel(): Promise<Object3D> {
    // Create the wrapper 3d model that will contain all real graphic parts.
    this.model = new Object3D();

    // Add the planet to the model.
    return this.addPlanet()
      // Add the clouds to the planet.
      .then(() => this.addClouds())
      // Return the complete model.
      .then(() => this.model);
  }

  private getTexture(name: string): Promise<Texture> {
    /*
      Return a Promise version of TextureLoader, the arguments:
      `assets/${name}` = the file path
      res = the success callback
      undefined = the progress callback
      rej = the fail callback
    */
    return new Promise((res, rej) => {
      new TextureLoader().load(`assets/${name}`, res, undefined, rej);
    });
  }

  private addPlanet(): Promise<void> {
    // Load the texture with the TextureLoader.
    return this.getTexture('planet.jpg').then(texture => {
      /*
        Create the geometry of the planet, the arguments:
        50 = the radius of sphere.
        100 = the width segments of the geometry, keep a value greater than radius.
        100 = the height segments of the geometry, keep a value greater than radius.
        ... = see the official docs for extra parameters.
      */
      const geometry = new SphereBufferGeometry(50, 100, 100);

      /*
        The material of the planet, in this case only a texture.
        MeshBasicMaterial is a material that will NOT be affected by the scene light.
        See the official docs for extra parameters.
      */
      const material = new MeshBasicMaterial({ map: texture });

      // Create the final mesh with the geometry and the material.
      this.planet = new Mesh(geometry, material);

      // Add it to the model.
      this.model.add(this.planet);
    });
  }

  private addClouds(): Promise<void> {
    // Load the texture with the TextureLoader.
    return this.getTexture('clouds.png').then(texture => {
      /*
        Create the geometry of the clouds, a sphere that wrap the planet. The arguments:
        50.1 = the radius of the sphere, slightly enlarged by the planet.
        100 = the width segments of the geometry, keep a value greater than radius.
        100 = the height segments of the geometry, keep a value greater than radius.
        ... = see the official docs for extra parameters.
      */
      const geometry = new SphereBufferGeometry(50.1, 100, 100);

      /*
        The material of the clouds, in this case only a texture.
        MeshBasicMaterial is a material that will NOT be affected by the scene light.
        See the official docs for extra parameters.
      */
      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
      });

      // Create the final mesh with geometry and material.
      this.clouds = new Mesh(geometry, material);

      // Add it to the model.
      this.model.add(this.clouds);
    });
  }
}
