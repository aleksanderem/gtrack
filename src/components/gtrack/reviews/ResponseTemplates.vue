<template>
    <Card class="h-full flex flex-col w-full max-w-full border border-gray-200 rounded-lg overflow-hidden">
        <template #content>
            <DataTable v-model:filters="filters" v-model:selection="selectedTemplates" :value="templates" paginator :rows="10" dataKey="id" filterDisplay="menu" :loading="loading" size="normal" class="text-sm flex-1 w-full"
            :globalFilterFields="['name', 'content', 'rating']"
            rowHover
            @row-click="onRowClick"
            :pt="{
                headerRow: { class: 'font-normal' },
                column: { headerCell: { class: 'font-normal text-surface-600 bg-surface-50' } },
                bodyRow: { class: '!py-4 cursor-pointer' }
            }">
            <template #header>
                <div class="flex flex-col gap-3">
                    <div class="flex justify-between items-center p-2">
                        <div class="flex gap-2">
                            <Button type="button" icon="pi pi-filter-slash" label="Wyczyść" outlined @click="clearFilter()" size="small" />
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search text-sm" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Szukaj..." size="small" />
                            </IconField>
                        </div>
                        <div class="flex items-center gap-3">
                            <Button label="Nowy szablon" icon="pi pi-plus" size="small" @click="createNewTemplate" />
                        </div>
                    </div>
                    <div v-if="selectedTemplates && selectedTemplates.length > 0" class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span class="text-sm font-semibold text-blue-700">{{ selectedTemplates.length }} szablon{{ selectedTemplates.length === 1 ? '' : selectedTemplates.length < 5 ? 'y' : 'ów' }} zaznaczon{{ selectedTemplates.length === 1 ? 'y' : 'e' }}</span>
                        <div class="flex gap-2 ml-auto">
                            <Button label="Zmiana aktywności" icon="pi pi-power-off" size="small" outlined @click="showBulkActiveDialog" />
                            <Button label="Zmiana auto-odpowiedzi" icon="pi pi-sparkles" size="small" outlined @click="showBulkAutoReplyDialog" />
                            <Button label="Zmiana oceny" icon="pi pi-star" size="small" outlined @click="showBulkRatingDialog" />
                            <Button label="Usuń" icon="pi pi-trash" size="small" severity="danger" outlined @click="confirmBulkDelete" />
    </div>
    </div>
    </div>
            </template>
            <template #empty> Nie znaleziono szablonów. </template>
            <template #loading> Ładowanie danych... </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem" :pt="{ headerContent: { class: 'font-normal' } }"></Column>

            <Column field="active" header="Aktywny" style="width: 8rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <i 
                            v-if="isActiveToggleLocked(data)" 
                            class="pi pi-lock text-gray-400 text-sm"
                            v-tooltip.top="getActiveToggleLockReason(data)"
                        ></i>
                        <ToggleSwitch 
                            :modelValue="isActiveToggleLocked(data) ? false : data.active" 
                            @update:modelValue="(val) => saveTemplateToggle(data, 'active', val)"
                            :disabled="isTemplateDisabled(data) || isActiveToggleLocked(data)"
                            v-tooltip.top="isActiveToggleLocked(data) ? getActiveToggleLockReason(data) : ''"
                        />
                    </div>
                </template>
            </Column>

            <Column field="name" header="Nazwa" sortable style="min-width: 14rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <span class="font-semibold text-sm" :class="{ 'opacity-50': isTemplateDisabled(data) }">{{ data.name }}</span>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Szukaj po nazwie" class="p-column-filter text-sm" size="small" />
        </template>
      </Column>

            <Column field="content" header="Treść" style="min-width: 20rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <div class="text-sm m-0 text-surface-600 leading-relaxed" style="max-height: 4.5rem; overflow: hidden;" :class="{ 'opacity-50': isTemplateDisabled(data) }">
                        <TinyEditor 
                            :modelValue="data.content || ''"
                            :mentions="mentionsMap"
                            :editable="false"
                            class="w-full"
                        />
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" class="p-column-filter text-sm" placeholder="Szukaj" size="small" />
        </template>
      </Column>

            <Column field="auto_reply" header="" style="width: 12rem" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #header>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-sparkles text-purple-500 text-sm"></i>
                        <span>Auto-odpowiedź</span>
                        <i class="pi pi-info-circle text-surface-400 text-xs cursor-help" v-tooltip.top="'Szablony dostępne w auto-odpowiedziach mogą być automatycznie używane przez system do odpowiadania na opinie klientów bez ręcznej interwencji.'"></i>
                    </div>
                </template>
                <template #body="{ data }">
                    <div class="flex items-center gap-2" :class="{ 'opacity-50': isTemplateDisabled(data) || !isAutoReplyAvailable }">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :class="isAutoReplyAvailable ? 'text-purple-500' : 'text-gray-400'">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.56 10.7834C10.56 10.7834 10.56 10.7834 10.56 10.7834C10.5559 10.7859 10.5327 10.8006 10.4779 10.8494C10.4045 10.915 10.312 11.0071 10.1596 11.1596C10.0071 11.312 9.91503 11.4045 9.84945 11.4779C9.80059 11.5327 9.78586 11.5559 9.78342 11.56C9.78342 11.56 9.78342 11.56 9.78342 11.56C9.73886 11.6504 9.73886 11.7564 9.78342 11.8467C9.78342 11.8467 9.78342 11.8467 9.78342 11.8467C9.78585 11.8509 9.80058 11.8741 9.84945 11.9288C9.91503 12.0023 10.0071 12.0948 10.1596 12.2472L11.7775 13.8652L12.8652 12.7775L11.2472 11.1596C11.0948 11.0071 11.0023 10.915 10.9288 10.8494C10.8741 10.8006 10.8509 10.7859 10.8467 10.7834C10.7564 10.7389 10.6504 10.7389 10.56 10.7834ZM13.9258 13.8382L12.8382 14.9258L18.7528 20.8404C18.9052 20.9929 18.9977 21.085 19.0712 21.1506C19.1259 21.1994 19.1491 21.2142 19.1533 21.2166C19.2436 21.2611 19.3496 21.2611 19.44 21.2166C19.4441 21.2142 19.4673 21.1994 19.5221 21.1506C19.5955 21.085 19.688 20.9929 19.8404 20.8404C19.9929 20.688 20.085 20.5955 20.1505 20.5221C20.1994 20.4674 20.2141 20.4441 20.2166 20.44C20.2611 20.3496 20.2611 20.2436 20.2166 20.1533C20.2141 20.1491 20.1994 20.1259 20.1505 20.0712C20.085 19.9977 19.9929 19.9052 19.8404 19.7528L13.9258 13.8382ZM9.89343 9.43968C10.4038 9.18677 11.003 9.18677 11.5133 9.43968C11.786 9.57479 12.0183 9.80812 12.2486 10.0395C12.2684 10.0593 12.2881 10.0791 12.3079 10.0989L20.9011 18.6921C20.9209 18.7119 20.9407 18.7316 20.9605 18.7514C21.1919 18.9817 21.4252 19.214 21.5603 19.4867C21.8132 19.997 21.8132 20.5962 21.5603 21.1066C21.4252 21.3792 21.1919 21.6115 20.9605 21.8419C20.9407 21.8616 20.9209 21.8814 20.9011 21.9011C20.8813 21.9209 20.8616 21.9407 20.8418 21.9605C20.6115 22.1919 20.3792 22.4252 20.1066 22.5603C19.5962 22.8132 18.997 22.8132 18.4867 22.5603C18.214 22.4252 17.9817 22.1919 17.7514 21.9605C17.7316 21.9407 17.7119 21.9209 17.6921 21.9011L9.09889 13.3079C9.07914 13.2881 9.05931 13.2684 9.03947 13.2486C8.80812 13.0183 8.57479 12.786 8.43968 12.5133C8.18677 12.003 8.18677 11.4038 8.43968 10.8934C8.57479 10.6208 8.80812 10.3885 9.03947 10.1581C9.05931 10.1384 9.07914 10.1186 9.0989 10.0989C9.11865 10.0791 9.13839 10.0593 9.15815 10.0395C9.38847 9.80812 9.62078 9.57479 9.89343 9.43968Z" fill="currentColor"/>
                            <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M6.70339 3.73972C6.59448 3.4454 6.31383 3.25 6 3.25C5.68617 3.25 5.40552 3.4454 5.29661 3.73972L5.07553 4.33717C4.76183 5.18495 4.67053 5.38548 4.528 5.528C4.38548 5.67053 4.18495 5.76183 3.33717 6.07553L2.73972 6.29661C2.4454 6.40552 2.25 6.68617 2.25 7C2.25 7.31383 2.4454 7.59448 2.73972 7.70339L3.33717 7.92447C4.18495 8.23817 4.38548 8.32947 4.528 8.472C4.67053 8.61452 4.76183 8.81505 5.07553 9.66283L5.29661 10.2603C5.40552 10.5546 5.68617 10.75 6 10.75C6.31383 10.75 6.59448 10.5546 6.70339 10.2603L6.92447 9.66283C7.23817 8.81505 7.32947 8.61452 7.47199 8.472C7.61452 8.32947 7.81505 8.23817 8.66282 7.92447L9.26028 7.70339C9.5546 7.59448 9.75 7.31383 9.75 7C9.75 6.68617 9.5546 6.40552 9.26028 6.29661L8.66283 6.07553C7.81505 5.76183 7.61452 5.67053 7.472 5.52801C7.32947 5.38548 7.23817 5.18495 6.92447 4.33717L6.70339 3.73972ZM5.58866 6.58867C5.75446 6.42287 5.88584 6.23409 6 6.02334C6.11416 6.23409 6.24554 6.42287 6.41133 6.58867C6.57713 6.75446 6.76591 6.88584 6.97666 7C6.76591 7.11416 6.57713 7.24554 6.41133 7.41134C6.24554 7.57713 6.11416 7.76591 6 7.97666C5.88584 7.76591 5.75446 7.57713 5.58866 7.41134C5.42287 7.24554 5.23409 7.11416 5.02334 7C5.23409 6.88584 5.42287 6.75446 5.58866 6.58867ZM17.7034 1.73972C17.5945 1.4454 17.3138 1.25 17 1.25C16.6862 1.25 16.4055 1.4454 16.2966 1.73972L16.0018 2.53633C15.5915 3.64524 15.4519 3.97634 15.2141 4.21412C14.9763 4.45189 14.6452 4.59151 13.5363 5.00184L12.7397 5.29661C12.4454 5.40552 12.25 5.68617 12.25 6C12.25 6.31383 12.4454 6.59448 12.7397 6.70339L13.5363 6.99816C14.6452 7.4085 14.9763 7.54811 15.2141 7.78588C15.4519 8.02366 15.5915 8.35476 16.0018 9.46368L16.2966 10.2603C16.4055 10.5546 16.6862 10.75 17 10.75C17.3138 10.75 17.5945 10.5546 17.7034 10.2603L17.9982 9.46368C18.4085 8.35476 18.5481 8.02366 18.7859 7.78588C19.0237 7.54811 19.3548 7.4085 20.4637 6.99816L21.2603 6.70339C21.5546 6.59448 21.75 6.31383 21.75 6C21.75 5.68617 21.5546 5.40552 21.2603 5.29661L20.4637 5.00184C19.3548 4.59151 19.0237 4.45189 18.7859 4.21412C18.5481 3.97634 18.4085 3.64524 17.9982 2.53633L17.7034 1.73972ZM16.2748 5.27478C16.5873 4.96223 16.8013 4.58242 17 4.11891C17.1987 4.58242 17.4127 4.96223 17.7252 5.27478C18.0378 5.58732 18.4176 5.80129 18.8811 6C18.4176 6.19871 18.0378 6.41268 17.7252 6.72522C17.4127 7.03777 17.1987 7.41758 17 7.88109C16.8013 7.41758 16.5873 7.03777 16.2748 6.72522C15.9622 6.41268 15.5824 6.19871 15.1189 6C15.5824 5.80129 15.9622 5.58732 16.2748 5.27478Z" fill="currentColor"/>
                        </svg>
                        <div class="flex items-center gap-2">
                            <i 
                                v-if="!isAutoReplyAvailable" 
                                class="pi pi-lock text-gray-400 text-sm"
                                v-tooltip.top="getAutoReplyLockReason"
                            ></i>
                            <ToggleSwitch 
                                :modelValue="!isAutoReplyAvailable ? false : data.auto_reply" 
                                @update:modelValue="(val) => saveTemplateToggle(data, 'auto_reply', val)" 
                                class="auto-reply-toggle"
                                :disabled="isTemplateDisabled(data) || !isAutoReplyAvailable"
                                v-tooltip.top="!isAutoReplyAvailable ? getAutoReplyLockReason : ''"
                            />
                        </div>
                    </div>
                </template>
            </Column>

            <Column field="rating" header="Ocena" sortable style="min-width: 10rem" :showFilterMatchModes="false" :pt="{ headerContent: { class: 'font-normal' } }">
                <template #body="{ data }">
                    <div :class="{ 'opacity-50': isTemplateDisabled(data) }">
                        <Rating 
                          :modelValue="data.rating" 
                          :readonly="true" 
                          :cancel="false" 
                          class="text-xs" 
                          :pt="{ 
                            onIcon: 'text-yellow-500', 
                            offIcon: 'text-gray-300' 
                          }" 
                        />
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="ratingOptions" optionLabel="label" optionValue="value" placeholder="Wybierz ocenę" showClear size="small" :pt="{ root: { class: 'text-sm' } }">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <Rating 
                                  :modelValue="slotProps.option.value" 
                                  :readonly="true" 
                                  :cancel="false" 
                                  class="text-xs" 
                                  :pt="{ 
                                    onIcon: 'text-yellow-500', 
                                    offIcon: 'text-gray-300' 
                                  }" 
                                />
                                <span>{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                    </Select>
        </template>
      </Column>

    </DataTable>
        </template>
    </Card>

        <!-- Template Details Drawer -->
        <Drawer v-model:visible="detailsVisible" header="Szczegóły Szablonu" position="right" class="w-full! md:w-[500px]!">
            <template #header>
                <div class="flex justify-between items-center w-full mr-2">
                    <span class="font-semibold text-lg">Szczegóły Szablonu</span>
                    <div class="flex gap-2">
                        <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Usuń" size="small" v-tooltip.bottom="'Usuń szablon'" @click="confirmDelete(selectedTemplate)" />
                    </div>
                </div>
            </template>
            <div v-if="selectedTemplate" class="flex flex-col gap-6 h-full overflow-hidden">
                <!-- Content Wrapper -->
                <div class="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden px-1">
                    <!-- Name -->
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Nazwa</span>
                            <p class="text-xs text-surface-500 m-0 leading-relaxed">
                                Nazwa szablonu pomaga szybko zidentyfikować i wybrać odpowiedni szablon podczas odpowiadania na opinie klientów. 
                                <span class="text-surface-400">Aby edytować nazwę, kliknij w pole powyżej.</span>
                            </p>
                        </div>
                        <Inplace :closable="true" @open="editingName = selectedTemplate.name; editingTemplateId = selectedTemplate.id" @close="cancelNameEdit">
                            <template #display>
                                <span class="font-semibold text-base cursor-pointer hover:text-primary transition-colors">{{ selectedTemplate.name || 'Kliknij aby edytować' }}</span>
                            </template>
                            <template #content="{ closeCallback }">
                                <div class="flex items-center gap-2 w-full">
                                    <InputText v-model="editingName" autofocus @keydown.enter="saveTemplateName(selectedTemplate, closeCallback)" @keydown.escape="closeCallback" size="small" class="flex-1" />
                                    <Button icon="pi pi-check" text severity="success" size="small" @click="saveTemplateName(selectedTemplate, closeCallback)" />
                                    <Button icon="pi pi-times" text severity="danger" size="small" @click="closeCallback" />
                                </div>
                            </template>
                        </Inplace>
                    </div>

                    <!-- Rating -->
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Ocena</span>
                            <p class="text-xs text-surface-500 m-0 leading-relaxed">
                                Ocena określa, dla jakich opinii klientów (1-5 gwiazdek) szablon jest odpowiedni. 
                                <span class="text-surface-400">Aby zmienić ocenę, kliknij w pole z gwiazdkami powyżej.</span>
                            </p>
                        </div>
                        <Inplace :closable="true" @open="editingRating = selectedTemplate.rating; editingTemplateId = selectedTemplate.id; hoverRating = 0; lockedRating = 0" @close="cancelRatingEdit">
                            <template #display>
                                <Rating 
                                  :key="`rating-display-${selectedTemplate.id}-${selectedTemplate.rating}`" 
                                  :modelValue="selectedTemplate.rating" 
                                  :readonly="true" 
                                  :cancel="false" 
                                  class="text-sm p-0!" 
                                  :pt="{ 
                                    onIcon: 'text-yellow-500', 
                                    offIcon: 'text-gray-300' 
                                  }" 
                                />
                            </template>
                            <template #content="{ closeCallback }">
                                <BlockUI :blocked="savingRating">
                                    <div class="flex items-center gap-2 w-full" style="min-width: 400px;">
                                        <div 
                                            class="flex-1 relative rating-hover-container" 
                                            style="flex: 1 1 auto;" 
                                            @mouseleave="hoverRating = 0"
                                            @mousemove="handleRatingHover"
                                            @click.capture="(e) => handleRatingContainerClick(e, closeCallback)"
                                        >
                                            <Rating 
                                                :modelValue="hoverRating || editingRating" 
                                                @update:modelValue="() => {}"
                                                :cancel="false" 
                                                :readonly="false"
                                                class="w-full"
                                            />
                                        </div>
                                        <Button icon="pi pi-check" text severity="success" size="small" @click="saveTemplateRating(selectedTemplate, editingRating, closeCallback)" />
                                        <Button icon="pi pi-times" text severity="danger" size="small" @click="closeCallback" />
                                    </div>
                                </BlockUI>
                            </template>
                        </Inplace>
                    </div>

                    <!-- Content -->
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Treść Szablonu</span>
                            <p class="text-xs text-surface-500 m-0 leading-relaxed">
                                Treść szablonu to gotowa odpowiedź, która zostanie wysłana do klienta. Możesz używać zmiennych (np. @imie, @pelne_imie), które zostaną automatycznie zastąpione danymi klienta. 
                                <span class="text-surface-400">Aby edytować treść, kliknij w pole tekstowe powyżej.</span>
                            </p>
                        </div>
                        <Inplace :closable="true" @open="editingContent = selectedTemplate.content || ''; editingTemplateId = selectedTemplate.id" @close="cancelContentEdit">
                            <template #display>
                                <div class="p-4 bg-surface-0 border border-surface-200 rounded-lg shadow-sm cursor-pointer hover:border-primary transition-colors">
                                    <div class="m-0 text-sm text-surface-700 leading-relaxed" style="min-height: 100px;">
                                        <TinyEditor 
                                            :modelValue="selectedTemplate?.content || ''"
                                            :mentions="mentionsMap"
                                            :editable="false"
                                            class="w-full"
                                        />
                                    </div>
                                </div>
                            </template>
                            <template #content="{ closeCallback }">
                                <div class="flex flex-col gap-2 w-full">
                                    <div class="flex items-start gap-2">
                                        <div class="flex-1">
                                            <TinyEditor 
                                                v-model="editingContent" 
                                                :mentions="mentionsMap"
                                                :editable="true"
                                                placeholder="Wpisz treść szablonu... Możesz używać @ aby wstawić zmienne."
                                                class="w-full"
                                            />
                                        </div>
                                        <div class="flex flex-col gap-1">
                                            <Button icon="pi pi-check" text severity="success" size="small" @click="saveTemplateContent(selectedTemplate, closeCallback)" />
                                            <Button icon="pi pi-times" text severity="danger" size="small" @click="closeCallback" />
                                        </div>
                                    </div>
                                    <!-- Variables Helper -->
                                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div class="flex items-center gap-2 mb-2">
                                            <i class="pi pi-info-circle text-blue-600 text-xs"></i>
                                            <span class="text-xs font-semibold text-blue-700">Dostępne zmienne (wpisz @ aby zobaczyć listę):</span>
                                        </div>
                                        <div class="flex flex-wrap gap-1">
                                            <Button 
                                                v-for="variable in availableVariables" 
                                                :key="variable.key"
                                                :label="`@${variable.key}`" 
                                                text 
                                                size="small" 
                                                severity="secondary"
                                                class="text-xs py-1 px-2"
                                                @click="insertVariableIntoEditor(variable.key)"
                                                v-tooltip.top="variable.description"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Inplace>
                        <div class="bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <span class="text-xs text-blue-700 font-semibold block mb-2">Dostępne zmienne:</span>
                            <div class="flex flex-wrap gap-2">
                                <div v-for="variable in availableVariables" :key="variable.key" class="flex flex-col">
                                    <code class="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded">@{{variable.key}}</code>
                                    <span class="text-[10px] text-blue-600 mt-1">{{ variable.description }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Toggle -->
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Aktywny</span>
                            <p class="text-xs text-surface-500 m-0 leading-relaxed">
                                Aktywny szablon jest widoczny i dostępny do użycia podczas odpowiadania na opinie klientów. Nieaktywne szablony są ukryte, ale nie są usuwane.
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <ToggleSwitch 
                                :modelValue="isActiveToggleLocked(selectedTemplate) ? false : selectedTemplate.active" 
                                @update:modelValue="(val) => saveTemplateToggle(selectedTemplate, 'active', val)"
                                :disabled="isActiveToggleLocked(selectedTemplate)"
                                v-tooltip.top="isActiveToggleLocked(selectedTemplate) ? getActiveToggleLockReason(selectedTemplate) : ''"
                            />
                            <span class="text-sm text-surface-700">{{ selectedTemplate.active ? 'Aktywny' : 'Nieaktywny' }}</span>
                        </div>
                    </div>

                    <!-- Auto Reply Toggle -->
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <span class="text-xs font-semibold text-surface-500 uppercase tracking-wider">Dostępny w auto-odpowiedziach</span>
                            <p class="text-xs text-surface-500 m-0 leading-relaxed">
                                Szablony dostępne w auto-odpowiedziach mogą być automatycznie używane przez system do odpowiadania na opinie klientów bez ręcznej interwencji.
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <ToggleSwitch 
                                :modelValue="!isAutoReplyAvailable ? false : selectedTemplate.auto_reply" 
                                @update:modelValue="(val) => saveTemplateToggle(selectedTemplate, 'auto_reply', val)"
                                :disabled="!isAutoReplyAvailable"
                                v-tooltip.top="!isAutoReplyAvailable ? getAutoReplyLockReason : ''"
                            />
                            <span class="text-sm text-surface-700">{{ selectedTemplate.auto_reply ? 'Włączone' : 'Wyłączone' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>

        <!-- New Template Dialog -->
        <Dialog v-model:visible="newTemplateDialogVisible" header="Nowy szablon" :modal="true" :style="{ width: '600px' }">
      <div class="flex flex-col mt-2" style="gap: 0.9rem;">
        <div class="field">
                    <div class="flex flex-col gap-1 mb-2">
                        <label for="new-name" class="font-semibold mb-0 block text-sm">Nazwa szablonu</label>
                        <p class="text-xs text-surface-500 m-0 leading-relaxed">
                            Nazwa szablonu pomaga szybko zidentyfikować i wybrać odpowiedni szablon podczas odpowiadania na opinie klientów.
                        </p>
                    </div>
                    <InputText id="new-name" v-model="newTemplate.name" required autofocus size="small" class="w-full" :class="{'p-invalid': submitted && !newTemplate.name}" />
                    <small class="p-error text-xs" v-if="submitted && !newTemplate.name">Nazwa jest wymagana.</small>
        </div>

        <div class="field">
                    <div class="flex flex-col gap-1 mb-2">
                        <label for="new-rating" class="font-semibold mb-0 block text-sm">Ocena</label>
                        <p class="text-xs text-surface-500 m-0 leading-relaxed">
                            Ocena określa, dla jakich opinii klientów (1-5 gwiazdek) szablon jest odpowiedni.
                        </p>
                    </div>
                    <Rating v-model="newTemplate.rating" :cancel="false" />
        </div>

        <div class="field">
                    <div class="flex flex-col gap-1 mb-2">
                        <label for="new-content" class="font-semibold mb-0 block text-sm">Treść</label>
                        <p class="text-xs text-surface-500 m-0 leading-relaxed">
                            Treść szablonu to gotowa odpowiedź, która zostanie wysłana do klienta. Możesz używać zmiennych (np. @imie, @pelne_imie), które zostaną automatycznie zastąpione danymi klienta.
                        </p>
                    </div>
                    <div>
                        <TinyEditor 
                            id="new-content"
                            v-model="newTemplate.content" 
                            :mentions="mentionsMap"
                            :editable="true"
                            placeholder="Wpisz treść szablonu... Możesz używać @ aby wstawić zmienne."
                            class="w-full"
                        />
                    </div>
                    <small class="p-error text-xs" v-if="submitted && !newTemplate.content">Treść jest wymagana.</small>
                    <!-- Variables Helper -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                        <div class="flex items-center gap-2 mb-2">
                            <i class="pi pi-info-circle text-blue-600 text-xs"></i>
                            <span class="text-xs font-semibold text-blue-700">Dostępne zmienne (wpisz @ aby zobaczyć listę):</span>
                        </div>
                        <div class="flex flex-wrap gap-1">
                            <Button 
                                v-for="variable in availableVariables" 
                                :key="variable.key"
                                :label="`@${variable.key}`" 
                                text 
                                size="small" 
                                severity="secondary"
                                class="text-xs py-1 px-2"
                                @click="insertVariableInNewTemplate(variable.key)"
                                v-tooltip.top="variable.description"
                            />
                        </div>
                    </div>
        </div>

        <div class="field">
                    <div class="flex flex-col gap-1 mb-2">
                        <label class="font-semibold mb-0 block text-sm">Aktywny</label>
                        <p class="text-xs text-surface-500 m-0 leading-relaxed">
                            Aktywny szablon jest widoczny i dostępny do użycia podczas odpowiadania na opinie klientów. Nieaktywne szablony są ukryte, ale nie są usuwane.
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <ToggleSwitch 
                            :modelValue="isActiveToggleLocked(newTemplate) ? false : newTemplate.active" 
                            @update:modelValue="(val) => { if (!isActiveToggleLocked(newTemplate)) newTemplate.active = val; }"
                            :disabled="isActiveToggleLocked(newTemplate)"
                            v-tooltip.top="isActiveToggleLocked(newTemplate) ? getActiveToggleLockReason(newTemplate) : ''"
                        />
                        <span class="text-sm text-surface-700">{{ (isActiveToggleLocked(newTemplate) ? false : newTemplate.active) ? 'Aktywny' : 'Nieaktywny' }}</span>
                    </div>
                </div>

                <div class="field">
                    <div class="flex flex-col gap-1 mb-2">
                        <label class="font-semibold mb-0 block text-sm">Dostępny w auto-odpowiedziach</label>
                        <p class="text-xs text-surface-500 m-0 leading-relaxed">
                            Szablony dostępne w auto-odpowiedziach mogą być automatycznie używane przez system do odpowiadania na opinie klientów bez ręcznej interwencji.
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <ToggleSwitch 
                            :modelValue="!isAutoReplyAvailable ? false : newTemplate.auto_reply" 
                            @update:modelValue="(val) => { if (isAutoReplyAvailable) newTemplate.auto_reply = val; }"
                            :disabled="!isAutoReplyAvailable"
                            v-tooltip.top="!isAutoReplyAvailable ? getAutoReplyLockReason : ''"
                        />
                        <span class="text-sm text-surface-700">{{ (!isAutoReplyAvailable ? false : newTemplate.auto_reply) ? 'Włączone' : 'Wyłączone' }}</span>
                    </div>
        </div>
      </div>

      <template #footer>
                <Button label="Anuluj" icon="pi pi-times" text @click="hideNewTemplateDialog" size="small" />
                <Button label="Zapisz" icon="pi pi-check" @click="saveNewTemplate" :loading="saving" size="small" />
      </template>
    </Dialog>

    <!-- Bulk Active Dialog -->
    <Dialog v-model:visible="bulkActiveDialogVisible" header="Zmiana aktywności" :modal="true" :style="{ width: '400px' }">
        <div class="flex flex-col gap-4 mt-2">
            <p class="text-sm text-surface-600 m-0">
                Wybierz nową wartość aktywności dla {{ selectedTemplates.length }} zaznaczonych szablonów.
            </p>
            <div class="flex items-center gap-3">
                <ToggleSwitch v-model="bulkActiveValue" />
                <span class="text-sm font-semibold">{{ bulkActiveValue ? 'Aktywny' : 'Nieaktywny' }}</span>
            </div>
        </div>
        <template #footer>
            <Button label="Anuluj" icon="pi pi-times" text @click="bulkActiveDialogVisible = false" size="small" />
            <Button label="Zastosuj" icon="pi pi-check" @click="applyBulkActive" :loading="saving" size="small" />
        </template>
    </Dialog>

    <!-- Bulk Auto Reply Dialog -->
    <Dialog v-model:visible="bulkAutoReplyDialogVisible" header="Zmiana auto-odpowiedzi" :modal="true" :style="{ width: '400px' }">
        <div class="flex flex-col gap-4 mt-2">
            <p class="text-sm text-surface-600 m-0">
                Wybierz nową wartość auto-odpowiedzi dla {{ selectedTemplates.length }} zaznaczonych szablonów.
            </p>
            <div class="flex items-center gap-3">
                <i 
                    v-if="!isAutoReplyAvailable" 
                    class="pi pi-lock text-gray-400 text-sm"
                    v-tooltip.top="getAutoReplyLockReason"
                ></i>
                <ToggleSwitch 
                    :modelValue="!isAutoReplyAvailable ? false : bulkAutoReplyValue" 
                    @update:modelValue="(val) => { if (isAutoReplyAvailable) bulkAutoReplyValue = val; }"
                    :disabled="!isAutoReplyAvailable"
                    v-tooltip.top="!isAutoReplyAvailable ? getAutoReplyLockReason : ''"
                />
                <span class="text-sm font-semibold">{{ (!isAutoReplyAvailable ? false : bulkAutoReplyValue) ? 'Włączone' : 'Wyłączone' }}</span>
            </div>
        </div>
        <template #footer>
            <Button label="Anuluj" icon="pi pi-times" text @click="bulkAutoReplyDialogVisible = false" size="small" />
            <Button label="Zastosuj" icon="pi pi-check" @click="applyBulkAutoReply" :loading="saving" size="small" />
        </template>
    </Dialog>

    <!-- Bulk Rating Dialog -->
    <Dialog v-model:visible="bulkRatingDialogVisible" header="Zmiana oceny" :modal="true" :style="{ width: '400px' }">
        <div class="flex flex-col gap-4 mt-2">
            <p class="text-sm text-surface-600 m-0">
                Wybierz nową ocenę dla {{ selectedTemplates.length }} zaznaczonych szablonów.
            </p>
            <div class="flex flex-col gap-2">
                <Rating v-model="bulkRatingValue" :cancel="false" />
                <span class="text-xs text-surface-500">{{ bulkRatingValue }} {{ bulkRatingValue === 1 ? 'gwiazdka' : bulkRatingValue < 5 ? 'gwiazdki' : 'gwiazdek' }}</span>
            </div>
  </div>
        <template #footer>
            <Button label="Anuluj" icon="pi pi-times" text @click="bulkRatingDialogVisible = false" size="small" />
            <Button label="Zastosuj" icon="pi pi-check" @click="applyBulkRating" :loading="saving" size="small" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { usePrimeVue } from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Drawer from 'primevue/drawer';
import Inplace from 'primevue/inplace';
import Rating from 'primevue/rating';
import Card from 'primevue/card';
import BlockUI from 'primevue/blockui';
import ToggleSwitch from 'primevue/toggleswitch';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { ReviewsService } from '../../../services/ReviewsService';
import TinyEditor from '@juit/vue-tiny-editor';
import '@juit/vue-tiny-editor/style.css';
import { useFeatures } from '../../../composables/useFeatures';
import { PLAN_NAMES } from '../../../config/features';

const templates = ref([]);
const loading = ref(true);
const saving = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    content: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    rating: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const detailsVisible = ref(false);
const selectedTemplate = ref(null);
const selectedTemplates = ref([]);

// Bulk actions dialogs
const bulkActiveDialogVisible = ref(false);
const bulkActiveValue = ref(true);
const bulkAutoReplyDialogVisible = ref(false);
const bulkAutoReplyValue = ref(true);
const bulkRatingDialogVisible = ref(false);
const bulkRatingValue = ref(5);
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const primevue = usePrimeVue();
const { can, isLocked, getLimit, checkLimit, features } = useFeatures();

// Check if auto-reply feature is available
const isAutoReplyAvailable = computed(() => can('autoReply'));

const getAutoReplyLockReason = computed(() => {
  if (isLocked('autoReply')) {
    const plan = features.autoReply?.requiredPlan;
    const planName = PLAN_NAMES[plan] || 'Professional';
    return `Auto-odpowiedzi są dostępne w planie ${planName}. Zwiększ pakiet, aby używać tej funkcji.`;
  }
  return null;
});

// Editing state
const editingName = ref('');
const editingContent = ref('');
const editingRating = ref(5);
const hoverRating = ref(0);
const lockedRating = ref(0); // Value locked after click
const editingTemplateId = ref(null);
const contentTextareaRef = ref(null);
const newContentTextareaRef = ref(null);
const savingRating = ref(false);

// New template state
const newTemplateDialogVisible = ref(false);
const submitted = ref(false);
const newTemplate = ref({
    name: '',
    content: '',
    rating: 5,
    active: true,
    auto_reply: false
});

// Available variables based on feedback structure
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

// Convert availableVariables to mentions map for TinyEditor
const mentionsMap = computed(() => {
    const map = {};
    availableVariables.value.forEach(variable => {
        map[variable.key] = variable.description;
    });
    return map;
});

const ratingOptions = [
  { label: '5 gwiazdek', value: 5 },
  { label: '4 gwiazdki', value: 4 },
  { label: '3 gwiazdki', value: 3 },
  { label: '2 gwiazdki', value: 2 },
  { label: '1 gwiazdka', value: 1 }
];

const saveTemplateToggle = async (template, field, value) => {
    // If trying to enable auto-reply, check if feature is available
    if (field === 'auto_reply' && value === true && !isAutoReplyAvailable.value) {
        // Force disable auto-reply if feature is not available
        value = false;
        toast.add({
            severity: 'warn',
            summary: 'Funkcja niedostępna',
            detail: getAutoReplyLockReason.value,
            life: 5000
        });
    }
    
    // If trying to activate a template, check limit first
    if (field === 'active' && value === true) {
        const currentActiveCount = templates.value.filter(t => t.active && t.id !== template.id).length;
        if (templateLimit.value && currentActiveCount >= templateLimit.value) {
            // Force disable if limit is reached
            value = false;
            toast.add({
                severity: 'warn',
                summary: 'Limit osiągnięty',
                detail: `Osiągnięto limit ${templateLimit.value} aktywnych szablonów. Wyłącz inne szablony lub zwiększ pakiet.`,
                life: 5000
            });
        }
    }
    
    // Force false if toggle is locked
    if (field === 'auto_reply' && !isAutoReplyAvailable.value) {
        value = false;
    }
    if (field === 'active' && isActiveToggleLocked(template)) {
        value = false;
    }
    
    try {
        const updated = { ...template, [field]: value };
        await ReviewsService.saveTemplate(updated);
        await loadTemplates();
        
        if (selectedTemplate.value && selectedTemplate.value.id === template.id) {
            selectedTemplate.value = { ...updated };
        }
        
        toast.add({ 
            severity: 'success', 
            summary: 'Zapisano', 
            detail: field === 'active' ? (value ? 'Szablon został aktywowany' : 'Szablon został dezaktywowany') : (value ? 'Auto-odpowiedź została włączona' : 'Auto-odpowiedź została wyłączona'), 
            life: 2000 
        });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać', life: 3000 });
    }
};

// Format template content for display - convert HTML mentions to readable text
const formatTemplateContentForDisplay = (content) => {
    if (!content) return '';
    
    let formatted = String(content);
    
    // Create a temporary DOM element to parse HTML safely
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formatted;
    
    // Find all link tags with rel="mention" and replace them with @variable
    const mentionLinks = tempDiv.querySelectorAll('link[rel="mention"]');
    mentionLinks.forEach(link => {
        const varName = link.getAttribute('name');
        if (varName) {
            // Replace the link element with @variable text
            const textNode = document.createTextNode(`@${varName}`);
            link.parentNode?.replaceChild(textNode, link);
        } else {
            // If no name attribute, just remove the link
            link.parentNode?.removeChild(link);
        }
    });
    
    // Get the formatted HTML
    formatted = tempDiv.innerHTML;
    
    // Also handle any remaining link tags that might not have been caught
    formatted = formatted.replace(/<link\s+rel="mention"\s+name="(\w+)"[^>]*>@\1<\/link>/gi, '@$1');
    formatted = formatted.replace(/<link\s+rel="mention"\s+name="(\w+)"[^>]*>([^<]*)<\/link>/gi, '@$1');
    formatted = formatted.replace(/<link\s+rel="mention"\s+name="(\w+)"[^>]*\/>/gi, '@$1');
    formatted = formatted.replace(/<link[^>]*rel="mention"[^>]*>([^<]*)<\/link>/gi, '$1');
    formatted = formatted.replace(/<link[^>]*>/gi, '');
    formatted = formatted.replace(/<\/link>/gi, '');
    
    // Also handle any remaining HTML tags - convert to readable format
    // This handles bold, italic, links etc. from the editor
    formatted = formatted.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
    formatted = formatted.replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>');
    formatted = formatted.replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2');
    
    // Preserve plain @variable format (for backward compatibility with old data)
    // No need to change these, they're already in the correct format
    
    return formatted;
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        content: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        rating: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter = () => {
    initFilters();
};

const onRowClick = (event) => {
    // Don't open drawer if clicking on checkbox or toggle
    if (event.originalEvent?.target?.closest('.p-checkbox') || 
        event.originalEvent?.target?.closest('.p-toggleswitch') ||
        event.originalEvent?.target?.closest('input[type="checkbox"]')) {
        return;
    }
    selectedTemplate.value = event.data;
    detailsVisible.value = true;
};

const loadTemplates = async () => {
  loading.value = true;
  try {
    templates.value = await ReviewsService.getTemplates();
    
    // Disable auto-reply if feature is not available
    await disableAutoReplyIfNotAvailable();
    
    // Enforce limit: disable excess templates
    await enforceTemplateLimit();
  } catch (e) {
    console.error(e);
    toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się pobrać szablonów', life: 3000 });
  } finally {
    loading.value = false;
  }
};

// Disable auto-reply in templates if feature is not available
const disableAutoReplyIfNotAvailable = async () => {
  if (isAutoReplyAvailable.value) return; // Feature is available, no need to disable
  
  const templatesWithAutoReply = templates.value.filter(t => t.auto_reply === true);
  if (templatesWithAutoReply.length === 0) return; // No templates with auto-reply enabled
  
  // Disable auto-reply for all templates
  for (const template of templatesWithAutoReply) {
    try {
      const updated = { ...template, auto_reply: false };
      await ReviewsService.saveTemplate(updated);
      // Update local state
      const index = templates.value.findIndex(t => t.id === template.id);
      if (index !== -1) {
        templates.value[index] = updated;
      }
    } catch (e) {
      console.error('Failed to disable auto-reply for template', e);
    }
  }
  
  if (templatesWithAutoReply.length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Auto-odpowiedzi wyłączone',
      detail: `${templatesWithAutoReply.length} szablon${templatesWithAutoReply.length === 1 ? '' : templatesWithAutoReply.length < 5 ? 'y' : 'ów'} miało włączone auto-odpowiedzi, które zostały wyłączone z powodu braku dostępu do tej funkcji w Twoim planie.`,
      life: 6000
    });
  }
};

// Template limits
const templateLimit = computed(() => getLimit('templates', 'maxTemplates'));
const activeTemplatesCount = computed(() => templates.value.filter(t => t.active).length);

const limitExceededInfo = computed(() => {
    if (!templateLimit.value) return null;
    if (activeTemplatesCount.value > templateLimit.value) {
        return {
            limit: templateLimit.value,
            excess: activeTemplatesCount.value - templateLimit.value
        };
    }
    return null;
});

const showLimitMessage = computed(() => {
    if (!templateLimit.value) return false;
    return activeTemplatesCount.value >= templateLimit.value;
});

const isTemplateDisabled = (template) => {
  if (!templateLimit.value) return false;
  
  const activeTemplates = templates.value.filter(t => t.active);
  const activeCount = activeTemplates.length;
  
  // Find position of this template in sorted active templates (by id or creation date)
  const sortedActive = [...activeTemplates].sort((a, b) => (a.id || 0) - (b.id || 0));
  const templateIndex = sortedActive.findIndex(t => t.id === template.id);
  
  // Disable if this template is beyond the limit
  return templateIndex >= templateLimit.value;
};

// Check if active toggle should be locked (limit reached and trying to activate)
const isActiveToggleLocked = (template) => {
  if (!templateLimit.value) return false;
  if (template.active) return false; // Already active, no need to lock
  
  // Check if limit is reached
  const currentActiveCount = templates.value.filter(t => t.active).length;
  return currentActiveCount >= templateLimit.value;
};

// Get lock reason for active toggle
const getActiveToggleLockReason = (template) => {
  if (!isActiveToggleLocked(template)) return '';
  return `Osiągnięto limit ${templateLimit.value} aktywnych szablonów dla Twojego planu. Wyłącz inne szablony lub zwiększ pakiet, aby aktywować więcej.`;
};

// Enforce template limit by disabling excess templates
const enforceTemplateLimit = async () => {
  if (!templateLimit.value) return;
  
  const activeTemplates = templates.value.filter(t => t.active);
  if (activeTemplates.length <= templateLimit.value) return;
  
  // Sort by ID (or creation date) and disable excess ones
  const sortedActive = [...activeTemplates].sort((a, b) => (a.id || 0) - (b.id || 0));
  const excessTemplates = sortedActive.slice(templateLimit.value);
  
  // Disable excess templates
  for (const template of excessTemplates) {
    try {
      const updated = { ...template, active: false };
      await ReviewsService.saveTemplate(updated);
      // Update local state
      const index = templates.value.findIndex(t => t.id === template.id);
      if (index !== -1) {
        templates.value[index] = updated;
      }
    } catch (e) {
      console.error('Failed to disable excess template', e);
    }
  }
  
  if (excessTemplates.length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Limit szablonów',
      detail: `${excessTemplates.length} szablon${excessTemplates.length === 1 ? '' : excessTemplates.length < 5 ? 'y' : 'ów'} zostało wyłączonych z powodu przekroczenia limitu.`,
      life: 5000
    });
  }
};

