<template>
    <div>
        <div class="block-category-title">Dialog</div>
        <BlockViewer header="Left Aligned Header Icon" :code="block1" containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible1 = true"></Button>

            <Dialog v-model:visible="visible1" appendTo="body" :modal="true" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
                <template #header>
                    <div class="flex align-items-center">
                        <span class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle" style="width: 32px; height: 32px">
                            <i class="pi pi-info text-lg"></i>
                        </span>
                        <span class="font-medium text-2xl text-900">Modal Title Placeholder</span>
                    </div>
                </template>
                <p class="line-height-3 p-0 m-0">Sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem integer. Sed risus pretium quam vulputate. At tellus at urna condimentum mattis pellentesque.</p>
                <template #footer>
                    <div class="border-top-1 surface-border pt-3">
                        <Button icon="pi pi-times" @click="visible1 = false" label="Cancel" class="p-button-text"></Button>
                        <Button icon="pi pi-check" @click="visible1 = false" label="Save"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>

        <BlockViewer header="Centered Header Icon" :code="block2" containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible2 = true"></Button>

            <Dialog v-model:visible="visible2" appendTo="body" :modal="true" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }" :closable="false" :showHeader="false">
                <div class="flex flex-column align-items-center my-4">
                    <span class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle mb-3" style="width: 64px; height: 64px">
                        <i class="pi pi-check text-5xl"></i>
                    </span>
                    <div class="font-medium text-2xl text-900">Modal Title Placeholder</div>
                </div>
                <p class="line-height-3 p-0 m-0">Sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem integer. Sed risus pretium quam vulputate. At tellus at urna condimentum mattis pellentesque.</p>
                <template #footer>
                    <div class="border-top-1 surface-border pt-3 flex">
                        <Button icon="pi pi-times" @click="visible2 = false" label="Cancel" class="p-button-outlined w-6 mr-2"></Button>
                        <Button icon="pi pi-check" @click="visible2 = false" label="Save" class="w-6 ml-2"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>

        <BlockViewer header="With Illustration" :code="block3" containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible3 = true"></Button>

            <Dialog v-model:visible="visible3" appendTo="body" :modal="true" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }" header="Title Placeholder">
                <div class="flex flex-wrap border-top-1 surface-border pt-4">
                    <div class="bg-blue-50 flex align-items-center justify-content-center py-3 px-0 w-full md:w-4 border-round">
                        <img src="/images/blocks/illustration/security.svg" alt="Image" class="w-9" />
                    </div>
                    <p class="text-700 line-height-3 m-0 p-5 w-full md:w-8">
                        Sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem integer. Sed risus pretium quam vulputate. At tellus at urna condimentum mattis pellentesque.
                    </p>
                </div>
                <template #footer>
                    <div class="border-top-1 surface-border pt-3">
                        <Button icon="pi pi-times" @click="visible3 = false" label="Cancel" class="p-button-text"></Button>
                        <Button icon="pi pi-check" @click="visible3 = false" label="Save"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>

        <BlockViewer header="With Form Layout" :code="block4" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible4 = true"></Button>

            <Dialog v-model:visible="visible4" appendTo="body" modal :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '52vw' }" header="Edit Payment Method" :draggable="false" :resizable="false">
                <template #header>
                    <div class="flex flex-column gap-2">
                        <h1 class="m-0 text-900 font-semibold text-xl line-height-3">Edit Payment Method</h1>
                        <span class="text-600 text-base">Quis enim lobortis scelerisque fermentum dui faucibus in ornare quam.</span>
                    </div>
                </template>
                <form class="flex flex-column gap-3 mt-3">
                    <div>
                        <label for="cardholder" class="block mb-1 text-color text-base">Cardholder Name</label>
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-user"></i>
                            <InputText name="cardholder" type="text" class="w-full" id="cardholder" />
                        </span>
                    </div>
                    <div>
                        <label for="credit-card" class="block mb-1 text-color text-base">Credit Card Number</label>
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-credit-card"></i>
                            <InputText name="cc" type="text" class="w-full" id="credit-card" placeholder="1234-1234-1234-1234" />
                        </span>
                    </div>
                    <div class="flex gap-3">
                        <div class="w-full">
                            <label for="cvc" class="block mb-1 text-color text-base">CVC</label>
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-lock"></i>
                                <InputText name="cvc" type="text" v-model="cvc" class="w-full" id="cvc" placeholder="123" />
                            </span>
                        </div>
                        <div class="w-full">
                            <label for="expiration" class="block mb-1 text-color text-base">Expiration</label>
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-clock"></i>
                                <InputText name="exp" type="text" v-model="expiration" class="w-full" id="expiration" placeholder="12/22" />
                            </span>
                        </div>
                    </div>
                </form>
                <template #footer>
                    <div class="flex gap-3 justify-content-end border-top-1 surface-border pt-5">
                        <Button label="Cancel" @click="visible4 = false" class="p-button-text"></Button>
                        <Button label="Update" @click="visible4 = false" class="p-button-rounded"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>

        <BlockViewer header="With Dropdown" :code="block5" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible5 = true"></Button>

            <Dialog v-model:visible="visible5" :modal="true" :closable="false" :showHeader="false" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
                <section class="flex flex-column w-full mt-4">
                    <div class="flex w-full justify-content-between mb-4">
                        <span class="w-4rem h-4rem border-circle flex justify-content-center align-items-center bg-blue-100"><i class="pi pi-users text-blue-700 text-4xl"></i></span>
                        <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-secondary p-button-text align-self-start" @click="visible5 = false"></Button>
                    </div>
                    <p class="font-semibold text-xl mt-0 mb-2 text-900">Invite Team Member</p>
                    <p class="font-normal text-base mt-0 mb-3 text-600">Sagittis eu volutpat odio facilisis mauris sit amet.</p>
                    <Dropdown :options="members" v-model="selectedMember" optionLabel="name" appendTo="body" styleClass="w-full border-round-lg">
                        <template #value>
                            <div class="flex align-items-center">
                                <img :src="'/images/blocks/avatars/circle/' + selectedMember.avatar + '.png'" class="mr-3" style="height: 1.5rem; width: 1.5rem" />
                                <p class="mt-0 mb-0 font-normal text-base text-600">
                                    {{ selectedMember.name }}
                                </p>
                            </div>
                        </template>
                        <template #option="{ option }">
                            <div class="flex align-items-center">
                                <img :src="'/images/blocks/avatars/circle/' + option.avatar + '.png'" class="mr-3" style="height: 1.5rem; width: 1.5rem" />
                                <p class="mt-0 mb-0 font-normal text-base text-600">
                                    {{ option.name }}
                                </p>
                            </div>
                        </template>
                    </Dropdown>
                </section>
                <template #footer>
                    <div class="pt-3 flex">
                        <Button @click="visible5 = false" label="Cancel" class="p-button-text flex-grow-1"></Button>
                        <Button @click="visible5 = false" label="Invite" class="flex-grow-1"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>

        <BlockViewer header="Verification" :code="block6" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible6 = true"></Button>

            <Dialog v-model:visible="visible6" :modal="false" :closable="false" :show-header="false" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '40vw' }">
                <form class="flex flex-column w-full mt-4">
                    <div class="flex w-full justify-content-between mb-4">
                        <span class="w-4rem h-4rem border-circle flex justify-content-center align-items-center bg-blue-100"><i class="pi pi-lock text-blue-700 text-4xl"></i></span>
                        <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-secondary p-button-text align-self-start" @click="visible6 = false"></Button>
                    </div>
                    <p class="font-semibold text-xl mt-0 mb-2 text-900">Authenticate Your Account</p>
                    <p class="font-normal text-base mt-0 mb-3 text-600">Protecting your profile is our first priority. Please confirm your account by entering the authorization code sent to ***-***1052.</p>
                    <div class="flex justify-content-between w-full align-items-center mb-4 gap-2">
                        <InputNumber v-model="value1" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)" />
                        <InputNumber v-model="value2" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)" />
                        <InputNumber v-model="value3" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)" />
                        <InputNumber v-model="value4" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)" />
                        <InputNumber v-model="value5" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)" />
                        <InputNumber v-model="value6" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" />
                    </div>
                </form>
                <template #footer>
                    <div class="pt-3 flex justify-content-between align-items-center">
                        <div class="text-left">
                            <p class="font-normal text-base text-600 mb-0 mt-0">It may take a minute to receive.</p>
                            <a class="font-normal text-base text-primary-500 mb-0 mt-0 cursor-pointer">Resend a new code.</a>
                        </div>
                        <Button @click="visible6 = false" label="Submit Code" class="m-0"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>

        <BlockViewer header="With Radio Group" :code="block7" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible7 = true"></Button>

            <Dialog v-model:visible="visible7" :modal="false" :closable="false" :showHeader="false" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '45vw' }">
                <form class="flex flex-column w-full mt-4">
                    <div class="flex w-full justify-content-between mb-4">
                        <span class="w-4rem h-4rem border-circle flex justify-content-center align-items-center bg-blue-100"><i class="pi pi-credit-card text-blue-700 text-4xl"></i></span>
                        <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-secondary p-button-text align-self-start" @click="visible7 = false"></Button>
                    </div>
                    <p class="font-semibold text-xl mt-0 mb-4 text-900">Manage Payment Info</p>
                    <div class="flex justify-content-between w-full align-items-center border-1 p-3 border-round surface-border mb-2 cursor-pointer" :class="{ 'surface-hover': payment === 'Visa' }" @click="payment = 'Visa'">
                        <div>
                            <div class="flex align-items-center mb-3">
                                <img src="/images/blocks/dialog/dialog-1.svg" alt="Image" class="mr-2 w-3rem border-1 surface-border border-round" />
                                <p class="font-medium text-xl mt-0 mb-0 mr-2 text-900">Visa ending in 1234</p>
                                <span class="p-tag">Default</span>
                            </div>
                            <p class="font-medium text-base mt-0 mb-0 text-600">Expires 12/2038</p>
                        </div>
                        <RadioButton name="payment" value="Visa" v-model="payment" inputId="payment1"></RadioButton>
                    </div>
                    <div class="flex justify-content-between w-full align-items-center border-1 p-3 border-round surface-border mb-2 cursor-pointer" :class="{ 'surface-hover': payment === 'MasterCard' }" @click="payment = 'MasterCard'">
                        <div>
                            <div class="flex align-items-center mb-3">
                                <img src="/images/blocks/dialog/dialog-2.svg" alt="Image" class="mr-2 w-3rem border-1 surface-border border-round" />
                                <p class="font-medium text-xl mt-0 mb-0 text-900">MasterCard ending in 1234</p>
                            </div>
                            <p class="font-medium text-base mt-0 mb-0 text-600">Expires 07/2025</p>
                        </div>
                        <RadioButton name="payment" value="MasterCard" v-model="payment" inputId="payment1"></RadioButton>
                    </div>
                    <div class="flex justify-content-between w-full align-items-center border-1 p-3 border-round surface-border opacity-50" :class="{ 'surface-hover': payment === 'Other' }">
                        <div>
                            <div class="flex align-items-center mb-3">
                                <img src="/images/blocks/dialog/dialog-1.svg" alt="Image" class="mr-2 w-3rem border-1 surface-border border-round" />
                                <p class="font-medium text-xl text-900 mt-0 mb-0 mr-2">Visa ending in 1234</p>
                                <span class="p-tag bg-red-500 text-white">Expired</span>
                            </div>
                            <p class="font-medium text-base text-600 mt-0 mb-0">Expires 01/2022</p>
                        </div>
                        <RadioButton name="payment" value="Other" v-model="payment" inputId="payment1" disabled></RadioButton>
                    </div>
                </form>
                <template #footer>
                    <div class="flex -mt-3 justify-content-between align-items-center">
                        <Button @click="visible7 = false" icon="pi pi-plus" label="Add Payment Method" class="p-button-text m-0"></Button>
                        <Button @click="visible7 = false" icon="pi pi-check" label="Save" class="m-0"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>

        <BlockViewer header="With Description List" :code="block8" recent containerClass="surface-section px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
            <Button label="Display" @click="visible8 = true"></Button>

            <Dialog v-model:visible="visible8" :modal="false" :closable="false" :showHeader="false" :breakpoints="{ '960px': '75vw', '640px': '100vw' }" :style="{ width: '45vw' }">
                <section class="flex flex-column w-full mt-4">
                    <div class="flex w-full justify-content-between align-items-center mb-4">
                        <span class="font-semibold text-base text-600">Notes / <span class="text-900">Daily</span></span>
                        <Button type="button" icon="pi pi-times text-sm" class="w-2rem h-2rem p-button-rounded p-button-secondary p-button-text text-600" @click="visible8 = false"></Button>
                    </div>
                    <div class="flex justify-content-between align-items-center w-full mb-4">
                        <p class="font-semibold text-xl mt-0 mb-0 text-900"><span class="pi pi-bolt text-xl text-yellow-600"></span> Extend Functional Coverage</p>
                        <Button type="button" icon="pi pi-pencil text-sm" class="w-2rem h-2rem p-button-rounded p-button-text surface-200 text-600"></Button>
                    </div>
                    <table>
                        <tr style="height: 2.5rem">
                            <td class="font-medium text-base text-600">Status</td>
                            <td class="font-medium text-base text-900">In Progress</td>
                        </tr>
                        <tr style="height: 2.5rem">
                            <td class="font-medium text-base text-600">Assignee</td>
                            <td>
                                <div class="flex align-items-center">
                                    <img src="/images/blocks/avatars/circle/avatar-m-11.png" alt="Image" class="inline mr-2" style="height: 1.5rem; width: 1.5rem" />
                                    <span class="font-medium text-base text-900">John Walter</span>
                                </div>
                            </td>
                        </tr>
                        <tr style="height: 2.5rem">
                            <td class="font-medium text-base text-600">Due Date</td>
                            <td class="font-medium text-base text-900">Oct 21 at 2:00 PM</td>
                        </tr>
                        <tr style="height: 2.5rem">
                            <td class="font-medium text-base text-600">Label</td>
                            <td>
                                <span class="p-tag bg-orange-500 mr-2">Product</span>
                                <span class="p-tag bg-green-500">Quality</span>
                            </td>
                        </tr>
                    </table>
                    <div class="border-y-1 surface-border py-4 my-4">
                        <p class="font-medium text-lg text-700 mt-0">Description</p>
                        <p class="text-base text-900 mt-0 mb-0">
                            Donec enim diam vulputate ut. Tellus mauris a diam maecenas. At varius vel pharetra vel turpis. Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Amet luctus venenatis lectus magna fringilla urna porttitor
                            rhoncus.
                        </p>
                    </div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between align-items-center w-full">
                            <p class="font-medium text-lg text-700 mt-0">Checklist</p>
                            <span class="text-500 flex align-items-center"><i class="pi pi-check-square text-lg mr-2"></i>1/4</span>
                        </div>
                        <div class="field-checkbox">
                            <Checkbox v-model="checked1" binary inputId="binary1"></Checkbox>
                            <label for="binary">Placerat in egestas erat imperdiet.</label>
                        </div>
                        <div class="field-checkbox">
                            <Checkbox v-model="checked2" binary inputId="binary2"></Checkbox>
                            <label for="binary">Cursus euismod quis viverra nibh.</label>
                        </div>
                        <div class="field-checkbox">
                            <Checkbox v-model="checked3" binary inputId="binary3"></Checkbox>
                            <label for="binary">Malesuada fames ac turpis egestas integer eget.</label>
                        </div>
                        <div class="field-checkbox mb-0">
                            <Checkbox v-model="checked4" binary inputId="binary4"></Checkbox>
                            <label for="binary">Nisl suscipit adipiscing bibendum est ultricies integer quis.</label>
                        </div>
                    </div>
                </section>
                <template #footer>
                    <div class="flex border-top-1 pt-5 surface-border justify-content-end align-items-center">
                        <Button @click="visible8 = false" icon="pi pi-check" label="Save" class="m-0"></Button>
                    </div>
                </template>
            </Dialog>
        </BlockViewer>
    </div>
