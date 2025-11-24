<template>
  <div class="flex flex-col gap-6">
    <!-- AI Insights & Best Practices -->
    <Card class="border border-gray-100 shadow-sm">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-lightbulb text-primary"></i>
          <span class="text-lg font-semibold">Wnioski AI i Najlepsze Praktyki</span>
        </div>
      </template>
      <template #content>
        <div v-if="loadingElements || loadingSentiment" class="space-y-4">
          <Skeleton height="150px"></Skeleton>
        </div>
        <div v-else class="flex flex-col gap-4">
          <!-- Scenario-based insights -->
          <div class="bg-white border border-gray-200 rounded-lg p-5">
            <div class="mb-5">
              <h3 class="text-base font-semibold mb-1.5" :class="getInsightsTitleClass()">
                {{ getScenarioTitle() }}
              </h3>
              <p class="text-sm leading-relaxed text-gray-600">
                {{ getScenarioDescription() }}
              </p>
            </div>
            
            <!-- Key Insights from Analysis -->
            <div v-if="elementsAnalysis?.insights && elementsAnalysis.insights.length > 0" class="mb-5">
              <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Kluczowe wnioski z analizy opinii
              </h4>
              <div class="space-y-2.5">
                <div v-for="insight in elementsAnalysis.insights" :key="insight.title" class="bg-white rounded-lg p-3 border border-gray-100">
                  <div class="font-medium text-sm text-gray-900 mb-2">{{ insight.title }}</div>
                  <div v-if="insight.elements && insight.elements.length > 0" class="flex flex-wrap gap-2 mb-2">
                    <template v-if="insight.type === 'trend'">
                      <Tag 
                        v-for="element in insight.elements" 
                        :key="element" 
                        :value="element"
                        severity="success"
                        rounded
                      />
                    </template>
                    <template v-else>
                      <Tag 
                        v-for="element in insight.elements" 
                        :key="element" 
                        :value="element"
                        :severity="props.scenario?.id === 'negative' ? 'danger' : 'warn'"
                        rounded
                      />
                    </template>
                  </div>
                  <div v-if="insight.description && (!insight.elements || insight.elements.length === 0)" class="text-sm text-gray-600 leading-relaxed">
                    {{ insight.description }}
                  </div>
                  <div v-else-if="insight.description && insight.elements && insight.elements.length === 0 && insight.type === 'recommendation'" class="text-sm text-gray-600 leading-relaxed mt-2">
                    {{ insight.description }}
                  </div>
                </div>
              </div>
            </div>
              
            <!-- Sentiment Summary -->
            <div v-if="sentimentAnalysis" class="mb-5">
              <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Podsumowanie sentymentu
              </h4>
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-white rounded-lg p-4 border border-gray-100 flex flex-col items-center">
                  <Knob 
                    :modelValue="sentimentAnalysis.distribution.positive" 
                    :min="0" 
                    :max="100" 
                    :size="70"
                    :strokeWidth="10"
                    valueColor="#22c55e"
                    rangeColor="#e5e7eb"
                    :textColor="'#6b7280'"
                    readonly
                    :pt="{ value: 'text-xs font-semibold', label: 'hidden' }"
                  />
                  <div class="text-xs text-gray-500 mt-2">Pozytywne</div>
                </div>
                <div class="bg-white rounded-lg p-4 border border-gray-100 flex flex-col items-center">
                  <Knob 
                    :modelValue="sentimentAnalysis.distribution.neutral" 
                    :min="0" 
                    :max="100" 
                    :size="70"
                    :strokeWidth="10"
                    valueColor="#6b7280"
                    rangeColor="#e5e7eb"
                    :textColor="'#6b7280'"
                    readonly
                    :pt="{ value: 'text-xs font-semibold', label: 'hidden' }"
                  />
                  <div class="text-xs text-gray-500 mt-2">Neutralne</div>
                </div>
                <div class="bg-white rounded-lg p-4 border border-gray-100 flex flex-col items-center">
                  <Knob 
                    :modelValue="sentimentAnalysis.distribution.negative" 
                    :min="0" 
                    :max="100" 
                    :size="70"
                    :strokeWidth="10"
                    valueColor="#ef4444"
                    rangeColor="#e5e7eb"
                    :textColor="'#6b7280'"
                    readonly
                    :pt="{ value: 'text-xs font-semibold', label: 'hidden' }"
                  />
                  <div class="text-xs text-gray-500 mt-2">Negatywne</div>
                </div>
              </div>
            </div>
              
            <!-- Best Practices -->
            <div>
              <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Najlepsze praktyki dla Twojej sytuacji
              </h4>
              <TabView :pt="{ nav: { class: 'text-xs' }, tab: { class: 'text-xs' }, tabTitle: { class: 'text-xs font-semibold text-gray-500 uppercase tracking-wide' } }">
                <TabPanel v-for="practice in getBestPractices()" :key="practice.title" :header="practice.title">
                  <div class="py-2">
                    <p class="text-sm text-gray-600 leading-relaxed mb-3">{{ practice.description }}</p>
                    <div class="bg-gray-50 rounded-md p-2.5 border-l-2" :class="getWhyBorderClass()">
                      <div class="flex items-start gap-2">
                        <i class="pi pi-info-circle text-xs text-gray-500 mt-0.5"></i>
                        <div>
                          <span class="text-xs font-medium text-gray-700 block mb-0.5">Dlaczego to ważne</span>
                          <span class="text-xs text-gray-600 leading-relaxed">{{ practice.why }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Sentiment Analysis -->
    <Card class="border border-gray-100 shadow-sm">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-heart text-primary"></i>
          <span class="text-lg font-semibold">Analiza Sentymentu</span>
          <Tag v-if="sentimentAnalysis" :value="getSentimentLabel(sentimentAnalysis.overall)" :severity="getSentimentSeverity(sentimentAnalysis.overall)" class="ml-2" />
        </div>
      </template>
      <template #content>
        <div v-if="loadingSentiment" class="space-y-4">
          <Skeleton height="100px"></Skeleton>
        </div>
        <div v-else-if="sentimentAnalysis && sentimentLineChartData" class="flex flex-col gap-4">
          <!-- Sentiment Distribution Chart -->
          <Chart type="line" :data="sentimentLineChartData" :options="sentimentLineChartOptions" class="h-[300px]" />
        </div>
        <div v-else-if="!loadingSentiment" class="text-center py-8 text-gray-500">
          <i class="pi pi-info-circle text-2xl mb-2"></i>
          <p>Brak danych do wyświetlenia</p>
        </div>
      </template>
    </Card>

    <!-- Products & Services Analysis -->
    <Card class="border border-gray-100 shadow-sm">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-shopping-bag text-primary"></i>
          <span class="text-lg font-semibold">Analiza Produktów i Usług</span>
        </div>
      </template>
      <template #content>
        <div v-if="loadingProducts" class="space-y-4">
          <Skeleton height="150px"></Skeleton>
        </div>
        <div v-else-if="productsAnalysis" class="flex flex-col gap-6">
          <!-- Services Chart -->
          <div v-if="productsAnalysis.services && productsAnalysis.services.length > 0">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Najczęściej wspominane usługi</h3>
            <Chart type="bar" :data="servicesChartData" :options="barChartOptions" class="h-[300px]" />
          </div>
          
          <!-- Products Chart -->
          <div v-if="productsAnalysis.products && productsAnalysis.products.length > 0">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Najczęściej wspominane produkty</h3>
            <Chart type="bar" :data="productsChartData" :options="barChartOptions" class="h-[300px]" />
          </div>
          
          <div v-if="(!productsAnalysis.services || productsAnalysis.services.length === 0) && (!productsAnalysis.products || productsAnalysis.products.length === 0)" class="text-sm text-gray-500 italic text-center py-4">
            Brak danych o produktach i usługach
          </div>
        </div>
      </template>
    </Card>

    <!-- Time Trends Analysis -->
    <Card class="border border-gray-100 shadow-sm">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-chart-line text-primary"></i>
          <span class="text-lg font-semibold">Trendy w Czasie</span>
        </div>
      </template>
      <template #content>
        <div v-if="loadingTimeTrends" class="space-y-4">
          <Skeleton height="300px"></Skeleton>
        </div>
        <div v-else-if="timeTrendsData">
          <Chart type="line" :data="timeTrendsChartData" :options="timeTrendsChartOptions" class="h-[400px]" />
        </div>
      </template>
    </Card>

    <!-- Repeating Elements Analysis -->
    <Card class="border border-gray-100 shadow-sm">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-chart-bar text-primary"></i>
          <span class="text-lg font-semibold">Powtarzające się Elementy</span>
        </div>
      </template>
      <template #content>
        <div v-if="loadingElements" class="space-y-4">
          <Skeleton height="200px"></Skeleton>
        </div>
        <div v-else-if="elementsAnalysis" class="flex flex-col gap-6">
          <!-- Themes Chart -->
          <div v-if="elementsAnalysis.themes && elementsAnalysis.themes.length > 0">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Tematy w opiniach</h3>
            <Chart type="bar" :data="themesChartData" :options="horizontalBarChartOptions" class="h-[300px]" />
          </div>
          
          <!-- Keywords -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Najczęstsze słowa kluczowe</h3>
            <div class="flex flex-wrap gap-2">
              <Tag 
                v-for="keyword in elementsAnalysis.keywords" 
                :key="keyword.word"
                :value="keyword.word"
                severity="secondary"
                class="text-xs"
              >
                <template #value>
                  {{ keyword.word }} ({{ keyword.count }})
                </template>
              </Tag>
            </div>
          </div>
          
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Skeleton from 'primevue/skeleton';
import Chart from 'primevue/chart';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Knob from 'primevue/knob';
import { ReviewsService } from '../../../services/ReviewsService';

const props = defineProps({
  scenario: {
    type: Object,
    default: null
  }
});

// Get colors based on scenario
const getScenarioColors = () => {
  if (props.scenario?.id === 'negative') {
    return {
      positive: '#ef4444', // red (but low percentage)
      neutral: '#f97316', // orange
      negative: '#dc2626', // dark red
      primary: '#dc2626'
    };
  } else if (props.scenario?.id === 'neutral') {
    return {
      positive: '#f59e0b', // amber
      neutral: '#f97316', // orange
      negative: '#dc2626', // red
      primary: '#f59e0b'
    };
  } else {
    return {
      positive: '#22c55e', // green
      neutral: '#6b7280', // gray
      negative: '#ef4444', // red
      primary: '#6366f1'
    };
  }
};

const sentimentAnalysis = ref(null);
const productsAnalysis = ref(null);
const elementsAnalysis = ref(null);
const timeTrendsData = ref(null);
const loadingSentiment = ref(false);
const loadingProducts = ref(false);
const loadingElements = ref(false);
const loadingTimeTrends = ref(false);

const getSentimentLabel = (sentiment) => {
  const labels = {
    positive: 'Pozytywny',
    neutral: 'Neutralny',
    negative: 'Negatywny'
  };
  return labels[sentiment] || sentiment;
};

const getSentimentSeverity = (sentiment) => {
  const severities = {
    positive: 'success',
    neutral: 'secondary',
    negative: 'danger'
  };
  return severities[sentiment] || 'secondary';
};

// Sentiment Line Chart Data
const sentimentLineChartData = computed(() => {
  if (!sentimentAnalysis.value || !sentimentAnalysis.value.trends) return null;
  
  const colors = getScenarioColors();
  
  // Helper to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return {
    labels: sentimentAnalysis.value.trends.labels,
    datasets: [
      {
        label: 'Pozytywne',
        data: sentimentAnalysis.value.trends.positive,
        borderColor: colors.positive,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, hexToRgba(colors.positive, 0.3));
          gradient.addColorStop(1, hexToRgba(colors.positive, 0.05));
          return gradient;
        },
        tension: 0.5,
        fill: true,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: colors.positive,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointBackgroundColor: colors.positive,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Neutralne',
        data: sentimentAnalysis.value.trends.neutral,
        borderColor: colors.neutral,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, hexToRgba(colors.neutral, 0.3));
          gradient.addColorStop(1, hexToRgba(colors.neutral, 0.05));
          return gradient;
        },
        tension: 0.5,
        fill: true,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: colors.neutral,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointBackgroundColor: colors.neutral,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Negatywne',
        data: sentimentAnalysis.value.trends.negative,
        borderColor: colors.negative,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, hexToRgba(colors.negative, 0.3));
          gradient.addColorStop(1, hexToRgba(colors.negative, 0.05));
          return gradient;
        },
        tension: 0.5,
        fill: true,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: colors.negative,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointBackgroundColor: colors.negative,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };
});

