<template>
    <BlockViewer header="Simple" :code="block1" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
        <section class="w-30rem border-1 surface-border border-round-lg">
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText type="text" placeholder="Search menus, shortcuts, contact and more..." class="w-full border-none shadow-none outline-none" @click="visible1 = true" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
        </section>
        <Dialog
            v-model:visible="visible1"
            dismissableMask
            modal
            :showHeader="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }"
            contentClass="border-round-top p-0"
            appendTo="body"
            @hide="
                visible1 = false;
                value1 = '';
            "
        >
            <div class="flex w-full surface-section align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText ref="input1" type="text" placeholder="Search menus, shortcuts, contact and more..." v-model="value1" class="w-full border-none shadow-none outline-none" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
            <div class="border-y-1 surface-border px-3 py-3">
                <h2 class="font-semibold text-xs text-500 mb-2 mt-0 px-1">RECENT</h2>
                <ul class="list-none m-0 p-0">
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">unread mails</li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">go to last mail</li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">lock account</li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">profile</li>
                </ul>
            </div>
            <div class="p-2">
                <article class="flex w-full justify-content-between align-items-center mb-3 select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
                    <div class="flex align-items-center">
                        <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                            <i class="pi pi-cog text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">System Settings</p>
                            <p class="font-normal text-xs text-600 mt-0 mb-0">Change your system preferences</p>
                        </div>
                    </div>
                    <span class="hidden md:inline-block border-1 px-2 py-1 surface-border border-round surface-100 mr-2 text-600 text-xs">S</span>
                </article>

                <article class="flex w-full justify-content-between align-items-center mb-3 select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
                    <div class="flex align-items-center">
                        <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                            <i class="pi pi-user text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">My Profile</p>
                            <p class="font-normal text-xs text-600 mt-0 mb-0">Go to your profile</p>
                        </div>
                    </div>
                    <span class="hidden md:inline-block border-1 px-2 py-1 surface-border border-round surface-100 mr-2 text-600 text-xs">P</span>
                </article>

                <article class="flex w-full justify-content-between align-items-center mb-3 select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
                    <div class="flex align-items-center">
                        <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                            <i class="pi pi-moon text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">Switch to Dark Mode</p>
                            <p class="font-normal text-xs text-600 mt-0 mb-0">Switch to dark mode save your eyes</p>
                        </div>
                    </div>
                    <span class="hidden md:inline-block border-1 px-2 py-1 surface-border border-round surface-100 mr-2 text-600 text-xs">D</span>
                </article>

                <article class="flex w-full justify-content-between align-items-center select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
                    <div class="flex align-items-center">
                        <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                            <i class="pi pi-sign-out text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">Log out</p>
                            <p class="font-normal text-xs text-600 mt-0 mb-0">End your session</p>
                        </div>
                    </div>
                </article>
            </div>
        </Dialog>
    </BlockViewer>

    <BlockViewer header="Not Found" :code="block2" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
        <section class="w-30rem border-1 surface-border border-round-lg">
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText type="text" placeholder="Search menus, shortcuts, contact and more..." class="w-full border-none shadow-none outline-none" @click="visible2 = true" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
        </section>
        <Dialog
            v-model:visible="visible2"
            dismissableMask
            modal
            :showHeader="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }"
            contentClass="border-round-top p-0"
            appendTo="body"
            @hide="
                visible2 = false;
                value2 = '';
            "
        >
            <div class="flex w-full surface-section align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText ref="input2" type="text" placeholder="Search menus, shortcuts, contact and more..." v-model="value2" class="w-full border-none shadow-none outline-none" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
            <section class="border-y-1 surface-border p-5 flex flex-column align-items-center gap-2">
                <h2 class="m-0 font-semibold text-900 text-xl">No emails found</h2>
                <span class="text-sm text-600 text-center">"{{ value2 }}" could not match any emails. Would you like to write a new email?</span>
                <div class="flex justfiy-content-center gap-3 mt-3">
                    <Button class="p-button-outlined" label="View all emails"></Button>
                    <Button icon="pi pi-plus" label="Compose"></Button>
                </div>
            </section>
        </Dialog>
    </BlockViewer>

    <BlockViewer header="With Icons" :code="block3" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
        <section class="w-30rem border-1 surface-border border-round-lg">
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText type="text" placeholder="Search menus, shortcuts, contact and more..." class="w-full border-none shadow-none outline-none" @click="visible3 = true" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
        </section>
        <Dialog
            v-model:visible="visible3"
            dismissableMask
            modal
            :showHeader="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }"
            contentClass="border-round-top p-0"
            appendTo="body"
            @hide="
                visible3 = false;
                value3 = '';
            "
        >
            <div class="flex w-full surface-section align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText type="text" ref="input3" placeholder="Search menus, shortcuts, contact and more..." v-model="value3" class="w-full border-none shadow-none outline-none" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
            <div class="border-y-1 surface-border p-3">
                <h2 class="font-semibold text-xs text-500 mb-2 mt-0 px-1">RECENT</h2>
                <ul class="list-none m-0 p-0">
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-file mr-2"></i>Add new file</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">N</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-lock mr-2"></i>Lock Session</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">L</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-moon mr-2"></i>Dark Mode</span>
                    </li>
                </ul>
            </div>
            <div class="p-3">
                <ul class="list-none m-0 p-0">
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-bell mr-2"></i>Notifications</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">C</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-bookmark mr-2"></i>Bookmarks</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">B</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-bolt mr-2"></i>Quick Actions</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">SHIFT</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">Q</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-users mr-2"></i>Manage User Groups</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">U</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-book mr-2"></i>Go to Documentation</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">SHIFT</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">L</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                        <span class="flex align-items-center"><i class="pi pi-cog mr-2"></i>System Preferences</span>
                        <div class="hidden md:flex align-items-center">
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                            <span class="mx-2 text-600">+</span>
                            <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">P</span>
                        </div>
                    </li>
                </ul>
            </div>
        </Dialog>
    </BlockViewer>

    <BlockViewer header="With Avatars" :code="block4" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
        <section class="w-30rem border-1 surface-border border-round-lg">
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText type="text" placeholder="Find someone quickly..." class="w-full border-none shadow-none outline-none text-white-alpha-80" @click="visible4 = true" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
        </section>
        <Dialog
            v-model:visible="visible4"
            dismissableMask
            modal
            :showHeader="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '50vw' }"
            contentClass="border-round-top p-0"
            appendTo="body"
            @hide="
                visible4 = false;
                value4 = '';
            "
        >
            <div class="flex w-full surface-section align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-500"></i>
                    <InputText ref="input4" type="text" placeholder="Find someone quickly..." v-model="value4" class="w-full border-none shadow-none outline-none" @click="visible4 = true" />
                </span>
                <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
            </div>
            <div class="border-y-1 surface-border p-3">
                <h2 class="font-semibold text-xs text-500 mb-2 mt-0 px-1">RECENT</h2>
                <ul class="list-none m-0 p-0">
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-1.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Sarah Dylan</span>
                            <span class="text-600 text-xs">@srhdylan</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-2.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Marvin McKinney</span>
                            <span class="text-600 text-xs">@terekdriving</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-3.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Jenny Wilson</span>
                            <span class="text-600 text-xs">@lewissanctuary</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="p-3">
                <ul class="list-none m-0 p-0">
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-4.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Wade Warren</span>
                            <span class="text-600 text-xs">@amusementethics</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-5.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Darlene Robertson</span>
                            <span class="text-600 text-xs">@pointersnutmeg</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-6.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Courtney Henry</span>
                            <span class="text-600 text-xs">@amisssteadily</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-7.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Annette Black</span>
                            <span class="text-600 text-xs">@raddledhastily</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-8.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Arlene McCoy</span>
                            <span class="text-600 text-xs">@germlessshredder</span>
                        </div>
                    </li>
                    <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-f-9.png" alt="Image" class="w-2rem h-2rem" />
                        <div class="flex flex-column justify-content-center">
                            <span class="text-800 text-base">Savannah Nguyen</span>
                            <span class="text-600 text-xs">@zapdetergent</span>
                        </div>
                    </li>
                </ul>
            </div>
        </Dialog>
    </BlockViewer>

    <BlockViewer
        header="Transparent"
        :code="block5"
        recent
        containerClass="bg-no-repeat bg-center px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center"
        :previewStyle="{
            'background-image': 'url(/images/blocks/commandmenu/commandmenu-1.jpg)',
            height: '700px'
        }"
    >
        <section class="w-30rem bg-black-alpha-50 border-round-lg" style="backdrop-filter: blur(70px)">
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-white-alpha-80"></i>
                    <InputText
                        type="text"
                        v-model="value5"
                        class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm"
                        @click="
                            visible5 = true;
                            value5 = '';
                        "
                    />
                </span>
                <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
            </div>
        </section>
        <Dialog
            v-model:visible="visible5"
            dismissableMask
            modal
            :showHeader="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '620px', 'backdrop-filter': 'blur(70px)' }"
            class="border-none bg-black-alpha-50"
            contentClass="border-black-alpha-20 border-round p-0 bg-transparent"
            appendTo="body"
            @hide="
                visible5 = false;
                value5 = 'Search menus, shortcuts, contact and more...';
            "
        >
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-white-alpha-80"></i>
                    <InputText ref="input5" type="text" v-model="value5" class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm" />
                </span>
                <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
            </div>
            <div class="border-y-2 border-white-alpha-20 p-3">
                <h2 class="font-semibold text-xs text-white-alpha-50 mb-2 mt-0 px-1">RECENT</h2>
                <ul class="list-none m-0 p-0">
                    <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">unread mails</li>
                    <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">go to last mail</li>
                    <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">lock account</li>
                    <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">profile</li>
                </ul>
            </div>
            <div class="p-3">
                <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
                    <div class="flex align-items-center">
                        <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                            <i class="pi pi-star text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">Favorites</p>
                            <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Reach your favorites easily</p>
                        </div>
                    </div>
                    <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                        <span class="mx-2 text-white-alpha-80">+</span>
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">F</span>
                    </div>
                </article>

                <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
                    <div class="flex align-items-center">
                        <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                            <i class="pi pi-github text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">Repositories</p>
                            <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Get list and manage your repositories</p>
                        </div>
                    </div>
                    <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                        <span class="mx-2 text-white-alpha-80">+</span>
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">SHIFT</span>
                        <span class="mx-2 text-white-alpha-80">+</span>
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">R</span>
                    </div>
                </article>

                <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
                    <div class="flex align-items-center">
                        <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                            <i class="pi pi-bolt text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">Uprade your plan now</p>
                            <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Access all premium benefits</p>
                        </div>
                    </div>
                    <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                        <span class="mx-2 text-white-alpha-80">+</span>
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">U</span>
                    </div>
                </article>

                <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
                    <div class="flex align-items-center">
                        <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                            <i class="pi pi-sync text-lg"></i>
                        </span>
                        <div class="ml-2">
                            <p class="font-semibold text-sm mt-0 mb-1">Resync your account</p>
                            <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Refresh all of your data</p>
                        </div>
                    </div>
                    <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                        <span class="mx-2 text-white-alpha-80">+</span>
                        <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">/</span>
                    </div>
                </article>
            </div>
            <div class="p-2 bg-white-alpha-10 border-top-1 border-white-alpha-20 flex flex-wrap sm:flex-nowrap align-items-center">
                <p class="hidden md:block mt-0 mb-0 mr-3 text-xs text-white-alpha-70">
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">P</span>
                    Select
                </p>
                <p class="hidden md:block mt-0 mb-0 mr-3 text-xs text-white-alpha-70">
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↑</span>
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↓</span>
                    Navigate
                </p>
                <p class="hidden md:block mt-0 mb-0 mr-3 text-xs text-white-alpha-70 flex-align-items-center justify-content-center flex-row">
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20 inline-flex">esc</span>
                    Close
                </p>
                <p class="w-full md:w-auto mt-0 mb-0 md:ml-auto text-xs text-white-alpha-70">4 results</p>
            </div>
        </Dialog>
    </BlockViewer>

    <BlockViewer
        header="With Preview"
        :code="block6"
        recent
        containerClass="bg-no-repeat bg-center px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center"
        :previewStyle="{
            'background-image': 'url(/images/blocks/commandmenu/commandmenu-2.jpg)',
            height: '700px'
        }"
    >
        <section class="w-30rem bg-black-alpha-50 border-round-lg" style="backdrop-filter: blur(70px); width: 40rem">
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-white-alpha-80"></i>
                    <InputText
                        type="text"
                        v-model="value6"
                        class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm"
                        @click="
                            visible6 = true;
                            value6 = '';
                        "
                    />
                </span>
                <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
            </div>
        </section>
        <Dialog
            v-model:visible="visible6"
            dismissableMask
            modal
            :showHeader="false"
            :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
            :style="{ width: '620px', 'backdrop-filter': 'blur(70px)' }"
            class="border-none bg-black-alpha-50"
            contentClass="border-black-alpha-20 border-round-top p-0 bg-transparent"
            @hide="visible6 = false"
        >
            <div class="flex w-full align-items-center justify-content-between px-1">
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-search text-white-alpha-80"></i>
                    <InputText ref="input6" type="text" v-model="value6" class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm" />
                </span>
                <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
            </div>
            <div class="flex flex-column md:flex-row border-top-1 border-white-alpha-20">
                <div class="w-full md:w-6 p-3 md:border-right-1 border-white-alpha-20">
                    <ul class="list-none m-0 p-0">
                        <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                            <span><i class="pi pi-image mr-2"></i>mail-sign.jpg</span>
                            <i class="pi pi-chevron-right text-xs"></i>
                        </li>
                        <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                            <span><i class="pi pi-image mr-2"></i>portrait-sign.jpg</span>
                            <i class="pi pi-chevron-right text-xs"></i>
                        </li>
                        <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                            <span><i class="pi pi-image mr-2"></i>sign-in.png</span>
                            <i class="pi pi-chevron-right text-xs"></i>
                        </li>
                        <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                            <span><i class="pi pi-image mr-2"></i>sign-out.png</span>
                            <i class="pi pi-chevron-right text-xs"></i>
                        </li>
                        <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                            <span><i class="pi pi-file-excel mr-2"></i>sign-terms.xls</span>
                            <i class="pi pi-chevron-right text-xs"></i>
                        </li>
                        <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                            <span><i class="pi pi-file-pdf mr-2"></i>sign-present.pdf</span>
                            <i class="pi pi-chevron-right text-xs"></i>
                        </li>
                    </ul>
                </div>
                <div class="w-full md:w-6 px-3 py-4 md:p-3 flex flex-column align-items-center md:align-items-start border-top-1 border-white-alpha-20 md:border-none">
                    <img src="/images/blocks/commandmenu/commandmenu-3.jpeg" class="w-10rem h-6rem mx-auto border-round shadow-2" alt="Image" />
                    <p class="font-medium text-sm text-white mt-2 mb-2 w-full text-center">portrait-sign.jpg</p>
                    <div class="flex w-full gap-2 text-white-alpha-80">
                        <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem"><i class="pi pi-eye"></i></span>
                        <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem"><i class="pi pi-star"></i></span>
                        <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem"><i class="pi pi-copy"></i></span>
                        <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem"><i class="pi pi-upload"></i></span>
                    </div>
                    <table class="w-full mt-2">
                        <tr>
                            <td>
                                <p class="text-white font-medium text-xs my-1">File Size</p>
                            </td>
                            <td>
                                <p class="text-white font-medium text-xs text-right my-1">345 kb</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="text-white font-medium text-xs my-1">Location</p>
                            </td>
                            <td>
                                <div class="inline-flex w-full align-items-center justify-content-end">
                                    <p class="text-white font-medium text-xs text-right my-1">My Drive/Personal//images/</p>
                                    <span class="bg-white-alpha-20 border-circle ml-1 p-1 flex align-items-center justify-content-center"><i class="pi pi-folder-open text-white" style="font-size: 8px"></i></span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="text-white font-medium text-xs my-1">Tags</p>
                            </td>
                            <td>
                                <div class="inline-flex w-full justify-content-end">
                                    <div class="flex align-items-center mr-2">
                                        <div class="bg-green-500 flex-shrink-0 border-circle mr-1" style="width: 10px; height: 10px"></div>
                                        <p class="text-white font-medium text-xs mt-0 mb-0">Green</p>
                                    </div>
                                    <div class="flex align-items-center">
                                        <div class="bg-yellow-500 flex-shrink-0 border-circle mr-1" style="width: 10px; height: 10px"></div>
                                        <p class="text-white font-medium text-xs mt-0 mb-0">Yellow</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="hidden md:flex column-gap-1 md:column-gap-3 flex-wrap md:flex-nowrap align-items-center justify-content-evenly sm:justify-content-start px-2 bg-white-alpha-10 border-top-1 border-white-alpha-20">
                <p class="text-xs text-white-alpha-70">
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">⏎</span>
                    Select
                </p>
                <p class="text-xs text-white-alpha-70">
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↑</span>
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↓</span>
                    Navigate
                </p>
                <p class="text-xs text-white-alpha-70 flex-align-items-center justify-content-center flex-row">
                    <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20 inline-flex">esc</span>
                    Close
                </p>
            </div>
        </Dialog>
    </BlockViewer>