// Navigate to settings
const navigateToSettings = () => {
  router.push({ 
    name: 'settings',
    query: { 
      tab: 'business'
    }
  });
};

// Template editing functions
const saveTemplateName = async (template, closeCallback) => {
    if (!editingName.value.trim()) {
        toast.add({ severity: 'warn', summary: 'Uwaga', detail: 'Nazwa nie może być pusta', life: 3000 });
        return;
    }
    
    saving.value = true;
    try {
        const updated = { ...template, name: editingName.value.trim() };
        await ReviewsService.saveTemplate(updated);
        await loadTemplates();
        
        if (selectedTemplate.value && selectedTemplate.value.id === template.id) {
            selectedTemplate.value = { ...updated };
        }
        
        editingName.value = '';
        editingTemplateId.value = null;
        if (closeCallback) closeCallback();
        toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Nazwa została zaktualizowana', life: 2000 });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać', life: 3000 });
    } finally {
        saving.value = false;
    }
};

const saveTemplateContent = async (template, closeCallback) => {
    if (!editingContent.value.trim()) {
        toast.add({ severity: 'warn', summary: 'Uwaga', detail: 'Treść nie może być pusta', life: 3000 });
        return;
    }
    
    saving.value = true;
    try {
        const updated = { ...template, content: editingContent.value.trim() };
        await ReviewsService.saveTemplate(updated);
        await loadTemplates();
        
        if (selectedTemplate.value && selectedTemplate.value.id === template.id) {
            selectedTemplate.value = { ...updated };
        }
        
        editingContent.value = '';
        editingTemplateId.value = null;
        if (closeCallback) closeCallback();
        toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Treść została zaktualizowana', life: 2000 });
    } catch (e) {
      console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać', life: 3000 });
    } finally {
        saving.value = false;
    }
};

