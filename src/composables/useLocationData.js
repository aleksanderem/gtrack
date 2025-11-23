import { ref } from 'vue';

const location = ref({
  name: 'Dublin City Center',
  address: '123 O\'Connell Street',
  city: 'Dublin',
  postal: 'D01 F5P2',
  phone: '+353 1 234 5678',
  status: 'Active',
  lat: 53.3498,
  lng: -6.2603
});

const keywords = ref([
  'restaurant dublin',
  'best food dublin',
  'italian restaurant'
]);

const trafficSummary = ref({
  title: 'Traffic Distribution',
  primary: {
    id: 'all-traffic',
    label: 'All Traffic',
    value: '1,250 Visits',
    bars: [22, 14, 19, 19, 17, 24],
    trend: 'up',
    iconType: 'svg',
    highlightClass: 'bg-primary',
    iconPaths: [
      {
        d: 'M8.9445 4.58986C7.99777 3.95728 7 3.07697 7 1.93836V0.5C8.38446 0.5 9.73784 0.910543 10.889 1.67971C12.0401 2.44888 12.9373 3.54213 13.4672 4.82121C13.997 6.10028 14.1356 7.50777 13.8655 8.86563C13.5954 10.2235 12.9287 11.4708 11.9497 12.4497C10.9708 13.4287 9.72349 14.0954 8.36563 14.3655C7.00777 14.6356 5.60028 14.497 4.32121 13.9672C3.04213 13.4373 1.94888 12.5401 1.17971 11.389C0.410543 10.2378 0 8.88446 0 7.5H1.43836C2.57697 7.5 3.45728 8.49777 4.08986 9.4445C4.47444 10.0201 5.02107 10.4687 5.66062 10.7336C6.30014 10.9985 7.00389 11.0678 7.68282 10.9327C8.36175 10.7977 8.98538 10.4644 9.47489 9.97489C9.96436 9.48538 10.2977 8.86175 10.4327 8.18282C10.5678 7.50389 10.4985 6.80014 10.2336 6.16062C9.96867 5.52107 9.52007 4.97444 8.9445 4.58986Z',
        class: 'fill-surface-0 dark:fill-surface-900'
      },
      {
        d: 'M3.9375 0.500001C3.69587 0.500001 3.50282 0.696627 3.47269 0.936366C3.43378 1.24606 3.35353 1.54981 3.23358 1.83939C3.05769 2.26403 2.79988 2.64987 2.47487 2.97488C2.14987 3.29988 1.76403 3.55769 1.33939 3.73358C1.04981 3.85353 0.746057 3.93378 0.436365 3.97269C0.196626 4.00282 1.44426e-07 4.19588 1.33864e-07 4.4375L0 7.5C0.919252 7.5 1.8295 7.31895 2.67879 6.96716C3.52807 6.61538 4.29975 6.09976 4.94973 5.44974C5.59975 4.79975 6.11537 4.02807 6.46716 3.17879C6.81894 2.3295 7 1.41925 7 0.5L3.9375 0.500001Z',
        class: 'fill-surface-0 dark:fill-surface-900'
      }
    ]
  }
});

const trafficSources = ref([
  {
    id: 'instagram',
    label: 'Instagram',
    value: '660 Visits',
    icon: 'pi pi-instagram',
    bars: [18, 18, 12, 18, 21, 15],
    trend: 'up',
    change: '+8.3%',
    highlightClass: 'bg-primary'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: '733 Visits',
    icon: 'pi pi-linkedin',
    bars: [12, 16, 20, 10, 12, 10],
    trend: 'down',
    change: '-5.2%',
    highlightClass: 'bg-primary'
  },
  {
    id: 'google',
    label: 'Google',
    value: '817 Visits',
    icon: 'pi pi-google',
    bars: [17, 9, 14, 12, 14, 21],
    trend: 'up',
    change: '+12.1%',
    highlightClass: 'bg-primary'
  },
  {
    id: 'x',
    label: 'X',
    value: '995 Visits',
    icon: 'pi pi-twitter',
    bars: [15, 15, 12, 21, 20, 17],
    trend: 'stable',
    change: '0%',
    highlightClass: 'bg-primary'
  }
]);

const gridConfig = ref({
  currentSize: 9,
  maxSize: 9,
  stepKm: 1,
  centerLat: location.value.lat,
  centerLng: location.value.lng,
  centerName: `${location.value.address}, ${location.value.city}`
});

// Mock function to "fetch" data
const fetchLocationData = async (id) => {
    // In a real app, this would fetch by ID
    console.log('Fetching data for location:', id);
    return { location, keywords, trafficSummary, trafficSources, gridConfig };
};

export function useLocationData() {
    return {
        location,
        keywords,
        trafficSummary,
        trafficSources,
        gridConfig,
        fetchLocationData
    };
}

