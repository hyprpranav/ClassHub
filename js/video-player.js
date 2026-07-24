// ========================================
// VIDEO PLAYER - CLASSROOM LESSONS
// Adds a local video experience with playback controls and download support
// ========================================

let videoPlayerInitialized = false;

function initializeVideoPlayer() {
    if (videoPlayerInitialized) return;

    const video = document.getElementById('labVideo');
    const overlay = document.getElementById('videoOverlay');
    const speedSelect = document.getElementById('videoSpeedSelect');
    const volumeSlider = document.getElementById('videoVolume');
    const qualitySelect = document.getElementById('videoQualitySelect');
    const downloadBtn = document.getElementById('videoDownloadBtn');
    const enhanceBtn = document.getElementById('videoEnhanceBtn');
    const statusLabel = document.getElementById('videoStatus');

    if (!video || !overlay || !speedSelect || !volumeSlider || !qualitySelect || !downloadBtn || !enhanceBtn || !statusLabel) {
        console.warn('⚠️ Video player elements are missing.');
        return;
    }

    video.playbackRate = 1;
    video.volume = 1;
    speedSelect.value = '1';
    volumeSlider.value = '1';
    qualitySelect.value = 'original';

    const updateStatus = (message) => {
        if (statusLabel) {
            statusLabel.textContent = message;
        }
    };

    const togglePlayback = () => {
        if (video.paused) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise
                    .then(() => {
                        overlay.classList.add('hidden');
                        updateStatus('Playing lesson video');
                    })
                    .catch(() => {
                        updateStatus('Playback started after user tap');
                    });
            } else {
                overlay.classList.add('hidden');
                updateStatus('Playing lesson video');
            }
        } else {
            video.pause();
            overlay.classList.remove('hidden');
            updateStatus('Paused');
        }
    };

    const applyQuality = (mode) => {
        if (mode === 'enhanced') {
            video.style.filter = 'brightness(1.08) contrast(1.06) saturate(1.15)';
            updateStatus('Enhanced viewing mode enabled');
        } else if (mode === 'boost') {
            video.style.filter = 'brightness(1.14) contrast(1.12) saturate(1.2)';
            updateStatus('Boosted clarity mode enabled');
        } else {
            video.style.filter = 'none';
            updateStatus('Original quality mode');
        }
    };

    video.addEventListener('play', () => {
        overlay.classList.add('hidden');
        updateStatus('Playing lesson video');
    });

    video.addEventListener('pause', () => {
        overlay.classList.remove('hidden');
        updateStatus('Paused');
    });

    video.addEventListener('ended', () => {
        overlay.classList.remove('hidden');
        updateStatus('Playback finished');
    });

    video.addEventListener('loadedmetadata', () => {
        updateStatus(`Ready • ${Math.round(video.duration)}s video`);
    });

    video.addEventListener('error', () => {
        updateStatus('Video could not be loaded');
    });

    overlay.addEventListener('click', togglePlayback);
    overlay.addEventListener('dblclick', (event) => {
        event.preventDefault();
        togglePlayback();
    });

    video.addEventListener('click', togglePlayback);
    video.addEventListener('dblclick', (event) => {
        event.preventDefault();
        togglePlayback();
    });

    speedSelect.addEventListener('change', () => {
        video.playbackRate = parseFloat(speedSelect.value);
        updateStatus(`Playback speed ${speedSelect.value}x`);
    });

    volumeSlider.addEventListener('input', () => {
        video.volume = parseFloat(volumeSlider.value);
        updateStatus(`Volume ${Math.round(parseFloat(volumeSlider.value) * 100)}%`);
    });

    qualitySelect.addEventListener('change', () => {
        applyQuality(qualitySelect.value);
    });

    enhanceBtn.addEventListener('click', () => {
        const nextMode = qualitySelect.value === 'enhanced' ? 'boost' : 'enhanced';
        qualitySelect.value = nextMode;
        applyQuality(nextMode);
    });

    downloadBtn.addEventListener('click', () => {
        const source = video.querySelector('source');
        const videoUrl = source ? source.src : video.currentSrc;

        if (!videoUrl) {
            updateStatus('Download unavailable');
            return;
        }

        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = 'VLSI_Lab_Essentials.mp4';
        document.body.appendChild(link);
        link.click();
        link.remove();
        updateStatus('Download started');
    });

    applyQuality(qualitySelect.value);
    videoPlayerInitialized = true;
    console.log('🎬 Video player initialized');
}

function openVideoHub() {
    if (typeof HamsterLoader !== 'undefined') {
        HamsterLoader.show('Opening lab essentials...', 800);
    }

    const videoView = document.getElementById('videoView');
    if (!videoView) {
        console.error('❌ Video view element not found');
        return;
    }

    hideAllViews();
    videoView.classList.remove('hidden');
    videoView.style.display = 'block';
    initializeVideoPlayer();

    setTimeout(() => {
        if (typeof HamsterLoader !== 'undefined') {
            HamsterLoader.hide();
        }
    }, 600);
}

window.initializeVideoPlayer = initializeVideoPlayer;
window.openVideoHub = openVideoHub;

document.addEventListener('DOMContentLoaded', () => {
    initializeVideoPlayer();
});
