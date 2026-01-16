/**
 * Particle Field - Dynamic 3D background
 * Creates an immersive particle system that responds to mouse movement
 */

import * as THREE from 'three';

export class ParticleField {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points;
  private mouse: THREE.Vector2;
  private animationId: number | null = null;

  constructor(container: HTMLElement) {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Mouse tracking
    this.mouse = new THREE.Vector2();
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // Create particle system
    this.particles = this.createParticles();
    this.scene.add(this.particles);

    // Handle resize
    window.addEventListener('resize', () => this.onResize(container));

    // Start animation
    this.animate();
  }

  private createParticles(): THREE.Points {
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color palette (primary blue and accent purple)
    const color1 = new THREE.Color(0x0ea5e9); // primary-500
    const color2 = new THREE.Color(0xa855f7); // accent-500

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random positions in a large sphere
      const radius = Math.random() * 100 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      // Blend between two colors
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onResize(container: HTMLElement): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Rotate particle system
    this.particles.rotation.y += 0.0005;
    this.particles.rotation.x += 0.0002;

    // Move camera based on mouse
    this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('resize', () => this.onResize);
    this.renderer.dispose();
    this.particles.geometry.dispose();
    if (this.particles.material instanceof THREE.Material) {
      this.particles.material.dispose();
    }
  }
}

// Initialize particle field when module loads
export function initParticleField(container: HTMLElement): ParticleField {
  return new ParticleField(container);
}
