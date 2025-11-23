<template>
  <div class="flex flex-col gap-4 font-sans">
    <!-- Top Navigation -->
    <Toolbar class="border-none bg-white p-2 shadow rounded-xl">
        <template #start>
            <div class="flex gap-2">
                <Button 
                    label="Generator Grafik" 
                    icon="pi pi-image" 
                    :severity="activeView === 'graphics' ? 'primary' : 'secondary'" 
                    :text="activeView !== 'graphics'"
                    class="!font-normal !text-[0.9rem]"
                    @click="activeView = 'graphics'" 
                />
                <Button 
                    label="Strona Oceny (Landing)" 
                    icon="pi pi-globe" 
                    :severity="activeView === 'landing' ? 'primary' : 'secondary'" 
                    :text="activeView !== 'landing'"
                    class="!font-normal !text-[0.9rem]"
                    @click="activeView = 'landing'" 
                />
            </div>
        </template>
    </Toolbar>

    <!-- GRAPHICS GENERATOR VIEW -->
    <div v-if="activeView === 'graphics'" class="flex flex-col gap-6">
        <Card class="shadow-sm border border-gray-100">
        <template #title>
            <div class="flex flex-col gap-1 mb-4">
                <span>Generator Materiałów</span>
                <span class="text-sm text-gray-500 font-normal">Twórz i personalizuj materiały marketingowe (plakaty, wizytówki) zachęcające klientów do wystawiania opinii.</span>
            </div>
        </template>
        <template #content>
            <div class="grid grid-cols-1 gap-8">
                <!-- LEFT COLUMN: PREVIEW -->
                <div class="col-span-12">
                    <div class="flex flex-col gap-4 sticky top-6">
                        <!-- Visual Preview Area -->
                        <div class="bg-gray-200 p-12 rounded-xl flex justify-center items-center relative pattern-grid min-h-[600px]">
                            
                            <!-- Loading Skeleton -->
                            <div v-if="loading" class="w-[350px] h-[495px] bg-white rounded-lg p-4 flex flex-col gap-4 shadow-xl">
                                <Skeleton height="100px" class="w-full" />
                                <div class="flex flex-col items-center gap-2 mt-4">
                                    <Skeleton width="70%" height="2rem" />
                                    <Skeleton width="40%" height="1.5rem" />
                                </div>
                                <div class="flex-1 flex items-center justify-center">
                                    <Skeleton size="12rem" />
                                </div>
                                <div class="flex justify-center gap-2 mt-auto">
                                    <Skeleton size="2rem" shape="circle" />
                                    <Skeleton size="2rem" shape="circle" />
                                    <Skeleton size="2rem" shape="circle" />
                                </div>
                            </div>

                            <!-- Actual Preview -->
                            <div v-else class="relative">
                                <!-- Top Dimension -->
                                <div class="absolute -top-8 left-0 w-full flex flex-col items-center">
                                    <span class="text-xs text-[#3b83f6] mb-1">{{ previewDimensions.width }}</span>
                                    <div class="w-full border-t border-[#3b83f6] border-dashed relative">
                                        <div class="absolute left-0 -top-1 w-px h-2 bg-[#3b83f6]"></div>
                                        <div class="absolute right-0 -top-1 w-px h-2 bg-[#3b83f6]"></div>
                                    </div>
                                </div>

                                <!-- Left Dimension -->
                                <div class="absolute right-full top-0 h-full flex flex-row justify-end items-center pr-4">
                                    <span class="text-xs text-[#3b83f6] -rotate-90 whitespace-nowrap origin-center transform rotate-180 mr-2">{{ previewDimensions.height }}</span>
                                    <div class="h-full border-l border-[#3b83f6] border-dashed relative">
                                        <div class="absolute -left-1 top-0 w-2 h-px bg-[#3b83f6]"></div>
                                        <div class="absolute -left-1 bottom-0 w-2 h-px bg-[#3b83f6]"></div>
                                    </div>
                                </div>

                                <!-- THE POSTER / CARD -->
                                <div 
                                    v-if="settings.style === 'card'"
                                    class="bg-white shadow-2xl relative flex flex-row transition-all duration-500 origin-center w-[350px] h-[200px] rounded-2xl"
                                >
                                    <div class="w-1/2 h-full flex flex-col items-center justify-center p-4 border-r border-gray-100 relative overflow-hidden">
                                        <!-- Google G Logo (SVG) -->
                                        <svg viewBox="0 0 24 24" class="w-20 h-20 mb-2 z-10">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        
                                        <div class="flex gap-1 mb-2">
                                            <i v-for="n in 5" :key="n" class="pi pi-star-fill text-yellow-400 text-sm drop-shadow-sm"></i>
                                        </div>
                                        
                                        <div class="text-sm font-bold text-gray-800 leading-tight">
                                            Review us on<br>
                                            <span class="text-blue-500">Google</span>
                                        </div>
                                    </div>
                                    
                                    <div class="w-1/2 h-full flex flex-col items-center justify-center p-4 bg-white">
                                        <div class="mb-2 text-xs text-gray-500 font-medium uppercase tracking-wide">Scan me!</div>
                                        <div class="border-2 border-gray-800 rounded-lg p-1 mb-2">
                                            <i class="pi pi-qrcode text-6xl transition-colors duration-300" :style="{ color: '#' + settings.qr_color }"></i>
                                        </div>
                                        <div class="text-[10px] text-gray-400 text-center leading-tight" v-if="settings.business_name">
                                            {{ settings.business_name }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Poster Style Layout -->
                                <div 
                                    v-else
                                    class="bg-white shadow-2xl relative flex flex-col items-center text-center transition-all duration-500 origin-center w-[350px] h-[495px]"
                                >
                                    <!-- Header Image -->
                                    <div class="w-full h-24 bg-gray-50 overflow-hidden relative flex-shrink-0">
                                        <img src="/google-reviews-header.png" class="w-full h-full object-cover" alt="Review Us" />
                                    </div>

                                    <div class="flex-1 flex flex-col items-center w-full px-4 pt-3 pb-4 relative">
                                        <!-- Business Name -->
                                        <div 
                                            v-if="!settings.logo_url && settings.business_name_visible" 
                                            class="absolute text-center w-full px-4"
                                            :style="{
                                                top: `${settings.business_name_top}%`,
                                                left: `${settings.business_name_left}%`,
                                                transform: `translate(-50%, -50%) scale(${settings.business_name_size})`
                                            }"
                                        >
                                            <h1 class="text-xl font-black text-gray-800 uppercase tracking-wide leading-tight">
                                                {{ settings.business_name || 'TWOJA FIRMA' }}
                                            </h1>
                                        </div>
                                        <div 
                                            v-if="settings.logo_url && settings.business_name_visible"
                                            class="absolute"
                                            :style="{
                                                top: `${settings.business_name_top}%`,
                                                left: `${settings.business_name_left}%`,
                                                transform: `translate(-50%, -50%) scale(${settings.business_name_size})`
                                            }"
                                        >
                                            <img :src="settings.logo_url" class="h-12 w-auto object-contain" />
                                        </div>

                                        <!-- QR Code Section (Central Focus) -->
                                        <div 
                                            v-if="settings.qr_visible"
                                            class="absolute group flex-shrink-0"
                                            :style="{
                                                top: `${settings.qr_top}%`,
                                                left: `${settings.qr_left}%`,
                                                transform: `translate(-50%, -50%) scale(${settings.qr_size})`
                                            }"
                                        >
                                            <div 
                                                v-if="settings.badge_visible"
                                                class="absolute -top-4 -right-4 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm transform rotate-12 z-10 border border-white transition-colors duration-300" 
                                                :style="{ 
                                                    backgroundColor: '#' + settings.badge_color,
                                                    top: `${-16 + settings.badge_top}px`,
                                                    right: `${-16 - settings.badge_left}px`,
                                                    transform: `rotate(12deg) scale(${settings.badge_size})`
                                                }"
                                            >
                                                {{ settings.badge_text }}
                                            </div>
                                            <div 
                                                class="bg-white p-2 transition-all duration-300 flex items-center justify-center" 
                                                :class="{'rounded-xl': settings.qr_dots_style === 'rounded', 'rounded-none': settings.qr_dots_style === 'square'}"
                                                :style="{
                                                    borderWidth: settings.qr_border_width + 'px',
                                                    borderColor: '#' + settings.qr_border_color,
                                                    borderStyle: 'solid'
                                                }"
                                            >
                                                <img :src="qrCode" alt="QR Code" class="w-full h-full object-contain block" />
                                            </div>
                                        </div>

                                        <!-- Call to Action -->
                                        <h2 
                                            v-if="settings.poster_headline_visible"
                                            class="absolute text-lg font-bold text-gray-800 mb-1 text-center whitespace-nowrap"
                                            :style="{
                                                top: `${settings.poster_headline_top}%`,
                                                left: `${settings.poster_headline_left}%`,
                                                transform: `translate(-50%, -50%) scale(${settings.poster_headline_size})`
                                            }"
                                        >
                                            {{ settings.poster_headline }}
                                        </h2>

                                        <!-- Stars -->
                                        <div 
                                            v-if="settings.stars_visible"
                                            class="absolute flex gap-1"
                                            :style="{
                                                top: `${settings.stars_top}%`,
                                                left: `${settings.stars_left}%`,
                                                transform: `translate(-50%, -50%) scale(${settings.stars_size})`
                                            }"
                                        >
                                            <i v-for="n in 5" :key="n" class="pi pi-star-fill text-yellow-400 text-xl drop-shadow-sm"></i>
                                        </div>

                                        <!-- Footer: Google Brand -->
                                        <div 
                                            v-if="settings.google_logo_visible"
                                            class="absolute flex items-center gap-2 opacity-90 whitespace-nowrap"
                                            :style="{
                                                top: `${settings.google_logo_top}%`,
                                                left: `${settings.google_logo_left}%`,
                                                transform: `translate(-50%, -50%) scale(${settings.google_logo_size})`
                                            }"
                                        >
                                            <span class="text-xs font-medium text-gray-500">{{ settings.footer_text }}</span>
                                            <svg viewBox="0 0 24 24" class="w-16 h-6">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                            </svg>
                                            <span class="font-product-sans font-medium text-gray-600 text-xl tracking-tight" style="font-family: 'Product Sans', sans-serif;">Google</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="flex justify-center">
                            <Button label="Pobierz" icon="pi pi-download" @click="toggleDownload" :disabled="loading" class="!text-[0.9rem]" />
                            <Popover ref="op">
                                <div class="flex flex-col gap-2 w-48">
                                    <Button label="PDF (A4)" icon="pi pi-file-pdf" severity="secondary" text @click="downloadAndClose('pdf', 'a4')" class="w-full popover-btn !text-[0.9rem]" />
                                    <Button label="PDF (Wizytówka)" icon="pi pi-id-card" severity="secondary" text @click="downloadAndClose('pdf', 'card')" class="w-full popover-btn !text-[0.9rem]" />
                                    <Button label="PNG" icon="pi pi-image" severity="secondary" text @click="downloadAndClose('png', 'high-res')" class="w-full popover-btn !text-[0.9rem]" />
                                </div>
                            </Popover>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: SETTINGS -->
                <div class="col-span-1 md:col-span-2">
                    <div v-if="loading" class="flex flex-col gap-4">
                        <Skeleton height="3rem" class="mb-2" />
                        <Skeleton height="3rem" class="mb-2" />
                        <Skeleton height="3rem" class="mb-2" />
                        <Skeleton height="3rem" class="mb-2" />
                    </div>
                    <div v-else class="flex flex-col gap-6 h-full font-sans">
                        <Accordion value="0" class="font-sans">
                            <!-- General Section -->
                            <AccordionPanel value="0">
                                <AccordionHeader class="font-sans">Ogólne</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-4 font-sans">
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-semibold text-gray-700">Format & Styl</label>
                                            <SelectButton v-model="settings.style" :options="styleOptions" optionLabel="label" optionValue="value" class="w-full" :pt="{ button: { class: 'flex-1 text-[0.8rem] py-1' } }" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-semibold text-gray-700">Kolor wiodący</label>
                                            <div class="flex items-center gap-2">
                                                <ColorPicker v-model="settings.theme_color" />
                                                <span class="text-sm text-gray-500">#{{ settings.theme_color }}</span>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-semibold text-gray-700">Logo Firmy</label>
                                            <FileUpload 
                                                mode="basic" 
                                                name="logo" 
                                                url="/api/upload" 
                                                accept="image/*" 
                                                :maxFileSize="1000000" 
                                                @upload="onUpload" 
                                                auto
                                                chooseLabel="Wybierz plik"
                                                class="p-button-sm p-button-outlined w-full"
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>

                            <!-- Business Name Section -->
                            <AccordionPanel value="1">
                                <AccordionHeader class="font-sans">Nazwa Firmy</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-4 font-sans">
                                        <div class="flex items-center justify-between">
                                            <label class="text-sm font-semibold text-gray-700">Pokaż nazwę</label>
                                            <ToggleSwitch v-model="settings.business_name_visible" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm text-gray-600">Treść</label>
                                            <InputText v-model="settings.business_name" placeholder="np. Salon Fryzjerski" />
                                        </div>
                                        
                                        <PositionControls :settings="settings" prefix="business_name" />
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>

                            <!-- Headline Section -->
                            <AccordionPanel value="2">
                                <AccordionHeader class="font-sans">Nagłówek (Wezwanie)</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-4 font-sans">
                                        <div class="flex items-center justify-between">
                                            <label class="text-sm font-semibold text-gray-700">Pokaż nagłówek</label>
                                            <ToggleSwitch v-model="settings.poster_headline_visible" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm text-gray-600">Treść</label>
                                            <InputText v-model="settings.poster_headline" placeholder="np. Oceń nas!" />
                                        </div>
                                        
                                        <PositionControls :settings="settings" prefix="poster_headline" />
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>

                            <!-- QR Code Section -->
                            <AccordionPanel value="3">
                                <AccordionHeader class="font-sans">Kod QR</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-4 font-sans">
                                        <div class="flex items-center justify-between">
                                            <label class="text-sm font-semibold text-gray-700">Pokaż QR</label>
                                            <ToggleSwitch v-model="settings.qr_visible" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm text-gray-600">Styl Narożników</label>
                                            <SelectButton v-model="settings.qr_dots_style" :options="[{label: 'Kwadrat', value: 'square'}, {label: 'Okrąg', value: 'rounded'}]" optionLabel="label" optionValue="value" class="w-full" :pt="{ button: { class: 'flex-1 text-[0.8rem] py-1' } }" />
                                        </div>
                                        
                                        <div class="grid grid-cols-2 gap-4 mx-0">
                                            <div class="flex flex-col gap-2">
                                                <label class="text-sm text-gray-600">Kolor QR</label>
                                                <div class="flex items-center gap-2">
                                                    <ColorPicker v-model="settings.qr_color" />
                                                    <span class="text-sm text-gray-500">#{{ settings.qr_color }}</span>
                                                </div>
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <label class="text-sm text-gray-600">Kolor Ramki</label>
                                                <div class="flex items-center gap-2">
                                                    <ColorPicker v-model="settings.qr_border_color" />
                                                    <span class="text-sm text-gray-500">#{{ settings.qr_border_color }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="border-t pt-2 mt-2">
                                            <PositionControls 
                                                :settings="settings" 
                                                prefix="qr" 
                                                :config="{
                                                    top: { min: 0, max: 100, suffix: '%' },
                                                    left: { min: 0, max: 100, suffix: '%' },
                                                    size: { min: 0.5, max: 3, step: 0.1, suffix: 'x' },
                                                    border: { min: 0, max: 20, suffix: 'px' }
                                                }"
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>

                            <!-- Badge Section -->
                            <AccordionPanel value="4">
                                <AccordionHeader class="font-sans">Badge (Skanuj)</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-4 font-sans">
                                        <div class="flex items-center justify-between">
                                            <label class="text-sm font-semibold text-gray-700">Pokaż Badge</label>
                                            <ToggleSwitch v-model="settings.badge_visible" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm text-gray-600">Tekst</label>
                                            <InputText v-model="settings.badge_text" placeholder="SKANUJ" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm text-gray-600">Kolor tła</label>
                                            <div class="flex items-center gap-2">
                                                <ColorPicker v-model="settings.badge_color" />
                                                <span class="text-sm text-gray-500">#{{ settings.badge_color }}</span>
                                            </div>
                                        </div>
                                        
                                        <PositionControls 
                                            :settings="settings" 
                                            prefix="badge" 
                                            :config="{
                                                top: { min: -50, max: 50, suffix: 'px' },
                                                left: { min: -50, max: 150, suffix: 'px' },
                                                size: { min: 0.5, max: 3, step: 0.1, suffix: 'x' }
                                            }"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>
                            
                            <!-- Stars Section -->
                            <AccordionPanel value="5">
                                <AccordionHeader class="font-sans">Gwiazdki</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-4 font-sans">
                                        <div class="flex items-center justify-between">
                                            <label class="text-sm font-semibold text-gray-700">Pokaż gwiazdki</label>
                                            <ToggleSwitch v-model="settings.stars_visible" />
                                        </div>
                                        
                                        <PositionControls :settings="settings" prefix="stars" />
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>

                             <!-- Footer/Logo Google Section -->
                            <AccordionPanel value="6">
                                <AccordionHeader class="font-sans">Logo Google (Stopka)</AccordionHeader>
                                <AccordionContent>
                                    <div class="flex flex-col gap-4 font-sans">
                                        <div class="flex items-center justify-between">
                                            <label class="text-sm font-semibold text-gray-700">Pokaż stopkę</label>
                                            <ToggleSwitch v-model="settings.google_logo_visible" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm text-gray-600">Tekst</label>
                                            <InputText v-model="settings.footer_text" placeholder="Oceń nas w" />
                                        </div>
                                        
                                        <PositionControls :settings="settings" prefix="google_logo" />
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>

                        </Accordion>
                    </div>
                </div>
            </div>
        </template>
        </Card>
    </div>

    <!-- LANDING PAGE VIEW -->
    <div v-else class="flex flex-col gap-6">
        <!-- Flow Visualization -->
        <Card class="shadow-sm border border-gray-100">
            <template #title>
                <div class="flex flex-col gap-1 mb-4">
                    <span>Jak działa ochrona reputacji?</span>
                    <span class="text-sm text-gray-500 font-normal">Prosty i skuteczny proces filtracji opinii.</span>
                </div>
            </template>
            <template #content>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <!-- Step 1 -->
                    <Panel class="h-full">
                        <template #header>
                            <div class="flex items-center gap-3">
                                <div class="bg-blue-500 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-sm" style="width: 40px; height: 40px; min-width: 40px;">
                                    <i class="pi pi-qrcode text-xl"></i>
                                </div>
                                <span class="font-bold text-surface-700">Zeskanowanie QR</span>
                            </div>
                        </template>
                        <p class="m-0 text-sm text-surface-600 leading-relaxed">
                            Klient skanuje Twój unikalny kod QR umieszczony na materiałach reklamowych w lokalu (plakat, wizytówka).
                        </p>
                    </Panel>

                    <!-- Step 2 -->
                    <Panel class="h-full">
                        <template #header>
                            <div class="flex items-center gap-3">
                                <div class="bg-purple-500 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-sm" style="width: 40px; height: 40px; min-width: 40px;">
                                    <i class="pi pi-filter text-xl"></i>
                                </div>
                                <span class="font-bold text-surface-700">Inteligentna Bramka</span>
                            </div>
                        </template>
                        <p class="m-0 text-sm text-surface-600 leading-relaxed mb-3">
                            System prosi klienta o ocenę usługi (gwiazdki). Ty ustalasz bezpieczny próg (np. 4 gwiazdki).
                        </p>
                        <div class="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded inline-block font-medium border border-purple-100">
                            Twój próg: ≥ {{ settings.min_rating_for_google }}
                        </div>
                    </Panel>

                    <!-- Step 3 -->
                    <Panel class="h-full">
                        <template #header>
                            <div class="flex items-center gap-3">
                                <div class="bg-green-500 text-white rounded-full flex-shrink-0 flex items-center justify-center shadow-sm" style="width: 40px; height: 40px; min-width: 40px;">
                                    <i class="pi pi-verified text-xl"></i>
                                </div>
                                <span class="font-bold text-surface-700">Rezultat</span>
                            </div>
                        </template>
                        <div class="flex flex-col gap-3">
                            <div class="flex items-start gap-2">
                                <i class="pi pi-check-circle text-green-500 mt-1"></i>
                                <span class="text-sm text-surface-600">Ocena wysoka trafia do <strong>Google Maps</strong> (Buduje ranking).</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <i class="pi pi-shield text-gray-400 mt-1"></i>
                                <span class="text-sm text-surface-600">Ocena niska trafia <strong>tylko do Ciebie</strong> (Ochrona wizerunku).</span>
                            </div>
                        </div>
                    </Panel>
                </div>
            </template>
        </Card>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- LEFT: Live Preview -->
            <Card class="shadow-sm border border-gray-100 h-full">
                <template #title>Podgląd na żywo</template>
                <template #content>
                    <div class="bg-gray-100 rounded-xl p-4 h-[600px] overflow-hidden flex justify-center items-center border border-gray-200">
                        <div class="w-[375px] h-full bg-white rounded-2xl shadow-2xl overflow-y-auto custom-scrollbar transform scale-90 origin-center">
                            <PublicFeedbackView :preview-mode="true" :preview-settings="settings" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- RIGHT: Settings -->
            <Card class="shadow-sm border border-gray-100 h-full">
                <template #title>
                    <div class="flex flex-col gap-1 mb-4">
                        <span>Konfiguracja Strony Oceny (Landing Page)</span>
                        <span class="text-sm text-gray-500 font-normal">Dostosuj wygląd i zachowanie strony, na którą trafią klienci po zeskanowaniu kodu QR.</span>
                    </div>
                </template>
                <template #content>
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col gap-2">
                            <label class="font-semibold">Nagłówek strony www</label>
                            <InputText v-model="settings.headline" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between">
                                <label class="font-semibold">Próg przekierowania do Google</label>
                                <span class="font-bold text-blue-600">{{ settings.min_rating_for_google }} gwiazdki</span>
                            </div>
                            <Slider v-model="settings.min_rating_for_google" :min="1" :max="5" :step="1" />
                            <small class="text-gray-500">
                                Jeśli klient oceni na <strong>{{ settings.min_rating_for_google }}</strong> lub więcej, zostanie przekierowany do Google.
                                Poniżej tej oceny, wyświetlimy wewnętrzny formularz.
                            </small>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="font-semibold">Styl</label>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-sm text-gray-600 mb-1 block">Kolor wiodący</label>
                                    <div class="flex items-center gap-2">
                                        <ColorPicker v-model="settings.theme_color" />
                                        <span class="text-sm">#{{ settings.theme_color }}</span>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-sm text-gray-600 mb-1 block">Logo</label>
                                    <Button label="Wybierz" icon="pi pi-upload" size="small" outlined />
                                </div>
                            </div>
                        </div>

                        <div class="border-t pt-4 mt-2">
                            <label class="font-semibold block mb-3">Pola formularza negatywnego</label>
                            <DataTable :value="settings.form_fields || []" size="small" class="text-sm">
                                <Column field="label" header="Pole"></Column>
                                <Column header="Widoczne">
                                    <template #body="slotProps">
                                        <ToggleSwitch v-model="slotProps.data.visible" />
                                    </template>
                                </Column>
                                <Column header="Wymagane">
                                    <template #body="slotProps">
                                        <Checkbox v-model="slotProps.data.required" :binary="true" :disabled="!slotProps.data.visible" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                        
                        <div class="flex justify-end mt-4">
                            <Button label="Zapisz ustawienia" icon="pi pi-save" @click="saveSettings" :loading="saving" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ColorPicker from 'primevue/colorpicker';
