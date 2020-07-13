<template>
    <div class="cb-container" style="padding: 50px 0;">
        <request-axios></request-axios>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
import requestAxios from '~/components/requestAxios.vue'

@Component({
    head () {
        return {
            title: 'REQUEST FRONT-END-TOOL'
        }
    },
    components: {
        requestAxios
    }
})
export default class PageRequest extends Vue {}
</script>
