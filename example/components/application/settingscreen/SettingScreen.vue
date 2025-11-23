<template>
    <div>
        <div class="block-category-title">Setting</div>
        <BlockViewer header="Settings" :code="block1">
            <div class="min-h-screen flex relative lg:static surface-ground">
                <div id="app-sidebar" class="h-full lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border w-full md:w-auto">
                    <div class="flex h-full">
                        <div class="flex flex-column h-full bg-indigo-500 flex-shrink-0 select-none">
                            <div class="flex align-items-center justify-content-center flex-shrink-0 bg-indigo-600" style="height: 60px">
                                <img src="/images/blocks/logos/hyper-light.svg" alt="Image" height="30" />
                            </div>
                            <div class="overflow-y-auto mt-3">
                                <ul class="list-none py-3 px-2 m-0">
                                    <li class="mb-2">
                                        <a
                                            class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors"
                                            @click="activeTab = 0"
                                            :class="{ 'bg-indigo-700': activeTab === 0 }"
                                        >
                                            <i class="pi pi-home text-lg"></i>
                                        </a>
                                    </li>
                                    <li class="mb-2">
                                        <a
                                            class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors"
                                            @click="activeTab = 1"
                                            :class="{ 'bg-indigo-700': activeTab === 1 }"
                                        >
                                            <i class="pi pi-bookmark text-lg"></i>
                                        </a>
                                    </li>
                                    <li class="mb-2">
                                        <a
                                            class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors"
                                            @click="activeTab = 2"
                                            :class="{ 'bg-indigo-700': activeTab === 2 }"
                                        >
                                            <i class="pi pi-users text-lg"></i>
                                        </a>
                                    </li>
                                    <li class="mb-2">
                                        <a
                                            class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors"
                                            @click="activeTab = 3"
                                            :class="{ 'bg-indigo-700': activeTab === 3 }"
                                        >
                                            <i class="pi pi-comments text-lg"></i>
                                        </a>
                                    </li>
                                    <li class="mb-2">
                                        <a
                                            class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors"
                                            @click="activeTab = 4"
                                            :class="{ 'bg-indigo-700': activeTab === 4 }"
                                        >
                                            <i class="pi pi-calendar text-lg"></i>
                                        </a>
                                    </li>
                                    <li class="mb-2">
                                        <a
                                            class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors"
                                            @click="activeTab = 5"
                                            :class="{ 'bg-indigo-700': activeTab === 5 }"
                                        >
                                            <i class="pi pi-cog text-lg"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="mt-auto">
                                <hr class="mb-3 mx-3 border-top-1 border-bottom-none border-indigo-300" />
                                <a class="m-3 flex align-items-center cursor-pointer py-1 px-0 justify-content-center hover:bg-indigo-400 border-round text-300 hover:text-0 transition-duration-150 transition-colors">
                                    <img src="/images/blocks/avatars/circle/avatar-f-1.png" style="width: 24px; height: 24px" />
                                </a>
                            </div>
                        </div>
                        <div class="flex flex-column surface-0 p-4 overflow-y-auto flex-shrink-0 flex-grow-1 md:flex-grow-0" style="width: 250px">
                            <div class="justify-content-end mb-3 flex lg:hidden">
                                <Button
                                    icon="pi pi-times"
                                    class="p-button-rounded p-button-text p-button-plain"
                                    v-styleclass="{
                                        selector: '#app-sidebar',
                                        leaveToClass: 'hidden',
                                        leaveActiveClass: 'fadeoutleft'
                                    }"
                                ></Button>
                            </div>
                            <div class="surface-0 flex-auto">
                                <div :class="{ hidden: activeTab !== 0 }">
                                    <div class="w-full lg:w-auto select-none">
                                        <ul class="list-none py-2 px-0 m-0">
                                            <li>
                                                <div class="p-3 text-500 font-medium">HOME</div>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-home mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Dashboard</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-bookmark mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Bookmarks</span>
                                                    <span class="inline-flex align-items-center justify-content-center ml-auto bg-blue-100 text-blue-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">3</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-users mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Team</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-comments mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Messages</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-calendar mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Calendar</span>
                                                    <span class="inline-flex align-items-center justify-content-center ml-auto bg-purple-100 text-purple-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">2</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-user mr-2 text-blue-500"></i>
                                                    <span class="font-medium text-blue-500 font-bold">Profile</span>
                                                </a>
                                            </li>
                                        </ul>
                                        <ul class="list-none py-2 px-0 m-0 border-top-1 surface-border">
                                            <li>
                                                <div class="p-3 text-500 font-medium">ORGANIZATION</div>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-home mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Overview</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-bookmark mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Security</span>
                                                    <span class="inline-flex align-items-center justify-content-center ml-auto bg-cyan-100 text-cyan-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">3</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-users mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Domains</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                                    <i class="pi pi-calendar mr-2 text-700"></i>
                                                    <span class="font-medium text-700">Reports</span>
                                                    <span class="inline-flex align-items-center justify-content-center ml-auto bg-orange-100 text-orange-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">2</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="p-3 font-medium text-xl text-900" :class="{ hidden: activeTab !== 1 }">Bookmarks</div>
                                <div class="p-3 font-medium text-xl text-900" :class="{ hidden: activeTab !== 2 }">Team</div>
                                <div class="p-3 font-medium text-xl text-900" :class="{ hidden: activeTab !== 3 }">Messages</div>
                                <div class="p-3 font-medium text-xl text-900" :class="{ hidden: activeTab !== 4 }">Calendar</div>
                                <div class="p-3 font-medium text-xl text-900" :class="{ hidden: activeTab !== 5 }">Settings</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="min-h-screen flex flex-column relative flex-auto">
                    <div class="flex justify-content-between align-items-center px-5 surface-section border-bottom-1 surface-border relative lg:static" style="height: 60px">
                        <div class="flex align-items-center">
                            <a
                                class="cursor-pointer block lg:hidden text-700 mr-3 mt-1"
                                v-styleclass="{
                                    selector: '#app-sidebar',
                                    enterClass: 'hidden',
                                    enterActiveClass: 'fadeinleft',
                                    leaveToClass: 'hidden',
                                    leaveActiveClass: 'fadeoutleft'
                                }"
                            >
                                <i class="pi pi-bars text-4xl"></i>
                            </a>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <InputText type="search" class="border-none" placeholder="Search" />
                            </span>
                        </div>
                        <a
                            class="cursor-pointer block lg:hidden text-700"
                            v-styleclass="{
                                selector: '@next',
                                enterClass: 'hidden',
                                enterActiveClass: 'fadein',
                                leaveToClass: 'hidden',
                                leaveActiveClass: 'fadeout',
                                hideOnOutsideClick: true
                            }"
                        >
                            <i class="pi pi-ellipsis-v text-2xl"></i>
                        </a>
                        <ul class="list-none p-0 m-0 hidden lg:flex lg:align-items-center select-none lg:flex-row surface-section border-1 lg:border-none surface-border right-0 top-100 z-1 shadow-2 lg:shadow-none absolute lg:static">
                            <li>
                                <a class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors">
                                    <i class="pi pi-inbox text-base lg:text-2xl mr-2 lg:mr-0"></i>
                                    <span class="block lg:hidden font-medium">Inbox</span>
                                </a>
                            </li>
                            <li>
                                <a class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors">
                                    <i class="pi pi-bell text-base lg:text-2xl mr-2 lg:mr-0" v-badge.danger></i>
                                    <span class="block lg:hidden font-medium">Notifications</span>
                                </a>
                            </li>
                            <li class="border-top-1 surface-border lg:border-top-none">
                                <a class="flex p-3 lg:px-3 lg:py-2 align-items-center hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors">
                                    <img src="/images/blocks/avatars/circle/avatar-f-1.png" class="mr-3 lg:mr-0" style="width: 32px; height: 32px" />
                                    <div class="block lg:hidden">
                                        <div class="text-900 font-medium">Josephine Lillard</div>
                                        <span class="text-600 font-medium text-sm">Marketing Specialist</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="p-5 flex flex-column flex-auto">
                        <div>
                            <div class="text-900 font-medium text-xl mb-3">Profile</div>
                            <p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">Odio euismod lacinia at quis risus sed vulputate odio. Non nisi est sit amet. Egestas integer eget aliquet nibh praesent tristique magna.</p>
                            <div class="surface-card p-4 shadow-2 border-round">
                                <div class="grid formgrid p-fluid">
                                    <div class="field mb-4 col-12">
                                        <label for="nickname" class="font-medium">Nickname</label>
                                        <InputText id="nickname" type="text" />
                                    </div>
                                    <div class="surface-100 mb-3 col-12" style="height: 2px"></div>
                                    <div class="field mb-4 col-12 md:col-6">
                                        <label for="bio" class="font-medium">Bio</label>
                                        <Textarea id="bio" :rows="5" :autoResize="true"></Textarea>
                                    </div>
                                    <div class="field mb-4 col-12 md:col-6">
                                        <label for="avatar" class="font-medium">Avatar</label>
                                        <div class="flex align-items-center">
                                            <img src="/images/blocks/avatars/circle/avatar-f-4.png" class="mr-4" />
                                            <FileUpload mode="basic" name="avatar" url="./upload.php" accept="image/*" :maxFileSize="1000000" class="p-button-outlined p-button-plain" chooseLabel="Upload Image"></FileUpload>
                                        </div>
                                    </div>
                                    <div class="surface-100 mb-3 col-12" style="height: 2px"></div>
                                    <div class="field mb-4 col-12 md:col-6">
                                        <label for="email" class="font-medium">Email</label>
                                        <InputText id="email" />
                                    </div>
                                    <div class="field mb-4 col-12 md:col-6">
                                        <label for="bio" class="font-medium">Country</label>
                                        <Dropdown v-model="selectedCountry" :options="countries" optionLabel="name" :filter="true" filterBy="name" :showClear="true" placeholder="Select a Country">
                                            <template #option="slotProps">
                                                <div class="flex align-items-center">
                                                    <img src="/images/blocks/flag/flag_placeholder.png" :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px" />
                                                    <div>{{ slotProps.option.name }}</div>
                                                </div>
                                            </template>
                                        </Dropdown>
                                    </div>
                                    <div class="field mb-4 col-12 md:col-6">
                                        <label for="city" class="font-medium">City</label>
                                        <InputText id="city" type="text" />
                                    </div>
                                    <div class="field mb-4 col-12 md:col-6">
                                        <label for="state" class="font-medium">State</label>
                                        <InputText id="state" type="text" />
                                    </div>
                                    <div class="surface-100 mb-3 col-12" style="height: 2px"></div>
                                    <div class="field mb-4 col-12">
                                        <label for="website" class="font-medium">Website</label>
                                        <div class="p-inputgroup">
                                            <span class="p-inputgroup-addon">www</span>
                                            <InputText id="website" type="text" />
                                        </div>
                                    </div>
                                    <div class="surface-100 mb-3 col-12" style="height: 2px"></div>
                                    <div class="field mb-4 col-12">
                                        <label for="privacy" class="font-medium">Privacy</label>
                                        <div class="flex align-items-center">
                                            <InputSwitch v-model="checked"></InputSwitch>
                                            <span class="ml-2">Share my data with contacts</span>
                                        </div>
                                    </div>
                                    <div class="surface-100 mb-3 col-12" style="height: 2px"></div>
                                    <div class="col-12">
                                        <Button label="Save Changes" class="w-auto mt-3"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Profile" :code="block2" recent>
            <section class="flex flex-column bg-black-alpha-90">
                <nav class="bg-black-alpha-90 px-4 flex justify-content-between relative xl:static" style="min-height: 70px">
                    <img src="/images/blocks/logos/hyper-300.svg" alt="Image" height="40" class="mr-0 xl:mr-6 align-self-center" />
                    <a
                        v-ripple
                        class="p-ripple cursor-pointer block xl:hidden align-self-center text-700"
                        v-styleclass="{
                            selector: '@next',
                            enterClass: 'hidden',
                            leaveToClass: 'hidden',
                            hideOnOutsideClick: true
                        }"
                    >
                        <i class="pi pi-bars text-4xl text-300"></i>
                    </a>
                    <div class="bg-black-alpha-90 flex-grow-1 justify-content-between hidden xl:flex absolute xl:static w-full left-0 top-100 z-1 shadow-2 xl:shadow-none surface-900">
                        <ul class="list-none p-0 m-0 flex select-none flex-column xl:flex-row xl:gap-2">
                            <li class="xl:flex xl:align-items-end">
                                <a
                                    v-ripple
                                    class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                                    :class="{
                                        'surface-50 text-900': activeTab2 === 0,
                                        'surface-700 text-50': activeTab2 !== 0
                                    }"
                                    @click="activeTab2 = 0"
                                >
                                    <i class="pi pi-bolt mr-2" :class="{ 'text-800': activeTab2 === 0 }"></i>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="xl:flex xl:align-items-end">
                                <a
                                    v-ripple
                                    class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                                    :class="{
                                        'surface-50 text-900': activeTab2 === 1,
                                        'surface-700 text-50': activeTab2 !== 1
                                    }"
                                    @click="activeTab2 = 1"
                                >
                                    <i class="pi pi-cog mr-2" :class="{ 'text-800': activeTab2 === 1 }"></i>
                                    <span>Settings</span>
                                </a>
                            </li>
                            <li class="xl:flex xl:align-items-end">
                                <a
                                    v-ripple
                                    class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                                    :class="{
                                        'surface-50 text-900': activeTab2 === 2,
                                        'surface-700 text-50': activeTab2 !== 2
                                    }"
                                    @click="activeTab2 = 2"
                                >
                                    <i class="pi pi-users mr-2" :class="{ 'text-800': activeTab2 === 2 }"></i>
                                    <span class="mr-2">Team</span>
                                </a>
                            </li>
                            <li class="xl:flex xl:align-items-end">
                                <a
                                    v-ripple
                                    class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                                    :class="{
                                        'surface-50 text-900': activeTab2 === 3,
                                        'surface-700 text-50': activeTab2 !== 3
                                    }"
                                    @click="activeTab2 = 3"
                                >
                                    <i class="pi pi-comments mr-2" :class="{ 'text-800': activeTab2 === 3 }"></i>
                                    <span>Messages</span>
                                    <span class="p-tag border-circle bg-cyan-500 text-white ml-2">3</span>
                                </a>
                            </li>
                        </ul>
                        <ul class="list-none p-0 m-0 flex xl:align-items-center select-none flex-column xl:flex-row border-top-1 surface-border xl:border-top-none">
                            <li>
                                <a
                                    v-ripple
                                    class="p-ripple flex h-3rem w-full xl:w-3rem px-3 xl:px-0 justify-content-start xl:justify-content-center align-items-center text-orange-600 hover:surface-hover font-medium xl:border-round cursor-pointer transition-colors transition-duration-150"
                                    @click="activeTab2 = 4"
                                >
                                    <i class="pi pi-inbox text-base xl:text-2xl mr-2 xl:mr-0"></i>
                                    <span class="block xl:hidden font-medium">Inbox</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    v-ripple
                                    class="p-ripple flex h-3rem w-full xl:w-3rem px-3 xl:px-0 justify-content-start xl:justify-content-center align-items-center text-cyan-600 hover:surface-hover font-medium xl:border-round cursor-pointer transition-colors transition-duration-150"
                                    @click="activeTab2 = 5"
                                >
                                    <i class="pi pi-bell text-base xl:text-2xl mr-2 xl:mr-0" pBadge severity="danger"></i>
                                    <span class="block xl:hidden font-medium">Notifications</span>
                                </a>
                            </li>
                            <li class="border-top-1 surface-border xl:border-top-none">
                                <a
                                    v-ripple
                                    class="p-ripple flex h-3rem w-full xl:w-3rem px-3 xl:px-0 justify-content-start xl:justify-content-center align-items-center hover:surface-hover font-medium xl:border-round cursor-pointer transition-colors transition-duration-150"
                                    @click="activeTab2 = 6"
                                >
                                    <img src="/images/blocks/avatars/circle/avatar-f-1.png" class="mr-3 xl:mr-0" style="width: 32px; height: 32px" />
                                    <div
                                        class="block xl:hidden"
                                        :class="{
                                            'text-900': activeTab2 === 6,
                                            'text-50': activeTab2 !== 6
                                        }"
                                    >
                                        <span class="block font-medium">Josephine Lillard</span>
                                        <span class="block font-medium text-sm">Marketing Specialist</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="flex flex-column flex-auto bg-black-alpha-90">
                    <div class="surface-section px-4 py-4 lg:py-5 lg:px-6 h-full border-round-top-3xl">
                        <div class="flex flex-column md:flex-row w-full justify-content-between md:align-items-center">
                            <div>
                                <h2 class="mt-0 mb-2 text-900 font-medium text-2xl">Settings</h2>
                                <p class="mt-0 mb-0 text-500">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</p>
                            </div>
                            <span class="p-input-icon-right w-full mt-2 md:mt-0 md:w-15rem">
                                <i class="pi pi-search"></i>
                                <InputText type="text" pInputText placeholder="Search" class="w-full md:w-15rem border-round" />
                            </span>
                        </div>
                        <Divider styleClass="my-5"></Divider>

                        <div class="p-fluid flex flex-column lg:flex-row">
                            <ul class="list-none m-0 p-0 flex flex-row lg:flex-column justify-content-between lg:justify-content-start mb-5 lg:mb-0">
                                <li>
                                    <a
                                        v-ripple
                                        class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors"
                                        :class="{ 'surface-200': activeTab3 === 0 }"
                                        @click="activeTab3 = 0"
                                    >
                                        <i
                                            class="pi pi-user md:mr-2"
                                            :class="{
                                                'text-700': activeTab3 === 0,
                                                'text-600': activeTab3 !== 0
                                            }"
                                        ></i>
                                        <span
                                            class="font-medium hidden md:block"
                                            :class="{
                                                'text-800': activeTab3 === 0,
                                                'text-700': activeTab3 !== 0
                                            }"
                                            >Profile</span
                                        >
                                    </a>
                                </li>
                                <li>
                                    <a
                                        v-ripple
                                        class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors"
                                        :class="{ 'surface-200': activeTab3 === 1 }"
                                        @click="activeTab3 = 1"
                                    >
                                        <i
                                            class="pi pi-cog md:mr-2"
                                            :class="{
                                                'text-700': activeTab3 === 1,
                                                'text-600': activeTab3 !== 1
                                            }"
                                        ></i>
                                        <span
                                            class="font-medium hidden md:block"
                                            :class="{
                                                'text-800': activeTab3 === 1,
                                                'text-700': activeTab3 !== 1
                                            }"
                                            >Account</span
                                        >
                                    </a>
                                </li>
                                <li>
                                    <a
                                        v-ripple
                                        class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors"
                                        :class="{ 'surface-200': activeTab3 === 2 }"
                                        @click="activeTab3 = 2"
                                    >
                                        <i
                                            class="pi pi-palette md:mr-2"
                                            :class="{
                                                'text-700': activeTab3 === 2,
                                                'text-600': activeTab3 !== 2
                                            }"
                                        ></i>
                                        <span
                                            class="font-medium hidden md:block"
                                            :class="{
                                                'text-800': activeTab3 === 2,
                                                'text-700': activeTab3 !== 2
                                            }"
                                            >Appearance</span
                                        >
                                    </a>
                                </li>
                                <li>
                                    <a
                                        v-ripple
                                        class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors"
                                        :class="{ 'surface-200': activeTab3 === 3 }"
                                        @click="activeTab3 = 3"
                                    >
                                        <i
                                            class="pi pi-sun md:mr-2"
                                            :class="{
                                                'text-700': activeTab3 === 3,
                                                'text-600': activeTab3 !== 3
                                            }"
                                        ></i>
                                        <span
                                            class="font-medium hidden md:block"
                                            :class="{
                                                'text-800': activeTab3 === 3,
                                                'text-700': activeTab3 !== 3
                                            }"
                                            >Accessibility</span
                                        >
                                    </a>
                                </li>
                                <li>
                                    <a
                                        v-ripple
                                        class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors"
                                        :class="{ 'surface-200': activeTab3 === 4 }"
                                        @click="activeTab3 = 4"
                                    >
                                        <i
                                            class="pi pi-bell md:mr-2"
                                            :class="{
                                                'text-700': activeTab3 === 4,
                                                'text-600': activeTab3 !== 4
                                            }"
                                        ></i>
                                        <span
                                            class="font-medium hidden md:block"
                                            :class="{
                                                'text-800': activeTab3 === 4,
                                                'text-700': activeTab3 !== 4
                                            }"
                                            >Notifications</span
                                        >
                                    </a>
                                </li>
                            </ul>
                            <div class="surface-card p-5 shadow-2 border-round flex-auto xl:ml-5">
                                <div class="text-900 font-semibold text-lg mt-3">Profile</div>
                                <Divider></Divider>
                                <div class="flex gap-5 flex-column-reverse md:flex-row">
                                    <div class="flex-auto p-fluid">
                                        <div class="mb-4">
                                            <label for="email" class="block font-normal text-900 mb-2">Name</label>
                                            <InputText id="email" type="text" />
                                        </div>
                                        <div class="mb-4">
                                            <label for="bio" class="block font-normal text-900 mb-2">Bio</label>
                                            <Textarea id="bio" type="text" rows="5" autoResize></Textarea>
                                            <p class="mt-2 mb-0 font-medium text-base text-600">
                                                You can
                                                <span class="font-medium text-900">@mention</span> other users and organizations to link to them.
                                            </p>
                                        </div>
                                        <div class="mb-4">
                                            <label for="website" class="block font-normal text-900 mb-2">URL</label>
                                            <div class="p-inputgroup">
                                                <span class="p-inputgroup-addon">https://</span>
                                                <InputText id="website" type="text" />
                                            </div>
                                        </div>
                                        <div class="mb-4">
                                            <label for="company" class="block font-normal text-900 mb-2">Company</label>
                                            <InputText id="company" type="text" />
                                        </div>
                                        <div class="mb-4">
                                            <label for="visibility" class="block font-normal text-900 mb-2">Profile Visibility</label>
                                            <div class="flex align-items-center">
                                                <Checkbox v-model="value1" binary inputId="visibility"></Checkbox>
                                                <span class="ml-2 font-normal text-base text-color-primary">Make profile private and hide all activity</span>
                                            </div>
                                        </div>
                                        <div>
                                            <Button label="Update Profile" class="w-auto mt-3"></Button>
                                        </div>
                                    </div>
                                    <div class="flex flex-column align-items-center flex-or">
                                        <span class="font-normal text-900 mb-2">Profile Picture</span>
                                        <img src="/images/blocks/avatars/circle-big/avatar-f-2.png" class="h-10rem w-10rem" />
                                        <Button type="button" icon="pi pi-pencil" class="p-button-rounded -mt-4"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="surface-section px-6 p-3 lg:px-3 mt-5">
                            <div class="flex flex-column sm:flex-row sm:align-items-center justify-content-between">
                                <div>
                                    <img src="/images/blocks/logos/hyper-900.svg" alt="Image" height="40" />
                                    <p class="mt-2 mb-0 line-height-3 font-medium text-base text-700">&copy; 202X Hyper, Inc. All rights reserved.</p>
                                </div>
                                <div class="mt-3 sm:mt-0">
                                    <a class="cursor-pointer text-500 transition-colors transition-duration-150 hover:text-700">
                                        <i class="pi pi-twitter text-xl"></i>
                                    </a>
                                    <a class="cursor-pointer text-500 ml-3 transition-colors transition-duration-150 hover:text-700">
                                        <i class="pi pi-facebook text-xl"></i>
                                    </a>
                                    <a class="cursor-pointer text-500 ml-3 transition-colors transition-duration-150 hover:text-700">
                                        <i class="pi pi-github text-xl"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </BlockViewer>

        <BlockViewer header="Group Layout" :code="block3" recent>
            <nav class="surface-overlay px-4 lg:px-6 shadow-2 flex justify-content-between relative lg:static" style="min-height: 84px">
                <img src="/images/blocks/logos/bastion-700.svg" alt="Image" height="40" class="mr-0 lg:mr-6 align-self-center" />
                <a
                    v-ripple
                    class="p-ripple cursor-pointer block lg:hidden align-self-center text-700"
                    v-styleclass="{
                        selector: '@next',
                        enterClass: 'hidden',
                        leaveToClass: 'hidden',
                        hideOnOutsideClick: true
                    }"
                >
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <div class="flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full surface-overlay left-0 top-100 z-1 shadow-2 lg:shadow-none">
                    <ul class="list-none p-0 m-0 flex select-none flex-column lg:flex-row">
                        <li>
                            <a
                                v-ripple
                                class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150"
                            >
                                <i class="pi pi-home mr-2"></i>
                                <span>Home</span>
                            </a>
                        </li>
                        <li>
                            <a
                                v-ripple
                                class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150"
                            >
                                <i class="pi pi-users mr-2"></i>
                                <span>Customers</span>
                            </a>
                        </li>
                        <li>
                            <a
                                v-ripple
                                class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150"
                            >
                                <i class="pi pi-calendar mr-2"></i>
                                <span>Calendar</span>
                            </a>
                        </li>
                        <li>
                            <a
                                v-ripple
                                class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150"
                            >
                                <i class="pi pi-chart-line mr-2"></i>
                                <span>Stats</span>
                            </a>
                        </li>
                    </ul>
                    <ul class="list-none p-0 m-0 flex select-none flex-column lg:flex-row border-top-1 surface-border lg:border-top-none">
                        <li>
                            <a
                                v-ripple
                                class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150"
                            >
                                <i class="pi pi-inbox text-base lg:text-2xl mr-2 lg:mr-0"></i>
                                <span class="block lg:hidden font-medium">Inbox</span>
                            </a>
                        </li>
                        <li>
                            <a
                                v-ripple
                                class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150"
                            >
                                <i class="pi pi-bell text-base lg:text-2xl mr-2 lg:mr-0"></i>
                                <span class="block lg:hidden font-medium">Notifications</span>
                            </a>
                        </li>
                        <li class="border-top-1 surface-border lg:border-top-none">
                            <a
                                v-ripple
                                class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150"
                            >
                                <img src="/images/blocks/avatars/circle/avatar-f-1.png" class="mr-3 lg:mr-0" style="width: 28px; height: 28px" />
                                <div class="block lg:hidden">
                                    <div class="text-900 font-medium">Josephine Lillard</div>
                                    <span class="text-600 font-medium text-sm">Marketing Specialist</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <nav class="surface-overlay px-4 lg:px-6 py-4 px-4 lg:px-6 border-y-1 surface-border flex flex-column flex-wrap md:flex-row gap-3 w-full md:justify-content-between md:align-items-center">
                <ul class="list-none m-0 p-0 flex flex-row justify-content-between lg:justify-content-start lg:mb-0">
                    <li>
                        <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{ 'surface-200': activeTab3 === 0 }" @click="activeTab3 = 0">
                            <i
                                class="pi pi-chart-line md:hidden"
                                :class="{
                                    'text-700': activeTab3 === 0,
                                    'text-600': activeTab3 !== 0
                                }"
                            ></i>
                            <span
                                class="font-medium hidden md:block"
                                :class="{
                                    'text-900': activeTab3 === 0,
                                    'text-600': activeTab3 !== 0
                                }"
                                >Overview</span
                            >
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{ 'surface-200': activeTab3 === 1 }" @click="activeTab3 = 1">
                            <i
                                class="pi pi-user md:hidden"
                                :class="{
                                    'text-700': activeTab3 === 1,
                                    'text-600': activeTab3 !== 1
                                }"
                            ></i>
                            <span
                                class="font-medium hidden md:block"
                                :class="{
                                    'text-900': activeTab3 === 1,
                                    'text-600': activeTab3 !== 1
                                }"
                                >Profile</span
                            >
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{ 'surface-200': activeTab3 === 2 }" @click="activeTab3 = 2">
                            <i
                                class="pi pi-bolt md:hidden"
                                :class="{
                                    'text-700': activeTab3 === 2,
                                    'text-600': activeTab3 !== 2
                                }"
                            ></i>
                            <span
                                class="font-medium hidden md:block"
                                :class="{
                                    'text-900': activeTab3 === 2,
                                    'text-600': activeTab3 !== 2
                                }"
                                >Activity</span
                            >
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{ 'surface-200': activeTab3 === 3 }" @click="activeTab3 = 3">
                            <i
                                class="pi pi-users md:hidden"
                                :class="{
                                    'text-700': activeTab3 === 3,
                                    'text-600': activeTab3 !== 3
                                }"
                            ></i>
                            <span
                                class="font-medium hidden md:block"
                                :class="{
                                    'text-900': activeTab3 === 3,
                                    'text-600': activeTab3 !== 3
                                }"
                                >Members & Roles</span
                            >
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{ 'surface-200': activeTab3 === 4 }" @click="activeTab3 = 4">
                            <i
                                class="pi pi-lock md:hidden"
                                :class="{
                                    'text-700': activeTab3 === 4,
                                    'text-600': activeTab3 !== 4
                                }"
                            ></i>
                            <span
                                class="font-medium hidden md:block"
                                :class="{
                                    'text-900': activeTab3 === 4,
                                    'text-600': activeTab3 !== 4
                                }"
                                >Security</span
                            >
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{ 'surface-200': activeTab3 === 5 }" @click="activeTab3 = 5">
                            <i
                                class="pi pi-dollar md:hidden"
                                :class="{
                                    'text-700': activeTab3 === 5,
                                    'text-600': activeTab3 !== 5
                                }"
                            ></i>
                            <span
                                class="font-medium hidden md:block"
                                :class="{
                                    'text-900': activeTab3 === 5,
                                    'text-600': activeTab3 !== 5
                                }"
                                >Team Plan</span
                            >
                        </a>
                    </li>
                </ul>
                <span class="p-input-icon-right w-full mt-2 md:mt-0 md:w-15rem">
                    <i class="pi pi-search"></i>
                    <InputText type="text" placeholder="Search" class="w-full md:w-15rem border-round" />
                </span>
            </nav>
            <section class="surface-overlay px-4 lg:px-6 py-4 px-4 lg:px-6 border-top-1 surface-border">
                <div class="border-bottom-1 surface-border">
                    <h2 class="mt-0 mb-2 text-900 font-bold text-4xl">Members & Roles</h2>
                    <p class="mt-0 mb-5 text-700 font-normal text-base">You can easily manage your team on this page</p>
                </div>
                <section class="flex flex-wrap gap-3 py-6 justify-content-between border-bottom-1 surface-border">
                    <div class="flex-shrink-0 w-15rem">
                        <h3 class="mb-4 mt-0 text-900 font-medium text-xl">Members</h3>
                        <p class="mb-4 mt-0 text-700 font-normal text-base">Manage your member in this project</p>
                        <Button label="Invite a member" class="w-auto"></Button>
                    </div>
                    <div class="overflow-x-scroll">
                        <DataTable :value="members" rowHover>
                            <Column style="min-width: 25rem">
                                <template #header>
                                    <span class="font-semibold text-sm text-color-secondary">Name</span>
                                </template>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-3">
                                        <Avatar :image="'/images/blocks/avatars/circle/' + data.image + '.png'" class="mr-2" size="large" shape="circle"></Avatar>
                                        <div>
                                            <p class="mt-0 mb-2 font-medium text-lg text-color-primary">
                                                {{ data.name }}
                                            </p>
                                            <p class="mt-0 mb-2 font-normal text-base text-color-secondary">
                                                {{ data.username }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </Column>
                            <Column style="min-width: 14rem">
                                <template #header>
                                    <span class="font-semibold text-sm text-color-secondary">Joined Date</span>
                                </template>
                                <template #body="{ data }">
                                    <p class="mt-0 mb-2 font-normal text-base text-color-secondary">
                                        {{ data.date }}
                                    </p>
                                </template>
                            </Column>
                            <Column style="min-width: 13rem">
                                <template #header>
                                    <span class="font-semibold text-sm text-color-secondary">Last Active</span>
                                </template>
                                <template #body="{ data }">
                                    <p class="mt-0 mb-2 font-normal text-base text-color-secondary">
                                        {{ data.active }}
                                    </p>
                                </template>
                            </Column>
                            <Column style="min-width: 8rem">
                                <template #body>
                                    <Button type="button" icon="pi pi-ellipsis-v" class="p-button-text p-button-secondary" @click="$refs.menu.toggle($event)"></Button>
                                    <Menu ref="menu" appendTo="body" popup :model="items"></Menu>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </section>
                <section class="flex flex-wrap gap-3 py-6 justify-content-between border-bottom-1 surface-border">
                    <div class="flex-shrink-0 w-15rem">
                        <h3 class="mb-4 mt-0 text-900 font-medium text-xl">Roles</h3>
                        <p class="mb-4 mt-0 text-700 font-normal text-base">Edit roles in this project</p>
                        <Button label="Add a role" class="w-auto"></Button>
                    </div>
                    <div class="overflow-x-scroll">
                        <DataTable :value="roles" rowHover>
                            <Column style="min-width: 25rem">
                                <template #header>
                                    <span class="font-semibold text-sm text-color-secondary">Alias Name</span>
                                </template>
                                <template #body="{ data }">
                                    <div class="flex align-items-center">
                                        <span class="border-circle mr-2" :class="data.color" style="width: 7px; height: 7px"></span>
                                        <p class="mt-0 mb-0 font-medium text-lg text-color-primary">
                                            {{ data.alias }}
                                        </p>
                                    </div>
                                </template>
                            </Column>
                            <Column style="min-width: 14rem">
                                <template #header>
                                    <span class="font-semibold text-sm text-color-secondary">Last Edit</span>
                                </template>
                                <template #body="{ data }">
                                    <p class="mt-0 mb-0 font-normal text-base text-color-secondary">
                                        {{ data.date }}
                                    </p>
                                </template>
                            </Column>
                            <Column style="min-width: 13rem">
                                <template #header>
                                    <span class="font-semibold text-sm text-color-secondary">Users</span>
                                </template>
                                <template #body="{ data }">
                                    <p class="mt-0 mb-0 font-normal text-base text-color-secondary">
                                        {{ data.users }}
                                    </p>
                                </template>
                            </Column>
                            <Column style="min-width: 8rem">
                                <template #body>
                                    <Button type="button" icon="pi pi-ellipsis-v" class="p-button-text p-button-secondary" @click="$refs.menu.toggle($event)"></Button>
                                    <Menu ref="menu" appendTo="body" popup :model="items"></Menu>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </section>
            </section>
        </BlockViewer>
    </div>
</template>

<script>
export default {
    name: 'SettingScreen',
    data() {
        return {
            block1: `
<div class="min-h-screen flex relative lg:static surface-ground">
    <div id="app-sidebar" class="h-full lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border w-full md:w-auto">
        <div class="flex h-full">
            <div class="flex flex-column h-full bg-indigo-500 flex-shrink-0 select-none">
                <div class="flex align-items-center justify-content-center flex-shrink-0 bg-indigo-600" style="height:60px">
                    <img src="/images/blocks/logos/hyper-light.svg" alt="Image" height="30" />
                </div>
                <div class="overflow-y-auto mt-3">
                    <ul class="list-none py-3 px-2 m-0">
                        <li class="mb-2">
                            <a class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors" @click="activeTab = 0"
                                :class="{'bg-indigo-700': activeTab === 0}">
                                <i class="pi pi-home text-lg"></i>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors" @click="activeTab = 1"
                                :class="{'bg-indigo-700': activeTab === 1}">
                                <i class="pi pi-bookmark text-lg"></i>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors" @click="activeTab = 2"
                                :class="{'bg-indigo-700': activeTab === 2}">
                                <i class="pi pi-users text-lg"></i>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors" @click="activeTab = 3"
                                :class="{'bg-indigo-700': activeTab === 3}">
                                <i class="pi pi-comments text-lg"></i>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors" @click="activeTab = 4"
                                :class="{'bg-indigo-700': activeTab === 4}">
                                <i class="pi pi-calendar text-lg"></i>
                            </a>
                        </li>
                        <li class="mb-2">
                            <a class="flex align-items-center cursor-pointer p-3 lg:justify-content-center hover:bg-indigo-400 border-round text-indigo-100 hover:text-indigo-50 transition-duration-150 transition-colors" @click="activeTab = 5"
                                :class="{'bg-indigo-700': activeTab === 5}">
                                <i class="pi pi-cog text-lg"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="mt-auto">
                    <hr class="mb-3 mx-3 border-top-1 border-bottom-none border-indigo-300" />
                    <a class="m-3 flex align-items-center cursor-pointer py-1 px-0 justify-content-center hover:bg-indigo-400 border-round text-300 hover:text-0
                        transition-duration-150 transition-colors">
                        <img src="/images/blocks/avatars/circle/avatar-f-1.png" style="width: 24px; height: 24px"/>
                    </a>
                </div>
            </div>
            <div class="flex flex-column surface-0 p-4 overflow-y-auto flex-shrink-0 flex-grow-1 md:flex-grow-0" style="width:250px">
                <div class="justify-content-end mb-3 flex lg:hidden">
                    <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-plain"
                        v-styleclass="{ selector: '#app-sidebar', leaveToClass: 'hidden', leaveActiveClass: 'fadeoutleft' }"></Button>
                </div>
                <div class="surface-0 flex-auto">
                    <div :class="{'hidden': activeTab !== 0}">
                        <div class="w-full lg:w-auto select-none">
                            <ul class="list-none py-2 px-0 m-0">
                                <li>
                                <div class="p-3 text-500 font-medium">HOME</div>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-home mr-2 text-700"></i>
                                        <span class="font-medium text-700">Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-bookmark mr-2 text-700"></i>
                                        <span class="font-medium text-700">Bookmarks</span>
                                        <span class="inline-flex align-items-center justify-content-center ml-auto bg-blue-100 text-blue-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">3</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-users mr-2 text-700"></i>
                                        <span class="font-medium text-700">Team</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-comments mr-2 text-700"></i>
                                        <span class="font-medium text-700">Messages</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-calendar mr-2 text-700"></i>
                                        <span class="font-medium text-700">Calendar</span>
                                        <span class="inline-flex align-items-center justify-content-center ml-auto bg-purple-100 text-purple-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">2</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-user mr-2 text-blue-500"></i>
                                        <span class="font-medium text-blue-500 font-bold">Profile</span>
                                    </a>
                                </li>
                            </ul>
                            <ul class="list-none py-2 px-0 m-0 border-top-1 surface-border">
                                <li>
                                <div class="p-3 text-500 font-medium">ORGANIZATION</div>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-home mr-2 text-700"></i>
                                        <span class="font-medium text-700">Overview</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-bookmark mr-2 text-700"></i>
                                        <span class="font-medium text-700">Security</span>
                                        <span class="inline-flex align-items-center justify-content-center ml-auto bg-cyan-100 text-cyan-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">3</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-users mr-2 text-700"></i>
                                        <span class="font-medium text-700">Domains</span>
                                    </a>
                                </li>
                                <li>
                                    <a class="flex align-items-center cursor-pointer p-3 hover:surface-100 border-round transition-colors transition-duration-150">
                                        <i class="pi pi-calendar mr-2 text-700"></i>
                                        <span class="font-medium text-700">Reports</span>
                                        <span class="inline-flex align-items-center justify-content-center ml-auto bg-orange-100 text-orange-900 border-circle" style="min-width: 1.5rem; height: 1.5rem">2</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="p-3 font-medium text-xl text-900" :class="{'hidden': activeTab !== 1}">Bookmarks</div>
                    <div class="p-3 font-medium text-xl text-900" :class="{'hidden': activeTab !== 2}">Team</div>
                    <div class="p-3 font-medium text-xl text-900" :class="{'hidden': activeTab !== 3}">Messages</div>
                    <div class="p-3 font-medium text-xl text-900" :class="{'hidden': activeTab !== 4}">Calendar</div>
                    <div class="p-3 font-medium text-xl text-900" :class="{'hidden': activeTab !== 5}">Settings</div>
                </div>
            </div>
        </div>
    </div>
    <div class="min-h-screen flex flex-column relative flex-auto">
        <div class="flex justify-content-between align-items-center px-5 surface-section border-bottom-1 surface-border relative lg:static" style="height:60px">
            <div class="flex align-items-center">
                <a class="cursor-pointer block lg:hidden text-700 mr-3 mt-1"
                    v-styleclass="{ selector: '#app-sidebar', enterClass: 'hidden', enterActiveClass: 'fadeinleft', leaveToClass: 'hidden', leaveActiveClass: 'fadeoutleft' }">
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <span class="p-input-icon-left">
                    <i class="pi pi-search"></i>
                    <InputText type="search" class="border-none" placeholder="Search" />
                </span>
            </div>
            <a class="cursor-pointer block lg:hidden text-700"
                v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'fadein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v text-2xl"></i>
            </a>
            <ul class="list-none p-0 m-0  hidden lg:flex lg:align-items-center select-none lg:flex-row
                surface-section border-1 lg:border-none surface-border right-0 top-100 z-1 shadow-2 lg:shadow-none absolute lg:static">
                <li>
                    <a class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer
                        transition-duration-150 transition-colors">
                        <i class="pi pi-inbox text-base lg:text-2xl mr-2 lg:mr-0"></i>
                        <span class="block lg:hidden font-medium">Inbox</span>
                    </a>
                </li>
                <li>
                    <a class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer
                        transition-duration-150 transition-colors">
                        <i class="pi pi-bell text-base lg:text-2xl mr-2 lg:mr-0" v-badge.danger></i>
                        <span class="block lg:hidden font-medium">Notifications</span>
                    </a>
                </li>
                <li class="border-top-1 surface-border lg:border-top-none">
                    <a class="flex p-3 lg:px-3 lg:py-2 align-items-center hover:surface-100 font-medium border-round cursor-pointer
                        transition-duration-150 transition-colors">
                        <img src="/images/blocks/avatars/circle/avatar-f-1.png" class="mr-3 lg:mr-0" style="width: 32px; height: 32px"/>
                        <div class="block lg:hidden">
                            <div class="text-900 font-medium">Josephine Lillard</div>
                            <span class="text-600 font-medium text-sm">Marketing Specialist</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <div class="p-5 flex flex-column flex-auto">
            <div>
                <div class="text-900 font-medium text-xl mb-3">Profile</div>
                <p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">Odio euismod lacinia at quis risus sed vulputate odio. Non nisi est sit amet.
                    Egestas integer eget aliquet nibh praesent tristique magna.</p>
                <div class="surface-card p-4 shadow-2 border-round">
                    <div class="grid formgrid p-fluid">
                        <div class="field mb-4 col-12">
                            <label for="nickname" class="font-medium">Nickname</label>
                            <InputText id="nickname" type="text" />
                        </div>
                        <div class="surface-100 mb-3 col-12" style="height:2px"></div>
                        <div class="field mb-4 col-12 md:col-6">
                            <label for="bio" class="font-medium">Bio</label>
                            <Textarea id="bio" :rows="5" :autoResize="true"></Textarea>
                        </div>
                        <div class="field mb-4 col-12 md:col-6">
                            <label for="avatar" class="font-medium">Avatar</label>
                            <div class="flex align-items-center">
                                <img src="/images/blocks/avatars/circle/avatar-f-4.png" class="mr-4" />
                                <FileUpload mode="basic" name="avatar" url="./upload.php" accept="image/*" :maxFileSize="1000000" class="p-button-outlined p-button-plain" chooseLabel="Upload Image"></FileUpload>
                            </div>
                        </div>
                        <div class="surface-100 mb-3 col-12" style="height:2px"></div>
                        <div class="field mb-4 col-12 md:col-6">
                            <label for="email" class="font-medium">Email</label>
                            <InputText id="email" />
                        </div>
                        <div class="field mb-4 col-12 md:col-6">
                            <label for="bio" class="font-medium">Country</label>
                            <Dropdown v-model="selectedCountry" :options="countries" optionLabel="name" :filter="true" filterBy="name" :showClear="true" placeholder="Select a Country">
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <img src="/images/blocks/flag/flag_placeholder.png" :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width:18px"/>
                                        <div>{{slotProps.option.name}}</div>
                                    </div>
                                </template>
                            </Dropdown>
                        </div>
                        <div class="field mb-4 col-12 md:col-6">
                            <label for="city" class="font-medium">City</label>
                            <InputText id="city" type="text" />
                        </div>
                        <div class="field mb-4 col-12 md:col-6">
                            <label for="state" class="font-medium">State</label>
                            <InputText id="state" type="text" />
                        </div>
                        <div class="surface-100 mb-3 col-12" style="height:2px"></div>
                        <div class="field mb-4 col-12">
                            <label for="website" class="font-medium">Website</label>
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon">www</span>
                                <InputText id="website" type="text" />
                            </div>
                        </div>
                        <div class="surface-100 mb-3 col-12" style="height:2px"></div>
                        <div class="field mb-4 col-12">
                            <label for="privacy" class="font-medium">Privacy</label>
                            <div class="flex align-items-center">
                                <InputSwitch v-model="checked"></InputSwitch>
                                <span class="ml-2">Share my data with contacts</span>
                            </div>
                        </div>
                        <div class="surface-100 mb-3 col-12" style="height:2px"></div>
                        <div class="col-12">
                            <Button label="Save Changes" class="w-auto mt-3"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
            block2: `
<section class="flex flex-column bg-black-alpha-90">
    <nav class="bg-black-alpha-90 px-4 flex justify-content-between relative xl:static" style="min-height:70px">
        <img src="/images/blocks/logos/hyper-300.svg" alt="Image" height="40" class="mr-0 xl:mr-6 align-self-center" />
        <a v-ripple class="p-ripple cursor-pointer block xl:hidden align-self-center text-700"
            v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
            <i class="pi pi-bars text-4xl text-300"></i>
        </a>
        <div class="bg-black-alpha-90 flex-grow-1 justify-content-between hidden xl:flex absolute xl:static w-full left-0 top-100 z-1 shadow-2 xl:shadow-none surface-900">
            <ul class="list-none p-0 m-0 flex select-none flex-column xl:flex-row xl:gap-2">
                <li class="xl:flex xl:align-items-end">
                    <a v-ripple class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                        :class="{'surface-50 text-900': activeTab2 === 0, 'surface-700 text-50': activeTab2 !== 0}" @click="activeTab2 = 0">
                        <i class="pi pi-bolt mr-2" :class="{'text-800': activeTab2 === 0}"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li class="xl:flex xl:align-items-end">
                    <a v-ripple class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                        :class="{'surface-50 text-900': activeTab2 === 1, 'surface-700 text-50': activeTab2 !== 1}" @click="activeTab2 = 1">
                        <i class="pi pi-cog mr-2" :class="{'text-800': activeTab2 === 1}"></i>
                        <span>Settings</span>
                    </a>
                </li>
                <li class="xl:flex xl:align-items-end">
                    <a v-ripple class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                    :class="{'surface-50 text-900': activeTab2 === 2, 'surface-700 text-50': activeTab2 !== 2}" @click="activeTab2 = 2">
                        <i class="pi pi-users mr-2" :class="{'text-800': activeTab2 === 2}"></i>
                        <span class="mr-2">Team</span>
                    </a>
                </li>
                <li class="xl:flex xl:align-items-end">
                    <a v-ripple class="p-ripple xl:border-round-top flex align-items-center h-3rem px-3 font-medium cursor-pointer transition-colors transition-duration-150"
                    :class="{'surface-50 text-900': activeTab2 === 3, 'surface-700 text-50': activeTab2 !== 3}" @click="activeTab2 = 3">
                        <i class="pi pi-comments mr-2" :class="{'text-800': activeTab2 === 3}"></i>
                        <span>Messages</span>
                        <span class="p-tag border-circle bg-cyan-500 text-white ml-2">3</span>
                    </a>
                </li>
            </ul>
            <ul class="list-none p-0 m-0 flex xl:align-items-center select-none flex-column xl:flex-row border-top-1 surface-border xl:border-top-none">
                <li>
                    <a v-ripple class="p-ripple flex h-3rem w-full xl:w-3rem px-3 xl:px-0 justify-content-start xl:justify-content-center align-items-center text-orange-600 hover:surface-hover font-medium xl:border-round cursor-pointer transition-colors transition-duration-150" @click="activeTab2 = 4">
                        <i class="pi pi-inbox text-base xl:text-2xl mr-2 xl:mr-0"></i>
                        <span class="block xl:hidden font-medium">Inbox</span>
                    </a>
                </li>
                <li>
                    <a v-ripple class="p-ripple flex h-3rem w-full xl:w-3rem px-3 xl:px-0 justify-content-start xl:justify-content-center align-items-center text-cyan-600 hover:surface-hover font-medium xl:border-round cursor-pointer transition-colors transition-duration-150" @click="activeTab2 = 5">
                        <i class="pi pi-bell text-base xl:text-2xl mr-2 xl:mr-0" pBadge severity="danger"></i>
                        <span class="block xl:hidden font-medium">Notifications</span>
                    </a>
                </li>
                <li class="border-top-1 surface-border xl:border-top-none">
                    <a v-ripple class="p-ripple flex h-3rem w-full xl:w-3rem px-3 xl:px-0 justify-content-start xl:justify-content-center align-items-center hover:surface-hover font-medium xl:border-round cursor-pointer transition-colors transition-duration-150" @click="activeTab2 = 6">
                        <img src="/images/blocks/avatars/circle/avatar-f-1.png" class="mr-3 xl:mr-0" style="width: 32px; height: 32px"/>
                        <div class="block xl:hidden" :class="{'text-900': activeTab2 === 6, 'text-50': activeTab2 !== 6}">
                            <span class="block font-medium">Josephine Lillard</span>
                            <span class="block font-medium text-sm">Marketing Specialist</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    <div class="flex flex-column flex-auto bg-black-alpha-90">
        <div class="surface-section px-4 py-4 lg:py-5 lg:px-6 h-full border-round-top-3xl">
            <div class="flex flex-column md:flex-row w-full justify-content-between md:align-items-center">
                <div>
                    <h2 class="mt-0 mb-2 text-900 font-medium text-2xl">Settings</h2>
                    <p class="mt-0 mb-0 text-500">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</p>
                </div>
                <span class="p-input-icon-right w-full mt-2 md:mt-0 md:w-15rem">
                    <i class="pi pi-search"></i>
                    <InputText type="text" pInputText placeholder="Search" class="w-full md:w-15rem border-round"/>
                </span>
            </div>
            <Divider styleClass="my-5"></Divider>

            <div class="p-fluid flex flex-column lg:flex-row">
                <ul class="list-none m-0 p-0 flex flex-row lg:flex-column justify-content-between lg:justify-content-start mb-5 lg:mb-0">
                    <li>
                        <a v-ripple class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 0}" @click="activeTab3 = 0">
                            <i class="pi pi-user md:mr-2" :class="{'text-700' : activeTab3 === 0, 'text-600': activeTab3 !== 0}"></i>
                            <span class="font-medium hidden md:block" :class="{'text-800': activeTab3 === 0, 'text-700': activeTab3 !== 0}">Profile</span>
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 1}" @click="activeTab3 = 1">
                            <i class="pi pi-cog md:mr-2" :class="{'text-700' : activeTab3 === 1, 'text-600': activeTab3 !== 1}"></i>
                            <span class="font-medium hidden md:block" :class="{'text-800': activeTab3 === 1, 'text-700': activeTab3 !== 1}">Account</span>
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 2}" @click="activeTab3 = 2">
                            <i class="pi pi-palette md:mr-2" :class="{'text-700' : activeTab3 === 2, 'text-600': activeTab3 !== 2}"></i>
                            <span class="font-medium hidden md:block" :class="{'text-800': activeTab3 === 2, 'text-700': activeTab3 !== 2}">Appearance</span>
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors"  :class="{'surface-200': activeTab3 === 3}" @click="activeTab3 = 3">
                            <i class="pi pi-sun md:mr-2" :class="{'text-700' : activeTab3 === 3, 'text-600': activeTab3 !== 3}"></i>
                            <span class="font-medium hidden md:block" :class="{'text-800': activeTab3 === 3, 'text-700': activeTab3 !== 3}">Accessibility</span>
                        </a>
                    </li>
                    <li>
                        <a v-ripple class="p-ripple lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 4}" @click="activeTab3 = 4">
                            <i class="pi pi-bell md:mr-2" :class="{'text-700' : activeTab3 === 4, 'text-600': activeTab3 !== 4}"></i>
                            <span class="font-medium hidden md:block" :class="{'text-800': activeTab3 === 4, 'text-700': activeTab3 !== 4}">Notifications</span>
                        </a>
                    </li>
                </ul>
                <div class="surface-card p-5 shadow-2 border-round flex-auto xl:ml-5">
                    <div class="text-900 font-semibold text-lg mt-3">Profile</div>
                    <Divider></Divider>
                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto p-fluid">
                            <div class="mb-4">
                                <label for="email" class="block font-normal text-900 mb-2">Name</label>
                                <InputText id="email" type="text" />
                            </div>
                            <div class="mb-4">
                                <label for="bio" class="block font-normal text-900 mb-2">Bio</label>
                                <Textarea id="bio" type="text"  rows="5" autoResize></Textarea>
                                <p class="mt-2 mb-0 font-medium text-base text-600">You can <span class="font-medium text-900">@mention</span> other users and organizations to link to them.</p>
                            </div>
                            <div class="mb-4">
                                <label for="website" class="block font-normal text-900 mb-2">URL</label>
                                <div class="p-inputgroup">
                                    <span class="p-inputgroup-addon">https://</span>
                                    <InputText id="website" type="text" />
                                </div>
                            </div>
                            <div class="mb-4">
                                <label for="company" class="block font-normal text-900 mb-2">Company</label>
                                <InputText id="company" type="text" />
                            </div>
                            <div class="mb-4">
                                <label for="visibility" class="block font-normal text-900 mb-2">Profile Visibility</label>
                                <div class="flex align-items-center">
                                    <Checkbox v-model="value1" binary inputId="visibility"></Checkbox>
                                    <span class="ml-2 font-normal text-base text-color-primary">Make profile private and hide all activity</span>
                                </div>
                            </div>
                            <div>
                                <Button label="Update Profile" class="w-auto mt-3"></Button>
                            </div>
                        </div>
                        <div class="flex flex-column align-items-center flex-or">
                            <span class="font-normal text-900 mb-2">Profile Picture</span>
                            <img src="/images/blocks/avatars/circle-big/avatar-f-2.png" class="h-10rem w-10rem"/>
                            <Button type="button" icon="pi pi-pencil" class="p-button-rounded -mt-4"></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="surface-section px-6 p-3 lg:px-3 mt-5">
                <div class="flex flex-column sm:flex-row sm:align-items-center justify-content-between">
                    <div>
                        <img src="/images/blocks/logos/hyper-900.svg" alt="Image" height="40" />
                        <p class="mt-2 mb-0 line-height-3 font-medium text-base text-700">&copy; 202X Hyper, Inc. All rights reserved.</p>
                    </div>
                    <div class="mt-3 sm:mt-0">
                        <a class="cursor-pointer text-500 transition-colors transition-duration-150 hover:text-700">
                            <i class="pi pi-twitter text-xl"></i>
                        </a>
                        <a class="cursor-pointer text-500 ml-3 transition-colors transition-duration-150 hover:text-700">
                            <i class="pi pi-facebook text-xl"></i>
                        </a>
                        <a class="cursor-pointer text-500 ml-3 transition-colors transition-duration-150 hover:text-700">
                            <i class="pi pi-github text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
        `,
            block3: `
<nav class="surface-overlay px-4 lg:px-6 shadow-2 flex justify-content-between relative lg:static" style="min-height: 84px">
    <img src="/images/blocks/logos/bastion-700.svg" alt="Image" height="40" class="mr-0 lg:mr-6 align-self-center" />
    <a v-ripple class="p-ripple cursor-pointer block lg:hidden align-self-center text-700" v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
        <i class="pi pi-bars text-4xl"></i>
    </a>
    <div class="flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full surface-overlay left-0 top-100 z-1 shadow-2 lg:shadow-none">
        <ul class="list-none p-0 m-0 flex select-none flex-column lg:flex-row">
            <li>
                <a v-ripple class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150">
                    <i class="pi pi-home mr-2"></i>
                    <span>Home</span>
                </a>
            </li>
            <li>
                <a v-ripple class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150">
                    <i class="pi pi-users mr-2"></i>
                    <span>Customers</span>
                </a>
            </li>
            <li>
                <a v-ripple class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>Calendar</span>
                </a>
            </li>
            <li>
                <a v-ripple class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150">
                    <i class="pi pi-chart-line mr-2"></i>
                    <span>Stats</span>
                </a>
            </li>
        </ul>
        <ul class="list-none p-0 m-0 flex select-none flex-column lg:flex-row border-top-1 surface-border lg:border-top-none">
            <li>
                <a v-ripple class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150">
                    <i class="pi pi-inbox text-base lg:text-2xl mr-2 lg:mr-0"></i>
                    <span class="block lg:hidden font-medium">Inbox</span>
                </a>
            </li>
            <li>
                <a v-ripple class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150">
                    <i class="pi pi-bell text-base lg:text-2xl mr-2 lg:mr-0"></i>
                    <span class="block lg:hidden font-medium">Notifications</span>
                </a>
            </li>
            <li class="border-top-1 surface-border lg:border-top-none">
                <a v-ripple class="p-ripple flex px-6 p-3 h-full lg:px-3 lg:py-2 align-items-center text-600 border-left-2 lg:border-bottom-2 lg:border-left-none border-transparent hover:border-blue-500 font-medium cursor-pointer transition-colors transition-duration-150">
                    <img src="/images/blocks/avatars/circle/avatar-f-1.png" class="mr-3 lg:mr-0" style="width: 28px; height: 28px"/>
                    <div class="block lg:hidden">
                        <div class="text-900 font-medium">Josephine Lillard</div>
                        <span class="text-600 font-medium text-sm">Marketing Specialist</span>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</nav>
<nav class="surface-overlay px-4 lg:px-6 py-4 px-4 lg:px-6 border-y-1 surface-border flex flex-column flex-wrap md:flex-row gap-3 w-full md:justify-content-between md:align-items-center">
    <ul class="list-none m-0 p-0 flex flex-row justify-content-between lg:justify-content-start lg:mb-0">
        <li>
            <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 0}" @click="activeTab3 = 0">
                <i class="pi pi-chart-line md:hidden" :class="{'text-700' : activeTab3 === 0, 'text-600': activeTab3 !== 0}"></i>
                <span class="font-medium hidden md:block" :class="{'text-900': activeTab3 === 0, 'text-600': activeTab3 !== 0}">Overview</span>
            </a>
        </li>
        <li>
            <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 1}" @click="activeTab3 = 1">
                <i class="pi pi-user md:hidden" :class="{'text-700' : activeTab3 === 1, 'text-600': activeTab3 !== 1}"></i>
                <span class="font-medium hidden md:block" :class="{'text-900': activeTab3 === 1, 'text-600': activeTab3 !== 1}">Profile</span>
            </a>
        </li>
        <li>
            <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 2}" @click="activeTab3 = 2">
                <i class="pi pi-bolt md:hidden" :class="{'text-700' : activeTab3 === 2, 'text-600': activeTab3 !== 2}"></i>
                <span class="font-medium hidden md:block" :class="{'text-900': activeTab3 === 2, 'text-600': activeTab3 !== 2}">Activity</span>
            </a>
        </li>
        <li>
            <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors"  :class="{'surface-200': activeTab3 === 3}" @click="activeTab3 = 3">
                <i class="pi pi-users md:hidden" :class="{'text-700' : activeTab3 === 3, 'text-600': activeTab3 !== 3}"></i>
                <span class="font-medium hidden md:block" :class="{'text-900': activeTab3 === 3, 'text-600': activeTab3 !== 3}">Members & Roles</span>
            </a>
        </li>
        <li>
            <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 4}" @click="activeTab3 = 4">
                <i class="pi pi-lock md:hidden" :class="{'text-700' : activeTab3 === 4, 'text-600': activeTab3 !== 4}"></i>
                <span class="font-medium hidden md:block" :class="{'text-900': activeTab3 === 4, 'text-600': activeTab3 !== 4}">Security</span>
            </a>
        </li>
        <li>
            <a v-ripple class="p-ripple flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors" :class="{'surface-200': activeTab3 === 5}" @click="activeTab3 = 5">
                <i class="pi pi-dollar md:hidden" :class="{'text-700' : activeTab3 === 5, 'text-600': activeTab3 !== 5}"></i>
                <span class="font-medium hidden md:block" :class="{'text-900': activeTab3 === 5, 'text-600': activeTab3 !== 5}">Team Plan</span>
            </a>
        </li>
    </ul>
    <span class="p-input-icon-right w-full mt-2 md:mt-0 md:w-15rem">
        <i class="pi pi-search"></i>
        <InputText type="text" placeholder="Search" class="w-full md:w-15rem border-round"/>
    </span>