const sentimentLineChartOptions = computed(() => ({
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false
  },
  animation: {
    duration: 1200,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
          weight: '500'
        },
        color: '#374151',
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 8,
        boxHeight: 8
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: 14,
      titleFont: {
        size: 13,
        weight: '600',
        family: 'Inter, system-ui, sans-serif'
      },
      bodyFont: {
        size: 12,
        family: 'Inter, system-ui, sans-serif'
      },
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 10,
      displayColors: true,
      boxPadding: 6,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y + '%';
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#6b7280',
        padding: 8,
        maxRotation: 45,
        minRotation: 0
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#6b7280',
        stepSize: 10,
        padding: 8,
        callback: function(value) {
          return value + '%';
        }
      },
      beginAtZero: true,
      max: 100
    }
  },
  maintainAspectRatio: false
}));

// Services Chart Data
const servicesChartData = computed(() => {
  if (!productsAnalysis.value || !productsAnalysis.value.services) return null;
  
  const colors = getScenarioColors();
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return {
    labels: productsAnalysis.value.services.map(s => s.name),
    datasets: [
      {
        label: 'Procent opinii',
        data: productsAnalysis.value.services.map(s => s.percentage),
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const chartArea = context.chart.chartArea;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, hexToRgba(colors.primary, 0.8));
          gradient.addColorStop(1, hexToRgba(colors.primary, 0.4));
          return gradient;
        },
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };
});

