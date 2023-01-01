import * as THREE from "../../libs/three/three.module.js";
import { OrbitControls } from "../../libs/three/jsm/OrbitControls.js";

class App {
  constructor() {
    const container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);

    // 카메라 + 배경색
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 5);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    // 빛
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(0.2, 1, 1);
    this.scene.add(dirLight);

    // 랜더러
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(this.render.bind(this));

    // 물체 = 사각형
    const geometry = new THREE.BoxBufferGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    this.mesh = new THREE.Mesh(geometry, material);

    this.scene.add(this.mesh);

    // 화면 드래그로 orbit이동
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // 이벤트 리스너
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    // 화면 리사이즈
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    // 사각형 rotate
    this.mesh.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
