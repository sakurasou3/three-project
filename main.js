import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// global変数
let scene, camera, renderer, pointLight, controls, ball2Mesh;

const init = () => {
  // scene, camera, rendererの作成
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50, // 視野角
    window.innerWidth / window.innerHeight, // アスペクト比（横：高さ）
    0.1, // 開始距離
    1000 // 終了距離
  );
  camera.position.set(0, 0, 500);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  // bodyタグの子要素として表示させる,
  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ジオメトリ（骨格）の作成
  // sphere: 球体
  // https://threejs.org/docs/index.html?q=geometry#api/en/geometries/SphereGeometry
  let ballGeometry = new THREE.SphereGeometry(
    100, // radius: 半径
    64, // widthSegments: ポリゴンの数。増やせば増やすほど球体に近づく
    32 // heightSegments: ポリゴンの分割数？
  );

  // テクスチャを追加
  let texture = new THREE.TextureLoader().load("./textures/earth.jpg");

  // マテリアル（色や質感など）の作成
  // https://threejs.org/docs/index.html?q=Material#api/en/materials/MeshPhysicalMaterial
  let ballMaterial = new THREE.MeshPhysicalMaterial({ map: texture });
  // メッシュ化
  // ジオメトリとマテリアルを組み合わせたもの＝オブジェクトやポリゴンと捉えて良さそう
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  let ball2Geometry = new THREE.SphereGeometry(
    10 // radius: 半径
  );
  let ball2Material = new THREE.MeshNormalMaterial();
  // メッシュ化
  // ジオメトリとマテリアルを組み合わせたもの＝オブジェクトやポリゴンと捉えて良さそう
  ball2Mesh = new THREE.Mesh(ball2Geometry, ball2Material);
  ball2Mesh.position.set(-200, -200, -200);
  scene.add(ball2Mesh);

  // 平行光源を追加する
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // ポイント光源を追加する
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  pointLight.decay = 1;
  pointLight.power = 1000;
  scene.add(pointLight);

  // ポイント光源の場所を特定する
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  // scene.add(pointLightHelper);

  // マウス操作
  controls = new OrbitControls(camera, renderer.domElement);

  // アニメーション開始
  animate();

  window.addEventListener("resize", onWindowResize);
};

const animate = () => {
  const now = Date.now();
  // ポイント光源を球体の周りを巡回させる
  pointLight.position.set(
    200 * Math.cos(now / 500),
    200 * Math.sin(now / 1000),
    200 * Math.sin(now / 500)
  );
  ball2Mesh.position.set(
    200 * Math.cos(now / 500),
    200 * Math.sin(now / 1000),
    200 * Math.sin(now / 500)
  );

  requestAnimationFrame(animate);
  // レンダリング
  renderer.render(scene, camera);
};

// ウィンドウのリサイズに対応する
const onWindowResize = () => {
  // rendererのサイズを随時更新する
  renderer.setSize(window.innerWidth, window.innerHeight);
  // カメラのアスペクト比を更新する
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

// ロードが完了したら、three.jsを生成する
window.addEventListener("load", init);
