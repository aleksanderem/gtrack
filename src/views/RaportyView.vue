<template>
  <div class="h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
    <div class="p-6 space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Raporty i Analiza</h1>
          <p class="text-sm text-gray-500 mt-1">Analiza widoczności, pozycji i porównanie z konkurencją</p>
        </div>
        <div class="flex items-center gap-3">
          <Select
            v-model="selectedDateRange"
            :options="dateRanges"
            optionLabel="label"
            placeholder="Zakres dat"
            class="w-44"
          />
          <Button
            v-if="can('raportyExport')"
            label="Eksportuj PDF"
            icon="pi pi-file-pdf"
            outlined
          />
          <Button
            v-else
            label="Eksportuj PDF"
            icon="pi pi-lock"
            outlined
            disabled
            v-tooltip="'Dostępne w planie Professional'"
          />
        </div>
      </div>

      <!-- Limit Warning -->
      <LimitWarningBanner
        v-if="gridLimitStatus.hasLimit && gridLimitStatus.percentage >= 75"
        :status="gridLimitStatus"
        @upgrade="navigateToSettings"
      />

      <!-- TabView for subpages -->
      <div class="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <TabView v-model:activeIndex="activeTab" :pt="tabViewPt">
          <!-- Tab 1: Pozycje / Rankingi -->
          <TabPanel header="Pozycje / Rankingi">
            <div class="p-6 space-y-6">
              <!-- Filters Toolbar -->
              <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div class="flex flex-wrap items-center gap-4">
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-600">Słowo kluczowe:</span>
                    <Select
                      v-model="selectedKeyword"
                      :options="keywords"
                      optionLabel="keyword"
                      placeholder="Wybierz frazę"
                      class="w-64"
                    />
                  </div>
                  <Divider layout="vertical" class="h-8 mx-2 hidden md:block" />
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-600">Rozmiar siatki:</span>
                    <SelectButton
                      v-model="gridSize"
                      :options="availableGridSizes"
                      optionLabel="label"
                      optionValue="value"
                      :allowEmpty="false"
                    />
                  </div>
                  <div class="ml-auto">
                    <Button icon="pi pi-refresh" severity="secondary" text rounded @click="refreshData" v-tooltip="'Odśwież dane'" />
                  </div>
                </div>
              </div>

              <!-- Stats Cards -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="stat in positionStats"
                  :key="stat.label"
                  class="relative overflow-hidden bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-300"
                >
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-5 rounded-bl-full"
                       :class="stat.gradient"></div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{{ stat.label }}</p>
                  <p class="text-3xl font-bold tracking-tight" :class="stat.colorClass">{{ stat.value }}</p>
                  <p v-if="stat.change !== undefined"
                     class="text-xs mt-2 flex items-center gap-1"
                     :class="stat.changePositive ? 'text-emerald-600' : 'text-red-500'">
                    <i :class="stat.changePositive ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-[10px]"></i>
                    {{ Math.abs(stat.change) }} vs poprzedni okres
                  </p>
                </div>
              </div>

              <!-- GeoGrid and Trend -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- GeoGrid Heatmap -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">GeoGrid - Mapa pozycji</h3>
                    <Tag :value="`${gridSize}×${gridSize}`" severity="secondary" />
                  </div>
                  <div class="p-5">
                    <div class="aspect-square bg-gray-50 rounded-xl p-4 relative">
                      <!-- Grid visualization -->
                      <div
                        class="grid gap-1.5 h-full"
                        :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }"
                      >
                        <div
                          v-for="(point, idx) in geoGridPoints"
                          :key="idx"
                          class="rounded-lg flex items-center justify-center text-xs font-bold text-white cursor-pointer
                                 hover:scale-105 hover:shadow-lg transition-all duration-200 relative group"
                          :class="getGridCellClass(point.rank)"
                          @click="selectGridPoint(point, idx)"
                        >
                          <span class="relative z-10">{{ point.rank <= 20 ? point.rank : '20+' }}</span>
                        </div>
                      </div>
                      <!-- Center marker -->
                      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full
                                  ring-4 ring-blue-600/20 pointer-events-none z-10"></div>
                    </div>
                    <!-- Legend -->
                    <div class="flex items-center justify-center gap-6 mt-5 text-xs">
                      <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded bg-emerald-500"></div>
                        <span class="text-gray-600">Top 3</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded bg-amber-500"></div>
                        <span class="text-gray-600">4-10</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded bg-orange-500"></div>
                        <span class="text-gray-600">11-20</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded bg-red-500"></div>
                        <span class="text-gray-600">20+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Trend Chart -->
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div class="px-5 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-gray-900">Trend pozycji w czasie</h3>
                    <p class="text-xs text-gray-500 mt-0.5">{{ selectedKeyword?.keyword || 'Wybierz słowo kluczowe' }}</p>
                  </div>
                  <div class="p-5">
                    <div class="h-64 flex items-end justify-between gap-2 px-4">
                      <div
                        v-for="(val, i) in trendData"
                        :key="i"
                        class="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                        :class="getTrendBarClass(val)"
                        :style="{ height: `${Math.max(10, (21 - val) * 4)}%` }"
                      >
                        <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600
                                    opacity-0 group-hover:opacity-100 transition-opacity">
                          #{{ val }}
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-between mt-4 text-xs text-gray-400 px-4">
                      <span>12 tyg. temu</span>
                      <span>Dziś</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rankings Table -->
              <Card class="border-0 shadow-sm">
                <template #title>
                  <div class="flex items-center justify-between">
                    <span>Ranking słów kluczowych</span>
                    <IconField>
                      <InputIcon class="pi pi-search" />
                      <InputText v-model="keywordSearch" placeholder="Szukaj..." class="w-56" />
                    </IconField>
                  </div>
                </template>
                <template #content>
                  <DataTable
                    :value="filteredKeywords"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[10, 25, 50]"
                    stripedRows
                    rowHover
                  >
                    <Column field="keyword" header="Słowo kluczowe" sortable>
                      <template #body="{ data }">
                        <div class="flex items-center gap-2">
                          <i class="pi pi-search text-gray-400 text-xs"></i>
                          <span class="font-medium text-gray-900">{{ data.keyword }}</span>
                        </div>
                      </template>
                    </Column>
                    <Column field="avgPosition" header="Śr. pozycja" sortable style="width: 120px">
                      <template #body="{ data }">
                        <Tag :severity="getPositionSeverity(data.avgPosition)" class="font-mono">
                          {{ data.avgPosition.toFixed(1) }}
                        </Tag>
                      </template>
                    </Column>
                    <Column field="bestPosition" header="Najlepsza" sortable style="width: 100px">
                      <template #body="{ data }">
                        <span class="text-emerald-600 font-semibold">{{ data.bestPosition }}</span>
                      </template>
                    </Column>
                    <Column field="worstPosition" header="Najgorsza" sortable style="width: 100px">
                      <template #body="{ data }">
                        <span class="text-red-500 font-medium">{{ data.worstPosition }}</span>
                      </template>
                    </Column>
                    <Column field="trend" header="Trend" sortable style="width: 100px">
                      <template #body="{ data }">
                        <div class="flex items-center gap-1">
                          <i :class="getTrendIcon(data.trend)" class="text-sm"></i>
                          <span :class="getTrendTextClass(data.trend)" class="font-medium">
                            {{ Math.abs(data.trend) }}
                          </span>
                        </div>
                      </template>
                    </Column>
                    <Column field="searchVolume" header="Wyszukiwań/mies." sortable style="width: 140px">
                      <template #body="{ data }">
                        <span class="text-gray-600 font-mono text-sm">{{ data.searchVolume.toLocaleString() }}</span>
                      </template>
                    </Column>
                    <template #empty>
                      <div class="text-center py-12">
                        <i class="pi pi-search text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-500">Brak słów kluczowych</p>
                      </div>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </div>
          </TabPanel>

          <!-- Tab 2: Konkurencja (Feature-gated) -->
          <TabPanel header="Konkurencja">
            <FeatureCard
              featureKey="raportyKonkurencja"
              featureDescription="Analiza konkurencji jest dostępna w planie Professional i wyższych."
              :cardPt="{ root: { class: 'border-0 shadow-none' }, body: { class: 'p-0' } }"
            >
              <template #content>
                <div class="p-6 space-y-6">
                  <!-- Benchmark Cards -->
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div
                      v-for="bench in benchmarks"
                      :key="bench.label"
                      class="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
                    >
                      <p class="text-xs text-gray-500 mb-2">{{ bench.label }}</p>
                      <div class="flex items-baseline justify-center gap-2">
                        <span class="text-2xl font-bold" :class="bench.yours >= bench.top3 ? 'text-emerald-600' : 'text-amber-500'">
                          {{ bench.yours }}
                        </span>
                        <span class="text-gray-400 text-sm">vs</span>
                        <span class="text-lg text-gray-600">{{ bench.top3 }}</span>
                      </div>
                      <p class="text-xs text-gray-400 mt-1">Ty vs Top 3</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Radar Chart -->
                    <div class="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 class="font-semibold text-gray-900 mb-4">Porównanie z konkurencją</h3>
                      <div class="h-64 flex items-center justify-center">
                        <div class="relative w-48 h-48">
                          <svg viewBox="0 0 200 200" class="w-full h-full">
                            <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                            <polygon points="100,40 160,70 160,130 100,160 40,130 40,70" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                            <polygon points="100,70 130,85 130,115 100,130 70,115 70,85" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                            <polygon points="100,30 155,65 145,135 100,155 55,130 50,60" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" stroke-width="2.5"/>
                            <polygon points="100,45 140,70 135,125 100,145 65,120 60,65" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="6,3"/>
                          </svg>
                          <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[10px] font-medium text-gray-500">Rating</div>
                          <div class="absolute top-[22%] right-0 translate-x-2 text-[10px] font-medium text-gray-500">Recenzje</div>
                          <div class="absolute bottom-[22%] right-0 translate-x-2 text-[10px] font-medium text-gray-500">Zdjęcia</div>
                          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[10px] font-medium text-gray-500">Posty</div>
                          <div class="absolute bottom-[22%] left-0 -translate-x-2 text-[10px] font-medium text-gray-500">Atrybuty</div>
                          <div class="absolute top-[22%] left-0 -translate-x-4 text-[10px] font-medium text-gray-500">Kategorie</div>
                        </div>
                      </div>
                      <div class="flex justify-center gap-6 text-xs mt-4">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span class="text-gray-600">Twoja wizytówka</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full border-2 border-orange-500 border-dashed"></div>
                          <span class="text-gray-600">Średnia konkurencji</span>
                        </div>
                      </div>
                    </div>

                    <!-- Competitors Table -->
                    <Card class="lg:col-span-2 border-0 shadow-sm">
                      <template #title>
                        <div class="flex items-center justify-between">
                          <span>Konkurenci</span>
                          <Select v-model="competitorKeyword" :options="keywords" optionLabel="keyword" placeholder="Wybierz frazę" class="w-48" />
                        </div>
                      </template>
                      <template #content>
                        <DataTable
                          :value="competitors"
                          :paginator="true"
                          :rows="5"
                          stripedRows
                          rowHover
                          @row-click="openCompetitorDrawer"
                          class="cursor-pointer"
                        >
                          <Column field="rank" header="#" style="width: 60px">
                            <template #body="{ data }">
                              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                   :class="data.rank <= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'">
                                {{ data.rank }}
                              </div>
                            </template>
                          </Column>
                          <Column field="name" header="Firma">
                            <template #body="{ data }">
                              <div>
                                <p class="font-medium text-gray-900">{{ data.name }}</p>
                                <p class="text-xs text-gray-500">{{ data.address }}</p>
                              </div>
                            </template>
                          </Column>
                          <Column field="rating" header="Ocena" sortable style="width: 100px">
                            <template #body="{ data }">
                              <div class="flex items-center gap-1">
                                <i class="pi pi-star-fill text-amber-400 text-sm"></i>
                                <span class="font-semibold">{{ data.rating }}</span>
                              </div>
                            </template>
                          </Column>
                          <Column field="reviewsCount" header="Recenzje" sortable style="width: 100px" />
                          <Column field="photosCount" header="Zdjęcia" sortable style="width: 80px" />
                          <Column header="" style="width: 50px">
                            <template #body>
                              <Button icon="pi pi-chevron-right" text rounded size="small" severity="secondary" />
                            </template>
                          </Column>
                        </DataTable>
                      </template>
                    </Card>
                  </div>
                </div>
              </template>
            </FeatureCard>
          </TabPanel>

          <!-- Tab 3: Audyt wizytówki -->
          <TabPanel header="Audyt wizytówki">
            <div class="p-6 space-y-6">
              <!-- Score and Sections -->
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Main Score Card -->
                <div class="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div class="relative inline-flex items-center justify-center mb-4">
                    <svg class="w-36 h-36 transform -rotate-90">
                      <circle cx="72" cy="72" r="64" stroke="#e5e7eb" stroke-width="10" fill="none"/>
                      <circle cx="72" cy="72" r="64" :stroke="getScoreColor(auditScore)" stroke-width="10" fill="none"
                              stroke-linecap="round" :stroke-dasharray="`${auditScore * 4.02} 402`" class="transition-all duration-1000"/>
                    </svg>
                    <div class="absolute flex flex-col items-center">
                      <span class="text-4xl font-bold" :class="getScoreTextColor(auditScore)">{{ auditScore }}</span>
                      <span class="text-xs text-gray-500">/ 100</span>
                    </div>
                  </div>
                  <p class="text-lg font-semibold" :class="getScoreTextColor(auditScore)">{{ getScoreLabel(auditScore) }}</p>
                  <p class="text-sm text-gray-500 mb-4">Wynik audytu</p>
                  <Button label="Uruchom ponownie" icon="pi pi-refresh" size="small" outlined class="w-full" />
                </div>

                <!-- Section Scores -->
                <Card class="lg:col-span-3 border-0 shadow-sm">
                  <template #title>Wyniki sekcji</template>
                  <template #content>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div v-for="section in auditSections" :key="section.name"
                           class="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                        <div class="flex items-center justify-between mb-3">
                          <span class="font-medium text-sm text-gray-700">{{ section.name }}</span>
                          <span class="text-sm font-bold px-2 py-0.5 rounded-full" :class="getSectionScoreClass(section.score)">
                            {{ section.score }}%
                          </span>
                        </div>
                        <ProgressBar :value="section.score" :showValue="false" class="h-2"
                                     :pt="{ value: { class: getSectionProgressClass(section.score) } }"/>
                        <p v-if="section.missing.length" class="text-xs text-red-500 mt-2 flex items-start gap-1">
                          <i class="pi pi-exclamation-circle mt-0.5"></i>
                          <span>{{ section.missing.join(', ') }}</span>
                        </p>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>

              <!-- Recommendations -->
              <Card class="border-0 shadow-sm">
                <template #title>
                  <div class="flex items-center justify-between">
                    <span>Rekomendacje</span>
                    <div class="flex gap-2">
                      <Tag severity="danger" class="font-medium">{{ highPriorityCount }} wysokie</Tag>
                      <Tag severity="warn" class="font-medium">{{ mediumPriorityCount }} średnie</Tag>
                      <Tag severity="secondary" class="font-medium">{{ lowPriorityCount }} niskie</Tag>
                    </div>
                  </div>
                </template>
                <template #content>
                  <DataTable :value="recommendations" stripedRows rowHover>
                    <Column field="priority" header="Priorytet" style="width: 110px" sortable>
                      <template #body="{ data }">
                        <Tag :severity="getPrioritySeverity(data.priority)" class="w-full justify-center">
                          {{ getPriorityLabel(data.priority) }}
                        </Tag>
                      </template>
                    </Column>
                    <Column field="description" header="Rekomendacja">
                      <template #body="{ data }">
                        <p class="text-gray-700">{{ data.description }}</p>
                      </template>
                    </Column>
                    <Column field="module" header="Moduł" style="width: 120px">
                      <template #body="{ data }">
                        <Tag severity="info" class="font-medium">{{ data.module }}</Tag>
                      </template>
                    </Column>
                    <Column field="uplift" header="Wpływ" style="width: 90px">
                      <template #body="{ data }">
                        <span class="text-emerald-600 font-bold">+{{ data.uplift }}%</span>
                      </template>
                    </Column>
                    <Column header="" style="width: 100px">
                      <template #body="{ data }">
                        <Button :label="getModuleAction(data.module)" size="small" text />
                      </template>
                    </Column>
                  </DataTable>
                </template>
              </Card>

              <!-- Audit History -->
              <Card class="border-0 shadow-sm">
                <template #title>Historia audytów</template>
                <template #content>
                  <DataTable :value="auditHistory" stripedRows rowHover>
                    <Column field="date" header="Data" sortable style="width: 140px" />
                    <Column field="score" header="Wynik" sortable style="width: 120px">
                      <template #body="{ data }">
                        <div class="flex items-center gap-2">
                          <span class="font-bold px-2 py-0.5 rounded-full text-sm" :class="getSectionScoreClass(data.score)">{{ data.score }}</span>
                          <span v-if="data.change" class="text-xs" :class="data.change > 0 ? 'text-emerald-600' : 'text-red-500'">
                            {{ data.change > 0 ? '+' : '' }}{{ data.change }}
                          </span>
                        </div>
                      </template>
                    </Column>
                    <Column field="completedTasks" header="Zrealizowane zadania" />
                    <Column header="" style="width: 60px">
                      <template #body>
                        <Button icon="pi pi-file-pdf" text rounded size="small" severity="secondary" v-tooltip="'Pobierz raport'" />
                      </template>
                    </Column>
                  </DataTable>
                </template>
              </Card>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <!-- Competitor Details Drawer -->
    <Drawer v-model:visible="competitorDrawerVisible" position="right" :style="{ width: '500px' }" header="Szczegóły konkurenta">
      <div v-if="selectedCompetitor" class="space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
            <i class="pi pi-building text-2xl text-gray-400"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-lg text-gray-900">{{ selectedCompetitor.name }}</h3>
            <p class="text-sm text-gray-500">{{ selectedCompetitor.address }}</p>
            <div class="flex items-center gap-3 mt-2">
              <div class="px-2 py-0.5 rounded-full text-xs font-bold"
                   :class="selectedCompetitor.rank <= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'">
                Pozycja #{{ selectedCompetitor.rank }}
              </div>
              <div class="flex items-center gap-1 text-sm">
                <i class="pi pi-star-fill text-amber-400"></i>
                <span class="font-semibold">{{ selectedCompetitor.rating }}</span>
                <span class="text-gray-400">({{ selectedCompetitor.reviewsCount }} opinii)</span>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div>
          <h4 class="font-medium text-gray-900 mb-3">Kategorie</h4>
          <div class="flex flex-wrap gap-2">
            <Tag v-for="cat in selectedCompetitor.categories" :key="cat" severity="secondary">{{ cat }}</Tag>
          </div>
        </div>

        <div>
          <h4 class="font-medium text-gray-900 mb-3">Godziny otwarcia</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div v-for="(hours, day) in selectedCompetitor.hours" :key="day" class="flex justify-between py-1 px-2 rounded bg-gray-50">
              <span class="text-gray-500 capitalize">{{ day }}:</span>
              <span class="font-medium">{{ hours }}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-medium text-gray-900 mb-3">Statystyki</h4>
          <div class="grid grid-cols-3 gap-3">
            <div class="text-center p-4 bg-blue-50 rounded-xl">
              <p class="text-2xl font-bold text-blue-600">{{ selectedCompetitor.photosCount }}</p>
              <p class="text-xs text-gray-500 mt-1">Zdjęcia</p>
            </div>
            <div class="text-center p-4 bg-emerald-50 rounded-xl">
              <p class="text-2xl font-bold text-emerald-600">{{ selectedCompetitor.postsCount }}</p>
              <p class="text-xs text-gray-500 mt-1">Posty</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
              <p class="text-2xl font-bold text-purple-600">{{ Object.keys(selectedCompetitor.attributes || {}).length }}</p>
              <p class="text-xs text-gray-500 mt-1">Atrybuty</p>
            </div>
          </div>
        </div>

        <div v-if="selectedCompetitor.attributes && Object.keys(selectedCompetitor.attributes).length">
          <h4 class="font-medium text-gray-900 mb-3">Atrybuty</h4>
          <div class="flex flex-wrap gap-2">
            <Tag v-for="(val, key) in selectedCompetitor.attributes" :key="key" severity="info" class="capitalize">
              <i class="pi pi-check mr-1 text-xs"></i>{{ formatAttribute(key) }}
            </Tag>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import ProgressBar from 'primevue/progressbar';
