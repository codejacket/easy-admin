<template>
    <template v-if="typeof items === 'function'" v-for="item in [].concat(items(itemProps))">
        <component :is="render(item)" />
    </template>
    <template v-else-if="typeof items === 'object'" v-for="item in [].concat(items)">
        <component :is="item.name" v-bind="item.props">
            <template v-for="(_item, name) in item.children" #[name]="slotProps">
                <easy-renderer :item="_item" :item-props="slotProps" />
            </template>
        </component>
    </template>
    <template v-else>
        {{ items }}
    </template>
</template>

<script lang="jsx">
export default {
    name: 'EasyRenderer',
    props: {
        items: {
            type: null,
            default: []
        },
        itemProps: {
            type: Object
        }
    },
    methods: {
        render(item) {
            if (item.__v_isVNode) {
                return item
            } else {
                return <easy-renderer items={item} />
            }
        }
    }
}
</script>