<template>

    <el-scrollbar class="aside">
        <el-menu
            :default-active="$route.path"
            :collapse-transition="false"
            :unique-opened="true"
            class="el-menu-vertical"
            text-color="#fff"
            background-color="#333744"
            :collapse="isCollapse"
            router>
            <div v-for="(item,index) in $store.state.routerList" :key="item.id">
                <el-submenu :index="item.url+'' " v-if="item.children">
                    <template slot="title">
                        <i :class="'fa-regular '+item.icon"></i>
                        <span slot="title" v-if="!isCollapse">{{ item.title }}</span>
                    </template>
                    <div v-for="(itemTow,index) in item.children" :key="itemTow.id">
                        <el-submenu :index="itemTow.url+'' " v-if="itemTow.children">
                            <template slot="title">
                                <i :class="itemTow.icon"></i>
                                <span slot="title">{{ itemTow.title }}</span>
                            </template>
                            <div v-for="(itemThree,index) in itemTow.children" :key="itemThree.id">
                                <el-submenu :index="itemThree.url+'' " v-if="itemThree.children">
                                    <template slot="title">
                                        <i :class="itemThree.icon"></i>
                                        <span slot="title">{{ itemThree.title }}</span>
                                    </template>
                                </el-submenu>
                                <el-menu-item v-else :index="itemThree.url+'' ">
                                    <i :class="itemThree.icon"></i>
                                    {{ itemThree.title }}
                                    <span slot="title"></span>
                                </el-menu-item>
                            </div>
                        </el-submenu>
                        <el-menu-item v-else :index="itemTow.url+'' ">
                            <i :class="itemTow.icon"></i>
                            {{ itemTow.title }}
                            <span slot="title"></span>
                        </el-menu-item>
                    </div>
                </el-submenu>
                <el-menu-item v-else :index="item.url+'' ">
                    <i :class="item.icon"></i>
                    {{ item.title }}
                    <span slot="title"></span>
                </el-menu-item>
            </div>
        </el-menu>
    </el-scrollbar>

</template>
<script>
export default {
    name: "AsideMenu",
    components: {},
    props: ['isCollapse'],
    data() {
        return {};
    },
}
</script>

<style lang="scss" scoped>
.el-menu {
    &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: 240px;
    min-height: 600px;
    height: 100%;
}
.aside {
    height: 100%;
}

:deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
}
</style>