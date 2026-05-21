/**
 * ElectricBorder — vanilla port of @react-bits/ElectricBorder-JS-CSS
 * Inspired by @BalintFerenczy — https://codepen.io/BalintFerenczy/pen/KwdoyEN
 */
(function (global) {
  "use strict";

  var instances = [];

  function random(x) {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }

  function noise2D(x, y) {
    var i = Math.floor(x);
    var j = Math.floor(y);
    var fx = x - i;
    var fy = y - j;
    var a = random(i + j * 57);
    var b = random(i + 1 + j * 57);
    var c = random(i + (j + 1) * 57);
    var d = random(i + 1 + (j + 1) * 57);
    var ux = fx * fx * (3.0 - 2.0 * fx);
    var uy = fy * fy * (3.0 - 2.0 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  function octavedNoise(x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time, seed, baseFlatness) {
    var y = 0;
    var amplitude = baseAmplitude;
    var frequency = baseFrequency;
    for (var i = 0; i < octaves; i++) {
      var octaveAmplitude = amplitude;
      if (i === 0) octaveAmplitude *= baseFlatness;
      y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return y;
  }

  function getCornerPoint(centerX, centerY, radius, startAngle, arcLength, progress) {
    var angle = startAngle + progress * arcLength;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  }

  function getRoundedRectPoint(t, left, top, width, height, radius) {
    var straightWidth = width - 2 * radius;
    var straightHeight = height - 2 * radius;
    var cornerArc = (Math.PI * radius) / 2;
    var totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    var distance = t * totalPerimeter;
    var accumulated = 0;
    var progress;

    if (distance <= accumulated + straightWidth) {
      progress = (distance - accumulated) / straightWidth;
      return { x: left + radius + progress * straightWidth, y: top };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      progress = (distance - accumulated) / straightHeight;
      return { x: left + width, y: top + radius + progress * straightHeight };
    }
    accumulated += straightHeight;

    if (distance <= accumulated + cornerArc) {
      progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightWidth) {
      progress = (distance - accumulated) / straightWidth;
      return { x: left + width - radius - progress * straightWidth, y: top + height };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      progress = (distance - accumulated) / straightHeight;
      return { x: left, y: top + height - radius - progress * straightHeight };
    }
    accumulated += straightHeight;

    progress = (distance - accumulated) / cornerArc;
    return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
  }

  function readOptions(el) {
    var radius = parseFloat(el.getAttribute("data-electric-radius") || "16");
    return {
      color: el.getAttribute("data-electric-color") || "#36f6dc",
      speed: parseFloat(el.getAttribute("data-electric-speed") || "1"),
      chaos: parseFloat(el.getAttribute("data-electric-chaos") || "0.12"),
      borderRadius: isNaN(radius) ? 16 : radius,
    };
  }

  function mountStructure(el, opts) {
    el.classList.add("electric-border");
    el.style.setProperty("--electric-border-color", opts.color);
    el.style.borderRadius = opts.borderRadius + "px";

    var canvasContainer = document.createElement("div");
    canvasContainer.className = "eb-canvas-container";
    var canvas = document.createElement("canvas");
    canvas.className = "eb-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvasContainer.appendChild(canvas);

    var layers = document.createElement("div");
    layers.className = "eb-layers";
    layers.innerHTML =
      '<div class="eb-glow-1"></div><div class="eb-glow-2"></div><div class="eb-background-glow"></div>';

    var content = document.createElement("div");
    content.className = "eb-content";
    while (el.firstChild) content.appendChild(el.firstChild);

    el.appendChild(canvasContainer);
    el.appendChild(layers);
    el.appendChild(content);

    return { canvas: canvas, content: content };
  }

  function createInstance(el) {
    if (el.dataset.electricMounted === "1") return null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("electric-border");
      el.style.setProperty("--electric-border-color", readOptions(el).color);
      el.dataset.electricMounted = "1";
      return null;
    }

    var opts = readOptions(el);
    var parts = mountStructure(el, opts);
    var canvas = parts.canvas;
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;

    var octaves = 10;
    var lacunarity = 1.6;
    var gain = 0.7;
    var amplitude = opts.chaos;
    var frequency = 10;
    var baseFlatness = 0;
    var displacement = 60;
    var borderOffset = 60;

    var time = 0;
    var lastFrameTime = 0;
    var width = 0;
    var height = 0;
    var lastDpr = 1;
    var animationId = 0;

    function updateSize() {
      var rect = el.getBoundingClientRect();
      var w = rect.width + borderOffset * 2;
      var h = rect.height + borderOffset * 2;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width: w, height: h, dpr: dpr };
    }

    var size = updateSize();
    width = size.width;
    height = size.height;
    lastDpr = size.dpr;

    function draw(currentTime) {
      if (!canvas.isConnected) return;

      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        size = updateSize();
        width = size.width;
        height = size.height;
      }

      var deltaTime = (currentTime - lastFrameTime) / 1000;
      if (lastFrameTime > 0) time += deltaTime * opts.speed;
      lastFrameTime = currentTime;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      var scale = displacement;
      var left = borderOffset;
      var top = borderOffset;
      var borderWidth = width - 2 * borderOffset;
      var borderHeight = height - 2 * borderOffset;
      var maxRadius = Math.min(borderWidth, borderHeight) / 2;
      var radius = Math.min(opts.borderRadius, maxRadius);
      var approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      var sampleCount = Math.floor(approximatePerimeter / 2);

      ctx.beginPath();
      for (var i = 0; i <= sampleCount; i++) {
        var progress = i / sampleCount;
        var point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
        var xNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          time,
          0,
          baseFlatness
        );
        var yNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          time,
          1,
          baseFlatness
        );
        var displacedX = point.x + xNoise * scale;
        var displacedY = point.y + yNoise * scale;
        if (i === 0) ctx.moveTo(displacedX, displacedY);
        else ctx.lineTo(displacedX, displacedY);
      }
      ctx.closePath();
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    }

    var resizeObserver = new ResizeObserver(function () {
      size = updateSize();
      width = size.width;
      height = size.height;
    });
    resizeObserver.observe(el);

    animationId = requestAnimationFrame(draw);
    el.dataset.electricMounted = "1";

    return {
      destroy: function () {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        el.dataset.electricMounted = "0";
      },
    };
  }

  function initElectricBorders(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-electric-border]").forEach(function (el) {
      var inst = createInstance(el);
      if (inst) instances.push(inst);
    });
  }

  global.ITWAY_ElectricBorder = {
    init: initElectricBorders,
    mount: createInstance,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initElectricBorders();
    });
  } else {
    initElectricBorders();
  }
})(window);
