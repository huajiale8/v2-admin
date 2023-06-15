import Vue from 'vue'
import Vuex from 'vuex'
import persist from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        user: {
            id: '',
            username: '',
            newPassword: '',
            contact: '',
            phone: '',
        },
        JurisdictionArray: [], //权限数据
        routerList: [], //侧边栏数据
        allData:{},
        flag:false,
        categories:[],
        activity:[]
    },
    getters: {},
    mutations: {
        logout(state) {
            state.JurisdictionArray = []
            state.routerList= []
            state.user = {}
            state.isLogin = false
            state.token = ''
            sessionStorage.clear()
        },
        list(stata, data) {
            stata.routerList = data
        },

    },
    actions: {},
    modules: {},
    plugins: [
        new persist({
            storage: window.sessionStorage,
        }),
    ],
})
