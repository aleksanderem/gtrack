<template>
    <div class="card h-full flex flex-col w-full max-w-full">
        <div class="flex gap-6 relative">
            <!-- Left Menu - Fixed -->
            <div class="w-64 flex-shrink-0">
                <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
                    <Menu :model="menuItems" class="w-full">
                    <template #item="{ item, props }">
                        <a v-ripple class="flex items-center cursor-pointer" v-bind="props.action">
                            <span :class="[item.icon, 'mr-2']" />
                            <span>{{ item.label }}</span>
                        </a>
                    </template>
                    </Menu>
                </div>
            </div>

            <!-- Right Content -->
            <div class="flex-1 flex flex-col gap-6">

            <!-- Main Settings -->
            <Card id="main-settings" class="w-full scroll-mt-4">
                <template #title>
                    <div class="flex flex-col gap-1">
                        <span class="text-lg font-bold text-surface-900">Główne Ustawienia</span>
                        <span class="text-sm text-surface-600 mb-4 font-normal">Skonfiguruj podstawowe opcje automatycznego odpowiadania na opinie</span>
                    </div>
                </template>
                <template #content>
                    <div class="flex flex-col gap-6">
                        <!-- Enable Toggle -->
                        <div class="flex items-start gap-3">
                            <Checkbox 
                                v-model="settings.enabled" 
                                :binary="true"
                                inputId="enable-auto-reply"
                                class="mt-1"
                            />
                            <div class="flex-1 flex flex-col gap-1">
                                <label for="enable-auto-reply" class="font-semibold text-sm text-surface-900 cursor-pointer">Włącz auto-odpowiedzi</label>
                                <span class="text-sm text-surface-600 font-normal">System automatycznie odpowiada na opinie zgodnie z poniższymi regułami</span>
                            </div>
                        </div>

                        <!-- Require Approval -->
                        <div class="flex items-start gap-3">
                            <Checkbox 
                                v-model="settings.require_approval" 
                                :binary="true"
                                inputId="require-approval"
                                class="mt-1"
                            />
                            <div class="flex-1 flex flex-col gap-1">
                                <label for="require-approval" class="font-semibold text-sm text-surface-900 cursor-pointer">Wymagaj zatwierdzenia przed wysłaniem</label>
                                <span class="text-sm text-surface-600 font-normal">Każda odpowiedź będzie wymagała Twojego zatwierdzenia przed wysłaniem</span>
                                
                                <!-- Approval Timeout -->
                                <div v-if="settings.require_approval" class="flex flex-col gap-2 mt-3">
                                    <label class="text-sm font-semibold text-surface-700">Auto-zatwierdzenie po (godzinach)</label>
                                    <InputNumber 
                                        v-model="settings.approval_timeout_hours" 
                                        :min="1" 
                                        :max="168" 
                                        showButtons
                                        class="w-full max-w-xs"
                                    />
                                    <span class="text-sm text-surface-600 font-normal">Po ilu godzinach odpowiedź zostanie automatycznie zatwierdzona jeśli brak akcji</span>
                                </div>
                            </div>
                        </div>

                        <!-- Email Notifications -->
                        <div class="flex items-start gap-3">
                            <Checkbox 
                                v-model="settings.email_notifications" 
                                :binary="true"
                                inputId="email-notifications"
                                class="mt-1"
                            />
                            <div class="flex-1 flex flex-col gap-1">
                                <label for="email-notifications" class="font-semibold text-sm text-surface-900 cursor-pointer">Powiadomienia email o nowych odpowiedziach</label>
                                <span class="text-sm text-surface-600 font-normal">Otrzymasz email gdy system wygeneruje odpowiedź</span>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Rules Section -->
            <Card id="rules" class="w-full scroll-mt-4">
                <template #title>
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-list-check text-primary"></i>
                            <span class="text-lg font-bold text-surface-900">Reguły Odpowiadania</span>
                        </div>
                        <Button 
                            label="Dodaj regułę" 
                            icon="pi pi-plus" 
                            size="small" 
                            @click="openRuleDialog(null)"
                        />
                    </div>
                </template>
                <template #content>
                    <div v-if="!settings.enabled && rules.length > 0" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div class="flex items-center gap-2 text-amber-700">
                            <i class="pi pi-info-circle"></i>
                            <span class="text-sm font-semibold">Auto-odpowiedzi są wyłączone</span>
                        </div>
                        <p class="text-sm text-amber-600 mt-1">Reguły nie będą działać dopóki nie włączysz auto-odpowiedzi w ustawieniach powyżej.</p>
                    </div>
                    <div v-if="rules.length === 0" class="text-center py-8 text-surface-500">
                        <i class="pi pi-info-circle text-4xl mb-3"></i>
                        <p>Brak reguł. Dodaj pierwszą regułę, aby rozpocząć automatyczne odpowiadanie.</p>
                    </div>
                    <div v-else class="flex flex-col gap-3">
                        <div 
                            v-for="rule in rules" 
                            :key="rule.id"
                            class="p-4 border border-surface-200 rounded-lg hover:border-primary transition-colors"
                            :class="{ 'bg-surface-50': !rule.enabled }"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 flex flex-col gap-2">
                                    <div class="flex items-center gap-2">
                                        <ToggleSwitch v-model="rule.enabled" @update:modelValue="() => saveRule(rule)" size="small" />
                                        <span class="font-semibold text-sm">{{ rule.name }}</span>
                                        <Tag v-if="!rule.enabled" value="Wyłączona" severity="secondary" class="text-sm" />
                                    </div>
                                    <div class="text-sm text-surface-600 font-normal ml-8">
                                        <div>Jeśli: 
                                            <span v-if="rule.conditions.rating">
                                                {{ getRatingConditionText(rule.conditions.rating) }}
                                            </span>
                                            <span v-if="rule.conditions.source && rule.conditions.source.length > 0">
                                                , Źródło: {{ rule.conditions.source.join(', ') }}
                                            </span>
                                        </div>
                                        <div>Wtedy: {{ getScheduleText(rule.schedule) }}</div>
                                        <div>Szablon: {{ getTemplateStrategyText(rule.template_selection?.strategy) }}</div>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <Button 
                                        icon="pi pi-pencil" 
                                        text 
                                        rounded 
                                        size="small"
                                        @click="openRuleDialog(rule)"
                                        v-tooltip.top="'Edytuj regułę'"
                                    />
                                    <Button 
                                        icon="pi pi-trash" 
                                        text 
                                        rounded 
                                        severity="danger"
                                        size="small"
                                        @click="confirmDeleteRule(rule)"
                                        v-tooltip.top="'Usuń regułę'"
                                    />
                                </div>
                            </div>
                            <div v-if="getExampleTemplateForRule(rule)" class="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                                <div class="text-sm font-semibold text-blue-700 mb-1">Przykładowa treść:</div>
                                <div class="text-sm text-surface-700" style="max-height: 3rem; overflow: hidden;">
                                    <TinyEditor 
                                        :modelValue="getExampleTemplateForRule(rule)?.content || ''"
                                        :mentions="mentionsMap"
                                        :editable="false"
                                        class="w-full example-template-editor"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Safety Settings -->
            <Card id="safety" class="w-full scroll-mt-4">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-shield text-primary"></i>
                        <span class="text-lg font-bold text-surface-900">Zabezpieczenia</span>
                    </div>
                </template>
                <template #content>
                    <div class="flex flex-col gap-4">
                        <!-- Daily Limit -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700">Maksymalna liczba auto-odpowiedzi dziennie</label>
                            <InputNumber 
                                v-model="settings.daily_limit" 
                                :min="1" 
                                :max="1000" 
                                showButtons
                                @update:modelValue="saveSettings"
                                class="w-full"
                            />
                        </div>

                        <!-- Cooldown -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700">Nie odpowiadaj jeśli klient już otrzymał odpowiedź w ciągu ostatnich (dni)</label>
                            <InputNumber 
                                v-model="settings.cooldown_days" 
                                :min="0" 
                                :max="30" 
                                showButtons
                                @update:modelValue="saveSettings"
                                class="w-full"
                            />
                        </div>

                        <!-- Max Age -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700">Nie odpowiadaj na opinie starsze niż (dni)</label>
                            <InputNumber 
                                v-model="settings.max_age_days" 
                                :min="1" 
                                :max="365" 
                                showButtons
                                @update:modelValue="saveSettings"
                                class="w-full"
                            />
                        </div>

                        <!-- Require Approval For Ratings -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700">Zawsze wymagaj zatwierdzenia dla ocen</label>
                            <MultiSelect 
                                v-model="settings.require_approval_for_ratings" 
                                :options="ratingOptions"
                                optionLabel="label"
                                optionValue="value"
                                display="chip"
                                @update:modelValue="saveSettings"
                                class="w-full"
                            />
                        </div>

                        <!-- Require Approval Keywords -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700">Zawsze wymagaj zatwierdzenia jeśli opinia zawiera słowa</label>
                            <Chips 
                                v-model="settings.require_approval_keywords" 
                                @update:modelValue="saveSettings"
                                placeholder="Dodaj słowo kluczowe..."
                                class="w-full"
                            />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Available Templates Preview -->
            <Card id="templates" class="w-full scroll-mt-4">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-file-edit text-primary"></i>
                        <span class="text-lg font-bold text-surface-900">Dostępne Szablony</span>
                    </div>
                </template>
                <template #content>
                    <div class="flex flex-col gap-3">
                        <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <Rating 
                                  :modelValue="rating" 
                                  :readonly="true" 
                                  :cancel="false" 
                                  class="text-sm" 
                                  :pt="{ 
                                    onIcon: 'text-yellow-500', 
                                    offIcon: 'text-gray-300' 
                                  }" 
                                />
                                <div class="flex flex-col gap-1">
                                    <span class="text-sm font-semibold">
                                        {{ getAllTemplatesForRating(rating).length }} szablon{{ getAllTemplatesForRating(rating).length === 1 ? '' : getAllTemplatesForRating(rating).length < 5 ? 'y' : 'ów' }} aktywn{{ getAllTemplatesForRating(rating).length === 1 ? 'y' : 'e' }}
                                    </span>
                                    <span class="text-sm text-surface-500">
                                        {{ getTemplatesForRating(rating).length }} dostępn{{ getTemplatesForRating(rating).length === 1 ? 'y' : 'e' }} dla auto-odpowiedzi
                                    </span>
                                </div>
                            </div>
                            <Tag 
                                v-if="getAllTemplatesForRating(rating).length === 0" 
                                value="Brak szablonów" 
                                severity="warn" 
                                class="text-sm"
                            />
                            <Tag 
                                v-else-if="getTemplatesForRating(rating).length === 0" 
                                value="Włącz auto-odpowiedź" 
                                severity="info" 
                                class="text-sm"
                            />
                            <Button 
                                v-else
                                label="Zarządzaj" 
                                text 
                                size="small"
                                @click="navigateToTemplates"
                            />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Rule Dialog -->
            <Dialog 
                v-model:visible="ruleDialogVisible" 
                :header="editingRule ? 'Edytuj regułę' : 'Nowa reguła'"
                :style="{ width: '90vw', maxWidth: '600px' }"
                :modal="true"
            >
                <div v-if="editingRule || newRule" class="flex flex-col gap-4">
                    <!-- Rule Name -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-surface-700">Nazwa reguły *</label>
                        <InputText 
                            v-model="(editingRule || newRule).name" 
                            placeholder="np. Pozytywne opinie Google"
                            class="w-full"
                        />
                    </div>

                    <!-- Rating Condition -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-surface-700">Ocena</label>
                        <Select 
                            v-model="ratingConditionOperator" 
                            :options="ratingOperatorOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Wybierz operator"
                            class="w-full mb-2"
                        />
                        <div v-if="ratingConditionOperator === 'between'" class="flex gap-2">
                            <InputNumber v-model="ratingConditionMin" :min="1" :max="5" placeholder="Min" class="flex-1" />
                            <InputNumber v-model="ratingConditionMax" :min="1" :max="5" placeholder="Max" class="flex-1" />
                        </div>
                        <InputNumber 
                            v-else-if="ratingConditionOperator && ratingConditionOperator !== 'between'"
                            v-model="ratingConditionValue" 
                            :min="1" 
                            :max="5" 
                            placeholder="Wartość"
                            class="w-full"
                        />
                    </div>

                    <!-- Source -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-surface-700">Źródło</label>
                        <MultiSelect 
                            v-model="(editingRule || newRule).conditions.source" 
                            :options="sourceOptions"
                            optionLabel="label"
                            optionValue="value"
                            display="chip"
                            placeholder="Wybierz źródła"
                            class="w-full"
                        />
                    </div>

                    <!-- Schedule -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-surface-700">Harmonogram</label>
                        <Select 
                            v-model="scheduleType" 
                            :options="scheduleTypeOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="w-full mb-2"
                        />
                        <InputNumber 
                            v-if="scheduleType === 'delayed'"
                            v-model="(editingRule || newRule).schedule.delay_minutes" 
                            :min="1" 
                            :max="1440"
                            placeholder="Opóźnienie (minuty)"
                            class="w-full"
                        />
                    </div>

                    <!-- Template Selection Strategy -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-surface-700">Strategia wyboru szablonu</label>
                        <Select 
                            v-model="(editingRule || newRule).template_selection.strategy" 
                            :options="templateStrategyOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="w-full"
                        />
                    </div>
                </div>

                <template #footer>
                    <Button label="Anuluj" text @click="ruleDialogVisible = false" />
                    <Button label="Zapisz" @click="saveRuleFromDialog" />
                </template>
            </Dialog>

            <!-- Fixed History Button -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Card from 'primevue/card';
