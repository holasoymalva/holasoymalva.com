// Animación de trazos de crayola durante el scroll
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'crayon-canvas';
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:1;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  
  // Colores de crayola vibrantes pero suaves
  const crayonColors = [
    'rgba(255, 107, 107, 0.3)', 
    'rgba(78, 205, 196, 0.3)', 
    'rgba(255, 230, 109, 0.3)', 
    'rgba(168, 230, 207, 0.3)', 
    'rgba(255, 139, 148, 0.3)', 
    'rgba(199, 206, 234, 0.3)',
    'rgba(255, 218, 193, 0.3)', 
    'rgba(180, 248, 200, 0.3)'
  ];

  const strokes = [];
  const maxStrokes = 8; // Número fijo de trazos

  class CrayonStroke {
    constructor(startX, startY, color, angle) {
      this.startX = startX;
      this.startY = startY;
      this.color = color;
      this.angle = angle;
      this.baseWidth = Math.random() * 12 + 8;
      this.wobbleFreq = Math.random() * 0.02 + 0.01;
      this.wobbleAmp = Math.random() * 15 + 10;
      this.maxLength = 0; // Longitud actual del trazo
      this.points = []; // Guardar puntos para efecto brush
    }

    draw(ctx, scrollProgress) {
      // La longitud del trazo crece con el scroll
      this.maxLength = scrollProgress;

      if (this.maxLength < 10) return;

      // Calcular puntos si no existen o si la longitud cambió
      const steps = Math.floor(this.maxLength / 5);
      if (this.points.length !== steps) {
        this.points = [];
        for (let i = 0; i <= steps; i++) {
          const progress = i * 5;
          
          // Movimiento base en el ángulo
          const baseX = this.startX + Math.cos(this.angle) * progress;
          const baseY = this.startY + Math.sin(this.angle) * progress;
          
          // Añadir wobble (ondulación)
          const wobbleOffset = Math.sin(progress * this.wobbleFreq) * this.wobbleAmp;
          const wobbleX = baseX + Math.cos(this.angle + Math.PI/2) * wobbleOffset;
          const wobbleY = baseY + Math.sin(this.angle + Math.PI/2) * wobbleOffset;
          
          // Variación en el grosor para efecto brush
          const widthVariation = 0.7 + Math.sin(progress * 0.05) * 0.3 + Math.random() * 0.2;
          
          this.points.push({
            x: wobbleX,
            y: wobbleY,
            width: this.baseWidth * widthVariation
          });
        }
      }

      ctx.save();

      // Dibujar múltiples capas para efecto de textura
      for (let layer = 0; layer < 3; layer++) {
        ctx.globalAlpha = 0.15 + (layer * 0.1);
        
        for (let i = 0; i < this.points.length - 1; i++) {
          const point = this.points[i];
          const nextPoint = this.points[i + 1];
          
          // Crear gradiente para cada segmento
          const gradient = ctx.createLinearGradient(
            point.x, point.y,
            nextPoint.x, nextPoint.y
          );
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(1, this.color);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = point.width + (layer * 2);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Añadir textura con puntos aleatorios
          if (layer === 0 && Math.random() > 0.7) {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.2;
            const offsetX = (Math.random() - 0.5) * point.width;
            const offsetY = (Math.random() - 0.5) * point.width;
            ctx.beginPath();
            ctx.arc(point.x + offsetX, point.y + offsetY, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextPoint.x, nextPoint.y);
          ctx.stroke();
        }
      }

      // Capa final más definida
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.baseWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 3;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      
      ctx.stroke();
      ctx.restore();
    }
  }

  // Inicializar trazos al cargar la página
  function initStrokes() {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    // Direcciones predefinidas para variedad
    const directions = [
      Math.PI / 2,        // Abajo
      -Math.PI / 2,       // Arriba
      0,                  // Derecha
      Math.PI,            // Izquierda
      Math.PI / 4,        // Diagonal abajo-derecha
      (3 * Math.PI) / 4,  // Diagonal abajo-izquierda
      -Math.PI / 4,       // Diagonal arriba-derecha
      -(3 * Math.PI) / 4  // Diagonal arriba-izquierda
    ];

    for (let i = 0; i < maxStrokes; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * (docHeight * 0.4); // Empiezan en el primer 40%
      const color = crayonColors[Math.floor(Math.random() * crayonColors.length)];
      
      // Seleccionar una dirección aleatoria y añadir variación
      const baseAngle = directions[Math.floor(Math.random() * directions.length)];
      const angle = baseAngle + (Math.random() - 0.5) * 0.5; // Variación de ±0.25 radianes
      
      strokes.push(new CrayonStroke(startX, startY, color, angle));
    }
  }

  function render() {
    const currentScrollY = window.scrollY;
    const maxScroll = Math.max(
      document.body.scrollHeight - window.innerHeight,
      1
    );
    
    // Progreso del scroll (0 a 1)
    const scrollRatio = Math.min(currentScrollY / maxScroll, 1);
    
    // Longitud máxima que pueden tener los trazos
    const maxPossibleLength = Math.sqrt(width * width + maxScroll * maxScroll);
    const scrollProgress = scrollRatio * maxPossibleLength * 0.8;

    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    
    canvas.height = docHeight;
    ctx.clearRect(0, 0, width, docHeight);

    // Dibujar todos los trazos
    strokes.forEach(stroke => {
      stroke.draw(ctx, scrollProgress);
    });
  }

  // Detectar scroll
  window.addEventListener('scroll', () => {
    render();
  }, { passive: true });

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    strokes.length = 0; // Limpiar trazos
    initStrokes(); // Reinicializar
    render();
  });

  // Inicializar y renderizar
  initStrokes();
  render();

  // Modo oscuro
  const observer = new MutationObserver(() => {
    const isDark = document.body.classList.contains('dark-mode');
    canvas.style.opacity = isDark ? '0.5' : '0.7';
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
});