</template>

<script>
export default {
    data() {
        return {
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            visible6: false,
            value1: null,
            value2: null,
            value3: null,
            value4: null,
            value5: 'Search menus, shortcuts, contact and more...',
            value6: 'Sign',

            block1: `
<section class="w-30rem border-1 surface-border border-round-lg">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText type="text" placeholder="Search menus, shortcuts, contact and more..." class="w-full border-none shadow-none outline-none" @click="visible1 = true"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
</section>
<Dialog v-model:visible="visible1" dismissableMask modal :showHeader="false" :breakpoints="{'960px':'75vw', '640px': '100vw'}" :style="{width: '50vw'}" contentClass="border-round-top p-0" appendTo="body" @hide="visible1 = false;  value1 = '';">
    <div class="flex w-full surface-section align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText ref="input1" type="text" placeholder="Search menus, shortcuts, contact and more..." v-model="value1" class="w-full border-none shadow-none outline-none"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
    <div class="border-y-1 surface-border px-3 py-3">
        <h2 class="font-semibold text-xs text-500 mb-2 mt-0 px-1">RECENT</h2>
        <ul class="list-none m-0 p-0">
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">unread mails</li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">go to last mail</li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">lock account</li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary">profile</li>
        </ul>
    </div>
    <div class="p-2">
        <article class="flex w-full justify-content-between align-items-center mb-3 select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
            <div class="flex align-items-center">
                <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                    <i class="pi pi-cog text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">System Settings</p>
                    <p class="font-normal text-xs text-600 mt-0 mb-0">Change your system preferences</p>
                </div>
            </div>
            <span class="hidden md:inline-block border-1 px-2 py-1 surface-border border-round surface-100 mr-2 text-600 text-xs">S</span>
        </article>

        <article class="flex w-full justify-content-between align-items-center mb-3 select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
            <div class="flex align-items-center">
                <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                    <i class="pi pi-user text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">My Profile</p>
                    <p class="font-normal text-xs text-600 mt-0 mb-0">Go to your profile</p>
                </div>
            </div>
            <span class="hidden md:inline-block border-1 px-2 py-1 surface-border border-round surface-100 mr-2 text-600 text-xs">P</span>
        </article>

        <article class="flex w-full justify-content-between align-items-center mb-3 select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
            <div class="flex align-items-center">
                <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                    <i class="pi pi-moon text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">Switch to Dark Mode</p>
                    <p class="font-normal text-xs text-600 mt-0 mb-0">Switch to dark mode save your eyes</p>
                </div>
            </div>
            <span class="hidden md:inline-block border-1 px-2 py-1 surface-border border-round surface-100 mr-2 text-600 text-xs">D</span>
        </article>

        <article class="flex w-full justify-content-between align-items-center select-none cursor-pointer surface-border hover:surface-hover border-round-lg px-2 py-1 text-800 hover:text-primary">
            <div class="flex align-items-center">
                <span class="border-circle w-2rem h-2rem flex align-items-center justify-content-center surface-100">
                    <i class="pi pi-sign-out text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">Log out</p>
                    <p class="font-normal text-xs text-600 mt-0 mb-0">End your session</p>
                </div>
            </div>
        </article>
    </div>
</Dialog>
`,
            block2: `
<section class="w-30rem border-1 surface-border border-round-lg">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText type="text" placeholder="Search menus, shortcuts, contact and more..." class="w-full border-none shadow-none outline-none" @click="visible2 = true;"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
</section>
<Dialog v-model:visible="visible2" dismissableMask modal :showHeader="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" contentClass="border-round-top p-0" appendTo="body" @hide="visible2 = false; value2 = '';">
    <div class="flex w-full surface-section align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText ref="input2" type="text" placeholder="Search menus, shortcuts, contact and more..." v-model="value2" class="w-full border-none shadow-none outline-none"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
    <section class="border-y-1 surface-border p-5 flex flex-column align-items-center gap-2">
        <h2 class="m-0 font-semibold text-900 text-xl">No emails found</h2>
        <span class="text-sm text-600 text-center">"{{ value2 }}" could not match any emails.
            Would you like to write a new email?</span>
        <div class="flex justfiy-content-center gap-3 mt-3">
            <Button class="p-button-outlined" label="View all emails"></Button>
            <Button icon="pi pi-plus" label="Compose"></Button>
        </div>
    </section>
</Dialog>
`,
            block3: `
<section class="w-30rem border-1 surface-border border-round-lg">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText type="text" placeholder="Search menus, shortcuts, contact and more..." class="w-full border-none shadow-none outline-none" @click="visible3 = true;"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
</section>
<Dialog v-model:visible="visible3" dismissableMask modal :showHeader="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" contentClass="border-round-top p-0" appendTo="body" @hide="visible3 = false; value3 = '';">
    <div class="flex w-full surface-section align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText type="text" ref="input3" placeholder="Search menus, shortcuts, contact and more..." v-model="value3" class="w-full border-none shadow-none outline-none"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
    <div class="border-y-1 surface-border p-3">
        <h2 class="font-semibold text-xs text-500 mb-2 mt-0 px-1">RECENT</h2>
        <ul class="list-none m-0 p-0">
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-file mr-2"></i>Add new file</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">N</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-lock mr-2"></i>Lock Session</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">L</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-moon mr-2"></i>Dark Mode</span>
            </li>
        </ul>
    </div>
    <div class="p-3">
        <ul class="list-none m-0 p-0">
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-bell mr-2"></i>Notifications</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">C</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-bookmark mr-2"></i>Bookmarks</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">B</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-bolt mr-2"></i>Quick Actions</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">SHIFT</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">Q</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-users mr-2"></i>Manage User Groups</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">U</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-book mr-2"></i>Go to Documentation</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">SHIFT</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">L</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex justify-content-between align-items-center">
                <span class="flex align-items-center"><i class="pi pi-cog mr-2"></i>System Preferences</span>
                <div class="hidden md:flex align-items-center">
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">CMD</span>
                    <span class="mx-2 text-600">+</span>
                    <span class="border-1 p-1 surface-border border-round surface-100 text-600 text-xs">P</span>
                </div>
            </li>
        </ul>
    </div>
</Dialog>
`,
            block4: `
<section class="w-30rem border-1 surface-border border-round-lg">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText type="text" placeholder="Find someone quickly..." class="w-full border-none shadow-none outline-none text-white-alpha-80" @click="visible4 = true;"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
</section>
<Dialog v-model:visible="visible4" dismissableMask modal :showHeader="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" contentClass="border-round-top p-0" appendTo="body" @hide="visible4 = false; value4 = '';">
    <div class="flex w-full surface-section align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-500"></i>
            <InputText ref="input4" type="text" placeholder="Find someone quickly..." v-model="value4" class="w-full border-none shadow-none outline-none" @click="visible4 = true;"/>
        </span>
        <span class="border-1 p-1 surface-border border-round surface-100 mr-2 text-600 text-xs hidden md:block">⌘K</span>
    </div>
    <div class="border-y-1 surface-border p-3">
        <h2 class="font-semibold text-xs text-500 mb-2 mt-0 px-1">RECENT</h2>
        <ul class="list-none m-0 p-0">
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-1.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Sarah Dylan</span>
                    <span class="text-600 text-xs">@srhdylan</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-2.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Marvin McKinney</span>
                    <span class="text-600 text-xs">@terekdriving</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-3.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Jenny Wilson</span>
                    <span class="text-600 text-xs">@lewissanctuary</span>
                </div>
            </li>
        </ul>
    </div>
    <div class="p-3">
        <ul class="list-none m-0 p-0">
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-4.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Wade Warren</span>
                    <span class="text-600 text-xs">@amusementethics</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-5.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Darlene Robertson</span>
                    <span class="text-600 text-xs">@pointersnutmeg</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-6.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Courtney Henry</span>
                    <span class="text-600 text-xs">@amisssteadily</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-7.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Annette Black</span>
                    <span class="text-600 text-xs">@raddledhastily</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-8.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Arlene McCoy</span>
                    <span class="text-600 text-xs">@germlessshredder</span>
                </div>
            </li>
            <li class="select-none p-2 font-medium text-base cursor-pointer border-round-lg hover:surface-hover hover:text-primary flex gap-2 align-items-center">
                <img src="/images/blocks/avatars/circle/avatar-f-9.png" alt="Image" class="w-2rem h-2rem" />
                <div class="flex flex-column justify-content-center">
                    <span class="text-800 text-base">Savannah Nguyen</span>
                    <span class="text-600 text-xs">@zapdetergent</span>
                </div>
            </li>
        </ul>
    </div>
</Dialog>
`,
            block5: `
<section class="w-30rem bg-black-alpha-50 border-round-lg" style="backdrop-filter: blur(70px)">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-white-alpha-80"></i>
            <InputText type="text" v-model="value5" class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm" @click="visible5 = true; value5 = '';"/>
        </span>
        <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
    </div>
</section>
<Dialog v-model:visible="visible5" dismissableMask modal :showHeader="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '620px', 'backdrop-filter': 'blur(70px)'}" class="border-none bg-black-alpha-50" contentClass="border-black-alpha-20 border-round p-0 bg-transparent" appendTo="body" @hide="visible5 = false; value5 = 'Search menus, shortcuts, contact and more...';">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-white-alpha-80"></i>
            <InputText ref="input5" type="text" v-model="value5" class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm"/>
        </span>
        <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
    </div>
    <div class="border-y-2 border-white-alpha-20 p-3">
        <h2 class="font-semibold text-xs text-white-alpha-50 mb-2 mt-0 px-1">RECENT</h2>
        <ul class="list-none m-0 p-0">
            <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">unread mails</li>
            <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">go to last mail</li>
            <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">lock account</li>
            <li class="select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">profile</li>
        </ul>
    </div>
    <div class="p-3">
        <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
            <div class="flex align-items-center">
                <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                    <i class="pi pi-star text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">Favorites</p>
                    <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Reach your favorites easily</p>
                </div>
            </div>
            <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                <span class="mx-2 text-white-alpha-80">+</span>
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">F</span>
            </div>
        </article>

        <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
            <div class="flex align-items-center">
                <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                    <i class="pi pi-github text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">Repositories</p>
                    <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Get list and manage your repositories</p>
                </div>
            </div>
            <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                <span class="mx-2 text-white-alpha-80">+</span>
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">SHIFT</span>
                <span class="mx-2 text-white-alpha-80">+</span>
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">R</span>
            </div>
        </article>

        <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
            <div class="flex align-items-center">
                <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                    <i class="pi pi-bolt text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">Uprade your plan now</p>
                    <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Access all premium benefits</p>
                </div>
            </div>
            <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                <span class="mx-2 text-white-alpha-80">+</span>
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">U</span>
            </div>
        </article>

        <article class="flex flex-column sm:flex-row w-full sm:justify-content-between sm:align-items-center mb-3 select-none cursor-pointer border-round-lg px-2 py-1 text-white-alpha-80 hover:bg-white-alpha-20 hover:text-white">
            <div class="flex align-items-center">
                <span class="border-circle flex-shrink-0 w-2rem h-2rem flex align-items-center justify-content-center bg-white-alpha-20">
                    <i class="pi pi-sync text-lg"></i>
                </span>
                <div class="ml-2">
                    <p class="font-semibold text-sm mt-0 mb-1">Resync your account</p>
                    <p class="font-normal text-xs text-white-alpha-80 mt-0 mb-0">Refresh all of your data</p>
                </div>
            </div>
            <div class="hidden md:flex align-items-center md:align-self-center mt-3 sm:mt-0">
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">⌘</span>
                <span class="mx-2 text-white-alpha-80">+</span>
                <span class="px-2 py-1 border-white-alpha-20 border-1 border-round text-white-alpha-80 text-xs bg-white-alpha-20">/</span>
            </div>
        </article>
    </div>
    <div class="p-2 bg-white-alpha-10 border-top-1 border-white-alpha-20 flex flex-wrap sm:flex-nowrap align-items-center">
        <p class="hidden md:block mt-0 mb-0 mr-3 text-xs text-white-alpha-70">
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">P</span>
            Select
        </p>
        <p class="hidden md:block mt-0 mb-0 mr-3 text-xs text-white-alpha-70">
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↑</span>
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↓</span>
            Navigate
        </p>
        <p class="hidden md:block mt-0 mb-0 mr-3 text-xs text-white-alpha-70 flex-align-items-center justify-content-center flex-row">
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20 inline-flex">esc</span>
            Close
        </p>
        <p class="w-full md:w-auto mt-0 mb-0 md:ml-auto text-xs text-white-alpha-70">4 results</p>
    </div>
</Dialog>
`,
            block6: `
<section class="w-30rem bg-black-alpha-50 border-round-lg" style="backdrop-filter: blur(70px); width: 40rem;">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-white-alpha-80"></i>
            <InputText type="text" v-model="value6" class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm" @click="visible6 = true; value6 = '';"/>
        </span>
        <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
    </div>
</section>
<Dialog v-model:visible="visible6" dismissableMask modal :showHeader="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '620px', 'backdrop-filter': 'blur(70px)'}" class="border-none bg-black-alpha-50" contentClass="border-black-alpha-20 border-round-top p-0 bg-transparent" @hide="visible6 = false;">
    <div class="flex w-full align-items-center justify-content-between px-1">
        <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-white-alpha-80"></i>
            <InputText ref="input6" type="text" v-model="value6" class="w-full border-none bg-transparent shadow-none outline-none text-white-alpha-80 text-sm"/>
        </span>
        <span class="p-1 border-white-alpha-20 border-1 border-round mr-2 text-white-alpha-80 text-xs bg-white-alpha-2s hidden md:block">⌘K</span>
    </div>
    <div class="flex flex-column md:flex-row border-top-1 border-white-alpha-20">
        <div class="w-full md:w-6 p-3 md:border-right-1 border-white-alpha-20">
            <ul class="list-none m-0 p-0">
                <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                    <span><i class="pi pi-image mr-2"></i>mail-sign.jpg</span>
                    <i class="pi pi-chevron-right text-xs"></i>
                </li>
                <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                    <span><i class="pi pi-image mr-2"></i>portrait-sign.jpg</span>
                    <i class="pi pi-chevron-right text-xs"></i>
                </li>
                <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                    <span><i class="pi pi-image mr-2"></i>sign-in.png</span>
                    <i class="pi pi-chevron-right text-xs"></i>
                </li>
                <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                    <span><i class="pi pi-image mr-2"></i>sign-out.png</span>
                    <i class="pi pi-chevron-right text-xs"></i>
                </li>
                <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                    <span><i class="pi pi-file-excel mr-2"></i>sign-terms.xls</span>
                    <i class="pi pi-chevron-right text-xs"></i>
                </li>
                <li class="flex justify-content-between align-items-center select-none p-2 text-white-alpha-80 font-normal text-base cursor-pointer border-round-lg hover:bg-white-alpha-20 hover:text-white">
                    <span><i class="pi pi-file-pdf mr-2"></i>sign-present.pdf</span>
                    <i class="pi pi-chevron-right text-xs"></i>
                </li>
            </ul>
        </div>
        <div class="w-full md:w-6 px-3 py-4 md:p-3 flex flex-column align-items-center md:align-items-start border-top-1 border-white-alpha-20 md:border-none">
            <img src="/images/blocks/commandmenu/commandmenu-3.jpeg" class="w-10rem h-6rem mx-auto border-round shadow-2" alt="Image" />
            <p class="font-medium text-sm text-white mt-2 mb-2 w-full text-center">portrait-sign.jpg</p>
            <div class="flex w-full gap-2 text-white-alpha-80">
                <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem;"><i class="pi pi-eye"></i></span>
                <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem;"><i class="pi pi-star"></i></span>
                <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem;"><i class="pi pi-copy"></i></span>
                <span class="flex flex-grow-1 justify-content-center align-items-center border-round bg-white-alpha-20 text-white hover:bg-white-alpha-30 cursor-pointer" style="height: 2rem; width: 4rem;"><i class="pi pi-upload"></i></span>
            </div>
            <table class="w-full mt-2">
                <tr>
                    <td>
                        <p class="text-white font-medium text-xs my-1">File Size</p>
                    </td>
                    <td>
                        <p class="text-white font-medium text-xs text-right my-1">345 kb</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="text-white font-medium text-xs my-1">Location</p>
                    </td>
                    <td>
                        <div class="inline-flex w-full align-items-center justify-content-end">
                            <p class="text-white font-medium text-xs text-right my-1">My Drive/Personal//images/</p>
                            <span class="bg-white-alpha-20 border-circle ml-1 p-1 flex align-items-center justify-content-center"><i class="pi pi-folder-open text-white" style="font-size: 8px;"></i></span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="text-white font-medium text-xs my-1">Tags</p>
                    </td>
                    <td>
                        <div class="inline-flex w-full justify-content-end">
                            <div class="flex align-items-center mr-2">
                                <div class="bg-green-500 flex-shrink-0 border-circle mr-1" style="width:10px; height:10px;"></div>
                                <p class="text-white font-medium text-xs mt-0 mb-0">Green</p>
                            </div>
                            <div class="flex align-items-center">
                                <div class="bg-yellow-500 flex-shrink-0 border-circle mr-1" style="width:10px; height:10px;"></div>
                                <p class="text-white font-medium text-xs mt-0 mb-0">Yellow</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div class="hidden md:flex column-gap-1 md:column-gap-3 flex-wrap md:flex-nowrap align-items-center justify-content-evenly sm:justify-content-start px-2 bg-white-alpha-10 border-top-1 border-white-alpha-20">
        <p class="text-xs text-white-alpha-70">
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">⏎</span>
            Select
        </p>
        <p class="text-xs text-white-alpha-70">
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↑</span>
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20">↓</span>
            Navigate
        </p>
        <p class="text-xs text-white-alpha-70 flex-align-items-center justify-content-center flex-row">
            <span class="px-2 py-1 border-white-alpha-20 border-1 border-round mr-1 text-white-alpha-80 text-xs bg-white-alpha-20 inline-flex">esc</span>
            Close
        </p>
    </div>
</Dialog>
            `
        };
    }
};
</script>