import Drawer from 'primevue/drawer';
import Divider from 'primevue/divider';
import FeatureCard from '../components/gtrack/reviews/FeatureCard.vue';
import LimitWarningBanner from '../components/gtrack/common/LimitWarningBanner.vue';
import { useFeatures } from '../composables/useFeatures';

const router = useRouter();
const route = useRoute();
const { can, getLimit, getLimitStatus } = useFeatures();

const activeTab = ref(0);

// Feature limits
const gridLimitStatus = computed(() => getLimitStatus('raportyPozycje', 'maxGridSize', gridSize.value * gridSize.value));

// TabView styling
const tabViewPt = {
  nav: { class: 'bg-gray-50 border-b border-gray-200 px-4' },
  inkbar: { class: 'bg-blue-500' }
};

// Date range options
const dateRanges = [
  { label: 'Ostatnie 7 dni', value: '7d' },
  { label: 'Ostatnie 30 dni', value: '30d' },
  { label: 'Ostatnie 3 mies.', value: '3m' },
  { label: 'Ostatnie 12 mies.', value: '12m' }
];
const selectedDateRange = ref(dateRanges[1]);

// Grid size based on plan limits
const maxGridPoints = computed(() => getLimit('raportyPozycje', 'maxGridSize') || 25);
const availableGridSizes = computed(() => {
  const sizes = [];
  if (maxGridPoints.value >= 25) sizes.push({ label: '5×5', value: 5 });
  if (maxGridPoints.value >= 49) sizes.push({ label: '7×7', value: 7 });
  if (maxGridPoints.value >= 81) sizes.push({ label: '9×9', value: 9 });
  return sizes.length ? sizes : [{ label: '5×5', value: 5 }];
});
const gridSize = ref(5);

