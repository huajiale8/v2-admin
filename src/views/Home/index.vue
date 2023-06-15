<template>
    <div class="layout">
        <TopBar :menuCollapse.sync="menuCollapse"/>
        <main>
            <AsideMenu :isCollapse.sync="menuCollapse"/>
            <div :class="menuCollapse? 'content' :'active'">
                <div class="wrapper">
                    <router-view v-if="isRouterAlive"/>
                </div>
                <div :class="menuCollapse? 'el-foot' :'el-active'">
                    <span>Copyright © 2015-2022</span>
                    <span>技术支持:</span>
                </div>
            </div>

        </main>
    </div>
</template>

<script>
import AsideMenu from '@/components/AsideMenu.vue'
import TopBar from '@/components/TopBar.vue'

export default {
    name: "PageLayout",
    components: {AsideMenu, TopBar},
    provide() {
        return {
            reload: this.reload,
        }
    },
    data() {
        return {
            isRouterAlive: true,
            menuCollapse: false,
            num: 241,
        };
    },
    created() {

    },

    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(() => {
                this.isRouterAlive = true;
            })
        },
    },
}
</script>

<style lang="scss">
.layout {
    display: flex;
    flex-direction: column;
    height: 100%;

    > main {
        display: flex;
        flex: 1;
        height: calc(100% - 60px);
        width: 100%;
        background-color: rgba(243, 243, 244);

        > .content {
            width: calc(100% - 64px);

            .wrapper {
                padding: 20px 20px 20px 20px;
                height: calc(100% - 50px);
            }
        }

        .active {
            width: calc(100% - 241px);

            .wrapper {
                padding: 20px 20px 20px 20px;
                height: calc(100% - 50px);
            }
        }

        .el-foot{
            display: flex;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            background-color: white;
            color: #333;
            text-align: center;
            width: calc(100% - 64px);
            height: 30px !important;
            line-height: 30px;
        }
        .el-active{
            display: flex;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            background-color: white;
            color: #333;
            text-align: center;
            width: calc(100% - 241px);
            height: 30px !important;
            line-height: 30px;
        }
    }
}

.page-scroll {
    height: 100%;
}

.page-scroll .el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>