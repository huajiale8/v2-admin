<template>
    <el-popover
        placement="bottom-end"
        width="260"
        :visible-arrow="false"
        v-model="visible"
        popper-class="popover">
        <ul>
            <li class="user">
                <img src="../assets/avatar.png" alt="...">
                <div class="userInfo">
                    <div class="contact">{{ $store.state.user.contact }}</div>
                    <div class="phone">{{ $store.state.user.phone }}</div>
                </div>
            </li>
            <li class="link">
                <div class="divider"></div>
                <div class="text" @click="goAccount">账户设置</div>
                <div class="divider"></div>
                <div class="text" @click="logout">退出登录</div>
            </li>
        </ul>
        <img slot="reference" src="../assets/avatar-white.png" alt="...">
    </el-popover>
</template>

<script>
import {apiLogout} from '@/http/api'

export default {
    name: "TopBarPopover",
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        logout() {
            apiLogout().then(() => {
                this.$store.commit('logout')
                this.$router.push('/login')
                this.$message.success({
                    message: '退出登录成功',
                    center: true,
                })
            })
        },
        goAccount() {
            this.$router.push('/profile').catch(err => err = err + 1)
        }
    }
}
</script>

<style lang="scss">
.el-popover.popover {
    padding: 0;
}
</style>

<style lang="scss" scoped>
img {
    height: 40px;
    width: 40px;
}

ul {
    > .user {
        margin: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        > .userInfo {
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            > .contact {
                font-weight: bold;
            }
        }

        > img {
            width: 64px;
            height: 64px;
            margin-right: 10px;
        }
    }

    > .link {
        > .divider {
            border-top: 1px solid #e9ecef;
        }

        > .text {
            margin: 10px 0;
            padding: 4px 20px;
            font-size: 13px;
            cursor: pointer;
            color: #16181b;

            &:hover {
                background: #f8f9fa;
            }
        }
    }
}
</style>