// Products Chart Data
const productsChartData = computed(() => {
  if (!productsAnalysis.value || !productsAnalysis.value.products) return null;
  
  const colors = getScenarioColors();
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return {
    labels: productsAnalysis.value.products.map(p => p.name),
    datasets: [
      {
        label: 'Procent opinii',
        data: productsAnalysis.value.products.map(p => p.percentage),
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const chartArea = context.chart.chartArea;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, hexToRgba(colors.primary, 0.8));
          gradient.addColorStop(1, hexToRgba(colors.primary, 0.4));
          return gradient;
        },
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };
});

// Themes Chart Data
const themesChartData = computed(() => {
  if (!elementsAnalysis.value || !elementsAnalysis.value.themes) return null;
  
  return {
    labels: elementsAnalysis.value.themes.map(t => t.theme),
    datasets: [
      {
        label: 'Procent wystąpień',
        data: elementsAnalysis.value.themes.map(t => t.percentage),
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          
          const theme = elementsAnalysis.value.themes[context.dataIndex];
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          
          if (theme.sentiment === 'positive') {
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
            gradient.addColorStop(1, 'rgba(22, 163, 74, 0.4)');
          } else {
            gradient.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
            gradient.addColorStop(1, 'rgba(234, 88, 12, 0.4)');
          }
          return gradient;
        },
        borderColor: elementsAnalysis.value.themes.map(t => 
          t.sentiment === 'positive' ? '#22c55e' : '#f97316'
        ),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };
});

// Bar Chart Options
const barChartOptions = computed(() => ({
  indexAxis: 'y',
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 13,
        weight: '600'
      },
      bodyFont: {
        size: 12
      },
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return context.parsed.x + '%';
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#6b7280',
        callback: function(value) {
          return value + '%';
        }
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
          weight: '500'
        },
        color: '#374151',
        padding: 8
      }
    }
  },
  maintainAspectRatio: false
}));