</nav>
<section class="surface-overlay px-4 lg:px-6 py-4 px-4 lg:px-6 border-top-1 surface-border">
    <div class="border-bottom-1 surface-border">
        <h2 class="mt-0 mb-2 text-900 font-bold text-4xl">Members & Roles</h2>
        <p class="mt-0 mb-5 text-700 font-normal text-base">You can easily manage your team on this page</p>
    </div>
    <section class="flex flex-wrap gap-3 py-6 justify-content-between border-bottom-1 surface-border">
        <div class="flex-shrink-0 w-15rem">
            <h3 class="mb-4 mt-0 text-900 font-medium text-xl">Members</h3>
            <p class="mb-4 mt-0 text-700 font-normal text-base">Manage your member in this project</p>
            <Button label="Invite a member" class="w-auto"></Button>
        </div>
        <div class="overflow-x-scroll">
            <DataTable :value="members" :tabStyle="{'min-width': '60rem'}" rowHover>
                <Column style="min-width:25rem">
                    <template #header>
                        <span class="font-semibold text-sm text-color-secondary">Name</span>
                    </template>
                    <template #body="{data}">
                        <div class="flex align-items-center gap-3">
                                <Avatar :image="'/images/blocks/avatars/circle/' + data.image + '.png'" styleClass="mr-2" size="large" shape="circle"></Avatar>
                                <div>
                                    <p class="mt-0 mb-2 font-medium text-lg text-color-primary">{{data.name}}</p>
                                    <p class="mt-0 mb-2 font-normal text-base text-color-secondary">{{data.username}}</p>
                                </div>
                            </div>
                    </template>
                </Column>
                <Column style="min-width:14rem">
                    <template #header>
                        <span class="font-semibold text-sm text-color-secondary">Joined Date</span>
                    </template>
                    <template #body="{data}">
                        <p class="mt-0 mb-2 font-normal text-base text-color-secondary">{{data.date}}</p>
                    </template>
                </Column>
                <Column style="min-width:13rem">
                    <template #header>
                        <span class="font-semibold text-sm text-color-secondary">Last Active</span>
                    </template>
                    <template #body="{data}">
                        <p class="mt-0 mb-2 font-normal text-base text-color-secondary">{{data.active}}</p>
                    </template>
                </Column>
                <Column style="min-width:8rem">
                    <template #body>
                        <Button type="button" icon="pi pi-ellipsis-v" class="p-button-text p-button-secondary" @click="$refs.menu.toggle($event)"></Button>
                        <Menu ref="menu" appendTo="body" popup :model="items"></Menu>
                    </template>
                </Column>
            </DataTable>
        </div>
    </section>
    <section class="flex flex-wrap gap-3 py-6 justify-content-between border-bottom-1 surface-border">
        <div class="flex-shrink-0 w-15rem">
            <h3 class="mb-4 mt-0 text-900 font-medium text-xl">Roles</h3>
            <p class="mb-4 mt-0 text-700 font-normal text-base">Edit roles in this project</p>
            <Button label="Add a role" class="w-auto"></Button>
        </div>
        <div class="overflow-x-scroll">
            <DataTable :value="roles" rowHover>
                <Column style="min-width:25rem">
                    <template #header>
                        <span class="font-semibold text-sm text-color-secondary">Alias Name</span>
                    </template>
                    <template #body="{data}">
                        <div class="flex align-items-center">
                                <span class="border-circle mr-2" :class="data.color" style="width: 7px; height: 7px;"></span>
                                <p class="mt-0 mb-0 font-medium text-lg text-color-primary">{{data.alias}}</p>
                            </div>
                    </template>
                </Column>
                <Column style="min-width:14rem">
                    <template #header>
                        <span class="font-semibold text-sm text-color-secondary">Last Edit</span>
                    </template>
                    <template #body="{data}">
                        <p class="mt-0 mb-0 font-normal text-base text-color-secondary">{{data.date}}</p>
                    </template>
                </Column>
                <Column style="min-width:13rem">
                    <template #header>
                        <span class="font-semibold text-sm text-color-secondary">Users</span>
                    </template>
                    <template #body="{data}">
                        <p class="mt-0 mb-0 font-normal text-base text-color-secondary">{{data.users}}</p>
                    </template>
                </Column>
                <Column style="min-width:8rem">
                    <template #body>
                        <Button type="button" icon="pi pi-ellipsis-v" class="p-button-text p-button-secondary" @click="$refs.menu.toggle($event)"></Button>
                        <Menu ref="menu" appendTo="body" popup :model="items"></Menu>
                    </template>
                </Column>
            </DataTable>
        </div>
    </section>
