<template>
    <div>
        <div class="block-category-title">List Container</div>
        <BlockViewer header="With Dividers" :code="block1" containerClass="surface-card px-4 py-8 md:px-6 lg:px-8">
            <ul class="list-none p-0 m-0">
                <li class="pb-4 border-bottom-1 surface-border">
                    <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                </li>
                <li class="py-4 border-bottom-1 surface-border">
                    <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                </li>
                <li class="pt-4">
                    <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                </li>
            </ul>
        </BlockViewer>

        <BlockViewer header="Card with Dividers" :code="block2" containerClass="px-4 py-8 md:px-6 lg:px-8">
            <div class="surface-card p-4 shadow-2 border-round">
                <ul class="list-none p-0 m-0">
                    <li class="pb-4 border-bottom-1 surface-border">
                        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                    </li>
                    <li class="py-4 border-bottom-1 surface-border">
                        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                    </li>
                    <li class="pt-4">
                        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                    </li>
                </ul>
            </div>
        </BlockViewer>

        <BlockViewer header="Separate Cards" :code="block3" containerClass="px-4 py-8 md:px-6 lg:px-8">
            <ul class="list-none p-0 m-0">
                <li class="surface-card p-4 mb-3 shadow-2 border-round">
                    <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                </li>
                <li class="surface-card p-4 mb-3 shadow-2 border-round">
                    <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                </li>
                <li class="surface-card p-4 shadow-2 border-round">
                    <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
                </li>
            </ul>
        </BlockViewer>
    </div>
</template>

<script>
export default {
    name: 'ListContainer',
    data() {
        return {
            block1: `
<ul class="list-none p-0 m-0">
    <li class="pb-4 border-bottom-1 surface-border">
        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
    </li>
    <li class="py-4 border-bottom-1 surface-border">
        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
    </li>
    <li class="pt-4">
        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
    </li>
</ul>`,
            block2: `
<div class="surface-card p-4 shadow-2 border-round">
    <ul class="list-none p-0 m-0">
        <li class="pb-4 border-bottom-1 surface-border">
            <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
        </li>
        <li class="py-4 border-bottom-1 surface-border">
            <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
        </li>
        <li class="pt-4">
            <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
        </li>
    </ul>
</div>`,
            block3: `
<ul class="list-none p-0 m-0">
    <li class="surface-card p-4 mb-3 shadow-2 border-round">
        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
    </li>
    <li class="surface-card p-4 mb-3 shadow-2 border-round">
        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
    </li>
    <li class="surface-card p-4 shadow-2 border-round">
        <div class="border-2 border-dashed surface-border border-round surface-0 p-4"></div>
    </li>
</ul>`
        };
    }
};
</script>