// Horizontal Bar Chart Options (for themes)
const horizontalBarChartOptions = computed(() => ({
  indexAxis: 'y',
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 13,
        weight: '600'
      },
      bodyFont: {
        size: 12
      },
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          const theme = elementsAnalysis.value.themes[context.dataIndex];
          return theme.theme + ': ' + context.parsed.x + '% (' + theme.count + ' wystąpień)';
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#6b7280',
        callback: function(value) {
          return value + '%';
        }
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
          weight: '500'
        },
        color: '#374151',
        padding: 8
      }
    }
  },
  maintainAspectRatio: false
}));

// Time Trends Chart Data
const timeTrendsChartData = computed(() => {
  if (!timeTrendsData.value) return null;
  
  const colors = getScenarioColors();
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // Colors for different datasets based on scenario
  const reviewCountColor = colors.primary;
  const ratingColor = props.scenario?.id === 'negative' ? colors.negative : 
                      props.scenario?.id === 'neutral' ? colors.neutral : colors.positive;
  const replyColor = props.scenario?.id === 'negative' ? '#dc2626' : 
                     props.scenario?.id === 'neutral' ? '#f59e0b' : '#6366f1';
  
  return {
    labels: timeTrendsData.value.labels,
    datasets: [
      {
        label: 'Liczba opinii',
        data: timeTrendsData.value.reviewCounts,
        borderColor: reviewCountColor,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, hexToRgba(reviewCountColor, 0.3));
          gradient.addColorStop(1, hexToRgba(reviewCountColor, 0.05));
          return gradient;
        },
        yAxisID: 'y',
        tension: 0.5,
        fill: true,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: reviewCountColor,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointBackgroundColor: reviewCountColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Średnia ocena',
        data: timeTrendsData.value.averageRatings,
        borderColor: ratingColor,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, hexToRgba(ratingColor, 0.3));
          gradient.addColorStop(1, hexToRgba(ratingColor, 0.05));
          return gradient;
        },
        yAxisID: 'y1',
        tension: 0.5,
        fill: true,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: ratingColor,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointBackgroundColor: ratingColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Liczba odpowiedzi',
        data: timeTrendsData.value.replyCounts,
        borderColor: replyColor,
        backgroundColor: 'transparent',
        yAxisID: 'y',
        tension: 0.5,
        fill: false,
        borderDash: [8, 4],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: replyColor,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointBackgroundColor: replyColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };
});

