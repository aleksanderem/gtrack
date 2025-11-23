<template>
    <div>
        <div class="block-category-title">Section Heading</div>
        <BlockViewer header="Icon And Actions" :code="block1">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
                    <div class="flex align-items-center">
                        <i class="pi pi-inbox text-2xl mr-3 text-500"></i>
                        <span class="text-3xl font-medium text-900">Messages</span>
                    </div>
                    <div class="mt-3 md:mt-0">
                        <Button label="Settings" class="p-button-outlined mr-3" icon="pi pi-cog"></Button>
                        <Button label="Compose" icon="pi pi-plus"></Button>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Subtitle and Search" :code="block2">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
                    <div class="mb-3 lg:mb-0">
                        <div class="text-3xl font-medium text-900 mb-3">Messages</div>
                        <div class="text-500 mr-0 md:mr-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
                    </div>
                    <span class="p-input-icon-left w-full md:w-auto">
                        <i class="pi pi-search"></i>
                        <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
                    </span>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="With Tabs" :code="block3">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="text-3xl font-medium text-900 mb-4">Application</div>
                <TabMenu :model="items"></TabMenu>
            </div>
        </BlockViewer>

        <BlockViewer header="Inline Tabs" :code="block4">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="flex lg:align-items-center flex-column lg:flex-row">
                    <div class="text-3xl font-medium text-900 mr-0 lg:mr-4 mb-4 lg:mb-0">Application</div>
                    <TabMenu :model="items" class="flex-grow-1"></TabMenu>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Simple" :code="block5">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="border-bottom-1 surface-border">
                    <span class="block text-3xl font-medium text-900 mb-4">Messages</span>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="With Label" :code="block6">
            <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="border-bottom-1 surface-border">
                    <div class="text-3xl font-medium text-900 mb-4 flex align-items-center">
                        Messages
                        <span class="text-base font-normal ml-3 text-600">79 Unread</span>
                    </div>
                </div>
            </div>
        </BlockViewer>

        <BlockViewer header="Pills and Actions" :code="block7" recent>
            <section class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="flex flex-wrap gap-3 justify-content-between align-items-center">
                    <div class="flex flex-column gap-2">
                        <h1 class="m-0 text-900 text-3xl font-medium line-height-3">Settings</h1>
                        <p class="mt-0 mb-0 text-600 text-lg">Set your preferences</p>
                    </div>
                    <div class="flex flex-wrap align-items-center gap-3">
                        <Button label="Upgrade to Pro" class="p-button-text"></Button>
                        <Button label="Save Changes"></Button>
                        <Button icon="pi pi-ellipsis-v" class="p-button-outlined"></Button>
                    </div>
                </div>
                <div class="mt-5">
                    <ul class="flex align-items-center overflow-x-auto gap-3 px-2 py-3 list-none border-bottom-1 surface-border">
                        <li>
                            <Button
                                icon="pi pi-user"
                                @click="activeTabAction = 'profile'"
                                label="Profile"
                                :class="{
                                    'p-button-text text-700': activeTabAction !== 'profile'
                                }"
                            ></Button>
                        </li>
                        <li>
                            <Button
                                icon="pi pi-globe"
                                @click="activeTabAction = 'website'"
                                label="Website"
                                :class="{
                                    'p-button-text text-700': activeTabAction != 'website'
                                }"
                            ></Button>
                        </li>
                        <li>
                            <Button
                                icon="pi pi-shield"
                                @click="activeTabAction = 'privacy'"
                                label="Privacy"
                                :class="{
                                    'p-button-text text-700': activeTabAction != 'privacy'
                                }"
                            ></Button>
                        </li>
                        <li>
                            <Button
                                icon="pi pi-wallet"
                                @click="activeTabAction = 'payment'"
                                label="Payments"
                                :class="{
                                    'p-button-text text-700': activeTabAction != 'payment'
                                }"
                            ></Button>
                        </li>
                        <li>
                            <Button
                                icon="pi pi-cog"
                                @click="activeTabAction = 'applications'"
                                label="Applications"
                                :class="{
                                    'p-button-text text-700': activeTabAction != 'applications'
                                }"
                            ></Button>
                        </li>
                    </ul>
                </div>
            </section>
        </BlockViewer>

        <BlockViewer header="Border, Badge and Actions" :code="block8" recent>
            <section class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="flex flex-column lg:flex-row gap-3 justify-content-between lg:align-items-center border-primary py-5" style="border-top: 7px solid">
                    <div class="flex flex-column gap-2">
                        <div class="flex align-items-center gap-2">
                            <h1 class="m-0 font-semibold text-900 text-xl line-height-3">Notifications</h1>
                            <Badge :value="11" severity="warning"></Badge>
                        </div>
                        <p class="mb-0 mt-0 text-base text-600">Manage your notifications and permissions.</p>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <SelectButton :options="options" v-model="value1" optionLabel="label" optionValue="value"></SelectButton>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text"></Button>
                    </div>
                </div>
            </section>
        </BlockViewer>
    </div>
</template>

