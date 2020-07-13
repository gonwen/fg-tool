import {MutationTree, ActionTree} from 'vuex'
interface defState {
    token: string
    haslogin: boolean
    userinfo: any
}

export const actions: ActionTree<defState, defState> = {
    // async nuxtServerInit ({commit}, context) {
    //     //
    // }
}
export const state = (): defState => ({
    token: '',
    haslogin: false,
    userinfo: {}
})

export const mutations: MutationTree<defState> = {
    setUserInfo (state: defState, json: any) {
        state.userinfo = json
        state.haslogin = !!(json && json.id)
        state.token = json.token || ''
    },
    setToken (state: defState, str: string) {
        state.token = str
    }
}