const saveTemplateRating = async (template, ratingValue, closeCallback) => {
    saving.value = true;
    savingRating.value = true;
    try {
        // Use the passed ratingValue directly instead of editingRating.value
        const ratingToSave = ratingValue !== undefined ? ratingValue : editingRating.value;
        console.log('saveTemplateRating called with ratingValue:', ratingValue, 'ratingToSave:', ratingToSave);
        console.log('template before update:', template);
        
        const updated = { ...template, rating: ratingToSave };
        const savedTemplate = await ReviewsService.saveTemplate(updated);
        console.log('savedTemplate returned:', savedTemplate);
        
        await loadTemplates();
        console.log('templates after load:', templates.value.find(t => t.id === template.id));
        
        // Update selectedTemplate with the saved template data
        if (selectedTemplate.value && selectedTemplate.value.id === template.id) {
            // Use the saved template directly, or find from loaded list
            const updatedTemplate = templates.value.find(t => t.id === template.id);
            console.log('updatedTemplate found:', updatedTemplate);
            
            if (updatedTemplate) {
                // Force reactivity by creating a completely new object with correct rating
                selectedTemplate.value = { 
                    ...updatedTemplate,
                    rating: ratingToSave // Explicitly set the rating to ensure it's correct
                };
                console.log('selectedTemplate updated to:', selectedTemplate.value);
            } else if (savedTemplate) {
                selectedTemplate.value = { ...savedTemplate };
                console.log('selectedTemplate set from savedTemplate:', selectedTemplate.value);
            } else {
                selectedTemplate.value = { ...updated };
                console.log('selectedTemplate set from updated:', selectedTemplate.value);
            }
        }
        
        // Wait for Vue to process the reactivity update
        await nextTick();
        console.log('After nextTick, selectedTemplate:', selectedTemplate.value);
        
        // Reset editing state BEFORE closing to prevent cancelRatingEdit from interfering
        editingRating.value = 5;
        hoverRating.value = 0;
        lockedRating.value = 0;
        editingTemplateId.value = null;
        
        // Close the inplace editor after update
        await nextTick();
        if (closeCallback) {
            closeCallback();
        }
        
        console.log('After closeCallback, selectedTemplate:', selectedTemplate.value);
        
        toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Ocena została zaktualizowana', life: 2000 });
    } catch (e) {
        console.error('Error in saveTemplateRating:', e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać', life: 3000 });
    } finally {
        saving.value = false;
        savingRating.value = false;
    }
};

// Cancel edit functions (called on @close when not saving)
const cancelNameEdit = () => {
    editingName.value = '';
    editingTemplateId.value = null;
};

const cancelContentEdit = () => {
    editingContent.value = '';
    editingTemplateId.value = null;
};

const cancelRatingEdit = () => {
    // Only reset if we're not in the middle of saving
    if (!saving.value && !savingRating.value) {
        editingRating.value = 5;
        hoverRating.value = 0;
        lockedRating.value = 0;
        editingTemplateId.value = null;
    }
};

const handleRatingHover = (event) => {
    // Only calculate hover if mouse is over the stars themselves, not the whole container
    const star = event.target.closest('.p-rating-icon');
    if (!star) {
        hoverRating.value = 0;
        return;
    }
    
    const container = event.currentTarget;
    const ratingElement = container.querySelector('.p-rating');
    if (!ratingElement) return;
    
    // Get all stars
    const stars = ratingElement.querySelectorAll('.p-rating-icon');
    const index = Array.from(stars).indexOf(star);
    
    if (index >= 0 && index < 5) {
        hoverRating.value = index + 1;
    }
};

const handleRatingContainerClick = async (event, closeCallback) => {
    // Handle click directly on container to capture star clicks
    const star = event.target.closest('.p-rating-icon');
    if (!star) return;
    
    // Prevent event bubbling to avoid double handling
    event.stopPropagation();
    event.preventDefault();
    
    const container = event.currentTarget;
    const ratingElement = container.querySelector('.p-rating');
    if (!ratingElement) return;
    
    const stars = ratingElement.querySelectorAll('.p-rating-icon');
    const index = Array.from(stars).indexOf(star);
    
    if (index >= 0 && index < 5) {
        const ratingValue = index + 1;
        console.log('handleRatingContainerClick: clicked star', ratingValue);
        
        // Set the value and immediately save
        editingRating.value = ratingValue;
        hoverRating.value = 0;
        
        // Wait for Vue to process the update
        await nextTick();
        
        // Block UI and save - pass the value directly
        if (selectedTemplate.value) {
            savingRating.value = true;
            try {
                await saveTemplateRating(selectedTemplate.value, ratingValue, closeCallback);
            } finally {
                savingRating.value = false;
            }
        }
    }
};

const handleRatingClick = async (val, closeCallback) => {
    console.log('handleRatingClick called with val:', val, typeof val);
    
    // Validate value - if null/undefined, try to get from event or use current editingRating
    let ratingValue = val;
    if (ratingValue === null || ratingValue === undefined || ratingValue === 0) {
        console.warn('Rating value is null/undefined/0, using editingRating:', editingRating.value);
        ratingValue = editingRating.value || 5;
    }
    
    // Set the value and immediately save
    editingRating.value = ratingValue;
    hoverRating.value = 0;
    
    console.log('editingRating set to:', editingRating.value);
    console.log('selectedTemplate before save:', selectedTemplate.value);
    
    // Wait for Vue to process the update
    await nextTick();
    
    // Block UI and save - pass the value directly
    if (selectedTemplate.value) {
        savingRating.value = true;
        try {
            await saveTemplateRating(selectedTemplate.value, ratingValue, closeCallback);
        } finally {
            savingRating.value = false;
        }
    }
};

// Variable insertion for TinyEditor (HTML)
const insertVariableIntoEditor = (variableKey) => {
    // TinyEditor uses contenteditable div, so we need to insert HTML mention tag
    // The editor will handle the mention insertion when user types @variableKey
    // For now, we'll insert the mention tag directly into the HTML
    const variableDescription = availableVariables.value.find(v => v.key === variableKey)?.description || variableKey;
    const mentionTag = `<link rel="mention" name="${variableKey}" title="${variableDescription}">@${variableKey}</link>`;
    
    // Get current HTML content
    const currentContent = editingContent.value || '';
    
    // Append the mention at the end (or we could try to insert at cursor position)
    // For simplicity, append for now - user can position it manually
    editingContent.value = currentContent + (currentContent ? ' ' : '') + mentionTag;
};

const insertVariableInNewTemplate = (variableKey) => {
    // TinyEditor uses contenteditable div, so we need to insert HTML mention tag
    const variableDescription = availableVariables.value.find(v => v.key === variableKey)?.description || variableKey;
    const mentionTag = `<link rel="mention" name="${variableKey}" title="${variableDescription}">@${variableKey}</link>`;
    
    // Get current HTML content
    const currentContent = newTemplate.value.content || '';
    
    // Append the mention at the end
    newTemplate.value.content = currentContent + (currentContent ? ' ' : '') + mentionTag;
};

// New template functions
const createNewTemplate = () => {
    newTemplate.value = {
        name: '',
        content: '',
        rating: 5,
        active: true,
        auto_reply: false
    };
    submitted.value = false;
    newTemplateDialogVisible.value = true;
};

const hideNewTemplateDialog = () => {
    newTemplateDialogVisible.value = false;
    submitted.value = false;
    newTemplate.value = {
        name: '',
        content: '',
        rating: 5,
        active: true,
        auto_reply: false
    };
};

const saveNewTemplate = async () => {
    submitted.value = true;

    if (newTemplate.value.name.trim() && newTemplate.value.content.trim()) {
        // Check limit before saving
        const currentCount = templates.value.length;
        if (isLimitExceeded('templates', 'maxTemplates', currentCount)) {
            const limit = getCurrentLimit('templates', 'maxTemplates');
            toast.add({ 
                severity: 'warn', 
                summary: 'Limit osiągnięty', 
                detail: `Osiągnięto limit ${limit} szablonów dla Twojego planu. Zaktualizuj plan, aby zwiększyć limit.`, 
                life: 5000 
            });
            return;
        }
        
        saving.value = true;
        try {
            await ReviewsService.saveTemplate(newTemplate.value);
            await loadTemplates();
            newTemplateDialogVisible.value = false;
            
            // Show limit info if close to limit
            const limitMessage = getLimitMessage('templates', 'maxTemplates', templates.value.length);
            if (limitMessage && limitMessage.canProceed) {
                toast.add({ 
                    severity: limitMessage.severity, 
                    summary: limitMessage.summary, 
                    detail: limitMessage.detail, 
                    life: 3000 
                });
            }
            
            toast.add({ severity: 'success', summary: 'Sukces', detail: 'Szablon został utworzony', life: 3000 });
            hideNewTemplateDialog();
        } catch (e) {
            console.error(e);
            toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się utworzyć szablonu', life: 3000 });
    } finally {
      saving.value = false;
    }
  }
};

const confirmDelete = (template) => {
  confirm.require({
    message: 'Czy na pewno chcesz usunąć ten szablon? Tej operacji nie można cofnąć.',
    header: 'Potwierdzenie usunięcia',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Anuluj',
    acceptLabel: 'Usuń',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await ReviewsService.deleteTemplate(template.id);
        await loadTemplates();
        
        if (selectedTemplate.value && selectedTemplate.value.id === template.id) {
          detailsVisible.value = false;
          selectedTemplate.value = null;
        }
        
        toast.add({ severity: 'success', summary: 'Sukces', detail: 'Szablon został usunięty', life: 3000 });
      } catch (e) {
         toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć szablonu', life: 3000 });
      }
    }
  });
};

