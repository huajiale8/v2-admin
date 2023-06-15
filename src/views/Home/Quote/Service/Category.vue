<template>
    <div class="account">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>服务分类管理</span>
            </div>
            <el-tooltip content="新增服务分类" placement="top">
                <el-button type="primary"
                           v-if="auth('/quote/service/category/add')"
                           icon="el-icon-plus" @click="add">
                </el-button>
            </el-tooltip>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item>
                    <el-input v-model="ruleForm.username" placeholder="请输入服务分类" style="width:80%">
                    </el-input>
                    <el-button type="primary" @click="onSubmit('ruleForm')" style="margin-left: 10px">搜索
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table lazy :data="tableData" v-loading="loading" max-height="600">
                <el-table-column prop="id" label="编号" width="50" show-overflow-tooltip fixed="left">
                </el-table-column>
                <el-table-column prop="name" label="分类名称" width="180">
                </el-table-column>
                <el-table-column prop="status" label="用户状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
                        <el-tag v-else type="info">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" show-overflow-tooltip>
                </el-table-column>
                <el-table-column fixed="right" width="120px" label="操作">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip content="编辑" placement="top">
                                <el-button
                                    v-if="auth('/quote/service/category/edit')"
                                    type="primary"
                                    @click="editCateDia(scope.row)"
                                    size="mini"
                                    icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <span v-if="scope.row.id !== 0">
                                  <el-tooltip v-if="scope.row.status === 0" content="启用" placement="top">
                                        <el-button
                                            v-if="auth('/quote/service/category/enable')"
                                            type="success"
                                            :underline="false"
                                            @click="enable(scope.row.id)"
                                            size="mini" icon="el-icon-unlock">
                                        </el-button>
                                </el-tooltip>
                                <el-tooltip v-else content="禁用" placement="top">
                                        <el-button
                                            v-if="auth('/quote/service/category/forbidden')"
                                            type="danger"
                                            :underline="false"
                                            @click="forbidden(scope.row.id)"
                                            size="mini" icon="el-icon-lock">
                                        </el-button>
                                </el-tooltip>
                            </span>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="pageInfo.page"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
            <el-dialog
                :before-close="handleClose"
                :title=name
                :visible.sync="centerDialogVisible"
                width="50%"
                center>
                <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item prop="name" label="分类名称">
                        <el-input v-model="dialogForm.name" placeholder="请输入服务分类名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-if="auth('/quote/service/category/update')"
                                   @click="submitForm('dialogForm')">保存
                        </el-button>
                        <el-button @click="centerDialogVisible = !centerDialogVisible ">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import {
    categoryApiList,
    categoryDetailApiList,
    categoryEnableApiList,
    categoryForbiddenApiList,
    categorySaveApiList
} from "@/http/quote";

export default {
    props: {},
    data() {
        return {
            name: '新增服务分类',
            loading: false,
            centerDialog: false,
            flag: true,
            centerDialogVisible: false,
            activeName: 'first',
            ruleForm: {
                username: '',
            },
            dialogForm: {
                name: '',
                password: '',
                contact_name: '',
                contact_phone: '',
                id: 0
            },
            rules: {
                name: [
                    {required: true, message: '请输入账户名称', trigger: 'blur'},
                ],
            },
            tableData: [],
            pageInfo: {
                page: 1,
                pageSize: 10,
                name: ''
            },
            total: 0,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        add(){
            this.centerDialogVisible = true
            this.name = "新增服务分类"
        },
        // 获取列表数据
        getList() {
            this.loading = true
            categoryApiList(this.pageInfo).then(res => {
                this.total = res.content.total
                this.tableData = res.content.data
                this.loading = false
            })
        },
        // 搜索
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.pageInfo = {
                        page: 1,
                        pageSize: 10,
                        name: this.ruleForm.username
                    }
                }
                this.getList()
            });
        },
        // 编辑
        editCateDia(row) {
            this.name = '编辑服务分类'
            categoryDetailApiList({id: row.id}).then(res => {
                this.centerDialogVisible = true
                this.flag = false
                this.dialogForm = res.content
            })
        },
        // 启用
        enable(id) {
            this.$confirm("是否要启用, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                const res = await categoryEnableApiList({id}).then(res => {
                    this.$message({message: res.message, type: 'success'});
                });
                this.getList();
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消启用",
                });
            });
        },
        // 禁用
        forbidden(row) {
            this.$confirm("是否要禁用, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                const res = await categoryForbiddenApiList({id: row}).then(res => {
                    this.$message({message: res.message, type: 'success'});
                });
                this.getList();
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消禁用",
                });
            });
        },
        // 新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    categorySaveApiList(this.dialogForm).then(res => {
                        if (res.code === 0) {
                            this.$message({message: res.message, type: 'success'});
                            this.centerDialogVisible = false
                            this.getList()
                            return false
                        }
                    })
                }
            });
        },
        // 弹出框关闭
        handleClose() {
            this.centerDialogVisible = false
            this.dialogForm = {
                name: '',
                password: '',
                contact_name: '',
                contact_phone: '',
                id: 0
            }
        },
        handleSizeChange(val) {
            this.pageInfo.page = 1
            this.pageInfo.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.pageInfo.page = val;
            this.getList();
        },
    },
}
</script>
<style lang="scss">
.account {
    .el-form-item__label {
        width: 230px;
    }
}

</style>
