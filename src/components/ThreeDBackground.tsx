import { useEffect, useRef } from 'react';

interface PCBTrace {
  zBase: number;
  xBase: number;
  y: number;
  segments: { relX: number; relZ: number }[];
  signalPos: number; // 0 to 1 progress along segments
  signalSpeed: number;
}

interface Component3D {
  type: 'ic' | 'resistor' | 'and' | 'or' | 'not';
  x: number;
  y: number;
  zBase: number;
  w: number;
  h: number;
  d: number;
  label: string;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const currentColor = useRef({ r: 46, g: 75, b: 56, a: 0.04 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Track scroll
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track mouse for parallax tilt
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Engine Constants
    const focalLength = 350;
    const sceneDepth = 1600; // loop range for elements
    const gridPlaneY = 220; // vertical offset for bottom PCB board

    // Generate PCB Traces - Restricted to margins to clear the center column
    const generateTrace = (zBase: number): PCBTrace => {
      const isLeft = Math.random() < 0.5;
      // Push traces far to the sides (left margin: x < -280, right margin: x > 280)
      const xBase = isLeft ? -Math.random() * 300 - 280 : Math.random() * 300 + 280;
      const y = Math.random() < 0.5 ? gridPlaneY : -gridPlaneY;
      
      const segments = [{ relX: 0, relZ: 0 }];
      let curRelX = 0;
      let curRelZ = 0;

      // Segment 1: straight along Z
      curRelZ += Math.random() * 150 + 50;
      segments.push({ relX: curRelX, relZ: curRelZ });

      // Segment 2: 45 or 90 degree turn (constrained to keep away from center)
      const turnType = Math.random() < 0.5 ? '45' : '90';
      const turnDir = isLeft ? -1 : 1; // turn outwards (away from center)
      const turnDist = Math.random() * 50 + 20;

      if (turnType === '45') {
        curRelX += turnDir * turnDist;
        curRelZ += turnDist;
      } else {
        curRelX += turnDir * turnDist;
      }
      segments.push({ relX: curRelX, relZ: curRelZ });

      // Segment 3: straight along Z to end
      curRelZ += Math.random() * 200 + 100;
      segments.push({ relX: curRelX, relZ: curRelZ });

      return {
        zBase,
        xBase,
        y,
        segments,
        signalPos: Math.random(),
        signalSpeed: Math.random() * 0.004 + 0.002
      };
    };

    // Reduced trace count for a cleaner layout (12 total traces)
    const traces: PCBTrace[] = [];
    for (let i = 0; i < 12; i++) {
      traces.push(generateTrace((i / 12) * sceneDepth));
    }

    // Simplified Component List (only 6 components total, pushed to margins)
    const components: Component3D[] = [
      // Left side components
      { type: 'ic', x: -350, y: 150, zBase: 200, w: 90, h: 20, d: 130, label: 'FPGA' },
      { type: 'and', x: -300, y: -100, zBase: 700, w: 55, h: 45, d: 20, label: 'AND' },
      { type: 'resistor', x: -360, y: 180, zBase: 1200, w: 25, h: 25, d: 60, label: 'R1' },

      // Right side components
      { type: 'ic', x: 350, y: -140, zBase: 400, w: 80, h: 20, d: 110, label: 'MCU' },
      { type: 'or', x: 310, y: 100, zBase: 900, w: 55, h: 45, d: 20, label: 'XOR' },
      { type: 'resistor', x: 340, y: -130, zBase: 1400, w: 25, h: 25, d: 60, label: 'R2' }
    ];

    // 3D Perspective Projection
    const project = (x: number, y: number, z: number, camX: number, camY: number) => {
      if (z <= 10) return null;
      const scale = focalLength / z;
      return {
        x: width / 2 + (x - camX) * scale,
        y: height / 2 + (y - camY) * scale,
        scale: scale
      };
    };

    // Helper to draw a line in 3D
    const drawLine3D = (
      x1: number, y1: number, z1: number,
      x2: number, y2: number, z2: number,
      camX: number, camY: number,
      widthScale: number = 1
    ) => {
      const p1 = project(x1, y1, z1, camX, camY);
      const p2 = project(x2, y2, z2, camX, camY);
      if (p1 && p2) {
        ctx.save();
        ctx.lineWidth = Math.max(0.4, 0.9 * widthScale * ((p1.scale + p2.scale) / 2));
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    };

    // Helper to draw a solid glassmorphic 3D Box
    const drawSolidBox3D = (
      cx: number, cy: number, cz: number,
      w: number, h: number, d: number,
      camX: number, camY: number,
      faceFillStyle: string
    ) => {
      const hw = w / 2;
      const hh = h / 2;
      const hd = d / 2;

      const vertices = [
        { x: cx - hw, y: cy - hh, z: cz - hd }, // 0
        { x: cx - hw, y: cy - hh, z: cz + hd }, // 1
        { x: cx - hw, y: cy + hh, z: cz - hd }, // 2
        { x: cx - hw, y: cy + hh, z: cz + hd }, // 3
        { x: cx + hw, y: cy - hh, z: cz - hd }, // 4
        { x: cx + hw, y: cy - hh, z: cz + hd }, // 5
        { x: cx + hw, y: cy + hh, z: cz - hd }, // 6
        { x: cx + hw, y: cy + hh, z: cz + hd }  // 7
      ];

      const projected = vertices.map(v => project(v.x, v.y, v.z, camX, camY));

      const faces = [
        [0, 1, 3, 2], // Left
        [4, 5, 7, 6], // Right
        [0, 1, 5, 4], // Top
        [2, 3, 7, 6], // Bottom
        [0, 2, 6, 4], // Front
        [1, 3, 7, 5]  // Back
      ];

      faces.forEach(faceIndices => {
        ctx.beginPath();
        let first = true;
        for (const idx of faceIndices) {
          const p = projected[idx];
          if (!p) return;
          if (first) {
            ctx.moveTo(p.x, p.y);
            first = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = faceFillStyle;
        ctx.fill();
      });

      // Draw wireframe edges on top
      for (let i = 0; i < 8; i++) {
        const pA = projected[i];
        if (!pA) continue;

        for (const mask of [1, 2, 4]) {
          const neighborIdx = i ^ mask;
          if (neighborIdx > i) {
            const pB = projected[neighborIdx];
            if (pB) {
              ctx.save();
              ctx.lineWidth = Math.max(0.4, 0.9 * ((pA.scale + pB.scale) / 2));
              ctx.beginPath();
              ctx.moveTo(pA.x, pA.y);
              ctx.lineTo(pB.x, pB.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }
    };

    // Helper to draw solid glassmorphic 3D Logic Gates
    const drawGate3D = (
      comp: Component3D,
      cz: number,
      camX: number,
      camY: number,
      faceFillStyle: string
    ) => {
      const { x: cx, y: cy, w, h, type } = comp;
      const pinLen = 12;

      const pBackCenter = project(cx, cy, cz, camX, camY);
      if (!pBackCenter) return;

      ctx.lineWidth = 1;

      if (type === 'and') {
        const p1 = project(cx - w/2, cy - h/2, cz, camX, camY);
        const p2 = project(cx - w/2, cy + h/2, cz, camX, camY);
        const pStartArc = project(cx, cy - h/2, cz, camX, camY);
        const pEndArc = project(cx, cy + h/2, cz, camX, camY);

        if (p1 && p2 && pStartArc && pEndArc) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(pStartArc.x, pStartArc.y);
          
          const steps = 8;
          for (let i = 0; i <= steps; i++) {
            const angle = -Math.PI/2 + (Math.PI * i / steps);
            const arcX = cx + Math.cos(angle) * (w/2);
            const arcY = cy + Math.sin(angle) * (h/2);
            const pArc = project(arcX, arcY, cz, camX, camY);
            if (pArc) ctx.lineTo(pArc.x, pArc.y);
          }

          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = faceFillStyle;
          ctx.fill();

          ctx.save();
          ctx.lineWidth = Math.max(0.4, 1.0 * pBackCenter.scale);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(pStartArc.x, pStartArc.y);
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(pEndArc.x, pEndArc.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(pStartArc.x, pStartArc.y);
          for (let i = 0; i <= steps; i++) {
            const angle = -Math.PI/2 + (Math.PI * i / steps);
            const arcX = cx + Math.cos(angle) * (w/2);
            const arcY = cy + Math.sin(angle) * (h/2);
            const pArc = project(arcX, arcY, cz, camX, camY);
            if (pArc) ctx.lineTo(pArc.x, pArc.y);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Pins
        drawLine3D(cx - w/2 - pinLen, cy - h/4, cz, cx - w/2, cy - h/4, cz, camX, camY, 0.6);
        drawLine3D(cx - w/2 - pinLen, cy + h/4, cz, cx - w/2, cy + h/4, cz, camX, camY, 0.6);
        drawLine3D(cx + w/2, cy, cz, cx + w/2 + pinLen, cy, cz, camX, camY, 0.6);

      } else if (type === 'or') {
        const steps = 8;
        
        ctx.beginPath();
        const pBackStart = project(cx - w/2, cy - h/2, cz, camX, camY);
        if (pBackStart) ctx.moveTo(pBackStart.x, pBackStart.y);
        
        for (let i = 1; i <= steps; i++) {
          const factor = i / steps;
          const backX = cx - w/2 + Math.sin(factor * Math.PI) * (w/4);
          const backY = cy - h/2 + factor * h;
          const pBack = project(backX, backY, cz, camX, camY);
          if (pBack) ctx.lineTo(pBack.x, pBack.y);
        }

        for (let i = steps; i >= 0; i--) {
          const factor = i / steps;
          const sideX = cx - w/2 + factor * w;
          const sideY = cy + h/2 - Math.sin(factor * Math.PI/2) * (h/2) - (factor * h/2);
          const pSide = project(sideX, sideY, cz, camX, camY);
          if (pSide) ctx.lineTo(pSide.x, pSide.y);
        }

        for (let i = 1; i <= steps; i++) {
          const factor = i / steps;
          const sideX = cx - w/2 + factor * w;
          const sideY = cy - h/2 + Math.sin(factor * Math.PI/2) * (h/2) + (factor * h/2);
          const pSide = project(sideX, sideY, cz, camX, camY);
          if (pSide) ctx.lineTo(pSide.x, pSide.y);
        }

        ctx.closePath();
        ctx.fillStyle = faceFillStyle;
        ctx.fill();

        ctx.save();
        ctx.lineWidth = Math.max(0.4, 1.0 * pBackCenter.scale);
        
        ctx.beginPath();
        if (pBackStart) ctx.moveTo(pBackStart.x, pBackStart.y);
        for (let i = 1; i <= steps; i++) {
          const factor = i / steps;
          const backX = cx - w/2 + Math.sin(factor * Math.PI) * (w/4);
          const backY = cy - h/2 + factor * h;
          const pBack = project(backX, backY, cz, camX, camY);
          if (pBack) ctx.lineTo(pBack.x, pBack.y);
        }
        ctx.stroke();

        ctx.beginPath();
        const pTop = project(cx - w/2, cy - h/2, cz, camX, camY);
        if (pTop) ctx.moveTo(pTop.x, pTop.y);
        for (let i = 0; i <= steps; i++) {
          const factor = i / steps;
          const sideX = cx - w/2 + factor * w;
          const sideY = cy - h/2 + Math.sin(factor * Math.PI/2) * (h/2) + (factor * h/2);
          const pSide = project(sideX, sideY, cz, camX, camY);
          if (pSide) ctx.lineTo(pSide.x, pSide.y);
        }
        ctx.stroke();

        ctx.beginPath();
        const pBot = project(cx - w/2, cy + h/2, cz, camX, camY);
        if (pBot) ctx.moveTo(pBot.x, pBot.y);
        for (let i = 0; i <= steps; i++) {
          const factor = i / steps;
          const sideX = cx - w/2 + factor * w;
          const sideY = cy + h/2 - Math.sin(factor * Math.PI/2) * (h/2) - (factor * h/2);
          const pSide = project(sideX, sideY, cz, camX, camY);
          if (pSide) ctx.lineTo(pSide.x, pSide.y);
        }
        ctx.stroke();
        ctx.restore();

        // Pins
        drawLine3D(cx - w/2 - pinLen + 4, cy - h/4, cz, cx - w/2 + 4, cy - h/4, cz, camX, camY, 0.6);
        drawLine3D(cx - w/2 - pinLen + 4, cy + h/4, cz, cx - w/2 + 4, cy + h/4, cz, camX, camY, 0.6);
        drawLine3D(cx + w/2, cy, cz, cx + w/2 + pinLen, cy, cz, camX, camY, 0.6);

      } else if (type === 'not') {
        const pTop = project(cx - w/3, cy - h/2, cz, camX, camY);
        const pBot = project(cx - w/3, cy + h/2, cz, camX, camY);
        const pNose = project(cx + w/3, cy, cz, camX, camY);

        if (pTop && pBot && pNose) {
          ctx.beginPath();
          ctx.moveTo(pTop.x, pTop.y);
          ctx.lineTo(pBot.x, pBot.y);
          ctx.lineTo(pNose.x, pNose.y);
          ctx.closePath();
          ctx.fillStyle = faceFillStyle;
          ctx.fill();

          ctx.save();
          ctx.lineWidth = Math.max(0.4, 1.0 * pBackCenter.scale);
          ctx.beginPath();
          ctx.moveTo(pTop.x, pTop.y);
          ctx.lineTo(pBot.x, pBot.y);
          ctx.lineTo(pNose.x, pNose.y);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          // Bubble circle
          const bubbleRadius = 4;
          const pBubble = project(cx + w/3 + bubbleRadius, cy, cz, camX, camY);
          if (pBubble) {
            ctx.save();
            ctx.lineWidth = Math.max(0.4, 0.8 * pBubble.scale);
            ctx.beginPath();
            ctx.arc(pBubble.x, pBubble.y, bubbleRadius * pBubble.scale, 0, Math.PI*2);
            ctx.fillStyle = faceFillStyle;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
        }

        // Pins
        drawLine3D(cx - w/3 - pinLen, cy, cz, cx - w/3, cy, cz, camX, camY, 0.6);
        drawLine3D(cx + w/3 + 8, cy, cz, cx + w/3 + 8 + pinLen, cy, cz, camX, camY, 0.6);
      }
    };

    // Detect active section theme
    const getActiveSectionTheme = () => {
      const sections = ['hero', 'about', 'education', 'projects', 'skills', 'experience', 'interests', 'contact'];
      let maxVisibleSection = 'hero';
      let maxVisibleHeight = 0;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(height, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            maxVisibleSection = id;
          }
        }
      }

      const activeEl = document.getElementById(maxVisibleSection);
      if (activeEl) {
        const isDark =
          activeEl.classList.contains('bg-secondary-bg') ||
          activeEl.classList.contains('bg-surface-dark') ||
          activeEl.classList.contains('bg-[#111111]');
        return isDark ? 'dark' : 'light';
      }

      return 'light';
    };

    let animationFrameId: number;
    let cameraZOffset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse movements
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const camX = mouseRef.current.x * 280;
      const camY = mouseRef.current.y * 180;
      
      const scrollFactor = 0.6;
      cameraZOffset = scrollYRef.current * scrollFactor;

      // Ultra faint opacity levels (watermark style)
      const theme = getActiveSectionTheme();
      const targetColor = theme === 'dark' 
        ? { r: 244, g: 180, b: 0, a: 0.05 } // Faint Amber Glow
        : { r: 46, g: 75, b: 56, a: 0.04 };  // Faint Forest Green

      const lerpSpeed = 0.05;
      currentColor.current.r += (targetColor.r - currentColor.current.r) * lerpSpeed;
      currentColor.current.g += (targetColor.g - currentColor.current.g) * lerpSpeed;
      currentColor.current.b += (targetColor.b - currentColor.current.b) * lerpSpeed;
      currentColor.current.a += (targetColor.a - currentColor.current.a) * lerpSpeed;

      const strokeColor = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a})`;
      const textFillColor = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 2.2})`;
      const faceFillStyle = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 0.4})`;

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = textFillColor;
      ctx.lineWidth = 1;

      // --- Draw 3D PCB Traces (Delicate, thin blueprint lines) ---
      traces.forEach(trace => {
        const effZBase = ((trace.zBase - cameraZOffset) % sceneDepth + sceneDepth) % sceneDepth + 10;
        
        ctx.beginPath();
        let pPrev = project(trace.xBase, trace.y, effZBase, camX, camY);
        if (pPrev) {
          ctx.moveTo(pPrev.x, pPrev.y);
        }

        // Draw start via pad
        if (pPrev) {
          ctx.save();
          ctx.strokeStyle = strokeColor;
          ctx.fillStyle = faceFillStyle;
          ctx.lineWidth = Math.max(0.4, 0.8 * pPrev.scale);
          ctx.beginPath();
          ctx.arc(pPrev.x, pPrev.y, 3.5 * pPrev.scale, 0, Math.PI*2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = strokeColor;
          ctx.arc(pPrev.x, pPrev.y, 1.2 * pPrev.scale, 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
        }

        const projectedSegments = [pPrev];

        // Draw trace segments
        trace.segments.forEach((seg, sIdx) => {
          if (sIdx === 0) return;
          const px = trace.xBase + seg.relX;
          const pz = effZBase + seg.relZ;
          const pNext = project(px, trace.y, pz, camX, camY);
          
          if (pPrev && pNext) {
            ctx.save();
            ctx.lineWidth = Math.max(0.4, 1.0 * ((pPrev.scale + pNext.scale) / 2));
            ctx.beginPath();
            ctx.moveTo(pPrev.x, pPrev.y);
            ctx.lineTo(pNext.x, pNext.y);
            ctx.stroke();
            ctx.restore();
          }
          pPrev = pNext;
          projectedSegments.push(pNext);
        });

        // Draw end via pad
        if (pPrev) {
          ctx.save();
          ctx.strokeStyle = strokeColor;
          ctx.fillStyle = faceFillStyle;
          ctx.lineWidth = Math.max(0.4, 0.8 * pPrev.scale);
          ctx.beginPath();
          ctx.arc(pPrev.x, pPrev.y, 3.5 * pPrev.scale, 0, Math.PI*2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Animate digital signal pulses (faint, small comets)
        trace.signalPos += trace.signalSpeed;
        if (trace.signalPos > 1) {
          trace.signalPos = 0;
        }

        const numSegs = trace.segments.length;
        if (numSegs > 1) {
          const totalLength = trace.segments[numSegs - 1].relZ;

          const getPosOnTrace = (progress: number) => {
            const curZTarget = totalLength * progress;
            let segIndex = 0;
            for (let i = 0; i < numSegs - 1; i++) {
              if (curZTarget >= trace.segments[i].relZ && curZTarget <= trace.segments[i + 1].relZ) {
                segIndex = i;
                break;
              }
            }
            const sStart = trace.segments[segIndex];
            const sEnd = trace.segments[segIndex + 1];
            const segRange = sEnd.relZ - sStart.relZ;
            const segProgress = segRange > 0 ? (curZTarget - sStart.relZ) / segRange : 0;
            
            return {
              x: trace.xBase + sStart.relX + (sEnd.relX - sStart.relX) * segProgress,
              z: effZBase + sStart.relZ + (sEnd.relZ - sStart.relZ) * segProgress
            };
          };

          // Faint, thin trail comets (3 points lag)
          const trailLength = 3;
          for (let t = trailLength; t >= 0; t--) {
            const lagProgress = Math.max(0, trace.signalPos - t * 0.015);
            if (lagProgress <= 0) continue;

            const pos = getPosOnTrace(lagProgress);
            const pSignal = project(pos.x, trace.y, pos.z, camX, camY);
            if (pSignal) {
              const alphaRatio = (trailLength - t) / trailLength;
              const size = Math.max(1, (1.5 + 1.5 * alphaRatio) * pSignal.scale);
              
              ctx.save();
              ctx.fillStyle = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 3.5 * alphaRatio})`;
              ctx.beginPath();
              ctx.arc(pSignal.x, pSignal.y, size, 0, Math.PI*2);
              ctx.fill();
              ctx.restore();
            }
          }
        }
      });

      // --- Draw 3D Electronic Components (Volumetric Glassmorphic Components) ---
      components.forEach(comp => {
        const effZ = ((comp.zBase - cameraZOffset) % sceneDepth + sceneDepth) % sceneDepth + 10;
        
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = textFillColor;
        
        if (comp.type === 'ic') {
          drawSolidBox3D(comp.x, comp.y, effZ, comp.w, comp.h, comp.d, camX, camY, faceFillStyle);

          // Component Text Label in 3D perspective
          const pText = project(comp.x, comp.y, effZ, camX, camY);
          if (pText) {
            ctx.font = `500 ${Math.round(7.5 * pText.scale)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(comp.label, pText.x, pText.y);
          }

          // Metallic side pins (simplified, no vertical segments down to plane)
          const pinSpacing = 16;
          const hw = comp.w / 2;
          const hd = comp.d / 2;
          const pinLength = 6;
          const zStart = effZ - hd + 12;
          const zEnd = effZ + hd - 12;
          const numPins = Math.floor((zEnd - zStart) / pinSpacing) + 1;

          for (let i = 0; i < numPins; i++) {
            const pinZ = zStart + i * pinSpacing;
            if (pinZ < 10 || pinZ > 1600) continue;

            // Left Pins
            drawLine3D(comp.x - hw, comp.y + comp.h/2, pinZ, comp.x - hw - pinLength, comp.y + comp.h/2, pinZ, camX, camY, 0.7);

            // Right Pins
            drawLine3D(comp.x + hw, comp.y + comp.h/2, pinZ, comp.x + hw + pinLength, comp.y + comp.h/2, pinZ, camX, camY, 0.7);
          }
        } 
        
        else if (comp.type === 'resistor') {
          drawSolidBox3D(comp.x, comp.y, effZ, comp.w, comp.h, comp.d, camX, camY, faceFillStyle);

          // Subdued monochrome concentric band lines
          const dPart = comp.d / 5;
          const bandColors = [
            `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 3.0})`,
            `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 1.5})`
          ];

          for (let i = 1; i <= 4; i++) {
            const zBand = effZ - comp.d/2 + i * dPart;
            ctx.save();
            ctx.strokeStyle = bandColors[i % 2];
            ctx.lineWidth = 1.5;
            drawLine3D(comp.x - comp.w/2, comp.y - comp.h/2, zBand, comp.x + comp.w/2, comp.y - comp.h/2, zBand, camX, camY, 1.5);
            drawLine3D(comp.x + comp.w/2, comp.y - comp.h/2, zBand, comp.x + comp.w/2, comp.y + comp.h/2, zBand, camX, camY, 1.5);
            drawLine3D(comp.x + comp.w/2, comp.y + comp.h/2, zBand, comp.x - comp.w/2, comp.y + comp.h/2, zBand, camX, camY, 1.5);
            drawLine3D(comp.x - comp.w/2, comp.y + comp.h/2, zBand, comp.x - comp.w/2, comp.y - comp.h/2, zBand, camX, camY, 1.5);
            ctx.restore();
          }

          // Metal wire leads
          drawLine3D(comp.x, comp.y, effZ - comp.d/2, comp.x, comp.y, effZ - comp.d/2 - 30, camX, camY, 0.6);
          drawLine3D(comp.x, comp.y, effZ + comp.d/2, comp.x, comp.y, effZ + comp.d/2 + 30, camX, camY, 0.6);
        } 
        
        else {
          drawGate3D(comp, effZ, camX, camY, faceFillStyle);

          // Logic Gate Text Label
          const pText = project(comp.x, comp.y + comp.h/2 + 12, effZ, camX, camY);
          if (pText) {
            ctx.font = `${Math.round(7.0 * pText.scale)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(comp.label, pText.x, pText.y);
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