</template>

<script>
export default {
    name: 'DialogPage',
    data() {
        return {
            block1: `
<Button label="Display" @click="visible1 = true"></Button>

<Dialog v-model:visible="visible1" appendTo="body" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '40vw'}">
    <template #header>
        <div class="flex align-items-center">
            <span class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle" style="width:32px;height:32px">
                <i class="pi pi-info text-lg"></i>
            </span>
            <span class="font-medium text-2xl text-900">Modal Title Placeholder</span>
        </div>
    </template>
    <p class="line-height-3 p-0 m-0">
        Sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem integer.
        Sed risus pretium quam vulputate. At tellus at urna condimentum mattis pellentesque.
    </p>
    <template #footer>
        <div class=" border-top-1 surface-border pt-3">
            <Button icon="pi pi-times" @click="visible1 = false" label="Cancel" class="p-button-text"></Button>
            <Button icon="pi pi-check" @click="visible1 = false" label="Save"></Button>
        </div>
    </template>
</Dialog>`,
            block2: `
<Button label="Display" @click="visible2 = true"></Button>

<Dialog v-model:visible="visible2" appendTo="body" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '40vw'}" :closable="false" :showHeader="false">
    <div class="flex flex-column align-items-center my-4">
        <span class="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle mb-3" style="width:64px;height:64px">
            <i class="pi pi-check text-5xl"></i>
        </span>
        <div class="font-medium text-2xl text-900">Modal Title Placeholder</div>
    </div>
    <p class="line-height-3 p-0 m-0">
        Sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem integer.
        Sed risus pretium quam vulputate. At tellus at urna condimentum mattis pellentesque.
    </p>
    <template #footer>
        <div class=" border-top-1 surface-border pt-3 flex">
            <Button icon="pi pi-times" @click="visible2 = false" label="Cancel" class="p-button-outlined w-6 mr-2"></Button>
            <Button icon="pi pi-check" @click="visible2 = false" label="Save" class="w-6 ml-2"></Button>
        </div>
    </template>
</Dialog>`,
            block3: `
<Button label="Display" @click="visible3 = true"></Button>

<Dialog v-model:visible="visible3" appendTo="body" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '40vw'}" header="Title Placeholder" >
    <div class="flex flex-wrap border-top-1 surface-border pt-4">
        <div class="bg-blue-50 flex align-items-center justify-content-center py-3 px-0 w-full md:w-4 border-round">
            <img src="/images/blocks/illustration/security.svg" alt="Image" class="w-9" />
        </div>
        <p class="text-700 line-height-3 m-0 p-5 w-full md:w-8">
            Sagittis eu volutpat odio facilisis mauris sit amet. Sed velit dignissim sodales ut eu sem integer. Sed risus pretium quam vulputate. At tellus at urna condimentum mattis pellentesque.
        </p>
    </div>
    <template #footer>
        <div class="border-top-1 surface-border pt-3">
            <Button icon="pi pi-times" @click="visible3 = false" label="Cancel" class="p-button-text"></Button>
            <Button icon="pi pi-check" @click="visible3 = false" label="Save"></Button>
        </div>
    </template>
</Dialog>`,
            block4: `
<Button label="Display" @click="visible4 = true"></Button>

<Dialog v-model:visible="visible4" appendTo="body" modal :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '52vw'}" header="Edit Payment Method" :draggable="false" :resizable="false">
    <template #header>
            <div class="flex flex-column gap-2">
                <h1 class="m-0 text-900 font-semibold text-xl line-height-3">Edit Payment Method</h1>
                <span class="text-600 text-base">Quis enim lobortis scelerisque fermentum dui faucibus in ornare quam.</span>
            </div>
    </template>
    <form class="flex flex-column gap-3 mt-3">
        <div>
            <label for="cardholder" class="block mb-1 text-color text-base">Cardholder Name</label>
            <span class="p-input-icon-left w-full">
                <i class="pi pi-user"></i>
                <InputText name="cardholder" type="text" class="w-full" id="cardholder" />
            </span>
        </div>
        <div>
            <label for="credit-card" class="block mb-1 text-color text-base">Credit Card Number</label>
            <span class="p-input-icon-left w-full">
                <i class="pi pi-credit-card"></i>
                <InputText name="cc" type="text" class="w-full" id="credit-card" placeholder="1234-1234-1234-1234"/>
            </span>
        </div>
        <div class="flex gap-3">
            <div class="w-full">
                <label for="cvc" class="block mb-1 text-color text-base">CVC</label>
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-lock"></i>
                    <InputText name="cvc" type="text" v-model="cvc" class="w-full" id="cvc" placeholder="123"/>
                </span>
            </div>
            <div class="w-full">
                <label for="expiration" class="block mb-1 text-color text-base">Expiration</label>
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-clock"></i>
                    <InputText name="exp" type="text" v-model="expiration" class="w-full" id="expiration" placeholder="12/22"/>
                </span>
            </div>
        </div>
    </form>
    <template #footer>
        <div class="flex gap-3 justify-content-end border-top-1 surface-border pt-5">
            <Button label="Cancel" @click="visible4 = false" class="p-button-text"></Button>
            <Button label="Update" @click="visible4 = false" class="p-button-rounded"></Button>
        </div>
    </template>
</Dialog>
`,
            block5: `
<Button label="Display" @click="visible5 = true"></Button>
<Dialog v-model:visible="visible5" :modal="true" :closable="false" :showHeader="false" :breakpoints="{'960px':'75vw','640px': '100vw'}" :style="{width: '40vw', height: '22rem'}">
    <section class="flex flex-column w-full mt-4">
        <div class="flex w-full justify-content-between mb-4">
            <span class="w-4rem h-4rem border-circle flex justify-content-center align-items-center bg-blue-100"><i class="pi pi-users text-blue-700 text-4xl"></i></span>
            <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-secondary p-button-text align-self-start" @click="visible5 = false"></Button>
        </div>
        <p class="font-semibold text-xl mt-0 mb-2 text-900">Invite Team Member</p>
        <p class="font-normal text-base mt-0 mb-3 text-600">Sagittis eu volutpat odio facilisis mauris sit amet.</p>
        <Dropdown :options="members" v-model="selectedMember" optionLabel="name" appendTo="body" styleClass="w-full border-round-lg">
            <template #value>
                <div class="flex align-items-center">
                    <img :src="'/images/blocks/avatars/circle/' + selectedMember.avatar +'.png'" class="mr-3" style="height: 1.50rem; width: 1.50rem;"/>
                    <p class="mt-0 mb-0 font-normal text-base text-600">{{selectedMember.name}}</p>
                </div>
            </template>
            <template #option="{option}">
                <div class="flex align-items-center">
                    <img :src="'/images/blocks/avatars/circle/' + option.avatar +'.png'" class="mr-3" style="height: 1.50rem; width: 1.50rem;"/>
                    <p class="mt-0 mb-0 font-normal text-base text-600">{{option.name}}</p>
                </div>
            </template>
        </Dropdown>
    </section>
    <template #footer>
        <div class="pt-3 flex">
            <Button @click="visible5 = false" label="Cancel" class="p-button-text flex-grow-1"></Button>
            <Button @click="visible5 = false" label="Invite" class="flex-grow-1"></Button>
        </div>
    </template>
</Dialog>
`,
            block6: `
<Button label="Display" @click="visible6 = true"></Button>

<Dialog v-model:visible="visible6" :modal="false" :closable="false" :show-header="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}">
    <form class="flex flex-column w-full mt-4">
        <div class="flex w-full justify-content-between mb-4">
            <span class="w-4rem h-4rem border-circle flex justify-content-center align-items-center bg-blue-100"><i class="pi pi-lock text-blue-700 text-4xl"></i></span>
            <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-secondary p-button-text align-self-start" @click="visible6 = false"></Button>
        </div>
        <p class="font-semibold text-xl mt-0 mb-2 text-900">Authenticate Your Account</p>
        <p class="font-normal text-base mt-0 mb-3 text-600">Protecting your profile is our first priority. Please confirm your account by entering the authorization code sent to ***-***1052.</p>
        <div class="flex justify-content-between w-full align-items-center mb-4 gap-2">
            <InputNumber v-model="value1" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)"/>
            <InputNumber v-model="value2" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)"/>
            <InputNumber v-model="value3" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)"/>
            <InputNumber v-model="value4" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)"/>
            <InputNumber v-model="value5" maxlength="1" inputClass="w-4rem xl:w-6rem text-center" @keyup="focus($event)"/>
            <InputNumber v-model="value6" maxlength="1" inputClass="w-4rem xl:w-6rem text-center"/>
        </div>
    </form>
    <template #footer>
        <div class="pt-3 flex justify-content-between align-items-center">
            <div class="text-left">
                <p class="font-normal text-base text-600 mb-0 mt-0">It may take a minute to receive.</p>
                <a class="font-normal text-base text-primary-500 mb-0 mt-0 cursor-pointer">Resend a new code.</a>
            </div>
            <Button @click="visible6 = false" label="Submit Code" class="m-0"></Button>
        </div>
    </template>
</Dialog>
`,
            block7: `
<Button label="Display" @click="visible7 = true"></Button>

<Dialog v-model:visible="visible7" :modal="false" :closable="false" :showHeader="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '45vw'}">
    <form class="flex flex-column w-full mt-4">
        <div class="flex w-full justify-content-between mb-4">
            <span class="w-4rem h-4rem border-circle flex justify-content-center align-items-center bg-blue-100"><i class="pi pi-credit-card text-blue-700 text-4xl"></i></span>
            <Button type="button" icon="pi pi-times" class="p-button-rounded p-button-secondary p-button-text align-self-start" @click="visible7 = false"></Button>
        </div>
        <p class="font-semibold text-xl mt-0 mb-4 text-900">Manage Payment Info</p>
        <div class="flex justify-content-between w-full align-items-center border-1 p-3 border-round surface-border mb-2 cursor-pointer" :class="{'surface-hover': payment === 'Visa'}" @click="payment = 'Visa'">
            <div>
                <div class="flex align-items-center mb-3">
                    <img src="/images/blocks/dialog/dialog-1.svg" alt="Image" class="mr-2 w-3rem border-1 surface-border border-round" />
                    <p class="font-medium text-xl mt-0 mb-0 mr-2 text-900">Visa ending in 1234</p>
                    <span class="p-tag">Default</span>
                </div>
                <p class="font-medium text-base mt-0 mb-0 text-600">Expires 12/2038</p>
            </div>
            <RadioButton name="payment" value="Visa" v-model="payment" inputId="payment1"></RadioButton>
        </div>
        <div class="flex justify-content-between w-full align-items-center border-1 p-3 border-round surface-border mb-2 cursor-pointer" :class="{'surface-hover': payment === 'MasterCard'}" @click="payment = 'MasterCard'">
            <div>
                <div class="flex align-items-center mb-3">
                    <img src="/images/blocks/dialog/dialog-2.svg" alt="Image" class="mr-2 w-3rem border-1 surface-border border-round" />
                    <p class="font-medium text-xl mt-0 mb-0 text-900">MasterCard ending in 1234</p>
                </div>
                <p class="font-medium text-base mt-0 mb-0 text-600">Expires 07/2025</p>
            </div>
            <RadioButton name="payment" value="MasterCard" v-model="payment" inputId="payment1"></RadioButton>
        </div>
        <div class="flex justify-content-between w-full align-items-center border-1 p-3 border-round surface-border opacity-50" :class="{'surface-hover': payment === 'Other'}">
            <div>
                <div class="flex align-items-center mb-3">
                    <img src="/images/blocks/dialog/dialog-1.svg" alt="Image" class="mr-2 w-3rem border-1 surface-border border-round" />
                    <p class="font-medium text-xl text-900 mt-0 mb-0 mr-2">Visa ending in 1234</p>
                    <span class="p-tag bg-red-500 text-white">Expired</span>
                </div>
                <p class="font-medium text-base text-600 mt-0 mb-0">Expires 01/2022</p>
            </div>
            <RadioButton name="payment" value="Other" v-model="payment" inputId="payment1" disabled></RadioButton>
        </div>
    </form>
    <template #footer>
        <div class="flex -mt-3 justify-content-between align-items-center">
            <Button @click="visible7 = false" icon="pi pi-plus" label="Add Payment Method" class="p-button-text m-0"></Button>
            <Button @click="visible7 = false" icon="pi pi-check" label="Save" class="m-0"></Button>
        </div>
    </template>
</Dialog>
`,
            block8: `
<Button label="Display" @click="visible8 = true"></Button>

<Dialog v-model:visible="visible8" :modal="false" :closable="false" :showHeader="false" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '45vw'}">
    <section class="flex flex-column w-full mt-4">
        <div class="flex w-full justify-content-between align-items-center mb-4">
            <span class="font-semibold text-base text-600">Notes / <span class="text-900">Daily</span></span>
            <Button type="button" icon="pi pi-times text-sm" class="w-2rem h-2rem p-button-rounded p-button-secondary p-button-text text-600" @click="visible8 = false"></Button>
        </div>
        <div class="flex justify-content-between align-items-center w-full mb-4">
            <p class="font-semibold text-xl mt-0 mb-0 text-900"><span class="pi pi-bolt text-xl text-yellow-600"></span> Extend Functional Coverage</p>
            <Button type="button" icon="pi pi-pencil text-sm" class="w-2rem h-2rem p-button-rounded p-button-text surface-200 text-600"></Button>
        </div>
        <table>
            <tr style="height:2.5rem">
                <td class="font-medium text-base text-600">Status</td>
                <td class="font-medium text-base text-900">In Progress</td>
            </tr>
            <tr style="height:2.5rem">
                <td class="font-medium text-base text-600">Assignee</td>
                <td>
                    <div class="flex align-items-center">
                        <img src="/images/blocks/avatars/circle/avatar-m-11.png" alt="Image" class="inline mr-2" style="height: 1.5rem; width: 1.5rem;" />
                        <span class="font-medium text-base text-900">John Walter</span>
                    </div>
                </td>
            </tr>
            <tr style="height:2.5rem">
                <td class="font-medium text-base text-600">Due Date</td>
                <td class="font-medium text-base text-900">Oct 21 at 2:00 PM</td>
            </tr>
            <tr style="height:2.5rem">
                <td class="font-medium text-base text-600">Label</td>
                <td>
                    <span class="p-tag bg-orange-500 mr-2">Product</span>
                    <span class="p-tag bg-green-500">Quality</span>
                </td>
            </tr>
        </table>
        <div class="border-y-1 surface-border py-4 my-4">
            <p class="font-medium text-lg text-700 mt-0">Description</p>
            <p class="text-base text-900 mt-0 mb-0">Donec enim diam vulputate ut. Tellus mauris a diam maecenas. At varius vel pharetra vel turpis. Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus.</p>
        </div>
        <div class="flex flex-column">
            <div class="flex justify-content-between align-items-center w-full">
                <p class="font-medium text-lg text-700 mt-0">Checklist</p>
                <span class="text-500 flex align-items-center"><i class="pi pi-check-square text-lg mr-2"></i>1/4</span>
            </div>
            <div class="field-checkbox">
                <Checkbox v-model="checked1" binary inputId="binary1"></Checkbox>
                <label for="binary">Placerat in egestas erat imperdiet.</label>
            </div>
            <div class="field-checkbox">
                <Checkbox v-model="checked2" binary inputId="binary2"></Checkbox>
                <label for="binary">Cursus euismod quis viverra nibh.</label>
            </div>
            <div class="field-checkbox">
                <Checkbox v-model="checked3" binary inputId="binary3"></Checkbox>
                <label for="binary">Malesuada fames ac turpis egestas integer eget.</label>
            </div>
            <div class="field-checkbox mb-0">
                <Checkbox v-model="checked4" binary inputId="binary4"></Checkbox>
                <label for="binary">Nisl suscipit adipiscing bibendum est ultricies integer quis.</label>
            </div>
        </div>
    </section>
    <template #footer>
        <div class="flex border-top-1 pt-5 surface-border justify-content-end align-items-center">
            <Button @click="visible8 = false" icon="pi pi-check" label="Save" class="m-0"></Button>
        </div>
    </template>
</Dialog>
`,
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            visible6: false,
            visible7: false,
            visible8: false,
            value1: null,
            value2: null,
            value3: null,
            value4: null,
            value5: null,
            value6: null,
            checked1: true,
            checked2: false,
            checked3: false,
            checked4: false,
            cvc: '',
            expiration: '',
            members: [
                { name: 'Robert Fox', avatar: 'avatar-m-11' },
                { name: 'John Walter', avatar: 'avatar-m-12' },
                { name: 'Jane Doe', avatar: 'avatar-f-12' }
            ],
            selectedMember: { name: 'Robert Fox', avatar: 'avatar-m-11' },
            payment: 'Visa',
            payment2: 'MasterCard'
        };
    },
    methods: {
        focus(event) {
            const regexNum = /^\d+$/;
            const isValid = regexNum.test(event.key);

            isValid && event.currentTarget.nextElementSibling.children[0].focus();
        }
    }
};
</script>