import ToggleSwitch from 'primevue/toggleswitch';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import Chips from 'primevue/chips';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Rating from 'primevue/rating';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Menu from 'primevue/menu';
import TinyEditor from '@juit/vue-tiny-editor';
import '@juit/vue-tiny-editor/style.css';
import { ReviewsService } from '../../../services/ReviewsService';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const settings = ref({
  enabled: false,
  require_approval: true,
  email_notifications: false,
  approval_timeout_hours: 24,
  daily_limit: 50,
  cooldown_days: 7,
  max_age_days: 30,
  response_rate_threshold: 95,
  require_approval_for_ratings: [1, 2],
  require_approval_keywords: []
});

const rules = ref([]);
const templates = ref([]);
const loading = ref(true);

const menuItems = ref([
    {
        label: 'Główne Ustawienia',
        icon: 'pi pi-cog',
        command: () => {
            const element = document.getElementById('main-settings');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    window.scrollBy(0, -52); // Offset for top navigation bar
                }, 100);
            }
        }
    },
    {
        label: 'Reguły Odpowiadania',
        icon: 'pi pi-sliders-h',
        command: () => {
            const element = document.getElementById('rules');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    window.scrollBy(0, -52); // Offset for top navigation bar
                }, 100);
            }
        }
    },
    {
        label: 'Zabezpieczenia',
        icon: 'pi pi-shield',
        command: () => {
            const element = document.getElementById('safety');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    window.scrollBy(0, -52); // Offset for top navigation bar
                }, 100);
            }
        }
    },
    {
        label: 'Dostępne Szablony',
        icon: 'pi pi-file-edit',
        command: () => {
            const element = document.getElementById('templates');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    window.scrollBy(0, -52); // Offset for top navigation bar
                }, 100);
            }
        }
    },
    {
        label: 'Historia Auto-Odpowiedzi',
        icon: 'pi pi-history',
        command: () => {
            navigateToHistory();
        }
    }
]);

