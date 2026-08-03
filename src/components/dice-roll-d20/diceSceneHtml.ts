/**
 * WebView HTML for a 3D D20.
 *
 * Engine adapted from react-3d-dice (MIT):
 * https://github.com/ChefJulio/react-3d-dice
 * Copyright (c) 2026 BosDev
 *
 * Three.js is loaded from CDN (UMD build) because React Native has no DOM canvas
 * for native Three.js rendering.
 */

type DiceHtmlOptions = {
  color?: string;
  background?: string;
};

export const buildDiceHtml = ({
  color = '#C24122',
  background = 'transparent',
}: DiceHtmlOptions = {}) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: ${background};
      touch-action: none;
    }
    #mount {
      width: 100%;
      height: 100%;
      position: relative;
    }
    #mount canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>
</head>
<body>
  <div id="mount"></div>
  <script>
(function () {
  var COLOR = ${JSON.stringify(color)};
  var SIDES = 20;
  var SETTLE_SECS = 0.6;
  var SPIN_MS = 900;
  var LABEL_SIZE = 0.62;

  function post(msg) {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }
  }

  function parseColor(color) {
    if (typeof color === 'number') return color;
    if (typeof color === 'string' && color.charAt(0) === '#') {
      return parseInt(color.slice(1), 16);
    }
    return 0xc24122;
  }

  var texCache = {};

  function getNumTexture(num) {
    if (texCache[num]) return texCache[num];
    var sz = 256;
    var c = document.createElement('canvas');
    c.width = sz;
    c.height = sz;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, sz, sz);
    var text = String(num);
    var fs = text.length > 1 ? sz * 0.62 : sz * 0.82;
    ctx.font = 'bold ' + fs + 'px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillText(text, sz / 2 + 2, sz / 2 + 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, sz / 2, sz / 2);
    var tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    texCache[num] = tex;
    return tex;
  }

  function computeFaces(geometry, numFaces) {
    var pos = geometry.getAttribute('position');
    var idx = geometry.index;
    if (idx) {
      var totalTris = idx.count / 3;
      var tpf = Math.round(totalTris / numFaces);
      var faces = [];
      for (var f = 0; f < numFaces; f++) {
        var centroid = new THREE.Vector3();
        var normal = new THREE.Vector3();
        var faceVerts = [];
        var seenIdx = {};
        var vertCount = 0;
        for (var t = f * tpf; t < (f + 1) * tpf; t++) {
          var base = t * 3;
          var ia = idx.getX(base), ib = idx.getX(base + 1), ic = idx.getX(base + 2);
          var a = new THREE.Vector3().fromBufferAttribute(pos, ia);
          var b = new THREE.Vector3().fromBufferAttribute(pos, ib);
          var c = new THREE.Vector3().fromBufferAttribute(pos, ic);
          centroid.add(a).add(b).add(c);
          vertCount += 3;
          if (t === f * tpf) {
            normal.crossVectors(
              new THREE.Vector3().subVectors(b, a),
              new THREE.Vector3().subVectors(c, a)
            ).normalize();
          }
          if (!seenIdx[ia]) { seenIdx[ia] = 1; faceVerts.push(a); }
          if (!seenIdx[ib]) { seenIdx[ib] = 1; faceVerts.push(b); }
          if (!seenIdx[ic]) { seenIdx[ic] = 1; faceVerts.push(c); }
        }
        centroid.divideScalar(vertCount);
        if (normal.dot(centroid) < 0) normal.negate();
        faces.push({ centroid: centroid.clone(), normal: normal.clone(), verts: faceVerts });
      }
      return faces;
    }

    var total = pos.count / 3;
    var clusters = [];
    for (var ti = 0; ti < total; ti++) {
      var vi = ti * 3;
      var a2 = new THREE.Vector3().fromBufferAttribute(pos, vi);
      var b2 = new THREE.Vector3().fromBufferAttribute(pos, vi + 1);
      var c2 = new THREE.Vector3().fromBufferAttribute(pos, vi + 2);
      var n = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(b2, a2),
        new THREE.Vector3().subVectors(c2, a2)
      ).normalize();
      var mid = new THREE.Vector3().add(a2).add(b2).add(c2).divideScalar(3);
      if (n.dot(mid) < 0) n.negate();
      var found = false;
      for (var ci = 0; ci < clusters.length; ci++) {
        if (clusters[ci].normal.dot(n) > 0.999) {
          clusters[ci].verts.push(a2, b2, c2);
          found = true;
          break;
        }
      }
      if (!found) clusters.push({ normal: n.clone(), verts: [a2, b2, c2] });
    }
    clusters.sort(function (a, b) {
      var an = a.normal, bn = b.normal;
      if (Math.abs(an.x - bn.x) > 0.001) return an.x - bn.x;
      if (Math.abs(an.y - bn.y) > 0.001) return an.y - bn.y;
      return an.z - bn.z;
    });
    return clusters.map(function (cl) {
      var centroid = new THREE.Vector3();
      cl.verts.forEach(function (v) { centroid.add(v); });
      centroid.divideScalar(cl.verts.length);
      var unique = [];
      for (var i = 0; i < cl.verts.length; i++) {
        var v = cl.verts[i];
        var isDup = false;
        for (var u = 0; u < unique.length; u++) {
          if (v.distanceTo(unique[u]) < 0.001) { isDup = true; break; }
        }
        if (!isDup) unique.push(v.clone());
      }
      return { centroid: centroid.clone(), normal: cl.normal.clone(), verts: unique };
    });
  }

  function computeFaceNumbers(faces, sides) {
    var n = faces.length;
    var numbers = new Array(n).fill(0);
    var target = sides + 1;
    var pairs = [];
    var used = {};
    for (var i = 0; i < n; i++) {
      if (used[i]) continue;
      var paired = false;
      for (var j = i + 1; j < n; j++) {
        if (used[j]) continue;
        if (faces[i].normal.dot(faces[j].normal) < -0.99) {
          pairs.push([i, j]);
          used[i] = 1;
          used[j] = 1;
          paired = true;
          break;
        }
      }
      if (!paired) {
        pairs.push([i, -1]);
        used[i] = 1;
      }
    }
    for (var k = 0; k < pairs.length; k++) {
      numbers[pairs[k][0]] = k + 1;
      if (pairs[k][1] >= 0) numbers[pairs[k][1]] = target - (k + 1);
    }
    return numbers;
  }

  function faceSettleQuat(face) {
    var n = face.normal.clone().normalize();
    var ref = new THREE.Vector3(0, 1, 0);
    if (Math.abs(n.dot(ref)) > 0.99) ref = new THREE.Vector3(0, 0, 1);
    var refUp = ref.clone().addScaledVector(n, -ref.dot(n)).normalize();
    var faceUp = refUp;
    if (face.verts && face.verts.length >= 3) {
      var bestDot = -Infinity;
      for (var i = 0; i < face.verts.length; i++) {
        var dir = new THREE.Vector3().subVectors(face.verts[i], face.centroid).normalize();
        var d = dir.dot(refUp);
        if (d > bestDot) {
          bestDot = d;
          faceUp = dir;
        }
      }
    }
    var xAxis = new THREE.Vector3().crossVectors(faceUp, n).normalize();
    var m = new THREE.Matrix4().makeBasis(xAxis, faceUp, n);
    return new THREE.Quaternion().setFromRotationMatrix(m).conjugate();
  }

  function settleQuat(mesh, result) {
    var faces = mesh.userData.faces;
    var ntf = mesh.userData.numberToFace;
    if (!faces || !ntf) return null;
    var fi = ntf[result];
    if (fi == null || fi < 0 || fi >= faces.length) return null;
    return faceSettleQuat(faces[fi]);
  }

  function buildDieMesh(color) {
    var geo = new THREE.IcosahedronGeometry(1.0, 0);
    var mat = new THREE.MeshPhongMaterial({
      color: parseColor(color),
      shininess: 80,
      specular: 0x333333,
      flatShading: true,
    });
    var mesh = new THREE.Mesh(geo, mat);
    var eg = new THREE.EdgesGeometry(geo);
    var em = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    mesh.add(new THREE.LineSegments(eg, em));

    var faces = computeFaces(geo, SIDES);
    mesh.userData.faces = faces;
    var faceNumbers = computeFaceNumbers(faces, SIDES);
    mesh.userData.faceNumbers = faceNumbers;
    var numberToFace = {};
    faceNumbers.forEach(function (num, idx) { numberToFace[num] = idx; });
    mesh.userData.numberToFace = numberToFace;

    for (var i = 0; i < SIDES; i++) {
      var face = faces[i];
      if (!face) continue;
      var num = faceNumbers[i];
      var tex = getNumTexture(num);
      var pg = new THREE.PlaneGeometry(LABEL_SIZE, LABEL_SIZE);
      var pm = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      var label = new THREE.Mesh(pg, pm);
      label.position.copy(face.centroid).addScaledVector(face.normal, 0.02);
      var sq = faceSettleQuat(face);
      label.quaternion.copy(sq.conjugate());
      mesh.add(label);
    }
    return mesh;
  }

  var el = document.getElementById('mount');
  var scene = new THREE.Scene();
  // Tight frustum so the die fills most of the wrapper (~85% of the short axis)
  var FRUSTUM = 1.18;
  var camera = new THREE.OrthographicCamera(-FRUSTUM, FRUSTUM, FRUSTUM, -FRUSTUM, 0.1, 100);
  camera.position.set(0, 0, 10);
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  var kl = new THREE.DirectionalLight(0xffffff, 1.0);
  kl.position.set(5, 8, 5);
  scene.add(kl);
  var fl = new THREE.DirectionalLight(0xffffff, 0.3);
  fl.position.set(-3, -2, 4);
  scene.add(fl);

  var mesh = buildDieMesh(COLOR);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  var state = {
    phase: 'idle',
    settleStart: 0,
    settleFrom: new THREE.Quaternion(),
    settleTo: new THREE.Quaternion(),
    pendingResult: null,
    baseY: 0,
  };

  function resize() {
    var w = el.clientWidth || window.innerWidth;
    var h = el.clientHeight || window.innerHeight;
    if (!w || !h) return;
    var aspect = w / h;
    camera.left = -FRUSTUM * aspect;
    camera.right = FRUSTUM * aspect;
    camera.top = FRUSTUM;
    camera.bottom = -FRUSTUM;
    camera.updateProjectionMatrix();
    // updateStyle=true keeps canvas CSS size in sync with the WebView
    renderer.setSize(w, h, true);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
  }
  resize();
  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(el);
  }
  // WebView often reports 0x0 on first paint — retry once layout settles
  setTimeout(resize, 50);
  setTimeout(resize, 250);

  function loop(time) {
    requestAnimationFrame(loop);
    var t = time / 1000;

    if (state.phase === 'spinning') {
      mesh.rotation.x += 10 * 0.016;
      mesh.rotation.y += 8 * 0.016;
      mesh.rotation.z += 3 * 0.016;
    } else if (state.phase === 'settling') {
      var elapsed = (time - state.settleStart) / 1000;
      var p = Math.min(elapsed / SETTLE_SECS, 1);
      var e = 1 - Math.pow(1 - p, 3);
      mesh.quaternion.slerpQuaternions(state.settleFrom, state.settleTo, e);
      if (p >= 1) {
        state.phase = 'idle';
        post({ type: 'settled', result: state.pendingResult });
      }
    } else if (state.phase === 'idle') {
      var w = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        Math.sin(t * 0.8) * 0.03,
        Math.sin(t * 0.6) * 0.05,
        0
      ));
      mesh.quaternion.copy(state.settleTo).multiply(w);
      mesh.position.y = state.baseY + Math.sin(t * 1.2) * 0.03;
    }

    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);

  // Show a default face on load
  state.settleTo = settleQuat(mesh, 20) || new THREE.Quaternion();
  mesh.quaternion.copy(state.settleTo);

  window.startRoll = function (result) {
    var value = Math.max(1, Math.min(20, Number(result) || 1));
    state.pendingResult = value;
    state.phase = 'spinning';
    post({ type: 'rolling', result: value });

    setTimeout(function () {
      state.settleFrom = mesh.quaternion.clone();
      state.settleTo = settleQuat(mesh, value) || new THREE.Quaternion();
      state.settleStart = performance.now();
      state.phase = 'settling';
    }, SPIN_MS);
  };

  window.setDieColor = function (hex) {
    COLOR = hex;
    if (mesh.material && mesh.material.color) {
      mesh.material.color.setHex(parseColor(hex));
    }
  };

  document.body.addEventListener('click', function () {
    if (state.phase === 'spinning' || state.phase === 'settling') return;
    window.startRoll(Math.floor(Math.random() * 20) + 1);
  });

  post({ type: 'ready' });
})();
  </script>
</body>
</html>`;
