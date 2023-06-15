<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>全景分类</span>
            </div>
            <el-tooltip content="新增" placement="top">
                <el-button type="primary"
                           icon="el-icon-plus"
                           v-if="auth('/system/attributes/category/add')"
                           @click="add">
                </el-button>
            </el-tooltip>
            <el-table
                v-loading="loading"
                max-height="660px"
                fit
                :data="tableData">
                <el-table-column prop="id" label="序号" fixed width="150">
                </el-table-column>
                <el-table-column prop="name" label="名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip content="编辑" placement="top">
                                <el-button
                                    v-if="auth('/system/attributes/category/edit')"
                                    type="warning"
                                    @click="editCateDia(scope.row)"
                                    size="mini" icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button v-if="auth('/system/attributes/category/del')" type="danger"
                                           @click="del(scope.row)" size="mini" icon="el-icon-delete">
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.page"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
            </el-pagination>
        </el-card>
        <el-dialog
            :before-close="handleClose"
            :title=name
            :visible.sync="centerDialogVisible"
            width="50%"
            center>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="字体图标" prop="icon">
                    <el-input v-model="ruleForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="封面图" prop="cover">
                    <el-upload
                        class="avatar-uploader"
                        action="comm/upload/picture?type=cover"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="ruleForm.cover" :src="ruleForm.cover" class="avatar" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="封面图-手机" prop="cover_mobile">
                    <el-upload
                        class="avatar-uploader"
                        action="comm/upload/picture?type=cover"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccessTow"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="ruleForm.cover_mobile" :src="ruleForm.cover_mobile" class="avatar" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <div class="foot">
                    <el-button
                        v-if="auth('/system/attributes/category/update')"
                        type="primary" @click="submitForm('ruleForm')">保存
                    </el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {addCateApi, categoryApi, categoryDeleteApi, ParticularsCateApi,} from '@/http/api'

export default {
    props: {},
    data() {
        return {
            loading: false,
            dialogVisible: false,
            disabled: false,
            tableData: [],
            centerDialogVisible: false,
            ruleForm: {
                id: 0,
                name: '',
                icon: '',
                cover: '',
                cover_mobile: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'},
                ],
                icon: [
                    {required: true, message: '请输入字体图标代码', trigger: 'blur'},
                ],
                cover: [
                    {
                        validator: (rule, value, callback) => {
                            setTimeout(() => {
                                if (this.ruleForm.cover !== '') {
                                    callback()
                                } else {
                                    callback(new Error('请上传封面图'))
                                }
                            }, 100)
                        }, trigger: 'blur'
                    },
                ],
                cover_mobile: [
                    {
                        validator: (rule, value, callback) => {
                            setTimeout(() => {
                                if (this.ruleForm.cover_mobile !== '') {
                                    callback()
                                } else {
                                    callback(new Error('请上传手机封面图'))
                                }
                            }, 100)
                        }, trigger: 'blur'
                    },
                ],
            },
            queryInfo: {
                page: 1,
                pageSize: 10,
            },
            total: 0,
            name: ''
        }
    },
    created() {
        this.getList()
    },
    methods: {
        add() {
            this.centerDialogVisible = true
            this.name = '新增全景分类'
        },
        // 获取列表数据
        getList() {
            this.loading = true
            categoryApi(this.queryInfo).then(res => {
                this.tableData = res.data.content.data
                this.total = res.data.content.total
                this.loading = false
            })
        },
        // 编辑
        editCateDia(row) {
            this.name = '编辑全景分类'
            this.centerDialogVisible = !this.centerDialogVisible
            ParticularsCateApi(row.id).then(res => {
                this.ruleForm = res.content
            })
        },
        del(val) {
            let id = val.id
            this.$confirm("是否要删除, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const res = await categoryDeleteApi({id});
                    this.getList();
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        handleAvatarSuccess(res, file) {
            this.ruleForm.cover = res.content.url
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
        handleAvatarSuccessTow(res, file) {
            this.ruleForm.cover_mobile = res.content.url
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addCateApi(
                        this.ruleForm
                    ).then(res => {
                        if (this.ruleForm.id === 0) {
                            this.$message({message: '添加成功', type: 'success'});
                            this.getList()
                        } else {
                            this.$message({message: '更新成功', type: 'success'});
                            this.getList()
                        }
                    })
                    this.centerDialogVisible = false
                    this.ruleForm.name = ""
                    this.ruleForm.icon = ""
                    this.ruleForm.id = 0
                    this.ruleForm.cover = ""
                    this.ruleForm.cover_mobile = ""
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.ruleForm = {
                id: 0,
                name: '',
                icon: '',
                cover: '',
                cover_mobile: ''
            }
            this.centerDialogVisible = false
        },
        // 分页
        handleSizeChange(val) {
            this.queryInfo.pageSize = val;
            this.queryInfo.page = 1
            this.getList();
        },
        handleCurrentChange(val) {
            this.queryInfo.page = val;
            this.getList();
        },
        handleClose() {
            this.ruleForm = {
                id: 0,
                name: '',
                icon: '',
                cover: '',
                cover_mobile: ''
            }
            this.centerDialogVisible = false
        },
    }
}
</script>
<style lang="scss">

.surfacePlot {
    margin-top: 20px;
    display: flex;

    > div:first-child {
        width: 88px;
        text-align: right;
        padding-right: 12px;
    }

}

.foot {
    display: flex;
    justify-content: center;
    margin: 20px;
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
</style>