// Available variables for mentions
const availableVariables = ref([
    { key: 'imie', description: 'Imię klienta' },
    { key: 'nazwisko', description: 'Nazwisko klienta' },
    { key: 'pelne_imie', description: 'Pełne imię (imię + nazwisko)' },
    { key: 'email', description: 'Email klienta' },
    { key: 'telefon', description: 'Numer telefonu' },
    { key: 'ocena', description: 'Ocena (liczba)' },
    { key: 'data', description: 'Data opinii' },
    { key: 'usluga', description: 'Nazwa usługi' },
    { key: 'pracownik', description: 'Imię pracownika' },
    { key: 'zamowienie', description: 'Numer zamówienia' }
]);

const mentionsMap = computed(() => {
    const map = {};
    availableVariables.value.forEach(variable => {
        map[variable.key] = variable.description;
    });
    return map;
});

const ruleDialogVisible = ref(false);
const editingRule = ref(null);
const newRule = ref(null);
const ratingConditionOperator = ref(null);
const ratingConditionValue = ref(null);
const ratingConditionMin = ref(null);
const ratingConditionMax = ref(null);
const scheduleType = ref('immediate');

const ratingOptions = [
  { label: '1 gwiazdka', value: 1 },
  { label: '2 gwiazdki', value: 2 },
  { label: '3 gwiazdki', value: 3 },
  { label: '4 gwiazdki', value: 4 },
  { label: '5 gwiazdek', value: 5 }
];