import FileUpload from 'primevue/fileupload';
import Slider from 'primevue/slider';
import SelectButton from 'primevue/selectbutton';
import ToggleSwitch from 'primevue/toggleswitch';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Skeleton from 'primevue/skeleton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import { useToast } from 'primevue/usetoast';
import Popover from 'primevue/popover';
import Panel from 'primevue/panel';
import Toolbar from 'primevue/toolbar';
import { ReviewsService } from '../../../services/ReviewsService';
import PositionControls from './PositionControls.vue';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import PublicFeedbackView from '../../../views/PublicFeedbackView.vue';

const settings = ref({
  headline: 'Daj znać jak nam poszło',
  min_rating_for_google: 4,
  theme_color: '3B82F6',
  logo_url: null,
  style: 'poster',
  business_name: 'Kolabo group sp z o.o.',
  business_name_visible: true,
  business_name_top: 11,
  business_name_left: 50,
  business_name_size: 1,
  poster_headline: 'Oceń nas!',
  poster_headline_visible: true,
  poster_headline_top: 21,
  poster_headline_left: 50,
  poster_headline_size: 1,
  qr_color: '4179E0',
  qr_dots_style: 'rounded',
  qr_top: 49,
  qr_left: 50,
  qr_size: 1,
  qr_visible: true,
  qr_border_width: 3,
  qr_border_color: '111827',
  badge_text: 'SKANUJ',
  badge_color: 'EF4444',
  badge_visible: true,
  badge_top: 4,
  badge_left: 27,
  badge_size: 1.3,
  stars_visible: true,
  stars_top: 82,
  stars_left: 50,
  stars_size: 1,
  google_logo_visible: true,
  google_logo_top: 93,
  google_logo_left: 50,
  google_logo_size: 0.8,
  footer_text: 'Oceń nas w',
  form_fields: []
});