// Bulk actions functions
const showBulkActiveDialog = () => {
    bulkActiveValue.value = true;
    bulkActiveDialogVisible.value = true;
};

const showBulkAutoReplyDialog = () => {
    // Set default value based on availability
    bulkAutoReplyValue.value = isAutoReplyAvailable.value ? true : false;
    bulkAutoReplyDialogVisible.value = true;
};

const showBulkRatingDialog = () => {
    bulkRatingValue.value = 5;
    bulkRatingDialogVisible.value = true;
};

const applyBulkActive = async () => {
    if (!selectedTemplates.value || selectedTemplates.value.length === 0) return;
    
    const count = selectedTemplates.value.length;
    saving.value = true;
    try {
        for (const template of selectedTemplates.value) {
            await ReviewsService.saveTemplate({ ...template, active: bulkActiveValue.value });
        }
        await loadTemplates();
        selectedTemplates.value = [];
        bulkActiveDialogVisible.value = false;
        toast.add({ 
            severity: 'success', 
            summary: 'Sukces', 
            detail: `Zmieniono aktywność ${count} szablon${count === 1 ? '' : count < 5 ? 'ów' : 'ów'}`, 
            life: 3000 
        });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zmienić aktywności', life: 3000 });
    } finally {
        saving.value = false;
    }
};

