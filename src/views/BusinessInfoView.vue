<template>
  <div class="p-6 overflow-y-auto h-full bg-gray-50">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Wizytówka</h1>
          <p class="text-sm text-gray-500 mt-1">Zarządzaj informacjami o firmie w Google Business Profile</p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            label="Historia zmian"
            icon="pi pi-history"
            severity="secondary"
            outlined
            size="small"
            @click="showHistoryPanel = true"
          />
        </div>
      </div>

      <!-- Tabs -->
      <TabView v-model:activeIndex="activeTabIndex">
        <!-- General Info Tab -->
        <TabPanel header="Informacje ogólne">
          <div class="space-y-6 pt-4">
            <!-- Business Name -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nazwa firmy</label>
                <p class="text-xs text-gray-400 mt-1">Oficjalna nazwa widoczna w Google</p>
              </div>
              <div class="md:col-span-2">
                <Inplace :closable="true" @close="saveField('name')">
                  <template #display>
                    <span class="text-gray-900 font-medium">{{ businessData.name || 'Kliknij, aby edytować' }}</span>
                  </template>
                  <template #content="{ closeCallback }">
                    <div class="flex items-center gap-2">
                      <InputText v-model="businessData.name" class="flex-1" />
                      <Button icon="pi pi-check" severity="success" size="small" @click="closeCallback" />
                      <Button icon="pi pi-times" severity="secondary" size="small" text @click="closeCallback" />
                    </div>
                  </template>
                </Inplace>
              </div>
            </div>

            <Divider />

            <!-- Address -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Adres</label>
                <p class="text-xs text-gray-400 mt-1">Lokalizacja firmy</p>
              </div>
              <div class="md:col-span-2">
                <Inplace :closable="true" @close="saveField('address')">
                  <template #display>
                    <span class="text-gray-900">{{ formatAddress(businessData.address) || 'Kliknij, aby edytować' }}</span>
                  </template>
                  <template #content="{ closeCallback }">
                    <div class="space-y-2">
                      <InputText v-model="businessData.address.street" placeholder="Ulica i numer" class="w-full" />
                      <div class="grid grid-cols-2 gap-2">
                        <InputText v-model="businessData.address.postalCode" placeholder="Kod pocztowy" />
                        <InputText v-model="businessData.address.city" placeholder="Miasto" />
                      </div>
                      <div class="flex justify-end gap-2 mt-2">
                        <Button icon="pi pi-check" label="Zapisz" severity="success" size="small" @click="closeCallback" />
                        <Button icon="pi pi-times" label="Anuluj" severity="secondary" size="small" text @click="closeCallback" />
                      </div>
                    </div>
                  </template>
                </Inplace>
              </div>
            </div>

            <Divider />

            <!-- Phone -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefon</label>
                <p class="text-xs text-gray-400 mt-1">Numer kontaktowy</p>
              </div>
              <div class="md:col-span-2">
                <Inplace :closable="true" @close="saveField('phone')">
                  <template #display>
                    <span class="text-gray-900">{{ businessData.phone || 'Kliknij, aby edytować' }}</span>
                  </template>
                  <template #content="{ closeCallback }">
                    <div class="flex items-center gap-2">
                      <InputText v-model="businessData.phone" class="flex-1" placeholder="+48 123 456 789" />
                      <Button icon="pi pi-check" severity="success" size="small" @click="closeCallback" />
                      <Button icon="pi pi-times" severity="secondary" size="small" text @click="closeCallback" />
                    </div>
                  </template>
                </Inplace>
              </div>
            </div>

            <Divider />

            <!-- Website -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Strona WWW</label>
                <p class="text-xs text-gray-400 mt-1">Adres strony internetowej</p>
              </div>
              <div class="md:col-span-2">
                <Inplace :closable="true" @close="saveField('website')">
                  <template #display>
                    <a v-if="businessData.website" :href="businessData.website" target="_blank" class="text-blue-600 hover:underline">
                      {{ businessData.website }}
                    </a>
                    <span v-else class="text-gray-400">Kliknij, aby edytować</span>
                  </template>
                  <template #content="{ closeCallback }">
                    <div class="flex items-center gap-2">
                      <InputText v-model="businessData.website" class="flex-1" placeholder="https://twojafirma.pl" />
                      <Button icon="pi pi-check" severity="success" size="small" @click="closeCallback" />
                      <Button icon="pi pi-times" severity="secondary" size="small" text @click="closeCallback" />
                    </div>
                  </template>
                </Inplace>
              </div>
            </div>

            <Divider />

            <!-- Description -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Opis firmy</label>
                <p class="text-xs text-gray-400 mt-1">Krótki opis działalności (max 750 znaków)</p>
              </div>
              <div class="md:col-span-2">
                <Inplace :closable="true" @close="saveField('description')">
                  <template #display>
                    <p class="text-gray-900 whitespace-pre-wrap">{{ businessData.description || 'Kliknij, aby edytować' }}</p>
                  </template>
                  <template #content="{ closeCallback }">
                    <div class="space-y-2">
                      <Textarea v-model="businessData.description" rows="4" class="w-full" :maxlength="750" />
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-400">{{ businessData.description?.length || 0 }}/750</span>
                        <div class="flex gap-2">
                          <Button icon="pi pi-check" label="Zapisz" severity="success" size="small" @click="closeCallback" />
                          <Button icon="pi pi-times" label="Anuluj" severity="secondary" size="small" text @click="closeCallback" />
                        </div>
                      </div>
                    </div>
                  </template>
                </Inplace>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Categories Tab -->
        <TabPanel header="Kategorie">
          <div class="space-y-6 pt-4">
            <!-- Primary Category -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategoria główna</label>
                <p class="text-xs text-gray-400 mt-1">Główna kategoria działalności</p>
              </div>
              <div class="md:col-span-2">
                <AutoComplete
                  v-model="businessData.primaryCategory"
                  :suggestions="categorySuggestions"
                  @complete="searchCategories"
                  placeholder="Wpisz, aby wyszukać..."
                  class="w-full"
                />
              </div>
            </div>

            <Divider />

            <!-- Additional Categories -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategorie dodatkowe</label>
                <p class="text-xs text-gray-400 mt-1">Dodatkowe kategorie (max 9)</p>
              </div>
              <div class="md:col-span-2">
                <div class="flex flex-wrap gap-2 mb-3">
                  <Chip
                    v-for="(cat, index) in businessData.additionalCategories"
                    :key="index"
                    :label="cat"
                    removable
                    @remove="removeCategory(index)"
                  />
                </div>
                <AutoComplete
                  v-if="businessData.additionalCategories.length < 9"
                  v-model="newCategory"
                  :suggestions="categorySuggestions"
                  @complete="searchCategories"
                  @item-select="addCategory"
                  placeholder="Dodaj kategorię..."
                  class="w-full"
                />
              </div>
            </div>

            <Divider />

            <!-- Services -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Usługi / Produkty</label>
                  <p class="text-xs text-gray-400 mt-1">Lista oferowanych usług</p>
                </div>
                <Button label="Dodaj usługę" icon="pi pi-plus" size="small" @click="showServiceDialog = true" />
              </div>
              <DataTable :value="businessData.services" size="small" stripedRows>
                <Column field="name" header="Nazwa" />
                <Column field="price" header="Cena" style="width: 150px" />
                <Column header="Akcje" style="width: 100px">
                  <template #body="{ index }">
                    <Button icon="pi pi-trash" severity="danger" text size="small" @click="removeService(index)" />
                  </template>
                </Column>
                <template #empty>
                  <div class="text-center py-4 text-gray-400">Brak usług</div>
                </template>
              </DataTable>
            </div>
          </div>
        </TabPanel>

        <!-- Hours Tab -->
        <TabPanel header="Godziny otwarcia">
          <div class="space-y-6 pt-4">
            <!-- Regular Hours -->
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 block">Standardowe godziny</label>
              <div class="space-y-3">
                <div
                  v-for="day in daysOfWeek"
                  :key="day.key"
                  class="grid grid-cols-4 gap-4 items-center p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div class="font-medium text-gray-700">{{ day.label }}</div>
                  <div class="col-span-2 flex items-center gap-2">
                    <template v-if="!getHours(day.key).closed">
                      <InputText
                        :modelValue="getHours(day.key).open"
                        @update:modelValue="setHours(day.key, 'open', $event)"
                        placeholder="08:00"
                        class="w-24 text-center"
                      />
                      <span class="text-gray-400">—</span>
                      <InputText
                        :modelValue="getHours(day.key).close"
                        @update:modelValue="setHours(day.key, 'close', $event)"
                        placeholder="20:00"
                        class="w-24 text-center"
                      />
                    </template>
                    <span v-else class="text-gray-400 italic">Zamknięte</span>
                  </div>
                  <div class="flex items-center gap-2 justify-end">
                    <Checkbox
                      :modelValue="getHours(day.key).closed"
                      @update:modelValue="setHours(day.key, 'closed', $event)"
                      :binary="true"
                    />
                    <span class="text-sm text-gray-500">Zamknięte</span>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <!-- Special Hours -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Godziny specjalne</label>
                  <p class="text-xs text-gray-400 mt-1">Święta i dni wyjątkowe</p>
                </div>
                <Button label="Dodaj dzień" icon="pi pi-plus" size="small" @click="showSpecialHoursDialog = true" />
              </div>
              <DataTable :value="businessData.specialHours" size="small">
                <Column field="date" header="Data">
                  <template #body="{ data }">
                    {{ formatSpecialDate(data.date) }}
                  </template>
                </Column>
                <Column header="Godziny">
                  <template #body="{ data }">
                    <span v-if="data.closed" class="text-gray-400 italic">Zamknięte</span>
                    <span v-else>{{ data.open }} - {{ data.close }}</span>
                  </template>
                </Column>
                <Column header="Akcje" style="width: 100px">
                  <template #body="{ index }">
                    <Button icon="pi pi-trash" severity="danger" text size="small" @click="removeSpecialHours(index)" />
                  </template>
                </Column>
                <template #empty>
                  <div class="text-center py-4 text-gray-400">Brak godzin specjalnych</div>
                </template>
              </DataTable>
            </div>
          </div>
        </TabPanel>

        <!-- Attributes Tab -->
        <TabPanel header="Atrybuty">
          <div class="space-y-6 pt-4">
            <p class="text-sm text-gray-500 mb-4">Zaznacz udogodnienia i cechy Twojej firmy</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="attr in availableAttributes"
                :key="attr.key"
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <Checkbox
                  v-model="businessData.attributes"
                  :inputId="attr.key"
                  :value="attr.key"
                />
                <label :for="attr.key" class="flex items-center gap-2 cursor-pointer flex-1">
                  <i :class="['pi', attr.icon, 'text-gray-400']" />
                  <span class="text-sm text-gray-700">{{ attr.label }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <Button label="Zapisz atrybuty" icon="pi pi-check" @click="saveAttributes" />
            </div>
          </div>
        </TabPanel>
      </TabView>

      <!-- Google Updates Alert -->
      <Card v-if="googleUpdates.length > 0" class="border-orange-200 bg-orange-50">
        <template #title>
          <div class="flex items-center gap-2 text-orange-700">
            <i class="pi pi-exclamation-triangle" />
            <span class="text-sm font-bold uppercase tracking-wider">Propozycje zmian od Google</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div
              v-for="update in googleUpdates"
              :key="update.field"
              class="flex items-center justify-between p-3 bg-white rounded-lg"
            >
              <div>
                <p class="text-sm font-medium text-gray-700">{{ update.fieldLabel }}</p>
                <p class="text-xs text-gray-500">
                  <span class="line-through">{{ update.oldValue }}</span>
                  <i class="pi pi-arrow-right mx-2 text-xs" />
                  <span class="text-orange-600 font-medium">{{ update.newValue }}</span>
                </p>
              </div>
              <div class="flex gap-2">
                <Button label="Akceptuj" severity="success" size="small" @click="acceptGoogleUpdate(update)" />
                <Button label="Odrzuć" severity="secondary" size="small" outlined @click="rejectGoogleUpdate(update)" />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- History Drawer -->
    <Drawer v-model:visible="showHistoryPanel" header="Historia zmian" position="right" class="w-full md:w-[500px]">
      <DataTable :value="changeHistory" size="small" paginator :rows="10">
        <Column field="timestamp" header="Data">
          <template #body="{ data }">
            {{ formatDateTime(data.timestamp) }}
          </template>
        </Column>
        <Column field="field" header="Pole" />
        <Column field="user" header="Użytkownik" />
        <Column header="Zmiana">
          <template #body="{ data }">
            <div class="text-xs">
              <span class="text-gray-400 line-through">{{ data.oldValue }}</span>
              <i class="pi pi-arrow-right mx-1 text-xs" />
              <span class="text-gray-700">{{ data.newValue }}</span>
            </div>
          </template>
        </Column>
      </DataTable>
    </Drawer>

    <!-- Add Service Dialog -->
    <Dialog v-model:visible="showServiceDialog" header="Dodaj usługę" modal :style="{ width: '400px' }">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nazwa usługi</label>
          <InputText v-model="newService.name" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cena</label>
          <InputText v-model="newService.price" class="w-full" placeholder="np. 100 PLN" />
        </div>
      </div>
      <template #footer>
        <Button label="Anuluj" severity="secondary" text @click="showServiceDialog = false" />
        <Button label="Dodaj" icon="pi pi-check" @click="addService" />
      </template>
    </Dialog>

    <!-- Add Special Hours Dialog -->
    <Dialog v-model:visible="showSpecialHoursDialog" header="Dodaj godziny specjalne" modal :style="{ width: '400px' }">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <DatePicker v-model="newSpecialHours.date" dateFormat="yy-mm-dd" class="w-full" />
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="newSpecialHours.closed" :binary="true" inputId="specialClosed" />
          <label for="specialClosed" class="text-sm text-gray-700">Zamknięte</label>
        </div>
        <div v-if="!newSpecialHours.closed" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Od</label>
            <InputText v-model="newSpecialHours.open" class="w-full" placeholder="08:00" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Do</label>
            <InputText v-model="newSpecialHours.close" class="w-full" placeholder="20:00" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Anuluj" severity="secondary" text @click="showSpecialHoursDialog = false" />
        <Button label="Dodaj" icon="pi pi-check" @click="addSpecialHours" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Inplace from 'primevue/inplace';
import Divider from 'primevue/divider';
import AutoComplete from 'primevue/autocomplete';
import Chip from 'primevue/chip';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import Drawer from 'primevue/drawer';
import Dialog from 'primevue/dialog';
import DatePicker from 'primevue/datepicker';

const toast = useToast();

const activeTabIndex = ref(0);
const showHistoryPanel = ref(false);
const showServiceDialog = ref(false);
const showSpecialHoursDialog = ref(false);

// Mock business data - mirrors production API structure
const businessData = reactive({
  name: 'Kawiarnia Róża',
  address: {
    street: 'ul. Kwiatowa 5',
    city: 'Warszawa',
    postalCode: '00-123',
    country: 'PL'
  },
  phone: '+48 123 456 789',
  website: 'https://kawiarnia-roza.pl',
  description: 'Przytulna kawiarnia serwująca świeżo paloną kawę. Oferujemy szeroki wybór kaw speciality, domowe ciasta oraz lekkie przekąski. Idealne miejsce na spotkania biznesowe i relaks.',
  primaryCategory: 'Kawiarnia',
  additionalCategories: ['Cafe', 'Cukiernia'],
  services: [
    { id: 's1', name: 'Espresso', price: '10 PLN' },
    { id: 's2', name: 'Cappuccino', price: '14 PLN' },
    { id: 's3', name: 'Latte', price: '15 PLN' }
  ],
  hours: {
    MONDAY: { open: '08:00', close: '20:00', closed: false },
    TUESDAY: { open: '08:00', close: '20:00', closed: false },
    WEDNESDAY: { open: '08:00', close: '20:00', closed: false },
    THURSDAY: { open: '08:00', close: '20:00', closed: false },
    FRIDAY: { open: '08:00', close: '22:00', closed: false },
    SATURDAY: { open: '09:00', close: '22:00', closed: false },
    SUNDAY: { open: '10:00', close: '18:00', closed: false }
  },
  specialHours: [
    { date: '2025-12-25', closed: true },
    { date: '2025-12-31', open: '10:00', close: '16:00', closed: false }
  ],
  attributes: ['wifi', 'parking', 'wheelchair'],
  logoUrl: null,
  coverUrl: null
});

// Google suggested updates mock
const googleUpdates = ref([
  {
    field: 'phone',
    fieldLabel: 'Telefon',
    oldValue: '+48 123 456 789',
    newValue: '+48 987 654 321'
  }
]);

// Change history mock
const changeHistory = ref([
  {
    timestamp: '2025-11-25T14:30:00Z',
    field: 'Opis',
    user: 'admin@kawiarnia.pl',
    oldValue: 'Stary opis...',
    newValue: 'Nowy opis...'
  },
  {
    timestamp: '2025-11-20T10:15:00Z',
    field: 'Telefon',
    user: 'admin@kawiarnia.pl',
    oldValue: '+48 111 222 333',
    newValue: '+48 123 456 789'
  }
]);

// Days of week
const daysOfWeek = [
  { key: 'MONDAY', label: 'Poniedziałek' },
  { key: 'TUESDAY', label: 'Wtorek' },
  { key: 'WEDNESDAY', label: 'Środa' },
  { key: 'THURSDAY', label: 'Czwartek' },
  { key: 'FRIDAY', label: 'Piątek' },
  { key: 'SATURDAY', label: 'Sobota' },
  { key: 'SUNDAY', label: 'Niedziela' }
];

// Available attributes
const availableAttributes = [
  { key: 'wifi', label: 'Wi-Fi', icon: 'pi-wifi' },
  { key: 'parking', label: 'Parking', icon: 'pi-car' },
  { key: 'wheelchair', label: 'Dostępność dla wózków', icon: 'pi-users' },
  { key: 'delivery', label: 'Dostawa', icon: 'pi-truck' },
  { key: 'takeout', label: 'Na wynos', icon: 'pi-shopping-bag' },
  { key: 'outdoor_seating', label: 'Ogródek', icon: 'pi-sun' },
  { key: 'reservations', label: 'Rezerwacje', icon: 'pi-calendar' },
  { key: 'credit_cards', label: 'Płatność kartą', icon: 'pi-credit-card' },
  { key: 'pets_allowed', label: 'Zwierzęta dozwolone', icon: 'pi-heart' }
];

// Category suggestions
const categorySuggestions = ref([]);
const newCategory = ref('');

const categoryOptions = [
  'Kawiarnia', 'Restauracja', 'Bar', 'Cukiernia', 'Piekarnia',
  'Cafe', 'Bistro', 'Pub', 'Pizzeria', 'Fast food'
];

// New service form
const newService = reactive({ name: '', price: '' });

// New special hours form
const newSpecialHours = reactive({ date: null, open: '', close: '', closed: false });

// Methods
function formatAddress(address) {
  if (!address) return '';
  return `${address.street}, ${address.postalCode} ${address.city}`;
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatSpecialDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function getHours(day) {
  return businessData.hours[day] || { open: '', close: '', closed: false };
}

function setHours(day, field, value) {
  if (!businessData.hours[day]) {
    businessData.hours[day] = { open: '', close: '', closed: false };
  }
  businessData.hours[day][field] = value;
}

function searchCategories(event) {
  const query = event.query.toLowerCase();
  categorySuggestions.value = categoryOptions.filter(cat =>
    cat.toLowerCase().includes(query)
  );
}

function addCategory(event) {
  if (event.value && !businessData.additionalCategories.includes(event.value)) {
    businessData.additionalCategories.push(event.value);
  }
  newCategory.value = '';
}

function removeCategory(index) {
  businessData.additionalCategories.splice(index, 1);
}

function addService() {
  if (newService.name) {
    businessData.services.push({
      id: `s${Date.now()}`,
      name: newService.name,
      price: newService.price
    });
    newService.name = '';
    newService.price = '';
    showServiceDialog.value = false;
    toast.add({ severity: 'success', summary: 'Sukces', detail: 'Dodano usługę', life: 3000 });
  }
}

function removeService(index) {
  businessData.services.splice(index, 1);
  toast.add({ severity: 'info', summary: 'Usunięto', detail: 'Usunięto usługę', life: 3000 });
}

function addSpecialHours() {
  if (newSpecialHours.date) {
    const dateStr = newSpecialHours.date instanceof Date
      ? newSpecialHours.date.toISOString().split('T')[0]
      : newSpecialHours.date;

    businessData.specialHours.push({
      date: dateStr,
      open: newSpecialHours.open,
      close: newSpecialHours.close,
      closed: newSpecialHours.closed
    });

    newSpecialHours.date = null;
    newSpecialHours.open = '';
    newSpecialHours.close = '';
    newSpecialHours.closed = false;
    showSpecialHoursDialog.value = false;
    toast.add({ severity: 'success', summary: 'Sukces', detail: 'Dodano godziny specjalne', life: 3000 });
  }
}

function removeSpecialHours(index) {
  businessData.specialHours.splice(index, 1);
}

function saveField(field) {
  toast.add({ severity: 'success', summary: 'Zapisano', detail: `Zaktualizowano pole: ${field}`, life: 3000 });
}

function saveAttributes() {
  toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Atrybuty zostały zapisane', life: 3000 });
}

function acceptGoogleUpdate(update) {
  businessData[update.field] = update.newValue;
  googleUpdates.value = googleUpdates.value.filter(u => u.field !== update.field);
  toast.add({ severity: 'success', summary: 'Zaakceptowano', detail: `Zmiana pola "${update.fieldLabel}" została zaakceptowana`, life: 3000 });
}

function rejectGoogleUpdate(update) {
  googleUpdates.value = googleUpdates.value.filter(u => u.field !== update.field);
  toast.add({ severity: 'info', summary: 'Odrzucono', detail: `Zmiana pola "${update.fieldLabel}" została odrzucona`, life: 3000 });
}
</script>
