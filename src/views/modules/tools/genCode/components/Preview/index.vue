<template>
    <easy-dialog title="预览" width="80%" height="80vh" destroy-on-close>
        <easy-table-pro :config="config" />
    </easy-dialog>
</template>

<script>
export default {
    name: 'Preview',
    props: {

    },
    data() {
        return {
            config: {
                api: {
                    async list() {
                        return {
                            data: {
                                list: [],
                                total: 0
                            }
                        }
                    }
                },
                query: {},
                table: {},
                dialog: {},
                form: {} 
            }
        }
    }
}
</script>