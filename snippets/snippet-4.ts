import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Object3D, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  scene!: Scene;
  camera!: PerspectiveCamera;
  animation$: Observable<void>;
  private webGLRenderer!: WebGLRenderer;
  private animation = new Subject<void>();

  constructor() {
    // Init animation observable to allow other services to subscribe it.
    this.animation$ = this.animation.asObservable();
  }

  init(host: HTMLElement, models: Object3D[]): void {
    // Init three.js renderer, the engine that keep updated the models in the scene.
    this.webGLRenderer = new WebGLRenderer();
    // Add the renderer to the host HTML element.
    host.appendChild(this.webGLRenderer.domElement);

    // Create the scene, it's the main three.js component and it will contains all the models.
    this.scene = new Scene();

    // Add the 3D models to the scene.
    this.scene.add(...models);

    /*
      Init the camera that will show the scene, the arguments:
      60 = vertical field of vision.
      1 = initial aspect ratio, this value will be overrided by 'update' method.
      0.1 = the nearest point that camera will show.
      500 = the farther point that camera will show.
    */
    this.camera = new PerspectiveCamera(60, 1, 0.1, 500);

    // Set the camera starting position and the 'look' direction, both with x, y and z.
    this.camera.position.set(0, 0, 110);
    this.camera.lookAt(0, 0, 0);

    // Init the orbital controls of camera (plugin)
    const controls = new OrbitControls(this.camera, this.webGLRenderer.domElement);
    controls.enablePan = false;
    controls.rotateSpeed = 0.7;

    /*
      Create the main light that will illuminate the materials, the arguments:
      '#FFF' = the color of the light, white.
      1.2 = the intensity of the light.
      ... = see the official docs for extra parameters.
    */
    const light = new PointLight('#FFF', 1.2);
    light.position.set(100, 0, 130);
    this.scene.add(light);

    // Update the screen layout.
    this.update();

    // Fire the animation loop.
    this.animate();
  }

  update(): void {
    // Set the size of the renderer.
    this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);

    // Set the aspect ratio of the camera.
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private animate(): void {
    // Notify all the subscribers to update their models.
    this.animation.next();

    // Update the scene and the camera with the renderer.
    this.webGLRenderer.render(this.scene, this.camera);

    // Bind this 'animate' method to the browser animation API to perform a 'repaint' loop.
    window.requestAnimationFrame(() => this.animate());
  }
}
