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

interface BinaryDigit {
  x: number;
  y: number;
  zBase: number;
  val: string;
  speed: number;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const currentColor = useRef({ r: 46, g: 75, b: 56, a: 0.12 });

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

    // Generate PCB Traces (45/90 degree lines)
    const generateTrace = (zBase: number): PCBTrace => {
      const isLeft = Math.random() < 0.5;
      // Position mostly at screen margins (left/right) to keep center content clean
      const xBase = isLeft ? -Math.random() * 350 - 150 : Math.random() * 350 + 150;
      const y = Math.random() < 0.5 ? gridPlaneY : -gridPlaneY;
      
      const segments = [{ relX: 0, relZ: 0 }];
      let curRelX = 0;
      let curRelZ = 0;

      // Segment 1: straight line along Z
      curRelZ += Math.random() * 150 + 50;
      segments.push({ relX: curRelX, relZ: curRelZ });

      // Segment 2: 45 or 90 degree turn
      const turnType = Math.random() < 0.5 ? '45' : '90';
      const turnDir = Math.random() < 0.5 ? -1 : 1;
      const turnDist = Math.random() * 60 + 30;

      if (turnType === '45') {
        curRelX += turnDir * turnDist;
        curRelZ += turnDist; // 45 degree trace
      } else {
        curRelX += turnDir * turnDist; // 90 degree trace
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
        signalSpeed: Math.random() * 0.005 + 0.003
      };
    };

    const traces: PCBTrace[] = [];
    for (let i = 0; i < 28; i++) {
      traces.push(generateTrace((i / 28) * sceneDepth));
    }

    // Generate 3D Components
    const components: Component3D[] = [
      // Left side components
      { type: 'ic', x: -320, y: 150, zBase: 150, w: 90, h: 20, d: 130, label: 'FPGA' },
      { type: 'and', x: -260, y: -100, zBase: 350, w: 50, h: 40, d: 20, label: 'AND' },
      { type: 'resistor', x: -350, y: 180, zBase: 500, w: 25, h: 25, d: 60, label: 'R1' },
      { type: 'ic', x: -280, y: -120, zBase: 700, w: 70, h: 18, d: 90, label: 'EPROM' },
      { type: 'or', x: -300, y: 80, zBase: 950, w: 50, h: 40, d: 20, label: 'OR' },
      { type: 'resistor', x: -250, y: 160, zBase: 1100, w: 25, h: 25, d: 60, label: 'R2' },
      { type: 'not', x: -320, y: -80, zBase: 1350, w: 40, h: 30, d: 20, label: 'NOT' },

      // Right side components
      { type: 'ic', x: 280, y: -140, zBase: 200, w: 80, h: 20, d: 110, label: 'MCU' },
      { type: 'or', x: 320, y: 100, zBase: 450, w: 50, h: 40, d: 20, label: 'XOR' },
      { type: 'resistor', x: 260, y: 190, zBase: 650, w: 25, h: 25, d: 60, label: 'R3' },
      { type: 'ic', x: 340, y: 120, zBase: 850, w: 100, h: 22, d: 140, label: 'ADC' },
      { type: 'and', x: 270, y: -90, zBase: 1050, w: 50, h: 40, d: 20, label: 'NAND' },
      { type: 'resistor', x: 330, y: -130, zBase: 1250, w: 25, h: 25, d: 60, label: 'R4' },
      { type: 'ic', x: 300, y: 130, zBase: 1450, w: 75, h: 18, d: 80, label: 'RAM' }
    ];

