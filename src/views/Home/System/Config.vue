<template>
    <div class="rootElement">
        <el-card class="box-card" v-loading="loading"  v-if="flag">
            <div slot="header" class="clearfix">
                <span>站点设置</span>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="网站名称" prop="site_name">
                    <el-input v-model="ruleForm.site_name"></el-input>
                </el-form-item>
                <el-form-item label="网站标题" prop="site_title">
                    <el-input v-model="ruleForm.site_title"></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="site_keywords">
                    <el-input v-model="ruleForm.site_keywords"></el-input>
                </el-form-item>
                <div class="surfacePlot">
                    <div>封面图</div>
                    <div>
                        <el-upload
                            class="avatar-uploader"
                            action="comm/upload/picture?type=cover"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm.site_logo" :src="ruleForm.site_logo" class="avatar" alt="">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
                <el-form-item label="站点状态">
                    <template>
                        <el-radio v-model="ruleForm.site_status" label="1">开启</el-radio>
                        <el-radio v-model="ruleForm.site_status" label="2">关闭</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="站点描述">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="站点描述"
                        v-model="ruleForm.site_desc">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系QQ">
                    <el-input v-model="ruleForm.site_contact_qq"></el-input>
                </el-form-item>
                <el-form-item label="联系微信">
                    <el-input v-model="ruleForm.site_contact_wechat"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="ruleForm.site_contact_phone"></el-input>
                </el-form-item>
                <el-form-item label="公司名称">
                    <el-input v-model="ruleForm.site_company_name"></el-input>
                </el-form-item>
                <el-form-item label="公司地址">
                    <el-input v-model="ruleForm.site_company_address"></el-input>
                </el-form-item>
                <el-form-item label="IPC备案号">
                    <el-input v-model="ruleForm.site_icp"></el-input>
                </el-form-item>
                <el-form-item class="save">
                    <el-button type="primary"
                               v-if="auth('/system/config/update')"
                               @click="submitForm('ruleForm2')">保存
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import {configDetailApi, ConfigSaveApi} from "@/http/place"

export default {
    props: {},
    data() {
        return {
            flag:true,
            loading: false,
            ruleForm: {
                site_name: '', //名称
                site_title: '', //标题
                site_keywords: '',//关键字
                site_logo: '',
                site_desc: '',
                site_contact_qq: '',
                site_contact_wechat: '',
                site_contact_phone: '',
                site_company_name: '',
                site_company_address: '',
                mailbox: "",
                site_icp: '',
                site_status: '1',
            },
            rules: {
                site_name: [
                    {required: true, message: '请输入网站名称', trigger: 'blur'},
                ],
                site_title: [
                    {required: true, message: '请输入网站标题', trigger: 'blur'},
                ],
                site_keywords: [
                    {required: true, message: '请输入关键词', trigger: 'blur'},
                ]
            }
        }
    },
    created() {
        this.configDetail()
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                console.log(valid);
                if (valid) {
                    ConfigSaveApi(this.ruleForm).then(res => {
                        this.$message({message: '添加成功', type: 'success'});
                        this.$router.go(0)
                    })
                }
            });
        },
        handleAvatarSuccess(res, file) {
            this.ruleForm.imageUrl = res.content.url
            if (res.code === 0) {
                this.$message({message: '图片上传成功', type: 'success'});
            }
            this.ruleForm.site_logo = res.content.url
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
        // 获取站点设置信息
        configDetail() {
            configDetailApi().then(res => {
                this.ruleForm = res.data.content
            })
        }
    },
}
</script>
<style lang="scss">
.rootElement {
    .save {
        display: flex;
        justify-content: end;
    }

    .box-card {
        height: 830px;
        overflow: auto;
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

    .surfacePlot {
        margin-top: 20px;
        display: flex;

        > div:first-child {
            width: 88px;
            text-align: right;
            padding-right: 12px;
        }
    }

    .avatar {
        width: 100%;
    }
}

</style>
