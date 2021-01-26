import { Injectable } from '@angular/core';
import { Mesh, MeshLambertMaterial, Object3D, SphereBufferGeometry, Texture, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EngineService } from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private model!: Object3D;
  private planet!: Mesh;
  private clouds!: Mesh;

  constructor(private engineService: EngineService) {
    // Subscribe to animation loop to update this 3d model.
    this.engineService.animation$.subscribe(() => this.animate());
  }

  getModel(): Promise<Object3D> {
    // Create the wrapper 3d model that will contain all real graphic parts.
    this.model = new Object3D();

    // Add the planet to the model.
    return this.addPlanet()
      // Add the clouds to the planet.
      .then(() => this.addClouds())
      // Add the satellite to the model.
      .then(() => this.addSatellite())
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
        MeshLambertMaterial is a material that render the light on its surface.
        See the official docs for extra parameters.
      */
      const material = new MeshLambertMaterial({ map: texture });

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
        MeshLambertMaterial is a material that render the light on its surface.
        See the official docs for extra parameters.
      */
      const material = new MeshLambertMaterial({
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

  private animate(): void {
    // Rotation animation based on the Y axis with 0.1 radians / second.
    this.planet.rotation.y += 0.1 / 60; // Remember ever the 60 fps division.

    /*
      Clouds animation:
      rotate the clouds on Y and Z axis to create a cross effect to the planet,
      the rotation speed is based on the planet rotation speed.
    */
    this.clouds.rotation.y = - this.planet.rotation.y;
    this.clouds.rotation.z = this.planet.rotation.y;
  }

  private getGLTF(name: string): Promise<Object3D> {
    /*
      Return a Promise version of GLTFLoader, the arguments:
      `assets/${name}` = the file path
      function = the success callback
      undefined = the progress callback
      rej = the fail callback
    */
    return new Promise((res, rej) => {
      new GLTFLoader().load(
        `assets/${name}`,
        gltf => {
          const result = new Object3D();
          result.add(...gltf.scene.children);
          res(result);
        },
        undefined,
        rej
      );
    });
  }

  private async addSatellite(): Promise<void> {
    // Load the object with the GLTFLoader.
    return this.getGLTF('satellite.gltf').then(object => {
      // Set the position and the rotation.
      object.position.set(-20, 5, 80);
      object.rotation.set(-0.2, 1.4, 0);

      // Add it to the model.
      this.model.add(object);
    });
  }
}