const applyBulkAutoReply = async () => {
    if (!selectedTemplates.value || selectedTemplates.value.length === 0) return;
    
    // If trying to enable auto-reply, check if feature is available
    if (bulkAutoReplyValue.value === true && !isAutoReplyAvailable.value) {
        toast.add({
            severity: 'warn',
            summary: 'Funkcja niedostępna',
            detail: getAutoReplyLockReason.value,
            life: 5000
        });
        return;
    }
    
    const count = selectedTemplates.value.length;
    saving.value = true;
    try {
        for (const template of selectedTemplates.value) {
            await ReviewsService.saveTemplate({ ...template, auto_reply: bulkAutoReplyValue.value });
        }
        await loadTemplates();
        selectedTemplates.value = [];
        bulkAutoReplyDialogVisible.value = false;
        toast.add({ 
            severity: 'success', 
            summary: 'Sukces', 
            detail: `Zmieniono auto-odpowiedź dla ${count} szablon${count === 1 ? '' : count < 5 ? 'ów' : 'ów'}`, 
            life: 3000 
        });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zmienić auto-odpowiedzi', life: 3000 });
    } finally {
        saving.value = false;
    }
};

const applyBulkRating = async () => {
    if (!selectedTemplates.value || selectedTemplates.value.length === 0) return;
    
    const count = selectedTemplates.value.length;
    saving.value = true;
    try {
        for (const template of selectedTemplates.value) {
            await ReviewsService.saveTemplate({ ...template, rating: bulkRatingValue.value });
        }
        await loadTemplates();
        selectedTemplates.value = [];
        bulkRatingDialogVisible.value = false;
        toast.add({ 
            severity: 'success', 
            summary: 'Sukces', 
            detail: `Zmieniono ocenę dla ${count} szablonów`, 
            life: 3000 
        });
    } catch (e) {
        console.error(e);
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zmienić oceny', life: 3000 });
    } finally {
        saving.value = false;
    }
};

