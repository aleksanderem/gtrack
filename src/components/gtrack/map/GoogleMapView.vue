<template>
  <div id="map" ref="mapContainer" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'

const props = defineProps({
  gridConfig: {
    type: Object,
    required: true
  },
  refreshKey: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['marker-selected', 'business-panel-open', 'grid-size-change'])

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const selectedMarker = ref(null)

onMounted(() => {
  initMap()
})

// Watch for grid config changes
watch(() => props.gridConfig, () => {
  if (map.value) {
    const zoom = map.value.getZoom()
    const newSize = computeGridSizeFromZoom(zoom)
    if (newSize !== props.gridConfig.currentSize) {
      emit('grid-size-change', newSize)
    }
    updateMapMarkers()
  }
}, { deep: true })

watch(() => props.refreshKey, () => {
  if (map.value) {
    updateMapMarkers()
  }
})

const initMap = () => {
  // Initialize Leaflet map
  map.value = L.map('map').setView(
    [props.gridConfig.centerLat, props.gridConfig.centerLng],
    13
  )

  // Add grayscale map tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map.value)

  // Initial markers
  updateMapMarkers()

  // Listen to zoom changes
  map.value.on('zoomend', () => {
    const zoom = map.value.getZoom()
    console.log('🔍 Zoom changed to:', zoom)
    const newSize = computeGridSizeFromZoom(zoom)
    if (newSize !== props.gridConfig.currentSize) {
      emit('grid-size-change', newSize)
    }
    updateMarkerSizes()
  })
}

const updateMapMarkers = () => {
  console.log(`🔄 Updating markers - Grid: ${props.gridConfig.currentSize}×${props.gridConfig.currentSize}`)

  // Clear existing markers
  markers.value.forEach(marker => map.value.removeLayer(marker))
  markers.value = []
  selectedMarker.value = null

  const gridSize = props.gridConfig.maxSize 
    ? Math.min(props.gridConfig.currentSize, props.gridConfig.maxSize)
    : props.gridConfig.currentSize
  const centerLat = props.gridConfig.centerLat
  const centerLng = props.gridConfig.centerLng

  // Convert km to degrees
  const stepDegreesLat = props.gridConfig.stepKm / 111
  const stepDegreesLng = props.gridConfig.stepKm / (111 * Math.cos(centerLat * Math.PI / 180))

  const halfGrid = (gridSize - 1) / 2

  // Create grid markers
  for (let row = -halfGrid; row <= halfGrid; row++) {
    for (let col = -halfGrid; col <= halfGrid; col++) {
      const lat = centerLat + (row * stepDegreesLat)
      const lng = centerLng + (col * stepDegreesLng)

      // Random ranking 1-25
      const ranking = Math.floor(Math.random() * 25) + 1

      const { outerColor, innerColor, textColor, shadowColor, size } = getMarkerStyle(ranking)

      const innerCircleSize = 48

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="outer-circle" style="
            --shadow-color: ${shadowColor};
            --text-color: ${textColor};
            position: relative;
            background: ${outerColor}1A;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: visible;
          ">
            <div class="ripple-wave"></div>
            <div class="inner-circle" style="
              background: ${innerColor};
              width: ${innerCircleSize}px;
              height: ${innerCircleSize}px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: 13px;
              color: ${textColor};
              text-shadow: 0 1px 0px rgb(255 255 255 / 49%), -1px 1px 0px rgb(255 255 255 / 24%);
            ">
              ${ranking > 20 ? '20+' : ranking}
            </div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      })

      const distanceFromCenter = Math.sqrt(row*row + col*col) * props.gridConfig.stepKm * 1000

      const marker = L.marker([lat, lng], {
        icon: icon,
        ranking: ranking,
        zIndexOffset: ranking <= 3 ? 1000 : 0
      }).bindPopup(`
        <div style="min-width: 150px;">
          <strong>Pozycja: ${ranking > 20 ? '20+' : ranking}</strong><br>
          <small>Od środka: ${Math.round(distanceFromCenter)}m</small><br>
          <small>Grid: ${gridSize}×${gridSize} (${row >= 0 ? '+' : ''}${row}, ${col >= 0 ? '+' : ''}${col})</small>
        </div>
      `)

      marker.on('click', () => {
        selectMarker(marker)
        emit('business-panel-open', ranking)
      })

      marker.addTo(map.value)
      markers.value.push(marker)

      // Select center marker by default
      if (row === 0 && col === 0) {
        setTimeout(() => {
          selectMarker(marker)
        }, 100)
      }
    }
  }
}

