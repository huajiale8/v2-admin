<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>权限组管理</span>
            </div>
            <el-tooltip content="新增" placement="top" v-if="auth('/admin/role/add')">
                <el-button type="primary"
                           v-if="auth('/system/attributes/category/add')"
                           icon="el-icon-plus" @click="add()">
                </el-button>
            </el-tooltip>
            <el-table :data="tableData" v-loading="loading"  max-height="660px">
                <el-table-column fixed label="序号" prop="id"></el-table-column>
                <el-table-column label="权限组名称" prop="title" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 0" type="success">启用</el-tag>
                        <el-tag v-else type="info">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="110">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip content="编辑" placement="top" v-if="auth('/admin/role/edit')">
                                <el-button
                                    type="primary"
                                    @click="editCateDia(scope.row)"
                                    size="mini"
                                    icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <span v-if="scope.row.id !== 1">
                                  <el-tooltip v-if="scope.row.status === 1" content="启用" placement="top">
                                        <el-button
                                            type="success"
                                            :underline="false"
                                            @click="enable(scope.row.id)"
                                            size="mini" icon="el-icon-unlock">
                                        </el-button>
                                </el-tooltip>
                                <el-tooltip v-else content="禁用" placement="top">
                                        <el-button
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
                @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="[5, 10, 15, 20]"
                :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
        </el-card>
        <el-dialog
            :before-close="handleClose"
            title="新增权限组"
            :visible.sync="centerDialogVisible"
            width="50%"
            center>
            <el-form v-if="flag" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="权限组名称" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-radio v-model="ruleForm.status" :label=0>启用</el-radio>
                    <el-radio v-model="ruleForm.status" :label=1>禁用</el-radio>
                </el-form-item>
                <el-form-item label="权限菜单">
                    <el-tree
                        prop="validator"
                        :data='treeList'
                        node-key="id"
                        :default-checked-keys="ruleForm.rules"
                        ref="tree"
                        show-checkbox
                        :props="defaultProps"
                        :expand-on-click-node="true"
                        :check-strictly="false"
                        @check-change="handleCheckChange">
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    roleDetailListApi,
    roleDisableUserApi,
    roleEnableUserApi,
    roleListApi,
    roleUpdateUserApi,
    rulesTreeApi,
} from "@/http/admin";
export default {
    props: {},
    data() {
        return {
            flag: false,
            loading: false,
            centerDialogVisible: false,
            tableData: [],
            treeList: [],
            pageInfo: {
                page: 1,
                pageSize: 10
            }
            , total: 0,
            ruleForm: {
                id: 0,
                title: '',
                status: 0,
                rules: []
            },
            rules: {
                title: [
                    {required: true, message: '请输入权限组名称', trigger: 'blur'},
                ],
                status: [
                    {required: true, message: '请选择是否启用', trigger: 'blur'},
                ],
                validator: [
                    {
                        validator: (rule, value, callback) => {
                            setTimeout(() => {
                                if (this.ruleForm.rules.length === 0 || this.ruleForm.rules.length === 1 && this.ruleForm.rules[0] === '') {
                                    callback(new Error('请至少选择一个权限菜单'))
                                } else {
                                    callback()
                                }
                            }, 100)
                        }, trigger: 'blur'
                    },
                ]
            },
            defaultProps: {
                children: 'children',
                label: 'title'
            },
        }
    },
    created() {
        this.roleList()
        this.treList()
    },
    methods: {
        handleClose() {
            this.ruleForm = {
                id: 0,
                title: '',
                status: 0,
                rules: []
            }
            this.flag = false
            this.centerDialogVisible = false
        },
        add() {
            this.centerDialogVisible = !this.centerDialogVisible
            this.flag = !this.flag
        },
        centerDialog() {
            this.$router.go(0)
        },
        roleList() {
            this.loading = true
            roleListApi(this.pageInfo).then(res => {
                this.total = res.content.total
                this.tableData = res.content.data
                this.loading = false
            })
        },
        treList() {
            rulesTreeApi().then(res => {
                this.treeList = res.content
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    roleUpdateUserApi(this.ruleForm).then(res => {
                        if (this.ruleForm.id === 0) {
                            this.$message({message: res.message, type: 'success'});
                            this.roleList()
                        } else {
                            this.$message({message: res.message, type: 'success'});
                            this.roleList()
                        }
                    })
                    this.centerDialogVisible = false
                } else {
                    return false;
                }
            });
        },
        handleCheckChange(data, node) {
            this.ruleForm.rules = this.$refs.tree.getCheckedKeys()
        },
        handleSizeChange(val) {
            this.pageInfo.page = 1
            this.pageInfo.pageSize = val;
            this.roleList();
        },
        handleCurrentChange(val) {
            this.pageInfo.page = val;
            this.roleList();
        },
        editCateDia(index) {
            roleDetailListApi(index.id).then(res => {
                let arrR = res.content.rules.split(",")
                this.ruleForm = {
                    id: res.content.id,
                    title: res.content.title,
                    status: res.content.status,
                    rules: arrR
                }
                this.flag = !this.flag
                this.centerDialogVisible = !this.centerDialogVisible
            })
        },
        // 管理员启用enable
        enable(val) {
            this.$confirm('确认启用该管理员？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                roleEnableUserApi({id: val}).then(res => {
                    if (res.code === 0) {
                        this.$message({message: res.message, type: 'success'});
                        this.roleList()
                        return false
                    }
                })
            })
        },
        // 管理员禁用forbidden
        forbidden(val) {
            this.$confirm('确认禁用该管理员？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                roleDisableUserApi({id: val}).then(res => {
                    if (res.code === 0) {
                        this.$message({message: res.message, type: 'success'});
                        this.roleList()
                        return false
                    }
                })
            })
        },
        // 弹出框关闭
    },
}
</script>
<style lang="scss" scoped>
</style>