<script>
export default {
    name: 'SectionHeading',
    data() {
        return {
            block1: `
<div class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
        <div class="flex align-items-center">
            <i class="pi pi-inbox text-2xl mr-3 text-500"></i>
            <span class="text-3xl font-medium text-900">Messages</span>
        </div>
        <div class="mt-3 md:mt-0">
            <Button label="Settings" class="p-button-outlined mr-3" icon="pi pi-cog"></Button>
            <Button label="Compose" icon="pi pi-plus"></Button>
        </div>
    </div>
</div>`,
            block2: `
<div class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
        <div class="mb-3 lg:mb-0">
            <div class="text-3xl font-medium text-900 mb-3">Messages</div>
            <div class="text-500 mr-0 md:mr-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
        </div>
        <span class="p-input-icon-left w-full md:w-auto">
            <i class="pi pi-search"></i>
            <InputText type="text" placeholder="Search" class="w-full md:w-auto"/>
        </span>
    </div>
</div>`,
            block3: `
<div class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="text-3xl font-medium text-900 mb-4">Application</div>
    <TabMenu :model="items"></TabMenu>
</div>`,
            block4: `
<div class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="flex lg:align-items-center flex-column lg:flex-row">
        <div class="text-3xl font-medium text-900 mr-0 lg:mr-4 mb-4 lg:mb-0">Application</div>
        <TabMenu :model="items" class="flex-grow-1"></TabMenu>
    </div>
</div>`,
            block5: `
<div class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="border-bottom-1 surface-border">
        <span class="block text-3xl font-medium text-900 mb-4">Messages</span>
    </div>
</div>`,
            block6: `
<div class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="border-bottom-1 surface-border">
        <div class="text-3xl font-medium text-900 mb-4 flex align-items-center">Messages <span class="text-base font-normal ml-3 text-600">79 Unread</span></div>
    </div>
</div>`,
            block7: `
<section class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="flex flex-wrap gap-3 justify-content-between align-items-center">
        <div class="flex flex-column gap-2">
            <h1 class="m-0 text-900 text-3xl font-medium line-height-3">Settings</h1>
            <p class="mt-0 mb-0 text-600 text-lg">Set your preferences</p>
        </div>
        <div class="flex flex-wrap align-items-center gap-3">
            <Button label="Upgrade to Pro" class="p-button-text"></Button>
            <Button label="Save Changes"></Button>
            <Button icon="pi pi-ellipsis-v" class="p-button-outlined"></Button>
        </div>
    </div>
    <div class="mt-5">
        <ul class="flex align-items-center overflow-x-auto gap-3 px-2 py-3 list-none border-bottom-1 surface-border">
            <li><Button icon="pi pi-user" @click="activeTabAction = 'profile'" label="Profile" :class="{'p-button-text text-700': activeTabAction !== 'profile'}"></Button></li>
            <li><Button icon="pi pi-globe" @click="activeTabAction = 'website'" label="Website" :class="{'p-button-text text-700': activeTabAction != 'website'}"></Button></li>
            <li><Button icon="pi pi-shield" @click="activeTabAction = 'privacy'" label="Privacy" :class="{'p-button-text text-700': activeTabAction != 'privacy'}"></Button></li>
            <li><Button icon="pi pi-wallet" @click="activeTabAction = 'payment'" label="Payments" :class="{'p-button-text text-700': activeTabAction != 'payment'}"></Button></li>
            <li><Button icon="pi pi-cog" @click="activeTabAction = 'applications'" label="Applications" :class="{'p-button-text text-700': activeTabAction != 'applications'}"></Button></li>
        </ul>
    </div>
</section>
`,
            block8: `
<section class="surface-section px-4 py-5 md:px-6 lg:px-8">
    <div class="flex flex-column lg:flex-row gap-3 justify-content-between lg:align-items-center border-primary py-5" style="border-top: 7px solid;">
        <div class="flex flex-column gap-2">
            <div class="flex align-items-center gap-2">
                <h1 class="m-0 font-semibold text-900 text-xl line-height-3">Notifications</h1>
                <Badge :value="11" severity="warning"></Badge>
            </div>
            <p class="mb-0 mt-0 text-base text-600">Manage your notifications and permissions.</p>
        </div>
        <div class="flex align-items-center gap-2">
            <SelectButton :options="options" v-model="value1" optionLabel="label" optionValue="value"></SelectButton>
            <Button icon="pi pi-ellipsis-v" class="p-button-text"></Button>
        </div>
    </div>
</section>
`,
            items: [
                { label: 'Overview', icon: 'pi pi-home' },
                { label: 'Members', icon: 'pi pi-users' },
                { label: 'Sales', icon: 'pi pi-shopping-cart' },
                { label: 'Profile', icon: 'pi pi-user' },
                { label: 'Settings', icon: 'pi pi-cog' }
            ],
            value1: 'do not disturb',
            activeTabAction: 'profile',
            options: [
                { label: 'Do Not Disturb', value: 'do not disturb' },
                { label: 'Notify', value: 'notify' }
            ]
        };
    }
};
</script>