const ratingOperatorOptions = [
  { label: 'Równa się', value: 'eq' },
  { label: 'Większa lub równa', value: 'gte' },
  { label: 'Mniejsza lub równa', value: 'lte' },
  { label: 'Pomiędzy', value: 'between' }
];

const sourceOptions = [
  { label: 'Google', value: 'google' },
  { label: 'Booksy', value: 'booksy' },
  { label: 'Facebook', value: 'facebook' }
];

const scheduleTypeOptions = [
  { label: 'Od razu po otrzymaniu', value: 'immediate' },
  { label: 'Z opóźnieniem', value: 'delayed' },
  { label: 'Tylko w godzinach pracy', value: 'scheduled' }
];

const templateStrategyOptions = [
  { label: 'Dopasuj do oceny', value: 'rating_match' },
  { label: 'Losowy z dostępnych', value: 'random' },
  { label: 'AI wybiera najlepszy', value: 'ai_best_match' }
];

const getAllTemplatesForRating = (rating) => {
  return templates.value.filter(t => 
    t.rating === rating && 
    t.active === true
  );
};

const getTemplatesForRating = (rating) => {
  return templates.value.filter(t => 
    t.rating === rating && 
    t.auto_reply === true && 
    t.active === true
  );
};

const getRatingConditionText = (condition) => {
  if (!condition) return '';
  const { operator, value } = condition;
  if (operator === 'gte') return `${value}+ gwiazdki`;
  if (operator === 'lte') return `${value}- gwiazdki`;
  if (operator === 'eq') return `${value} gwiazdek`;
  if (operator === 'between') return `${value.min}-${value.max} gwiazdek`;
  return '';
};

