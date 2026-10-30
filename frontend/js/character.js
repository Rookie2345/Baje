// ============================================================
// BAJE AI — 3D Character (Three.js Procedural)
// Creates a charming Nepali grandfather using Three.js primitives
// ============================================================

class BajeCharacter {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.character = null;
    this.parts = {};
    this.clock = new THREE.Clock();
    this.currentState = 'idle';
    this.isWebGLAvailable = false;
    this.animFrameId = null;

    this.init();
  }

  checkWebGL() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  init() {
    this.isWebGLAvailable = this.checkWebGL();

    if (!this.isWebGLAvailable || !this.canvas) {
      this.showFallback();
      return;
    }

    try {
      this.setupScene();
      this.setupLighting();
      this.createCharacter();
      this.animate();

      window.addEventListener('resize', () => this.onResize());
    } catch (e) {
      console.warn('3D character init failed:', e.message);
      this.showFallback();
    }
  }

  setupScene() {
    const container = document.getElementById('baje-canvas-container');
    const w = container.clientWidth || 340;
    const h = container.clientHeight || 380;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 1.6, 5.5);
    this.camera.lookAt(0, 1.4, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: window.devicePixelRatio <= 1,
      powerPreference: 'low-power'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false;
  }

  setupLighting() {
    // Ambient warm light
    const ambient = new THREE.AmbientLight(0xfff3e0, 0.8);
    this.scene.add(ambient);

    // Key light (warm from upper-left)
    const keyLight = new THREE.DirectionalLight(0xffcc88, 1.2);
    keyLight.position.set(-2, 4, 3);
    this.scene.add(keyLight);

    // Fill light (cyan accent from right)
    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.4);
    fillLight.position.set(3, 2, 2);
    this.scene.add(fillLight);

    // Rim light (gold from behind)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.3);
    rimLight.position.set(0, 3, -3);
    this.scene.add(rimLight);
  }

  createCharacter() {
    this.character = new THREE.Group();

    // ---- Color palette ----
    const skinColor    = 0xc8825a;  // warm Nepali skin tone
    const skinDark     = 0xb5714a;
    const clothColor   = 0x5b4a82;  // traditional purple-ish daura suruwal
    const waistcoat    = 0x3a2d5f;  // dark waistcoat
    const topiColor    = 0xb5293a;  // red dhaka topi
    const topiPattern  = 0xd4a017;  // gold pattern stripe
    const whiteColor   = 0xf0ede8;  // white (hair, mustache)
    const eyeWhite     = 0xffffff;
    const eyeDark      = 0x2c1810;
    const eyePupil     = 0x1a0a05;
    const browColor    = 0x6b4c3b;

    // ---- BODY (torso) ----
    const bodyGeo = new THREE.CylinderGeometry(0.36, 0.30, 0.85, 12);
    const bodyMat = new THREE.MeshLambertMaterial({ color: clothColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 0.6, 0);
    this.character.add(body);
    this.parts.body = body;

    // Waistcoat (slight overlay)
    const waistGeo = new THREE.CylinderGeometry(0.37, 0.31, 0.6, 12);
    const waistMat = new THREE.MeshLambertMaterial({ color: waistcoat });
    const waistMesh = new THREE.Mesh(waistGeo, waistMat);
    waistMesh.position.set(0, 0.65, 0.01);
    this.character.add(waistMesh);

    // Waistcoat buttons
    for (let i = 0; i < 3; i++) {
      const btnGeo = new THREE.SphereGeometry(0.025, 6, 6);
      const btnMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.position.set(0, 0.82 - i * 0.2, 0.37);
      this.character.add(btn);
    }

    // ---- NECK ----
    const neckGeo = new THREE.CylinderGeometry(0.10, 0.13, 0.18, 8);
    const neckMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.set(0, 1.12, 0);
    this.character.add(neck);

    // ---- HEAD ----
    const headGeo = new THREE.SphereGeometry(0.30, 16, 14);
    const headMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.50, 0);
    head.scale.set(1, 1.12, 1);
    this.character.add(head);
    this.parts.head = head;
    this.parts.headBaseY = 1.50;

    // Wrinkle suggestion (slightly darker band)
    const wrinkleGeo = new THREE.TorusGeometry(0.28, 0.02, 4, 16);
    const wrinkleMat = new THREE.MeshLambertMaterial({ color: skinDark });
    const wrinkle = new THREE.Mesh(wrinkleGeo, wrinkleMat);
    wrinkle.position.set(0, 1.50, 0);
    wrinkle.rotation.x = Math.PI / 2;
    wrinkle.scale.set(1, 0.3, 1);
    this.character.add(wrinkle);

    // ---- EARS ----
    const earGeo = new THREE.SphereGeometry(0.075, 8, 8);
    const earMat = new THREE.MeshLambertMaterial({ color: skinDark });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.30, 1.50, 0);
    this.character.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.30, 1.50, 0);
    this.character.add(rightEar);

    // ---- EYES ----
    // Eye whites
    const eyeWhiteGeo = new THREE.SphereGeometry(0.065, 10, 10);
    const eyeWhiteMat = new THREE.MeshLambertMaterial({ color: eyeWhite });

    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    leftEyeWhite.position.set(-0.10, 1.54, 0.27);
    this.character.add(leftEyeWhite);

    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    rightEyeWhite.position.set(0.10, 1.54, 0.27);
    this.character.add(rightEyeWhite);

    // Irises
    const irisGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const irisMat = new THREE.MeshLambertMaterial({ color: eyeDark });

    const leftIris = new THREE.Mesh(irisGeo, irisMat);
    leftIris.position.set(-0.10, 1.545, 0.30);
    this.character.add(leftIris);

    const rightIris = new THREE.Mesh(irisGeo, irisMat);
    rightIris.position.set(0.10, 1.545, 0.30);
    this.character.add(rightIris);

    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.022, 6, 6);
    const pupilMat = new THREE.MeshLambertMaterial({ color: eyePupil });

    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.10, 1.548, 0.335);
    this.character.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.10, 1.548, 0.335);
    this.character.add(rightPupil);

    // Eye lids (for blinking)
    const lidGeo = new THREE.SphereGeometry(0.068, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
    const lidMat = new THREE.MeshLambertMaterial({ color: skinColor });

    const leftLid = new THREE.Mesh(lidGeo, lidMat);
    leftLid.position.set(-0.10, 1.54, 0.27);
    leftLid.rotation.x = Math.PI;
    leftLid.scale.y = 0; // start open
    this.character.add(leftLid);

    const rightLid = new THREE.Mesh(lidGeo, lidMat);
    rightLid.position.set(0.10, 1.54, 0.27);
    rightLid.rotation.x = Math.PI;
    rightLid.scale.y = 0;
    this.character.add(rightLid);

    this.parts.leftLid = leftLid;
    this.parts.rightLid = rightLid;

    // ---- EYEBROWS ----
    const browGeo = new THREE.BoxGeometry(0.09, 0.016, 0.025);
    const browMat = new THREE.MeshLambertMaterial({ color: browColor });

    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-0.10, 1.60, 0.28);
    leftBrow.rotation.z = 0.15;
    this.character.add(leftBrow);
    this.parts.leftBrow = leftBrow;

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(0.10, 1.60, 0.28);
    rightBrow.rotation.z = -0.15;
    this.character.add(rightBrow);
    this.parts.rightBrow = rightBrow;

    // ---- NOSE ----
    const noseGeo = new THREE.SphereGeometry(0.055, 8, 8);
    const noseMat = new THREE.MeshLambertMaterial({ color: skinDark });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.scale.set(1, 0.85, 0.9);
    nose.position.set(0, 1.47, 0.31);
    this.character.add(nose);

    // ---- MUSTACHE ----
    const mustacheGroup = new THREE.Group();
    mustacheGroup.position.set(0, 1.40, 0.31);
    this.character.add(mustacheGroup);
    this.parts.mustache = mustacheGroup;

    const mGeo = new THREE.TorusGeometry(0.065, 0.022, 6, 10, Math.PI);
    const mMat = new THREE.MeshLambertMaterial({ color: whiteColor });

    const mLeft = new THREE.Mesh(mGeo, mMat);
    mLeft.rotation.z = Math.PI;
    mLeft.position.set(-0.045, 0, 0);
    mustacheGroup.add(mLeft);

    const mRight = new THREE.Mesh(mGeo, mMat);
    mRight.rotation.z = Math.PI;
    mRight.position.set(0.045, 0, 0);
    mustacheGroup.add(mRight);

    // ---- SMILE ----
    const smileGeo = new THREE.TorusGeometry(0.08, 0.015, 6, 10, Math.PI * 0.7);
    const smileMat = new THREE.MeshLambertMaterial({ color: 0x7a3c25 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.rotation.z = -Math.PI * 0.15;
    smile.rotation.x = -0.4;
    smile.position.set(0, 1.36, 0.30);
    this.character.add(smile);
    this.parts.smile = smile;

    // ---- WHITE HAIR (sides) ----
    const hairMat = new THREE.MeshLambertMaterial({ color: whiteColor });

    const sideHairPositions = [
      [-0.27, 1.62, 0.10],
      [-0.28, 1.58, -0.05],
      [0.27, 1.62, 0.10],
      [0.28, 1.58, -0.05],
      [-0.20, 1.68, -0.10],
      [0.20, 1.68, -0.10],
    ];

    sideHairPositions.forEach(pos => {
      const hGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.03, 6, 6);
      const h = new THREE.Mesh(hGeo, hairMat);
      h.position.set(...pos);
      this.character.add(h);
    });

    // ---- DHAKA TOPI ----
    const topiGroup = new THREE.Group();
    topiGroup.position.set(0, 1.78, 0);
    this.character.add(topiGroup);
    this.parts.topi = topiGroup;

    // Topi base (flat cylinder)
    const topiBaseGeo = new THREE.CylinderGeometry(0.32, 0.29, 0.16, 12);
    const topiMat = new THREE.MeshLambertMaterial({ color: topiColor });
    const topiBase = new THREE.Mesh(topiBaseGeo, topiMat);
    topiGroup.add(topiBase);

    // Topi top (slightly narrower)
    const topiTopGeo = new THREE.CylinderGeometry(0.22, 0.32, 0.10, 12);
    const topiTop = new THREE.Mesh(topiTopGeo, topiMat);
    topiTop.position.y = 0.13;
    topiGroup.add(topiTop);

    // Dhaka pattern stripes (gold)
    const stripeGeo = new THREE.TorusGeometry(0.30, 0.012, 4, 16);
    const stripeMat = new THREE.MeshLambertMaterial({ color: topiPattern });
    for (let i = 0; i < 3; i++) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = Math.PI / 2;
      stripe.position.y = -0.02 + i * 0.05;
      topiGroup.add(stripe);
    }

    // ---- ARMS ----
    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.55, 8);
    const armMat = new THREE.MeshLambertMaterial({ color: clothColor });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.44, 0.68, 0);
    leftArm.rotation.z = 0.25;
    this.character.add(leftArm);
    this.parts.leftArm = leftArm;

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.44, 0.68, 0);
    rightArm.rotation.z = -0.25;
    this.character.add(rightArm);
    this.parts.rightArm = rightArm;

    // Hands
    const handGeo = new THREE.SphereGeometry(0.085, 8, 8);
    const handMat = new THREE.MeshLambertMaterial({ color: skinColor });

    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.position.set(-0.55, 0.38, 0);
    this.character.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, handMat);
    rightHand.position.set(0.55, 0.38, 0);
    this.character.add(rightHand);

    // ---- LOWER BODY (waist/legs partial) ----
    const lowerGeo = new THREE.CylinderGeometry(0.30, 0.26, 0.50, 12);
    const lowerMat = new THREE.MeshLambertMaterial({ color: 0x4a3a70 });
    const lower = new THREE.Mesh(lowerGeo, lowerMat);
    lower.position.set(0, 0.17, 0);
    this.character.add(lower);

    // ---- POSITION CHARACTER IN SCENE ----
    this.character.position.set(0, -1.0, 0);
    this.scene.add(this.character);
  }

  setState(state) {
    this.currentState = state;

    // Update mood display elements
    const moodEl = document.getElementById('baje-mood');
    const stateEl = document.getElementById('state-badge');

    const stateData = {
      idle:      { moodIcon: '😊', moodText: 'खुसी',      stateIcon: '😊', stateText: 'खुसी छ',    browZ: 0.15 },
      thinking:  { moodIcon: '🤔', moodText: 'सोच्दैछ',   stateIcon: '🤔', stateText: 'सोच्दैछ',   browZ: 0.30 },
      happy:     { moodIcon: '😄', moodText: 'मस्त',       stateIcon: '😄', stateText: 'मस्त छ',    browZ: 0.10 },
      laughing:  { moodIcon: '😂', moodText: 'हाँस्दैछ',   stateIcon: '😂', stateText: 'हाँस्दैछ',  browZ: 0.08 },
      advice:    { moodIcon: '🧓', moodText: 'सल्लाह',     stateIcon: '🧓', stateText: 'सल्लाह',    browZ: 0.25 }
    };

    const d = stateData[state] || stateData.idle;

    if (moodEl) {
      const mi = document.getElementById('mood-icon');
      const mt = document.getElementById('mood-text');
      if (mi) mi.textContent = d.moodIcon;
      if (mt) mt.textContent = d.moodText;
    }

    if (stateEl) {
      const si = document.getElementById('state-icon');
      const st = document.getElementById('state-text');
      if (si) si.textContent = d.stateIcon;
      if (st) st.textContent = d.stateText;
    }

    // Brow expression
    if (this.parts.leftBrow && this.parts.rightBrow) {
      this.parts.leftBrow.rotation.z = d.browZ;
      this.parts.rightBrow.rotation.z = -d.browZ;
    }
  }

  animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();

    if (!this.parts.head) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const state = this.currentState;
    const head = this.parts.head;
    const body = this.parts.body;
    const topi = this.parts.topi;
    const mustache = this.parts.mustache;
    const baseY = this.parts.headBaseY || 1.50;

    // ---- BREATHING (all states) ----
    const breathe = Math.sin(t * 1.4) * 0.018;
    if (body) body.scale.y = 1 + breathe;

    // ---- STATE-BASED ANIMATIONS ----
    if (state === 'idle' || state === 'happy') {
      head.position.y = baseY + Math.sin(t * 1.0) * 0.015;
      head.rotation.y = Math.sin(t * 0.5) * 0.06;
      head.rotation.z = 0;
      if (topi) {
        topi.position.y = 1.78 + Math.sin(t * 1.0) * 0.015;
      }
    }

    if (state === 'thinking') {
      head.rotation.z = Math.sin(t * 0.7) * 0.08 + 0.05; // slight tilt
      head.rotation.y = Math.sin(t * 0.3) * 0.04;
      head.position.y = baseY + Math.sin(t * 0.8) * 0.01;
      if (topi) {
        topi.position.y = 1.78 + Math.sin(t * 0.8) * 0.01;
        topi.rotation.z = head.rotation.z;
      }
    }

    if (state === 'laughing') {
      head.position.y = baseY + Math.sin(t * 6) * 0.025;
      head.rotation.z = Math.sin(t * 5) * 0.08;
      if (body) body.rotation.z = Math.sin(t * 4) * 0.04;
      if (topi) {
        topi.position.y = 1.78 + Math.sin(t * 6) * 0.025;
        topi.rotation.z = head.rotation.z;
      }
    } else {
      if (body) body.rotation.z = 0;
    }

    if (state === 'advice') {
      head.rotation.y = Math.sin(t * 0.6) * 0.12;
      head.position.y = baseY + Math.sin(t * 1.2) * 0.01;
      if (topi) {
        topi.position.y = 1.78 + Math.sin(t * 1.2) * 0.01;
        topi.rotation.y = head.rotation.y;
      }
    }

    // ---- BLINKING ----
    const blinkCycle = t % 4.5;
    const blinkVal = blinkCycle > 4.2 ? Math.min(1, (blinkCycle - 4.2) / 0.08) : 0;
    const openVal = blinkCycle > 4.28 ? Math.max(0, 1 - (blinkCycle - 4.28) / 0.12) : blinkVal;

    if (this.parts.leftLid) {
      this.parts.leftLid.scale.y = openVal;
    }
    if (this.parts.rightLid) {
      this.parts.rightLid.scale.y = openVal;
    }

    // ---- ARM GENTLE SWING ----
    if (this.parts.leftArm) {
      this.parts.leftArm.rotation.x = Math.sin(t * 0.8) * 0.04;
    }
    if (this.parts.rightArm) {
      this.parts.rightArm.rotation.x = -Math.sin(t * 0.8) * 0.04;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const container = document.getElementById('baje-canvas-container');
    if (!container || !this.renderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  showFallback() {
    const fallback = document.getElementById('character-fallback');
    if (fallback) fallback.style.display = 'flex';
    if (this.canvas) this.canvas.style.display = 'none';
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.renderer) this.renderer.dispose();
  }
}

