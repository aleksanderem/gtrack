import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import LocationMapView from '../views/LocationMapView.vue';
import LocationSettingsView from '../views/LocationSettingsView.vue';
import ReviewsDashboard from '../components/gtrack/reviews/ReviewsDashboard.vue';

// Reviews sub-components
import ReviewsStats from '../components/gtrack/reviews/ReviewsStats.vue';
import ReviewsList from '../components/gtrack/reviews/ReviewsList.vue';
import AcquisitionPanel from '../components/gtrack/reviews/AcquisitionPanel.vue';
import InterceptedReviews from '../components/gtrack/reviews/InterceptedReviews.vue';
import ResponseTemplates from '../components/gtrack/reviews/ResponseTemplates.vue';

const routes = [
  {
    path: '/',
    redirect: '/demo-location/map'
  },
  {
    path: '/:locationId',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirect: 'map'
      },
      {
        path: 'map',
        name: 'map',
        component: LocationMapView,
        meta: { label: 'Mapa' }
      },
      {
        path: 'reviews',
        component: ReviewsDashboard,
        children: [
            {
                path: '',
                redirect: { name: 'reviews-overview' }
            },
            {
                path: 'overview',
                name: 'reviews-overview',
                component: {
                    // Wrapper to show stats + list, as per original dashboard
                    template: `<div><ReviewsStats v-if="stats" :stats="stats" /><ReviewsList /></div>`,
                    components: { ReviewsStats, ReviewsList },
                    props: ['stats'] 
                }
            },
            {
                path: 'acquisition',
                name: 'reviews-acquisition',
                component: AcquisitionPanel
            },
            {
                path: 'intercepted',
                name: 'reviews-intercepted',
                component: InterceptedReviews
            },
            {
                path: 'templates',
                name: 'reviews-templates',
                component: ResponseTemplates
            }
        ]
      },
      {
        path: 'settings',
        name: 'settings',
        component: LocationSettingsView,
        meta: { label: 'Ustawienia' }
      },
      // Placeholder for other tabs
      {
        path: 'posts',
        name: 'posts',
        component: { template: '<div class="p-6">Widok Posty (w przygotowaniu)</div>' }
      },
      {
        path: 'content',
        name: 'content',
        component: { template: '<div class="p-6">Widok Wizytówka (w przygotowaniu)</div>' }
      },
      {
        path: 'keywords',
        name: 'keywords-report',
        component: { template: '<div class="p-6">Raport Pozycje (w przygotowaniu)</div>' }
      },
      {
        path: 'comparison',
        name: 'comparison',
        component: { template: '<div class="p-6">Raport Konkurencja (w przygotowaniu)</div>' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