const getScheduleText = (schedule) => {
  if (!schedule) return '';
  if (schedule.type === 'immediate') return 'Wyślij natychmiast';
  if (schedule.type === 'delayed') return `Wyślij po ${schedule.delay_minutes} minutach`;
  if (schedule.type === 'scheduled') return 'Wyślij w godzinach pracy';
  return '';
};

const getTemplateStrategyText = (strategy) => {
  const option = templateStrategyOptions.find(o => o.value === strategy);
  return option ? option.label : strategy;
};

const getExampleTemplateForRule = (rule) => {
  if (!rule.conditions.rating) return null;
  
  // Get rating value for example
  let exampleRating = 5;
  if (rule.conditions.rating.operator === 'eq') {
    exampleRating = rule.conditions.rating.value;
  } else if (rule.conditions.rating.operator === 'gte') {
    exampleRating = rule.conditions.rating.value;
  } else if (rule.conditions.rating.operator === 'between') {
    exampleRating = rule.conditions.rating.value.min || rule.conditions.rating.value.max || 5;
  }
  
  // Find first matching template
  const matchingTemplates = templates.value.filter(t => 
    t.rating === exampleRating && 
    t.auto_reply === true && 
    t.active === true
  );
  
  if (matchingTemplates.length === 0) {
    // Fallback: find any active template for this rating
    const fallbackTemplates = templates.value.filter(t => 
      t.rating === exampleRating && 
      t.active === true
    );
    return fallbackTemplates.length > 0 ? fallbackTemplates[0] : null;
  }
  
  return matchingTemplates[0];
};

const loadSettings = async () => {
  try {
    settings.value = await ReviewsService.getAutoReplySettings();
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się załadować ustawień', life: 3000 });
  }
};

const saveSettings = async () => {
  try {
    await ReviewsService.saveAutoReplySettings(settings.value);
    toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Ustawienia zostały zapisane', life: 2000 });
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać ustawień', life: 3000 });
  }
};

const loadRules = async () => {
  try {
    rules.value = await ReviewsService.getAutoReplyRules();
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się załadować reguł', life: 3000 });
  }
};

const loadTemplates = async () => {
  try {
    templates.value = await ReviewsService.getTemplates();
  } catch (e) {
    console.error(e);
  }
};