// ---- Global Character Instance ----
let bajeCharacter = null;

function initCharacter() {
  if (typeof THREE === 'undefined') {
    document.getElementById('character-fallback').style.display = 'flex';
    return;
  }
  bajeCharacter = new BajeCharacter('baje-canvas');
}

function setCharacterState(state) {
  if (bajeCharacter) {
    bajeCharacter.setState(state);
  } else {
    // Update mood display even without 3D
    const mi = document.getElementById('mood-icon');
    const mt = document.getElementById('mood-text');
    const si = document.getElementById('state-icon');
    const st = document.getElementById('state-text');
    const stateData = {
      idle:     { icon: '😊', text: 'खुसी',     sIcon: '😊', sText: 'खुसी छ' },
      thinking: { icon: '🤔', text: 'सोच्दैछ',  sIcon: '🤔', sText: 'सोच्दैछ' },
      happy:    { icon: '😄', text: 'मस्त',      sIcon: '😄', sText: 'मस्त छ' },
      laughing: { icon: '😂', text: 'हाँस्दैछ', sIcon: '😂', sText: 'हाँस्दैछ' },
      advice:   { icon: '🧓', text: 'सल्लाह',   sIcon: '🧓', sText: 'सल्लाह' }
    };
    const d = stateData[state] || stateData.idle;
    if (mi) mi.textContent = d.icon;
    if (mt) mt.textContent = d.text;
    if (si) si.textContent = d.sIcon;
    if (st) st.textContent = d.sText;
  }
}