const confirmBulkDelete = () => {
    if (!selectedTemplates.value || selectedTemplates.value.length === 0) return;
    
    const count = selectedTemplates.value.length;
    confirm.require({
        message: `Czy na pewno chcesz usunąć ${count} szablon${count === 1 ? '' : count < 5 ? 'y' : 'ów'}? Tej operacji nie można cofnąć.`,
        header: 'Potwierdzenie usunięcia',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Anuluj',
        acceptLabel: 'Usuń',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: async () => {
            saving.value = true;
            try {
                for (const template of selectedTemplates.value) {
                    await ReviewsService.deleteTemplate(template.id);
                }
                await loadTemplates();
                selectedTemplates.value = [];
                toast.add({ 
                    severity: 'success', 
                    summary: 'Sukces', 
                    detail: `Usunięto ${count} szablon${count === 1 ? '' : count < 5 ? 'y' : 'ów'}`, 
                    life: 3000 
                });
            } catch (e) {
                console.error(e);
                toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć szablonów', life: 3000 });
            } finally {
                saving.value = false;
            }
        }
    });
};

onMounted(async () => {
    // Set Polish translations for filters
    primevue.config.locale.startsWith = 'Zaczyna się od';
    primevue.config.locale.contains = 'Zawiera';
    primevue.config.locale.notContains = 'Nie zawiera';
    primevue.config.locale.endsWith = 'Kończy się na';
    primevue.config.locale.equals = 'Równe';
    primevue.config.locale.notEquals = 'Nie równe';
    primevue.config.locale.noFilter = 'Brak filtra';
    primevue.config.locale.lt = 'Mniejsze niż';
    primevue.config.locale.lte = 'Mniejsze lub równe';
    primevue.config.locale.gt = 'Większe niż';
    primevue.config.locale.gte = 'Większe lub równe';
    primevue.config.locale.dateIs = 'Data to';
    primevue.config.locale.dateIsNot = 'Data to nie';
    primevue.config.locale.dateBefore = 'Data przed';
    primevue.config.locale.dateAfter = 'Data po';
    primevue.config.locale.clear = 'Wyczyść';
    primevue.config.locale.apply = 'Zastosuj';
    primevue.config.locale.matchAll = 'Pasuje do wszystkich';
    primevue.config.locale.matchAny = 'Pasuje do dowolnego';
    primevue.config.locale.addRule = 'Dodaj regułę';
    primevue.config.locale.removeRule = 'Usuń regułę';
    
    await loadTemplates();
    initFilters();
});
</script>