// Keywords
const keywords = ref([
  { keyword: 'restauracja dublin', searchVolume: 2400 },
  { keyword: 'najlepsza restauracja dublin', searchVolume: 880 },
  { keyword: 'włoska restauracja dublin', searchVolume: 1200 },
  { keyword: 'pizza dublin', searchVolume: 3200 },
  { keyword: 'obiad dublin', searchVolume: 1800 }
]);
const selectedKeyword = ref(keywords.value[0]);
const keywordSearch = ref('');
const competitorKeyword = ref(keywords.value[0]);

// Position stats
const positionStats = computed(() => [
  { label: 'Średnia pozycja', value: '4.2', colorClass: 'text-emerald-600', change: 0.8, changePositive: true, gradient: 'from-emerald-400 to-emerald-600' },
  { label: 'Najlepsza pozycja', value: '1', colorClass: 'text-emerald-600', gradient: 'from-emerald-400 to-emerald-600' },
  { label: 'Widoczność Top 3', value: '62%', colorClass: 'text-blue-600', change: 5, changePositive: true, gradient: 'from-blue-400 to-blue-600' },
  { label: 'Monitorowane frazy', value: '12', colorClass: 'text-gray-800', gradient: 'from-gray-400 to-gray-600' }
]);

// GeoGrid points
const geoGridPoints = computed(() => {
  const points = [];
  const total = gridSize.value * gridSize.value;
  const center = Math.floor(gridSize.value / 2);
  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / gridSize.value);
    const col = i % gridSize.value;
    const distance = Math.abs(row - center) + Math.abs(col - center);
    const baseRank = distance <= 1 ? Math.floor(Math.random() * 3) + 1 :
                     distance <= 2 ? Math.floor(Math.random() * 7) + 3 :
                     Math.floor(Math.random() * 15) + 8;
    points.push({ rank: Math.min(baseRank, 25), row, col });
  }
  return points;
});