    // Generate Floating Binary Streams
    const binaries: BinaryDigit[] = [];
    for (let i = 0; i < 30; i++) {
      const isLeft = Math.random() < 0.5;
      binaries.push({
        x: isLeft ? -Math.random() * 300 - 150 : Math.random() * 300 + 150,
        y: (Math.random() - 0.5) * 360,
        zBase: Math.random() * sceneDepth,
        val: Math.random() < 0.5 ? '0' : '1',
        speed: Math.random() * 0.4 + 0.1
      });
    }

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
      camX: number, camY: number
    ) => {
      const p1 = project(x1, y1, z1, camX, camY);
      const p2 = project(x2, y2, z2, camX, camY);
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    // Helper to draw a 3D box (e.g. for ICs and Resistors)
    const drawBox3D = (
      cx: number, cy: number, cz: number,
      w: number, h: number, d: number,
      camX: number, camY: number
    ) => {
      // Define 8 vertices relative to center
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

      // Bitwise connection helper (draw edges)
      // Connect along axis directions
      for (let i = 0; i < 8; i++) {
        const pA = projected[i];
        if (!pA) continue;

        // Connections along X, Y, Z directions
        for (const mask of [1, 2, 4]) {
          const neighborIdx = i ^ mask;
          if (neighborIdx > i) {
            const pB = projected[neighborIdx];
            if (pB) {
              ctx.beginPath();
              ctx.moveTo(pA.x, pA.y);
              ctx.lineTo(pB.x, pB.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    // Helper to draw 3D Logic Gates
    const drawGate3D = (
      comp: Component3D,
      cz: number,
      camX: number,
      camY: number
    ) => {
      const { x: cx, y: cy, w, h, type } = comp;
      const pinLen = 15;

      const pBackCenter = project(cx, cy, cz, camX, camY);
      if (!pBackCenter) return;

      ctx.lineWidth = 1;

      if (type === 'and') {
        // Draw AND gate: straight back, inputs, semicircular front
        const p1 = project(cx - w/2, cy - h/2, cz, camX, camY);
        const p2 = project(cx - w/2, cy + h/2, cz, camX, camY);
        const pStartArc = project(cx, cy - h/2, cz, camX, camY);
        const pEndArc = project(cx, cy + h/2, cz, camX, camY);

        if (p1 && p2 && pStartArc && pEndArc) {
          // Draw back plate
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Draw straight sides
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(pStartArc.x, pStartArc.y);
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(pEndArc.x, pEndArc.y);
          ctx.stroke();

          // Draw front curve (semi-circle in Z plane)
          ctx.beginPath();
          ctx.moveTo(pStartArc.x, pStartArc.y);
          const steps = 8;
          for (let i = 0; i <= steps; i++) {
            const angle = -Math.PI/2 + (Math.PI * i / steps);
            const arcX = cx + Math.cos(angle) * (w/2);
            const arcY = cy + Math.sin(angle) * (h/2);
            const pArc = project(arcX, arcY, cz, camX, camY);
            if (pArc) ctx.lineTo(pArc.x, pArc.y);
          }
          ctx.stroke();
        }

        // Inputs
        drawLine3D(cx - w/2 - pinLen, cy - h/4, cz, cx - w/2, cy - h/4, cz, camX, camY);
        drawLine3D(cx - w/2 - pinLen, cy + h/4, cz, cx - w/2, cy + h/4, cz, camX, camY);
        // Output
        drawLine3D(cx + w/2, cy, cz, cx + w/2 + pinLen, cy, cz, camX, camY);

      } else if (type === 'or') {
        // Draw OR gate: curved back, pointed nose
        const steps = 8;
        
        // Curved back
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const factor = i / steps; // 0 to 1
          const backX = cx - w/2 + Math.sin(factor * Math.PI) * (w/4);
          const backY = cy - h/2 + factor * h;
          const pBack = project(backX, backY, cz, camX, camY);
          if (pBack) {
            if (i === 0) ctx.moveTo(pBack.x, pBack.y);
            else ctx.lineTo(pBack.x, pBack.y);
          }
        }
        ctx.stroke();

        // Top arc to pointed nose
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

        // Bottom arc to pointed nose
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

        // Inputs
        drawLine3D(cx - w/2 - pinLen + 4, cy - h/4, cz, cx - w/2 + 4, cy - h/4, cz, camX, camY);
        drawLine3D(cx - w/2 - pinLen + 4, cy + h/4, cz, cx - w/2 + 4, cy + h/4, cz, camX, camY);
        // Output
        drawLine3D(cx + w/2, cy, cz, cx + w/2 + pinLen, cy, cz, camX, camY);

      } else if (type === 'not') {
        // Draw NOT gate: triangle pointing right + circle bubble
        const pTop = project(cx - w/3, cy - h/2, cz, camX, camY);
        const pBot = project(cx - w/3, cy + h/2, cz, camX, camY);
        const pNose = project(cx + w/3, cy, cz, camX, camY);

        if (pTop && pBot && pNose) {
          ctx.beginPath();
          ctx.moveTo(pTop.x, pTop.y);
          ctx.lineTo(pBot.x, pBot.y);
          ctx.lineTo(pNose.x, pNose.y);
          ctx.closePath();
          ctx.stroke();

          // Bubble circle
          const bubbleRadius = 4;
          const pBubble = project(cx + w/3 + bubbleRadius, cy, cz, camX, camY);
          if (pBubble) {
            ctx.beginPath();
            ctx.arc(pBubble.x, pBubble.y, bubbleRadius * pBubble.scale, 0, Math.PI*2);
            ctx.stroke();
          }
        }

        // Inputs
        drawLine3D(cx - w/3 - pinLen, cy, cz, cx - w/3, cy, cz, camX, camY);
        // Output
        drawLine3D(cx + w/3 + 8, cy, cz, cx + w/3 + 8 + pinLen, cy, cz, camX, camY);
      }
    };

    // Detect if current visible section is dark or light
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
      
      // Auto-traverse + scroll depth
      const scrollFactor = 0.6;
      cameraZOffset = scrollYRef.current * scrollFactor;

      // Theme blending
      const theme = getActiveSectionTheme();
      const targetColor = theme === 'dark' 
        ? { r: 244, g: 180, b: 0, a: 0.16 } // Amber glow
        : { r: 46, g: 75, b: 56, a: 0.11 };  // Soft Forest Green

      const lerpSpeed = 0.05;
      currentColor.current.r += (targetColor.r - currentColor.current.r) * lerpSpeed;
      currentColor.current.g += (targetColor.g - currentColor.current.g) * lerpSpeed;
      currentColor.current.b += (targetColor.b - currentColor.current.b) * lerpSpeed;
      currentColor.current.a += (targetColor.a - currentColor.current.a) * lerpSpeed;

      const strokeColor = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a})`;
      const textFillColor = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 2.5})`;
      const signalColor = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 5.0})`;

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = textFillColor;
      ctx.lineWidth = 1;

      // --- Draw 3D PCB Traces (Circuit Paths) ---
      traces.forEach(trace => {
        // Wrap trace modularly to stay in scene depth
        const effZBase = ((trace.zBase - cameraZOffset) % sceneDepth + sceneDepth) % sceneDepth + 10;
        
        ctx.beginPath();
        let pPrev = project(trace.xBase, trace.y, effZBase, camX, camY);
        if (pPrev) {
          ctx.moveTo(pPrev.x, pPrev.y);
        }

        // Draw via circle at start
        if (pPrev) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(pPrev.x, pPrev.y, 4 * pPrev.scale, 0, Math.PI*2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(pPrev.x, pPrev.y, 1.5 * pPrev.scale, 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
        }

        const projectedSegments = [pPrev];

        // Draw segments
        trace.segments.forEach((seg, sIdx) => {
          if (sIdx === 0) return;
          const px = trace.xBase + seg.relX;
          const pz = effZBase + seg.relZ;
          const pNext = project(px, trace.y, pz, camX, camY);
          
          if (pPrev && pNext) {
            ctx.beginPath();
            ctx.moveTo(pPrev.x, pPrev.y);
            ctx.lineTo(pNext.x, pNext.y);
            ctx.stroke();
          }
          pPrev = pNext;
          projectedSegments.push(pNext);
        });

        // Draw via circle at end
        if (pPrev) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(pPrev.x, pPrev.y, 4 * pPrev.scale, 0, Math.PI*2);
          ctx.stroke();
          ctx.restore();
        }

        // Animate digital signals along trace pathways
        trace.signalPos += trace.signalSpeed;
        if (trace.signalPos > 1) {
          trace.signalPos = 0;
        }

        // Calculate position of signal along segments
        const numSegs = trace.segments.length;
        if (numSegs > 1) {
          const totalLength = trace.segments[numSegs - 1].relZ;
          const curZTarget = totalLength * trace.signalPos;
          
          // Find which segment Z fits in
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

          // Interpolated 3D position
          const sigX = trace.xBase + sStart.relX + (sEnd.relX - sStart.relX) * segProgress;
          const sigZ = effZBase + sStart.relZ + (sEnd.relZ - sStart.relZ) * segProgress;
          
          const pSignal = project(sigX, trace.y, sigZ, camX, camY);
          if (pSignal) {
            const size = Math.max(2, 4.5 * pSignal.scale);
            ctx.save();
            ctx.fillStyle = signalColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = signalColor;
            ctx.beginPath();
            ctx.arc(pSignal.x, pSignal.y, size, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
          }
        }
      });

      // --- Draw 3D Electronic Components ---
      components.forEach(comp => {
        const effZ = ((comp.zBase - cameraZOffset) % sceneDepth + sceneDepth) % sceneDepth + 10;
        
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = textFillColor;
        
        if (comp.type === 'ic') {
          // Draw Integrated Circuit (IC chip)
          drawBox3D(comp.x, comp.y, effZ, comp.w, comp.h, comp.d, camX, camY);

          // Draw text label on IC (e.g. CPU, FPGA)
          const pText = project(comp.x, comp.y, effZ, camX, camY);
          if (pText) {
            ctx.font = `bold ${Math.round(8 * pText.scale)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(comp.label, pText.x, pText.y);
          }

          // Draw metallic side pins
          const pinSpacing = 16;
          const hw = comp.w / 2;
          const hd = comp.d / 2;
          const pinLength = 8;

          // Left and Right pins
          const zStart = effZ - hd + 12;
          const zEnd = effZ + hd - 12;
          const numPins = Math.floor((zEnd - zStart) / pinSpacing) + 1;

          for (let i = 0; i < numPins; i++) {
            const pinZ = zStart + i * pinSpacing;
            if (pinZ < 10 || pinZ > 1600) continue;

            // Left side pins
            drawLine3D(comp.x - hw, comp.y + comp.h/2, pinZ, comp.x - hw - pinLength, comp.y + comp.h/2, pinZ, camX, camY);
            drawLine3D(comp.x - hw - pinLength, comp.y + comp.h/2, pinZ, comp.x - hw - pinLength, comp.y + 40, pinZ, camX, camY);

            // Right side pins
            drawLine3D(comp.x + hw, comp.y + comp.h/2, pinZ, comp.x + hw + pinLength, comp.y + comp.h/2, pinZ, camX, camY);
            drawLine3D(comp.x + hw + pinLength, comp.y + comp.h/2, pinZ, comp.x + hw + pinLength, comp.y + 40, pinZ, camX, camY);
          }
        } 
        
        else if (comp.type === 'resistor') {
          // Draw Resistor Cylinder
          drawBox3D(comp.x, comp.y, effZ, comp.w, comp.h, comp.d, camX, camY);

          // Concentric band lines around resistor
          const dPart = comp.d / 5;
          for (let i = 1; i <= 4; i++) {
            const zBand = effZ - comp.d/2 + i * dPart;
            drawLine3D(comp.x - comp.w/2, comp.y - comp.h/2, zBand, comp.x + comp.w/2, comp.y - comp.h/2, zBand, camX, camY);
            drawLine3D(comp.x + comp.w/2, comp.y - comp.h/2, zBand, comp.x + comp.w/2, comp.y + comp.h/2, zBand, camX, camY);
            drawLine3D(comp.x + comp.w/2, comp.y + comp.h/2, zBand, comp.x - comp.w/2, comp.y + comp.h/2, zBand, camX, camY);
            drawLine3D(comp.x - comp.w/2, comp.y + comp.h/2, zBand, comp.x - comp.w/2, comp.y - comp.h/2, zBand, camX, camY);
          }

          // Metal wire leads
          drawLine3D(comp.x, comp.y, effZ - comp.d/2, comp.x, comp.y, effZ - comp.d/2 - 40, camX, camY);
          drawLine3D(comp.x, comp.y, effZ + comp.d/2, comp.x, comp.y, effZ + comp.d/2 + 40, camX, camY);
        } 
        
        else {
          // Logic Gates (AND, OR, NOT)
          drawGate3D(comp, effZ, camX, camY);

          // Add small text label under logic gate
          const pText = project(comp.x, comp.y + comp.h/2 + 15, effZ, camX, camY);
          if (pText) {
            ctx.font = `${Math.round(7 * pText.scale)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(comp.label, pText.x, pText.y);
          }
        }
      });

      // --- Draw 3D Floating Binary Streams (Data Buses) ---
      binaries.forEach(b => {
        // Move binary along Z axis continuously
        b.zBase -= b.speed;
        const effZ = ((b.zBase - cameraZOffset) % sceneDepth + sceneDepth) % sceneDepth + 10;
        
        const pBin = project(b.x, b.y, effZ, camX, camY);
        if (pBin) {
          // Opacity fades out if binary is too close or too far
          const distFade = Math.min(1, effZ / 200) * Math.max(0, 1 - effZ / 1500);
          ctx.save();
          ctx.fillStyle = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(currentColor.current.g)}, ${Math.round(currentColor.current.b)}, ${currentColor.current.a * 1.8 * distFade})`;
          ctx.font = `${Math.round(11 * pBin.scale)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.val, pBin.x, pBin.y);
          ctx.restore();
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