<style scoped>
/* Hide formatting toolbox in TinyEditor */
:deep(.-jte-toolbox) {
    display: none !important;
}

/* Style for TinyEditor in edit mode only (not in table or readonly) */
:deep(.-jte-editor[contenteditable="true"]),
:deep(.-jte-editor[contenteditable="plaintext-only"]) {
    min-height: 200px !important;
    padding: 1rem !important;
    border: 1px solid var(--p-input-border-color, #ced4da) !important;
    border-radius: var(--p-border-radius, 0.375rem) !important;
    margin-bottom: 0 !important;
}

/* Remove padding from TinyEditor root container */
:deep(.-jte-root),
:deep(#new-content),
:deep(.-jte-editable) {
    padding: 0 !important;
}

/* Style placeholder padding */
:deep(.juit-tiny-edit .-jte-root .-jte-placeholder) {
    padding: 1rem !important;
}

/* Remove margin-bottom from TinyEditor */
:deep(.-jte-editor[contenteditable="plaintext-only"]) {
    margin-bottom: 0 !important;
}

/* Style TinyEditor on focus (only in edit mode) */
:deep(.-jte-editor[contenteditable="true"]:focus),
:deep(.-jte-editor[contenteditable="plaintext-only"]:focus) {
    outline: none !important;
    border-color: var(--p-focus-ring-color, #3b82f6) !important;
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.2) !important;
}

/* Style placeholder to match editor height */
:deep(.-jte-editor[contenteditable="plaintext-only"]:empty::before),
:deep(.-jte-editor[contenteditable="true"]:empty::before) {
    min-height: 200px;
    display: flex;
    align-items: flex-start;
    padding-top: 0.5rem;
}

/* Style for readonly TinyEditor in display mode */
:deep(.p-inplace-display .-jte-editor),
:deep(.p-inplace-display .-jte-editor[contenteditable="false"]) {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    cursor: pointer !important;
    min-height: auto !important;
}

/* Style for TinyEditor in table (readonly mode) */
:deep(.p-datatable .-jte-editor),
:deep(.p-datatable .-jte-editor[contenteditable="false"]) {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    font-size: 0.875rem !important;
    line-height: 1.5rem !important;
    min-height: auto !important;
}
/* Remove padding from Inplace display elements */
:deep(.p-inplace-display) {
    padding: 0 !important;
}

/* Make Rating component wider in edit mode */
:deep(.p-inplace-content .p-rating) {
    min-width: 200px;
    flex: 1 1 auto;
}

/* Ensure Rating shows hover preview in edit mode */
:deep(.p-inplace-content .p-rating:not(.p-disabled) .p-rating-icon) {
    cursor: pointer;
    pointer-events: auto;
}

/* Style for auto-reply toggle - purple/magic theme */
:deep(.auto-reply-toggle) {
    transform: scale(0.85);
    transform-origin: left center;
}

:deep(.auto-reply-toggle .p-toggleswitch-slider) {
    background: #9ca3af !important; /* gray-400 for unchecked state */
    opacity: 0.5 !important;
}

:deep(.auto-reply-toggle .p-toggleswitch-slider:before) {
    background: #ffffff !important;
}

:deep(.auto-reply-toggle.p-toggleswitch-checked .p-toggleswitch-slider) {
    background: #9333ea !important; /* purple-600 */
    opacity: 1 !important;
}

:deep(.auto-reply-toggle.p-toggleswitch-checked .p-toggleswitch-slider:before) {
    background: #ffffff !important;
}

/* Make all toggles smaller */
:deep(.p-toggleswitch) {
    transform: scale(0.85);
    transform-origin: left center;
}

/* DataTable header styles */
:deep(.p-datatable-header) {
    background: #FFF !important;
    border: none !important;
    padding: 0 !important;
    padding-bottom: 0.5rem !important;
}
</style>