const trendData = ref([8, 7, 6, 5, 4, 3, 4, 3, 3, 2, 3, 4]);

const keywordRankings = ref([
  { keyword: 'restauracja dublin', avgPosition: 3.2, bestPosition: 1, worstPosition: 7, trend: -1.2, searchVolume: 2400 },
  { keyword: 'najlepsza restauracja dublin', avgPosition: 5.8, bestPosition: 2, worstPosition: 12, trend: -0.5, searchVolume: 880 },
  { keyword: 'włoska restauracja dublin', avgPosition: 2.1, bestPosition: 1, worstPosition: 4, trend: -0.3, searchVolume: 1200 },
  { keyword: 'pizza dublin', avgPosition: 8.4, bestPosition: 4, worstPosition: 15, trend: 1.2, searchVolume: 3200 },
  { keyword: 'obiad dublin', avgPosition: 6.2, bestPosition: 3, worstPosition: 11, trend: 0, searchVolume: 1800 },
  { keyword: 'jedzenie na wynos dublin', avgPosition: 4.5, bestPosition: 2, worstPosition: 8, trend: -0.8, searchVolume: 1500 },
  { keyword: 'lunch dublin centrum', avgPosition: 3.8, bestPosition: 1, worstPosition: 6, trend: -1.0, searchVolume: 950 },
  { keyword: 'kolacja dublin', avgPosition: 7.1, bestPosition: 3, worstPosition: 14, trend: 0.5, searchVolume: 1100 }
]);

