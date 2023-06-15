<template>
    <div class="wrapper">
        <el-card class="box-card">
            <h4>818管理平台</h4>
            <el-form :model="user" status-icon ref="loginForm" class="loginForm" label-position="top">
                <el-form-item label="账号" prop="name">
                    <el-input v-model="user.phone" autocomplete="off" placeholder="请输入您的用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="user.password" autocomplete="off"
                              placeholder="请输入您的密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login" class="loginButton" :loading="loading">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import {getJurisdictionApi, LoginApi, menuApi, userInfoApi} from "@/http/api";


export default {
    props: {},
    data() {
        return {
            user: {
                phone: '15516724393',
                password: '123456',
            },
            loading: false,
        }
    },
    created() {

    },
    methods: {
        async login() {
            this.loading = true
            await LoginApi({
                phone: this.user.phone,
                password: this.user.password
            }).then(res => {
                this.loading = false
                sessionStorage.setItem('token', res.data.content.access_token)
                this.$message.success({message: res.data.message, center: true})
            }).catch(error => {
                this.$message.error({message: '网络异常，请稍后重试', center: true})
                this.loading = false
            })
            await userInfoApi().then(res => {
                console.log(res)
                sessionStorage.setItem("user", JSON.stringify(res.data.content))
            })
            await getJurisdictionApi().then(res => {
                this.$store.state.JurisdictionArray = res.data.content
            })
            await menuApi().then(res => {
                this.$store.commit("list", res.content)
            })
            await this.$router.push('/home')

        },
    },
}
</script>
<style lang="scss" scoped>
@import "@/assets/style/dynamicBackground.scss";

.box-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 420px;
    transform: translateX(-50%) translateY(-50%);
    padding: 20px;
    z-index: 2;

    h4 {
        margin-top: 30px;
        font-size: 19px;
        text-align: center;
        font-weight: bold;
    }

    :deep(.el-form-item__label) {
        font-weight: bold;
        font-size: 12px;
        padding: 0;
    }

    :deep(.el-form-item__content) {
        display: flex;
        justify-content: center;
    }

    :deep(.el-form-item) {
        margin: 10px;
    }

    .loginButton {
        margin: 20px;
        width: 120px;
    }
}
</style>