const activeView = ref('graphics');
const viewOptions = [
    { label: 'Generator Grafik', value: 'graphics' },
    { label: 'Strona Oceny (Landing)', value: 'landing' }
];

const styleOptions = [
    { label: 'Plakat (A4)', value: 'poster' },
    { label: 'Wizytówka', value: 'card' }
];

const saving = ref(false);
const loading = ref(true);
const toast = useToast();
const op = ref();

const toggleDownload = (event) => {
    op.value.toggle(event);
};

const downloadAndClose = (type, format) => {
    downloadFile(type, format);
    op.value.hide();
};

// QR Code Generation
const qrContent = computed(() => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/feedback/demo-123`;
    }
    return 'https://gtrack.com/review/demo-123';
});
const qrOptions = computed(() => ({
  errorCorrectionLevel: 'H',
  margin: 0,
  width: 200,
  color: {
    dark: '#' + settings.value.qr_color,
    light: '#00000000', 
  },
}));
const qrCode = useQRCode(qrContent, qrOptions);

const previewDimensions = computed(() => {
    if (settings.value.style === 'poster') {
        return { width: '210 mm', height: '297 mm' };
    }
    return { width: '90 mm', height: '50 mm' };
});

onMounted(async () => {
    loading.value = true;
    try {
        const s = await ReviewsService.getAcquisitionSettings();
        
        // Merge defaults
        settings.value = { 
            ...settings.value, 
            ...s,
            poster_headline: s.poster_headline || 'Oceń nas!',
            business_name: s.business_name || '',
            footer_text: s.footer_text || 'Oceń nas w',
            qr_border_width: s.qr_border_width !== undefined ? s.qr_border_width : 4,
            qr_border_color: s.qr_border_color || '111827',
            form_fields: s.form_fields || []
        };
        
        // Normalize colors (remove # if present)
        ['theme_color', 'qr_color', 'badge_color', 'qr_border_color'].forEach(k => {
            if (settings.value[k] && settings.value[k].startsWith('#')) {
                settings.value[k] = settings.value[k].substring(1);
            }
        });

    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
});

const saveSettings = async () => {
    saving.value = true;
    try {
        await ReviewsService.saveAcquisitionSettings(settings.value);
        toast.add({ severity: 'success', summary: 'Zapisano', detail: 'Ustawienia zaktualizowane', life: 3000 });
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać ustawień', life: 3000 });
    } finally {
        saving.value = false;
    }
};

const onUpload = (event) => {
    // Mock upload
    toast.add({ severity: 'info', summary: 'Info', detail: 'Funkcja uploadu wymaga backendu', life: 3000 });
};

const downloadFile = (type, format) => {
    let dimensions = '';
    if (format === 'a4') dimensions = '210mm x 297mm';
    else if (format === 'card') dimensions = '54mm x 94mm';
    else dimensions = 'High Res';

    console.log(`Downloading ${type.toUpperCase()} in ${format} format. Dimensions: ${dimensions}`);
    toast.add({ 
        severity: 'success', 
        summary: 'Pobieranie', 
        detail: `Generowanie pliku ${type.toUpperCase()} (${format})...`, 
        life: 4000 
    });
};

</script>

<style scoped>
.pattern-grid {
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 20px 20px;
}
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 20px;
}
:deep(.p-accordionheader) {
    font-size: 0.9rem !important;
    font-weight: normal !important;
}
:deep(.p-togglebutton) {
    font-size: 0.8rem !important;
}
:deep(.popover-btn) {
    justify-content: flex-start !important;
    justify-items: flex-start !important;
    text-align: left !important;
    padding-left: 1rem !important;
}
</style>