const timeTrendsChartOptions = computed(() => ({
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false
  },
  animation: {
    duration: 1200,
    easing: 'easeInOutQuart'
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif',
          weight: '500'
        },
        color: '#374151',
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 8,
        boxHeight: 8
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: 14,
      titleFont: {
        size: 13,
        weight: '600',
        family: 'Inter, system-ui, sans-serif'
      },
      bodyFont: {
        size: 12,
        family: 'Inter, system-ui, sans-serif'
      },
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 10,
      displayColors: true,
      boxPadding: 6,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            if (label.includes('Średnia ocena')) {
              label += context.parsed.y.toFixed(1);
            } else {
              label += context.parsed.y;
            }
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#6b7280',
        padding: 8
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#6b7280',
        stepSize: 1,
        padding: 8
      },
      beginAtZero: true
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        font: {
          size: 11,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#6b7280',
        stepSize: 0.5,
        padding: 8,
        callback: function(value) {
          return value.toFixed(1);
        }
      },
      beginAtZero: false,
      min: 1,
      max: 5
    }
  },
  maintainAspectRatio: false
}));

const loadAnalyses = async () => {
  try {
    // Load reviews first
    const reviews = await ReviewsService.getReviews();
    
    // Load all analyses in parallel
    loadingSentiment.value = true;
    loadingProducts.value = true;
    loadingElements.value = true;
    loadingTimeTrends.value = true;
    
    const [sentiment, products, elements, timeTrends] = await Promise.all([
      ReviewsService.analyzeSentiment(reviews, props.scenario),
      ReviewsService.analyzeProductsAndServices(reviews),
      ReviewsService.analyzeRepeatingElements(reviews),
      ReviewsService.analyzeTimeTrends(reviews, props.scenario)
    ]);
    
    sentimentAnalysis.value = sentiment;
    productsAnalysis.value = products;
    elementsAnalysis.value = elements;
    timeTrendsData.value = timeTrends;
  } catch (error) {
    console.error('Failed to load AI analyses', error);
  } finally {
    loadingSentiment.value = false;
    loadingProducts.value = false;
    loadingElements.value = false;
    loadingTimeTrends.value = false;
  }
};

