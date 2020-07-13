<template>
    <div class="cb-container">
        <code-editor :show-menu="true"></code-editor>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
import codeEditor from '~/components/codeEditor.vue'

@Component({
    components: {codeEditor},
    head () {
        return {
            title: 'CODE FRONT-END-TOOL'
        }
    }
})
export default class PageCodeIndex extends Vue {}
</script>