const selectMarker = (marker) => {
  // Remove selected class from all markers
  markers.value.forEach(m => {
    const element = m.getElement()
    if (element) {
      element.querySelector('.outer-circle')?.classList.remove('selected')
    }
  })

  // Add selected class to clicked marker
  const element = marker.getElement()
  if (element) {
    element.querySelector('.outer-circle')?.classList.add('selected')
  }

  selectedMarker.value = marker
  emit('marker-selected', marker.options.ranking)
}

const getMarkerStyle = (ranking) => {
  let outerColor, innerColor, textColor, shadowColor

  if (ranking <= 3) {
    outerColor = '#22c55e'
    innerColor = '#86efac'
    textColor = '#16a34a'
    shadowColor = 'rgba(34, 197, 94, 0.5)'
  } else if (ranking <= 7) {
    outerColor = '#84cc16'
    innerColor = '#bef264'
    textColor = '#84cc16'
    shadowColor = 'rgba(132, 204, 22, 0.5)'
  } else if (ranking <= 12) {
    outerColor = '#eab308'
    innerColor = '#fde047'
    textColor = '#eab308'
    shadowColor = 'rgba(234, 179, 8, 0.5)'
  } else if (ranking <= 18) {
    outerColor = '#f97316'
    innerColor = '#fdba74'
    textColor = '#f97316'
    shadowColor = 'rgba(249, 115, 22, 0.5)'
  } else {
    outerColor = '#ef4444'
    innerColor = '#fca5a5'
    textColor = '#ef4444'
    shadowColor = 'rgba(239, 68, 68, 0.5)'
  }

  const zoom = map.value.getZoom()
  const metersPerPixel = 156543.03392 / Math.pow(2, zoom)
  const stepMeters = props.gridConfig.stepKm * 1000
  const stepPixels = stepMeters / metersPerPixel
  const size = Math.round(stepPixels * 2.2)

  return { outerColor, innerColor, textColor, shadowColor, size }
}

const updateMarkerSizes = () => {
  markers.value.forEach(marker => {
    const ranking = marker.options.ranking
    const { outerColor, innerColor, textColor, shadowColor, size } = getMarkerStyle(ranking)
    const innerCircleSize = 48

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="outer-circle" style="
          --shadow-color: ${shadowColor};
          --text-color: ${textColor};
          position: relative;
          background: ${outerColor}1A;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        ">
          <div class="ripple-wave"></div>
          <div class="inner-circle" style="
            background: ${innerColor};
            width: ${innerCircleSize}px;
            height: ${innerCircleSize}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 13px;
            color: ${textColor};
            text-shadow: 0 1px 0px rgb(255 255 255 / 49%), -1px 1px 0px rgb(255 255 255 / 24%);
          ">
            ${ranking > 20 ? '20+' : ranking}
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    })

    marker.setIcon(icon)

    if (selectedMarker.value && marker._leaflet_id === selectedMarker.value._leaflet_id) {
      nextTick(() => {
        const element = marker.getElement()
        element?.querySelector('.outer-circle')?.classList.add('selected')
      })
    }
  })
}

const computeGridSizeFromZoom = (zoom) => {
  let size = 1
  if (zoom >= 13) {
    size = 9
  } else if (zoom >= 11) {
    size = 6
  } else if (zoom >= 9) {
    size = 3
  }

  if (props.gridConfig.maxSize) {
    size = Math.min(size, props.gridConfig.maxSize)
  }

  return size
}
</script>

<style>
#map {
  height: 100%;
  width: 100%;
  border-radius: 6px;
}

.outer-circle {
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.inner-circle {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.outer-circle:hover .inner-circle {
  transform: scale(1.15);
  box-shadow: 0 4px 16px var(--shadow-color, rgba(0,0,0,0.35));
  border: 1px solid var(--text-color, #000);
}

.outer-circle.selected .inner-circle {
  transform: scale(1.15);
  box-shadow: 0 4px 16px var(--shadow-color, rgba(0,0,0,0.35));
  border: 2px solid white;
}

.outer-circle.selected {
  z-index: 10000 !important;
}

.outer-circle.selected .inner-circle {
  border: 2px solid white;
}

.outer-circle.selected::before,
.outer-circle.selected::after,
.outer-circle.selected .ripple-wave {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  border: 6px solid var(--text-color, rgba(0,0,0,0.8));
  background: transparent;
  transform: translate(-50%, -50%);
  animation: growAndFade 10s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

.outer-circle.selected::before {
  animation-delay: 0s;
}

.outer-circle.selected::after {
  animation-delay: 3.33s;
}

.outer-circle.selected .ripple-wave {
  animation-delay: 6.66s;
}

@keyframes growAndFade {
  0% {
    opacity: 0.5;
    width: 0;
    height: 0;
  }
  100% {
    opacity: 0;
    width: 180px;
    height: 180px;
  }
}
</style>
