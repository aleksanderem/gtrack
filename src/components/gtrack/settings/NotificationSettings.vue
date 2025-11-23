<template>
  <div class="space-y-6">
    <section class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <header class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">Powiadomienia e-mail</h3>
        <p class="text-sm text-gray-500">
          Wybierz zdarzenia, o których GTRACK powinien informować Twój zespół.
        </p>
      </header>
      <div class="space-y-3">
        <div v-for="item in emailNotifications" :key="item.key" class="flex items-start gap-3">
          <Checkbox v-model="item.enabled" :inputId="item.key" binary />
          <label :for="item.key" class="text-sm text-gray-700 leading-relaxed">
            <span class="font-medium text-gray-900">{{ item.title }}</span><br />
            <span class="text-gray-500">{{ item.description }}</span>
          </label>
        </div>
      </div>
      <div class="mt-5 flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700" for="notificationEmail">
          Adres e-mail do powiadomień
        </label>
        <InputText id="notificationEmail" v-model="notificationEmail" type="email" class="rounded-2xl" />
      </div>
    </section>

    <section class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <header class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">Powiadomienia push</h3>
        <p class="text-sm text-gray-500">
          Pozostań na bieżąco w przeglądarce lub aplikacji mobilnej.
        </p>
      </header>
      <div class="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3">
        <div>
          <p class="text-sm font-medium text-gray-900">Push w przeglądarce</p>
          <p class="text-xs text-gray-500">Wysyłaj alerty o istotnych zmianach pozycji.</p>
        </div>
        <InputSwitch v-model="pushEnabled" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Checkbox from 'primevue/checkbox'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'

const emailNotifications = ref([
  {
    key: 'ranking',
    title: 'Zmiany w rankingu',
    description: 'Powiadom mnie, gdy pozycja w map packu poprawi się lub pogorszy.',
    enabled: true
  },
  {
    key: 'scan',
    title: 'Zakończone skanowanie',
    description: 'Otrzymuj informację, gdy raport zostanie wygenerowany.',
    enabled: true
  },
  {
    key: 'competitors',
    title: 'Nowi konkurenci',
    description: 'Informuj, gdy na mapie pojawi się nowa firma.',
    enabled: false
  }
])

const notificationEmail = ref('adrian.c@example.com')
const pushEnabled = ref(true)
</script>
