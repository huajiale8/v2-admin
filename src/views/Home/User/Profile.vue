<template>
    <div class="profile">
        <el-card class="box-card" >
            <div slot="header" class="clearfix">
                <span>个人资料</span>
            </div>
            <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :rules="rules" >
                <el-form-item label="头像">
                    <el-upload
                        class="avatar-uploader"
                        action="comm/upload/picture?type=cover"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password_confirmation">
                    <el-input type="password" v-model="ruleForm.password_confirmation"></el-input>
                </el-form-item>
                <el-form-item v-if="auth('/profile/update')">
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>

import {profileApi, userInfoApi} from "@/http/api";

export default {
    props: {},
    data() {
        return {
            ruleForm: {
                uid: 0,
                password: '',
                name: '',
                password_confirmation: '',
                phone: '',
                imageUrl: '',
            },
            rules: {
                name: [
                    {required: true, message: '请输入真实姓名', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
                phone: [
                    {required: true, message: '请输入手机号码', trigger: 'blur'},
                    {
                        validator: function (rule, value, callback) {
                            let urlReg = /^1(3|4|5|7|8)[0-9]{9}$/
                            if (urlReg.test(value) === false) {
                                callback(new Error("请输入正确的11位手机号码"));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ],
                password_confirmation: [
                    {required: true, message: '确认密码', trigger: 'blur'},
                ],
            }
        }
    },
    created() {
        userInfoApi().then(res => {
            console.log(res)
            this.ruleForm.name = res.data.content.name
            this.ruleForm.phone = res.data.content.phone
            this.ruleForm.uid = res.data.content.id

        })
    },
    methods: {
        handleAvatarSuccess(res, file) {
            console.log(res)
            this.ruleForm.imageUrl = res.content.url
            if (res.code === 0) {
                this.$message({message: '图片上传成功', type: 'success'});
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    profileApi(this.ruleForm).then(res => {
                        console.log(res)
                        this.$message({message: res.data.message, type: 'success'});
                    })

                } else {
                    return false;
                }
            });
        },
    },
}
</script>
<style lang="scss" scoped>
.profile{
    .el-button--primary {
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;
        position: absolute;
        right: 0;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

}



</style>