const filteredKeywords = computed(() => {
  if (!keywordSearch.value) return keywordRankings.value;
  return keywordRankings.value.filter(k => k.keyword.toLowerCase().includes(keywordSearch.value.toLowerCase()));
});

const benchmarks = ref([
  { label: 'Rating', yours: 4.6, top3: 4.7 },
  { label: 'Recenzje', yours: 156, top3: 243 },
  { label: 'Zdjęcia', yours: 48, top3: 72 },
  { label: 'Posty/mies.', yours: 4, top3: 8 },
  { label: 'Atrybuty', yours: 12, top3: 15 }
]);

const competitors = ref([
  { rank: 1, name: 'The Italian Kitchen', address: 'ul. Main St 15, Dublin', rating: 4.8, reviewsCount: 312, photosCount: 89, postsCount: 12, categories: ['Restaurant', 'Italian', 'Pizza'], hours: { pon: '11-22', wt: '11-22', śr: '11-22', czw: '11-23', pt: '11-23', sob: '12-23', nd: '12-21' }, attributes: { wifi: true, outdoor_seating: true, delivery: true } },
  { rank: 2, name: 'Dublin City Center (Ty)', address: 'ul. Temple Bar 8, Dublin', rating: 4.6, reviewsCount: 156, photosCount: 48, postsCount: 4, categories: ['Restaurant', 'Bar'], hours: { pon: '10-22', wt: '10-22', śr: '10-22', czw: '10-22', pt: '10-23', sob: '11-23', nd: '11-21' }, attributes: { wifi: true } },
  { rank: 3, name: 'Bella Vista', address: 'ul. Grafton St 22, Dublin', rating: 4.7, reviewsCount: 267, photosCount: 76, postsCount: 8, categories: ['Restaurant', 'Italian'], hours: { pon: '12-22', wt: '12-22', śr: '12-22', czw: '12-22', pt: '12-23', sob: '12-23', nd: '13-21' }, attributes: { wifi: true, reservations: true } },
  { rank: 4, name: "O'Connell Bistro", address: "ul. O'Connell St 45, Dublin", rating: 4.5, reviewsCount: 198, photosCount: 54, postsCount: 6, categories: ['Bistro', 'Irish'], hours: { pon: '08-21', wt: '08-21', śr: '08-21', czw: '08-21', pt: '08-22', sob: '09-22', nd: '10-20' }, attributes: { breakfast: true, wifi: true } },
  { rank: 5, name: 'Green Garden Cafe', address: "ul. St Stephen's Green 3, Dublin", rating: 4.4, reviewsCount: 145, photosCount: 42, postsCount: 3, categories: ['Cafe', 'Restaurant'], hours: { pon: '07-18', wt: '07-18', śr: '07-18', czw: '07-18', pt: '07-19', sob: '08-19', nd: '09-17' }, attributes: { wifi: true, vegan_options: true } }
]);

