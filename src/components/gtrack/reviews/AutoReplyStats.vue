<template>
    <Card class="mb-6">
        <template #title>
            <div class="flex items-center gap-2">
                <i class="pi pi-sparkles text-purple-500"></i>
                <span>Auto-Odpowiedzi</span>
            </div>
        </template>
        <template #content>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <!-- Total Sent -->
                <div class="flex flex-col gap-2 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-send text-purple-600"></i>
                        <span class="text-xs font-semibold text-purple-700 uppercase">Wysłanych</span>
                    </div>
                    <div class="text-3xl font-bold text-purple-900">{{ stats.total_sent }}</div>
                    <span class="text-xs text-purple-600">Auto-odpowiedzi</span>
                </div>

                <!-- Google Auto-Replies -->
                <div class="flex flex-col gap-2 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-google text-blue-600"></i>
                        <span class="text-xs font-semibold text-blue-700 uppercase">Z Opinii Google</span>
                    </div>
                    <div class="text-3xl font-bold text-blue-900">{{ stats.google_auto_replies }}</div>
                    <span class="text-xs text-blue-600">Auto-odpowiedzi</span>
                </div>

                <!-- Intercepted Auto-Replies -->
                <div class="flex flex-col gap-2 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-inbox text-indigo-600"></i>
                        <span class="text-xs font-semibold text-indigo-700 uppercase">Z Przechwyconych</span>
                    </div>
                    <div class="text-3xl font-bold text-indigo-900">{{ stats.intercepted_auto_replies }}</div>
                    <span class="text-xs text-indigo-600">Auto-odpowiedzi</span>
                </div>

                <!-- Time Saved -->
                <div class="flex flex-col gap-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-clock text-green-600"></i>
                        <span class="text-xs font-semibold text-green-700 uppercase">Oszczędzono</span>
                    </div>
                    <div class="text-3xl font-bold text-green-900">{{ stats.time_saved_hours }}h</div>
                    <span class="text-xs text-green-600">Szacunkowo</span>
                </div>

                <!-- Pending -->
                <div class="flex flex-col gap-2 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-hourglass text-amber-600"></i>
                        <span class="text-xs font-semibold text-amber-700 uppercase">Oczekuje</span>
                    </div>
                    <div class="text-3xl font-bold text-amber-900">{{ stats.total_pending }}</div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
:deep(.p-card-body) {
  padding: 2rem 1.5rem;
}

:deep(.p-card-title) {
  margin-bottom: 1.5rem;
}
</style>

