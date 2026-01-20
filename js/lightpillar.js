// ========================================
// LIGHT PILLAR ANIMATION - OPTIONAL MODULE
// This file can be safely deleted to remove the animation
// ========================================

class LightPillar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn('Light Pillar: Container not found');
            return;
        }

        // Default options
        this.options = {
            topColor: options.topColor || '#5227FF',
            bottomColor: options.bottomColor || '#FF9FFC',
            intensity: options.intensity || 1,
            rotationSpeed: options.rotationSpeed || 0.3,
            glowAmount: options.glowAmount || 0.002,
            pillarWidth: options.pillarWidth || 3,
            pillarHeight: options.pillarHeight || 0.4,
            noiseIntensity: options.noiseIntensity || 0.5,
            pillarRotation: options.pillarRotation || 25,
            quality: options.quality || 'medium'
        };

        this.time = 0;
        this.animationFrame = null;
        this.initialized = false;

        this.init();
    }

    init() {
        // Check WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.warn('🎨 Light Pillar: WebGL not supported');
            this.showFallback();
            return;
        }

        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('🎨 Light Pillar: Three.js not loaded');
            return;
        }

        try {
            console.log('🎨 Light Pillar: Setting up scene...');
            this.setupScene();
            this.animate();
            this.initialized = true;
            console.log('✅ Light Pillar animation initialized');
        } catch (error) {
            console.error('🎨 Light Pillar error:', error);
            this.showFallback();
        }
    }

    setupScene() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Create scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Quality settings
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const qualitySettings = {
            low: { iterations: 24, pixelRatio: 0.5, stepMultiplier: 1.5 },
            medium: { iterations: 40, pixelRatio: 0.75, stepMultiplier: 1.2 },
            high: { iterations: 80, pixelRatio: Math.min(window.devicePixelRatio, 2), stepMultiplier: 1.0 }
        };

        const quality = isMobile ? 'low' : this.options.quality;
        const settings = qualitySettings[quality];

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: quality === 'high' ? 'high-performance' : 'low-power',
            precision: 'mediump'
        });

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(settings.pixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Shader material
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            precision mediump float;
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uTopColor;
            uniform vec3 uBottomColor;
            uniform float uIntensity;
            uniform float uGlowAmount;
            uniform float uPillarWidth;
            uniform float uPillarHeight;
            uniform float uRotCos;
            uniform float uRotSin;
            varying vec2 vUv;

            const int MAX_ITER = ${settings.iterations};

            void main() {
                vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
                vec3 ro = vec3(0.0, 0.0, -10.0);
                vec3 rd = normalize(vec3(uv, 1.0));

                vec3 col = vec3(0.0);
                float t = 0.1;
                
                for(int i = 0; i < MAX_ITER; i++) {
                    vec3 p = ro + rd * t;
                    p.xz = vec2(uRotCos * p.x - uRotSin * p.z, uRotSin * p.x + uRotCos * p.z);
                    
                    vec3 q = p;
                    q.y = p.y * uPillarHeight + uTime;
                    q += cos(q.zxy * 1.0 - uTime) * 1.0;
                    
                    float d = length(cos(q.xz)) - 0.2;
                    float bound = length(p.xz) - uPillarWidth;
                    d = max(d, bound);
                    d = abs(d) * 0.15 + 0.01;

                    float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
                    col += mix(uBottomColor, uTopColor, grad) / d;

                    t += d * ${settings.stepMultiplier.toFixed(1)};
                    if(t > 50.0) break;
                }

                col = tanh(col * uGlowAmount);
                gl_FragColor = vec4(col * uIntensity, 1.0);
            }
        `;

        const parseColor = (hex) => {
            const color = new THREE.Color(hex);
            return new THREE.Vector3(color.r, color.g, color.b);
        };

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uTopColor: { value: parseColor(this.options.topColor) },
                uBottomColor: { value: parseColor(this.options.bottomColor) },
                uIntensity: { value: this.options.intensity },
                uGlowAmount: { value: this.options.glowAmount },
                uPillarWidth: { value: this.options.pillarWidth },
                uPillarHeight: { value: this.options.pillarHeight },
                uRotCos: { value: 1.0 },
                uRotSin: { value: 0.0 }
            },
            transparent: true
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);

        // Handle resize
        window.addEventListener('resize', () => this.onResize());
    }

    animate() {
        if (!this.initialized) return;

        this.time += 0.016 * this.options.rotationSpeed;
        
        if (this.material) {
            this.material.uniforms.uTime.value = this.time;
            this.material.uniforms.uRotCos.value = Math.cos(this.time * 0.3);
            this.material.uniforms.uRotSin.value = Math.sin(this.time * 0.3);
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    onResize() {
        if (!this.container || !this.renderer || !this.material) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.renderer.setSize(width, height);
        this.material.uniforms.uResolution.value.set(width, height);
    }

    updateColors(topColor, bottomColor) {
        if (!this.material) return;

        const parseColor = (hex) => {
            const color = new THREE.Color(hex);
            return new THREE.Vector3(color.r, color.g, color.b);
        };

        this.material.uniforms.uTopColor.value = parseColor(topColor);
        this.material.uniforms.uBottomColor.value = parseColor(bottomColor);
    }

    showFallback() {
        this.container.innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">WebGL not supported</div>';
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        if (this.material) {
            this.material.dispose();
        }
        this.initialized = false;
        console.log('🗑️ Light Pillar animation destroyed');
    }
}

// Global instance
window.LightPillarAnimation = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Light Pillar: Initializing...');
    
    const container = document.getElementById('lightPillarContainer');
    if (!container) {
        console.warn('🎨 Light Pillar: Container not found');
        return;
    }

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('🎨 Light Pillar: Three.js not loaded!');
        container.innerHTML = '<div style="color: #888; text-align: center; padding: 20px; font-size: 12px;">Animation library not loaded</div>';
        return;
    }

    // Theme-aware colors (check body, not documentElement)
    const isDarkTheme = document.body.classList.contains('dark-theme');
    console.log('🎨 Light Pillar: Dark theme?', isDarkTheme);
    
    const colors = isDarkTheme 
        ? { topColor: '#5227FF', bottomColor: '#FF9FFC' }  // Light colors for dark theme
        : { topColor: '#1a1a2e', bottomColor: '#16213e' };  // Dark colors for light theme

    console.log('🎨 Light Pillar: Using colors:', colors);
    window.LightPillarAnimation = new LightPillar('lightPillarContainer', colors);
});

// Update colors on theme change
document.addEventListener('themeChanged', (e) => {
    if (!window.LightPillarAnimation) return;

    const isDark = e.detail.theme === 'dark';
    const colors = isDark
        ? { topColor: '#5227FF', bottomColor: '#FF9FFC' }
        : { topColor: '#1a1a2e', bottomColor: '#16213e' };

    window.LightPillarAnimation.updateColors(colors.topColor, colors.bottomColor);
});

console.log('✅ Light Pillar module loaded (removable)');