const competitorDrawerVisible = ref(false);
const selectedCompetitor = ref(null);

const openCompetitorDrawer = (event) => {
  selectedCompetitor.value = event.data;
  competitorDrawerVisible.value = true;
};

const auditScore = ref(78);
const auditSections = ref([
  { name: 'Profil', score: 85, missing: ['Opis firmy'] },
  { name: 'Opinie', score: 72, missing: [] },
  { name: 'Media', score: 60, missing: ['Zdjęcie okładki', 'Zdjęcia wnętrza'] },
  { name: 'Posty', score: 45, missing: ['Regularne posty'] },
  { name: 'Kategorie', score: 90, missing: [] },
  { name: 'Atrybuty', score: 75, missing: ['Parking', 'Rezerwacje'] }
]);

const recommendations = ref([
  { description: 'Dodaj szczegółowy opis firmy z kluczowymi frazami', priority: 'High', module: 'Wizytówka', uplift: 8 },
  { description: 'Zbierz minimum 50 nowych recenzji', priority: 'High', module: 'Opinie', uplift: 12 },
  { description: 'Dodaj zdjęcie okładki i minimum 10 zdjęć wnętrza', priority: 'High', module: 'Media', uplift: 6 },
  { description: 'Publikuj minimum 4 posty miesięcznie', priority: 'Medium', module: 'Posty', uplift: 4 },
  { description: 'Uzupełnij brakujące atrybuty (parking, rezerwacje)', priority: 'Medium', module: 'Wizytówka', uplift: 3 },
  { description: 'Odpowiadaj na wszystkie recenzje w ciągu 24h', priority: 'Low', module: 'Opinie', uplift: 2 }
]);

