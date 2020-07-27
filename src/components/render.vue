<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'

const option: any = {
    name: 'renderComp',
    render (h: any, context: any) {
        console.log('****h***', h)
        console.log('****context***', context)
    }
}
@Component(option)
export default class RenderComp extends Vue {
    //
}
</script>