// Get scenario-based insights styling
const getScenarioEmoji = () => {
  if (!props.scenario) return '📊';
  return props.scenario.emoji || '🎉';
};

const getScenarioTitle = () => {
  if (!props.scenario) return 'Analiza opinii';
  if (props.scenario.id === 'positive') {
    return 'Świetne wyniki!';
  } else if (props.scenario.id === 'neutral') {
    return 'Wymaga uwagi';
  } else {
    return 'Krytyczna sytuacja';
  }
};

const getScenarioDescription = () => {
  if (!props.scenario) return 'Przeanalizuj swoje opinie i wykorzystaj poniższe wnioski oraz najlepsze praktyki do poprawy satysfakcji klientów.';
  if (props.scenario.id === 'positive') {
    return 'Twoje opinie są w większości pozytywne. Kontynuuj obecne działania i wykorzystaj sukces do budowania jeszcze silniejszej reputacji.';
  } else if (props.scenario.id === 'neutral') {
    return 'Twoje opinie mieszczą się w średnim zakresie. To sygnał, że warto skupić się na poprawie jakości obsługi i doświadczenia klientów.';
  } else {
    return 'Twoje opinie wskazują na poważne problemy wymagające natychmiastowej interwencji. Skoncentruj się na szybkim rozwiązywaniu problemów klientów.';
  }
};

const getInsightsCardClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'bg-blue-50 border border-blue-100';
  } else if (props.scenario.id === 'neutral') {
    return 'bg-amber-50 border border-amber-100';
  } else {
    return 'bg-red-50 border border-red-100';
  }
};

const getEmojiContainerClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'bg-blue-500 text-white';
  } else if (props.scenario.id === 'neutral') {
    return 'bg-amber-500 text-white';
  } else {
    return 'bg-red-500 text-white';
  }
};

const getBulletBgClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'bg-blue-500';
  } else if (props.scenario.id === 'neutral') {
    return 'bg-amber-500';
  } else {
    return 'bg-red-500';
  }
};

const getPracticeIconBgClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'bg-blue-100';
  } else if (props.scenario.id === 'neutral') {
    return 'bg-amber-100';
  } else {
    return 'bg-red-100';
  }
};

const getPracticeIconClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'text-blue-600';
  } else if (props.scenario.id === 'neutral') {
    return 'text-amber-600';
  } else {
    return 'text-red-600';
  }
};

const getWhyBorderClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'border-blue-300';
  } else if (props.scenario.id === 'neutral') {
    return 'border-amber-300';
  } else {
    return 'border-red-300';
  }
};

const getInsightsTitleClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'text-blue-800';
  } else if (props.scenario.id === 'neutral') {
    return 'text-yellow-800';
  } else {
    return 'text-red-800';
  }
};

const getInsightsTextClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'text-blue-700';
  } else if (props.scenario.id === 'neutral') {
    return 'text-yellow-700';
  } else {
    return 'text-red-700';
  }
};

const getInsightsBulletClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'text-blue-500';
  } else if (props.scenario.id === 'neutral') {
    return 'text-yellow-500';
  } else {
    return 'text-red-500';
  }
};

const getPracticeBorderClass = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return 'border-blue-200';
  } else if (props.scenario.id === 'neutral') {
    return 'border-yellow-200';
  } else {
    return 'border-red-200';
  }
};

