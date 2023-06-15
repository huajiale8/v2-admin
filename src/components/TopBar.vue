<template>
    <header class="container">
        <div class="title" ref="title">
      <span class="text" @click="$router.push('/')">
      818 管理后台
      </span>
            <i class="el-icon-s-fold" v-if="!menuCollapse" @click="$emit('update:menuCollapse',!menuCollapse)"></i>
            <i class="el-icon-s-unfold" v-if="menuCollapse" @click="$emit('update:menuCollapse',!menuCollapse)"></i>
        </div>
        <TopBarPopover/>
    </header>
</template>

<script>
import TopBarPopover from '@/components/TopBarPopover'

export default {
    name: "TopBar",
    props: ['menuCollapse'],
    components: {TopBarPopover},
    watch: {
        menuCollapse: {
            immediate: true,
            handler(val) {
                val ? this.hide() : this.show()
            }
        }
    },
    methods: {
        show() {
            this.$nextTick(() => {
                this.$refs.title.classList.remove('hidden')
            })
        },
        hide() {
            this.$nextTick(() => {
                this.$refs.title.classList.add('hidden')
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    min-height: 60px;
    padding: 0 30px;

    background: #282a3c;

    > .title {
        color: #fff;
        font-size: 20px;
        font-weight: 700;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        transition: all 300ms ease-in-out;

        &.hidden {
            transform: translateX(-176px);
        }

        > .text {
            margin-right: 42px;
            cursor: pointer;
        }

        > i {
            font-size: 25px;
        }
    }

    > img {
        width: 40px;
        height: 40px;
    }
}
</style>