const saveRule = async (rule) => {
  try {
    await ReviewsService.saveAutoReplyRule(rule);
    await loadRules();
    toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Reguła została zapisana', life: 2000 });
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać reguły', life: 3000 });
  }
};

const openRuleDialog = (rule) => {
  if (rule) {
    editingRule.value = { ...rule };
    newRule.value = null;
    
    // Parse rating condition
    if (rule.conditions.rating) {
      const cond = rule.conditions.rating;
      ratingConditionOperator.value = cond.operator;
      if (cond.operator === 'between') {
        ratingConditionMin.value = cond.value.min;
        ratingConditionMax.value = cond.value.max;
      } else {
        ratingConditionValue.value = cond.value;
      }
    } else {
      ratingConditionOperator.value = null;
      ratingConditionValue.value = null;
    }
    
    scheduleType.value = rule.schedule?.type || 'immediate';
  } else {
    newRule.value = {
      name: '',
      enabled: true,
      conditions: {
        rating: null,
        source: [],
        status: ['new', 'read']
      },
      schedule: {
        type: 'immediate',
        delay_minutes: 0,
        time_window: null,
        weekdays_only: false
      },
      template_selection: {
        strategy: 'rating_match',
        fallback_template_id: null
      }
    };
    editingRule.value = null;
    ratingConditionOperator.value = null;
    ratingConditionValue.value = null;
    scheduleType.value = 'immediate';
  }
  ruleDialogVisible.value = true;
};

const saveRuleFromDialog = async () => {
  const rule = editingRule.value || newRule.value;
  
  if (!rule.name || !rule.name.trim()) {
    toast.add({ severity: 'warn', summary: 'Uwaga', detail: 'Nazwa reguły jest wymagana', life: 3000 });
    return;
  }
  
  // Build rating condition
  if (ratingConditionOperator.value) {
    if (ratingConditionOperator.value === 'between') {
      rule.conditions.rating = {
        operator: 'between',
        value: {
          min: ratingConditionMin.value,
          max: ratingConditionMax.value
        }
      };
    } else {
      rule.conditions.rating = {
        operator: ratingConditionOperator.value,
        value: ratingConditionValue.value
      };
    }
  } else {
    rule.conditions.rating = null;
  }
  
  // Update schedule
  rule.schedule.type = scheduleType.value;
  
  try {
    await saveRule(rule);
    ruleDialogVisible.value = false;
    editingRule.value = null;
    newRule.value = null;
  } catch (e) {
    // Error already handled in saveRule
  }
};

const confirmDeleteRule = (rule) => {
  confirm.require({
    message: `Czy na pewno chcesz usunąć regułę "${rule.name}"?`,
    header: 'Potwierdzenie usunięcia',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Anuluj',
    acceptLabel: 'Usuń',
    accept: async () => {
      try {
        await ReviewsService.deleteAutoReplyRule(rule.id);
        await loadRules();
        toast.add({ severity: 'success', summary: 'Usunięto', detail: 'Reguła została usunięta', life: 2000 });
      } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć reguły', life: 3000 });
      }
    }
  });
};

const navigateToTemplates = () => {
  router.push({ name: 'reviews-templates', params: router.currentRoute.value.params });
};

const navigateToHistory = () => {
  const locationId = router.currentRoute.value.params.locationId;
  router.push({ name: 'reviews-auto-reply-history', params: { locationId } });
};


onMounted(async () => {
  loading.value = true;
  await Promise.all([
    loadSettings(),
    loadRules(),
    loadTemplates()
  ]);
  loading.value = false;
});
</script>

<style scoped>
:deep(.p-card-body) {
  padding: 1.5rem;
}

:deep(.example-template-editor .-jte-editor) {
  border: none !important;
  padding: 0 !important;
}

:deep(.example-template-editor .-jte-toolbox) {
  display: none !important;
}

:deep(.p-menu-item-link) {
  padding: 0.875rem 1rem !important;
  font-size: 0.875rem !important;
}

:deep(.p-menu-list) {
  font-size: 0.875rem !important;
}

:deep(.p-menu-group-label) {
  background-color: var(--p-surface-50) !important;
  font-weight: 600 !important;
  padding: 0.5rem 1rem !important;
}
</style>