const getBestPractices = () => {
  if (!props.scenario || props.scenario.id === 'positive') {
    return [
      {
        title: 'Wykorzystaj pozytywne opinie',
        description: 'Udostępniaj najlepsze opinie na swojej stronie i w mediach społecznościowych. Pozytywne recenzje zwiększają zaufanie i przyciągają nowych klientów.',
        icon: 'pi pi-share-alt',
        why: 'Badania pokazują, że 88% konsumentów ufa recenzjom online tak samo jak rekomendacjom od znajomych. Promowanie pozytywnych opinii buduje wiarygodność marki.'
      },
      {
        title: 'Utrzymaj wysoką jakość obsługi',
        description: 'Kontynuuj obecne standardy obsługi klienta. Regularnie monitoruj opinie, aby szybko reagować na wszelkie zmiany w postrzeganiu marki.',
        icon: 'pi pi-check-circle',
        why: 'Konsystencja w jakości obsługi jest kluczowa dla utrzymania pozytywnej reputacji. Nawet małe spadki mogą szybko wpłynąć na ogólną ocenę.'
      },
      {
        title: 'Zachęcaj do pozostawiania opinii',
        description: 'Aktywnie proś zadowolonych klientów o pozostawienie opinii. Więcej pozytywnych recenzji poprawia widoczność w wyszukiwarkach i zwiększa konwersję.',
        icon: 'pi pi-star',
        why: 'Firmy z większą liczbą recenzji mają wyższy ranking w Google i innych platformach. Więcej opinii = więcej potencjalnych klientów.'
      },
      {
        title: 'Analizuj trendy i wzorce',
        description: 'Regularnie przeglądaj analizy AI, aby identyfikować powtarzające się tematy i obszary, które klienci szczególnie doceniają.',
        icon: 'pi pi-chart-line',
        why: 'Zrozumienie tego, co klienci najbardziej cenią, pozwala lepiej pozycjonować usługi i inwestować w obszary o największym wpływie na satysfakcję.'
      }
    ];
  } else if (props.scenario?.id === 'neutral') {
    return [
      {
        title: 'Priorytetyzuj szybkie odpowiedzi',
        description: 'Odpowiadaj na wszystkie opinie w ciągu 24-48 godzin. Szybka reakcja pokazuje, że zależy Ci na klientach i może zmienić negatywne doświadczenie w pozytywne.',
        icon: 'pi pi-clock',
        why: 'Klienci oczekują szybkiej odpowiedzi. Badania pokazują, że odpowiedź w ciągu 24 godzin może zwiększyć satysfakcję klienta nawet o 40%.'
      },
      {
        title: 'Skup się na najczęstszych problemach',
        description: 'Przeanalizuj powtarzające się tematy w opiniach i wprowadź konkretne zmiany. Jeśli klienci często wspominają o czasie oczekiwania, optymalizuj procesy.',
        icon: 'pi pi-wrench',
        why: 'Rozwiązanie najczęściej wspominanych problemów ma największy wpływ na poprawę ogólnej oceny. Skupienie się na głównych bolączkach przynosi najlepsze rezultaty.'
      },
      {
        title: 'Proaktywna komunikacja',
        description: 'Kontaktuj się z klientami przed wystąpieniem problemów. Informuj o zmianach, nowościach i ulepszeniach, które wprowadzasz na podstawie ich opinii.',
        icon: 'pi pi-comments',
        why: 'Proaktywna komunikacja buduje zaufanie i pokazuje zaangażowanie. Klienci doceniają, gdy widzą, że ich opinie są słuchane i wprowadzane w życie.'
      },
      {
        title: 'Szkolenia zespołu',
        description: 'Zainwestuj w szkolenia personelu z obsługi klienta. Dobrze wyszkolony zespół może znacząco poprawić doświadczenie klientów i zwiększyć pozytywnych opinii.',
        icon: 'pi pi-users',
        why: 'Personel jest często pierwszym punktem kontaktu z klientem. Wysoka jakość obsługi bezpośrednio przekłada się na lepsze oceny i większą lojalność klientów.'
      },
      {
        title: 'Monitoruj postępy',
        description: 'Ustaw konkretne cele poprawy (np. zwiększenie średniej oceny o 0.5 w ciągu 3 miesięcy) i regularnie sprawdzaj postępy za pomocą analiz AI.',
        icon: 'pi pi-chart-bar',
        why: 'Mierzenie postępów pozwala ocenić skuteczność wprowadzanych zmian i dostosować strategię. Bez monitoringu trudno wiedzieć, czy działania przynoszą efekty.'
      }
    ];
  } else {
    return [
      {
        title: 'Natychmiastowa interwencja',
        description: 'Odpowiedz na wszystkie negatywne opinie w ciągu kilku godzin. Oferuj konkretne rozwiązania i przeprosiny. Pokaż, że zależy Ci na naprawie sytuacji.',
        icon: 'pi pi-exclamation-triangle',
        why: 'Negatywne opinie mogą szybko się rozprzestrzeniać i wpływać na decyzje innych klientów. Szybka reakcja może powstrzymać eskalację problemu i pokazać zaangażowanie.'
      },
      {
        title: 'Identyfikuj główne przyczyny',
        description: 'Przeanalizuj wszystkie negatywne opinie i znajdź wspólne wzorce. Czy problem dotyczy konkretnej usługi, pracownika czy procesu? Skoncentruj się na najważniejszych problemach.',
        icon: 'pi pi-search',
        why: 'Zrozumienie przyczyn negatywnych opinii jest kluczowe dla skutecznego rozwiązania problemu. Bez identyfikacji źródła trudno wprowadzić trwałe zmiany.'
      },
      {
        title: 'Wprowadź natychmiastowe poprawki',
        description: 'Nie czekaj - wprowadź szybkie poprawki tam, gdzie to możliwe. Nawet małe zmiany mogą pokazać klientom, że ich opinie są traktowane poważnie.',
        icon: 'pi pi-sync',
        why: 'Działania naprawcze pokazują zaangażowanie i mogą zmienić negatywne postrzeganie. Klienci doceniają, gdy widzą realne zmiany wprowadzone na podstawie ich opinii.'
      },
      {
        title: 'Osobisty kontakt z klientami',
        description: 'Skontaktuj się bezpośrednio z klientami, którzy pozostawili negatywne opinie. Zaproponuj rozwiązanie problemu i poproś o aktualizację opinii po naprawie.',
        icon: 'pi pi-phone',
        why: 'Osobisty kontakt pokazuje, że zależy Ci na każdym kliencie. Często klienci zmieniają negatywną opinię na pozytywną po otrzymaniu odpowiedniej pomocy i zadośćuczynienia.'
      },
      {
        title: 'Przejrzystość i komunikacja',
        description: 'Bądź transparentny co do problemów i działań naprawczych. Informuj klientów o wprowadzanych zmianach i poproś o cierpliwość podczas procesu poprawy.',
        icon: 'pi pi-info-circle',
        why: 'Przejrzystość buduje zaufanie nawet w trudnych sytuacjach. Klienci doceniają szczerość i chętniej dają drugą szansę firmom, które przyznają się do błędów i pracują nad poprawą.'
      },
      {
        title: 'Długoterminowy plan naprawczy',
        description: 'Stwórz kompleksowy plan poprawy jakości obsługi i produktów. Ustaw konkretne cele i terminy. Regularnie monitoruj postępy i dostosowuj strategię.',
        icon: 'pi pi-calendar',
        why: 'Trwała poprawa wymaga systematycznego podejścia. Plan naprawczy zapewnia, że zmiany są wprowadzane konsekwentnie i mierzalnie, co prowadzi do długoterminowej poprawy reputacji.'
      }
    ];
  }
};

onMounted(() => {
  loadAnalyses();
});

// Reload analyses when scenario changes
watch(() => props.scenario, () => {
  if (props.scenario) {
    loadAnalyses();
  }
}, { deep: true });
</script>

