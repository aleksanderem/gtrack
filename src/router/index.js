import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import DashboardView from '../views/DashboardView.vue';
import LocationMapView from '../views/LocationMapView.vue';
import LocationSettingsView from '../views/LocationSettingsView.vue';
import BusinessInfoView from '../views/BusinessInfoView.vue';
import PostsView from '../views/PostsView.vue';
import MediaView from '../views/MediaView.vue';
import SmartTasksView from '../views/SmartTasksView.vue';
import MonitoringView from '../views/MonitoringView.vue';
import RaportyView from '../views/RaportyView.vue';
import ReviewsDashboard from '../components/gtrack/reviews/ReviewsDashboard.vue';

// Reviews sub-components
import ReviewsOverview from '../components/gtrack/reviews/ReviewsOverview.vue';
import ReviewsList from '../components/gtrack/reviews/ReviewsList.vue';
import AcquisitionPanel from '../components/gtrack/reviews/AcquisitionPanel.vue';
import InterceptedReviews from '../components/gtrack/reviews/InterceptedReviews.vue';
import ResponseTemplates from '../components/gtrack/reviews/ResponseTemplates.vue';
import AutoReplySettings from '../components/gtrack/reviews/AutoReplySettings.vue';
import AutoReplyHistory from '../components/gtrack/reviews/AutoReplyHistory.vue';
import PublicFeedbackView from '../views/PublicFeedbackView.vue';

const routes = [
  {
    path: '/',
    redirect: '/demo-location/map'
  },
  {
    path: '/feedback/:locationId',
    name: 'public-feedback',
    component: PublicFeedbackView
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
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { label: 'Dashboard' }
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
                component: ReviewsOverview,
                props: true 
            },
            {
                path: 'reviews',
                name: 'reviews-list',
                component: ReviewsList
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
            },
            {
                path: 'auto-reply',
                name: 'reviews-auto-reply',
                component: AutoReplySettings
            },
            {
                path: 'auto-reply/history',
                name: 'reviews-auto-reply-history',
                component: AutoReplyHistory
            }
        ]
      },
      {
        path: 'settings',
        name: 'settings',
        component: LocationSettingsView,
        meta: { label: 'Ustawienia' }
      },
      {
        path: 'posts',
        name: 'posts',
        component: PostsView,
        meta: { label: 'Posty' }
      },
      {
        path: 'media',
        name: 'media',
        component: MediaView,
        meta: { label: 'Media' }
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: SmartTasksView,
        meta: { label: 'Smart Tasks' }
      },
      {
        path: 'monitoring',
        name: 'monitoring',
        component: MonitoringView,
        meta: { label: 'Monitoring' }
      },
      {
        path: 'raporty',
        name: 'raporty',
        component: RaportyView,
        meta: { label: 'Raporty' }
      },
      // Placeholders using render functions to avoid runtime compiler dependency
      {
        path: 'content',
        name: 'content',
        component: BusinessInfoView,
        meta: { label: 'Wizytówka' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