const highPriorityCount = computed(() => recommendations.value.filter(r => r.priority === 'High').length);
const mediumPriorityCount = computed(() => recommendations.value.filter(r => r.priority === 'Medium').length);
const lowPriorityCount = computed(() => recommendations.value.filter(r => r.priority === 'Low').length);

const auditHistory = ref([
  { date: '27 lis 2025', score: 78, change: 5, completedTasks: '3 zadania' },
  { date: '20 lis 2025', score: 73, change: 8, completedTasks: '5 zadań' },
  { date: '13 lis 2025', score: 65, change: 0, completedTasks: '0 zadań' },
  { date: '6 lis 2025', score: 65, change: 3, completedTasks: '2 zadania' },
  { date: '30 paź 2025', score: 62, change: null, completedTasks: '0 zadań' }
]);

const refreshData = () => {};
const selectGridPoint = (point, idx) => { console.log('Selected:', point, idx); };
const navigateToSettings = () => {
  const locationId = route.params.locationId;
  router.push({ name: 'settings', params: { locationId } });
};

const getGridCellClass = (rank) => {
  if (rank <= 3) return 'bg-emerald-500 shadow-emerald-200/50 shadow-md';
  if (rank <= 10) return 'bg-amber-500 shadow-amber-200/50 shadow-md';
  if (rank <= 20) return 'bg-orange-500 shadow-orange-200/50 shadow-md';
  return 'bg-red-500 shadow-red-200/50 shadow-md';
};