</section>
`,
            activeTab: 0,
            activeTab2: 1,
            activeTab3: 0,
            value1: false,
            checked: false,
            selectedCountry: null,
            countries: [
                { name: 'Australia', code: 'AU' },
                { name: 'Brazil', code: 'BR' },
                { name: 'China', code: 'CN' },
                { name: 'Egypt', code: 'EG' },
                { name: 'France', code: 'FR' },
                { name: 'Germany', code: 'DE' },
                { name: 'India', code: 'IN' },
                { name: 'Japan', code: 'JP' },
                { name: 'Spain', code: 'ES' },
                { name: 'United States', code: 'US' }
            ],
            members: [
                {
                    image: 'avatar-f-13',
                    name: 'Jenny Wilson',
                    username: '@jnnywlsn',
                    date: 'Oct 30, 2022',
                    active: '2 hours ago'
                },
                {
                    image: 'avatar-f-14',
                    name: 'Kathryn Murphy',
                    username: '@murphyyy',
                    date: 'Jul 14, 2022',
                    active: '5 days ago'
                },
                {
                    image: 'avatar-f-15',
                    name: 'Leslie Alexander',
                    username: '@leslie98',
                    date: 'Dec 19, 2022',
                    active: '4 days ago'
                },
                {
                    image: 'avatar-m-13',
                    name: 'Ralph Edwards',
                    username: '@ralphadator',
                    date: 'Feb 11, 2022',
                    active: '9 hours ago'
                },
                {
                    image: 'avatar-m-14',
                    name: 'Guy Hawkins',
                    username: '@guyman',
                    date: 'Aug 02, 2022',
                    active: '2 hours ago'
                },
                {
                    image: 'avatar-f-16',
                    name: 'Wade Warren',
                    username: '@wayyyd',
                    date: 'May 20, 2022',
                    active: '6 days ago'
                },
                {
                    image: 'avatar-f-17',
                    name: 'Kristin Watson',
                    username: '@kristinwtsn',
                    date: 'Nov 28, 2022',
                    active: '5 days ago'
                }
            ],
            roles: [
                {
                    color: 'bg-purple-500',
                    alias: 'Project Manager',
                    date: 'Oct 30, 2022',
                    users: '4 users'
                },
                {
                    color: 'bg-blue-500',
                    alias: 'QA Manager',
                    date: 'Oct 30, 2022',
                    users: '2 users'
                },
                {
                    color: 'bg-green-500',
                    alias: 'QA Tester',
                    date: 'Oct 30, 2022',
                    users: '1 user'
                },
                {
                    color: 'bg-red-500',
                    alias: 'Product Manager',
                    date: 'Oct 30, 2022',
                    users: '7 users'
                },
                {
                    color: 'bg-indigo-500',
                    alias: 'UX Designer',
                    date: 'Oct 30, 2022',
                    users: '1 users'
                },
                {
                    color: 'bg-green-500',
                    alias: 'UI Designer',
                    date: 'Oct 30, 2022',
                    users: '3 users'
                },
                {
                    color: 'bg-orange-500',
                    alias: 'Developer',
                    date: 'Oct 30, 2022',
                    users: '5 users'
                }
            ],
            items: [
                {
                    label: 'Options',
                    items: [
                        {
                            label: 'Update',
                            icon: 'pi pi-refresh'
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-times'
                        }
                    ]
                }
            ]
        };
    }
};
</script>