const getTrendBarClass = (val) => {
  if (val <= 3) return 'bg-emerald-500';
  if (val <= 10) return 'bg-amber-500';
  return 'bg-orange-500';
};

const getPositionSeverity = (pos) => pos <= 3 ? 'success' : pos <= 10 ? 'warn' : 'danger';
const getTrendIcon = (trend) => trend < 0 ? 'pi pi-arrow-up text-emerald-500' : trend > 0 ? 'pi pi-arrow-down text-red-500' : 'pi pi-minus text-gray-400';
const getTrendTextClass = (trend) => trend < 0 ? 'text-emerald-600' : trend > 0 ? 'text-red-500' : 'text-gray-500';
const getScoreColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
const getScoreTextColor = (score) => score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
const getScoreLabel = (score) => score >= 80 ? 'Doskonały' : score >= 60 ? 'Dobry' : score >= 40 ? 'Wymaga poprawy' : 'Krytyczny';
const getSectionScoreClass = (score) => score >= 80 ? 'bg-emerald-100 text-emerald-700' : score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
const getSectionProgressClass = (score) => score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
const getPrioritySeverity = (priority) => ({ 'High': 'danger', 'Medium': 'warn', 'Low': 'secondary' })[priority];
const getPriorityLabel = (priority) => ({ 'High': 'Wysoki', 'Medium': 'Średni', 'Low': 'Niski' })[priority];
const getModuleAction = (module) => ({ 'Wizytówka': 'Edytuj', 'Opinie': 'Zarządzaj', 'Media': 'Dodaj', 'Posty': 'Utwórz' })[module] || 'Otwórz';
const formatAttribute = (key) => key.replace(/_/g, ' ');
</script>

<style scoped>
:deep(.p-tabview-panels) {
  padding: 0;
  background: transparent;
}

:deep(.p-tabview-nav) {
  background: transparent;
  border: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}
</style>
