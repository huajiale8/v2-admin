<template>
    <div class="account">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>账户管理</span>
            </div>
            <el-tooltip content="新增报价员账户" placement="top">
                <el-button type="primary"
                           v-if="addFlag"
                           icon="el-icon-plus" @click="add">
                </el-button>
            </el-tooltip>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="报价员列表" name="first">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item>
                            <el-input v-model="ruleForm.username" placeholder="请输入报价员名称" style="width:80%">
                            </el-input>
                            <el-button type="primary" @click="onSubmit('ruleForm')" style="margin-left: 10px">搜索
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table lazy :data="tableData" v-loading="loading"  max-height="545px">
                        <el-table-column prop="name" label="用户名" width="100" show-overflow-tooltip fixed="left">
                        </el-table-column>
                        <el-table-column prop="contact_name" label="姓名" width="180">
                        </el-table-column>
                        <el-table-column prop="contact_phone" label="联系电话" show-overflow-tooltip>
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
                                            v-if="auth('/quote/account/edit')"
                                            type="primary"
                                            @click="editCateDia(scope.row)"
                                            size="mini"
                                            icon="el-icon-edit">
                                        </el-button>
                                    </el-tooltip>
                                    <span v-if="scope.row.id !== 0">
                                  <el-tooltip v-if="scope.row.status === 0" content="启用" placement="top">
                                        <el-button
                                            v-if="auth('/quote/account/enable')"
                                            type="success"
                                            :underline="false"
                                            @click="enable(scope.row.id)"
                                            size="mini" icon="el-icon-unlock">
                                        </el-button>
                                </el-tooltip>
                                <el-tooltip v-else content="禁用" placement="top">
                                        <el-button
                                            v-if="auth('/quote/account/forbidden')"
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
                </el-tab-pane>
                <el-tab-pane label="报价员操作日志" name="second">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item>
                            <el-input v-model="ruleForm.riZiName" placeholder="请输入报价员名称" style="width: 80%">
                            </el-input>
                            <el-button type="primary" @click="search()" style="margin-left: 10px">
                                搜索
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table lazy :data="riZiData">
                        <el-table-column prop="name" label="客户" width="180" show-overflow-tooltip fixed="left">
                        </el-table-column>
                        <el-table-column prop="ip" label="客户端IP" width="180">
                        </el-table-column>
                        <el-table-column prop="url" label="URL地址" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="desc" label="内容">
                        </el-table-column>
                        <el-table-column prop="created_at" label="时间" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-tooltip content="查看" placement="top" v-if="auth('/admin/role/edit')">
                                        <el-button
                                            type="primary"
                                            @click="show(scope.row)"
                                            size="mini"
                                            icon="el-icon-view">
                                        </el-button>
                                    </el-tooltip>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        background @size-change="handleSize"
                        @current-change="handleCurrent" :current-page="riZiInfo.page"
                        :page-sizes="[5, 10, 15, 20]"
                        :page-size="riZiInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=riTotal>
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
            <el-dialog
                :before-close="handleClose"
                :title= name
                :visible.sync="centerDialogVisible"
                width="50%"
                center>
                <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item prop="name" label="账户名称">
                        <el-input v-model="dialogForm.name" placeholder="报价员账户名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="登录密码" v-if="flag">
                        <el-input v-model="dialogForm.password" show-password placeholder="登录密码">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="dialogForm.contact_name" placeholder="姓名">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="dialogForm.contact_phone" placeholder="联系电话">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-if="auth('/quote/account/update')"
                                   @click="submitForm('dialogForm')">创建
                        </el-button>
                        <el-button @click="centerDialogVisible = !centerDialogVisible ">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog
                :before-close="handle"
                class="dialog"
                title="数据比较"
                :visible.sync="centerDialog"
                width="50%"
                center>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="color: green">新数据</span>
                    </div>
                    <div class="text item" v-for="(i,index) in Object.keys(newList)" :key="index">
                        <p>{{ i }}: <span style="color: red">{{ newList[i] }}</span></p>
                    </div>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="color: #cccccc;text-align: center;">旧数据</span>
                    </div>
                    <div v-for="(i,index) in oldData" :key="index" class="text item">
                        <p>{{ i }}:{{ newList[i] }}</p>
                    </div>
                </el-card>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import {
    accountApiList,
    detailApiList,
    diffApiList,
    enableApiList,
    forbiddenApiList,
    logsApiList,
    saveApiList
} from "@/http/quote";

export default {
    props: {},
    data() {
        return {
            name:'新增报价员账户',
            addFlag: true,
            loading: false,
            centerDialog: false,
            flag: true,
            centerDialogVisible: false,
            activeName: 'first',
            ruleForm: {
                username: '',
                riZiName: ''
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
                password: [
                    {required: true, message: '登录密码', trigger: 'blur'},
                ],
                username: [
                    {required: true, message: '请输入报价员名称', trigger: 'blur'},
                ],
            },
            tableData: [],
            riZiData: [],
            pageInfo: {
                page: 1,
                pageSize: 10,
                name: ''
            },
            riZiInfo: {
                page: 1,
                pageSize: 10,
                name: ''
            },
            total: 0,
            riTotal: 0,
            newList: {},
            oldData: []
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 获取列表数据
        add(){
            this.centerDialogVisible = true
            this.name = '新增报价员账户'
        },
        getList() {
            this.loading = true
            accountApiList(this.pageInfo).then(res => {
                this.total = res.content.total
                this.tableData = res.content.data
            })
            this.loading = false
        },
        getLogList() {
            this.loading = true
            logsApiList(this.riZiInfo).then(res => {
                this.riZiData = res.content.data
                this.riTotal = res.content.total
            })
            this.loading = false
        },
        // tab切换
        handleClick(tab) {
            this.addFlag = tab.name === "first";
            if (tab.name === "second") {
                this.getLogList()
            }
        },
        // 搜索
        onSubmit() {
            let username = this.ruleForm.username
            this.pageInfo = {
                page: 1,
                pageSize: 10,
                name: username
            }
            this.getList()

        },
        search() {
            let username = this.ruleForm.riZiName
            if (username === '') {
                this.$message({
                    message: '请输入报价员名称',
                    type: 'warning'
                });
            } else {
                this.riZiInfo = {
                    page: 1,
                    pageSize: 10,
                    name: this.ruleForm.riZiName
                }
                this.getLogList()
            }
        }
        // 编辑
        , editCateDia(row) {
            this.name = "编辑报价员账户"
            detailApiList({id: row.id}).then(res => {
                this.centerDialogVisible = true
                this.flag = false
                this.dialogForm = res.content
            })
        },
        show(row) {
            this.centerDialog = true
            diffApiList({id: row}).then(res => {
                this.newList = res.content.new
                this.oldData = res.content.old
            })
        },
        // 启用
         enable(id) {
            this.$confirm("是否要启用, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const res = await enableApiList({id}).then(res => {
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
                    const res = await forbiddenApiList({id: row}).then(res => {
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
                    saveApiList(this.dialogForm).then(res => {
                        if (res.code === 0) {
                            this.$message({message: res.message, type: 'success'});
                            this.getList()
                            this.centerDialogVisible = false
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
        handle() {
            this.centerDialog = false;
            this.oldData = []
            this.newList = {}
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
        handleSize(val) {
            this.riZiInfo.page = 1
            this.riZiInfo.pageSize = val;
            this.getLogList();
        },
        handleCurrent(val) {
            this.riZiInfo.page = val;
            this.getLogList();
        },
    },
}
</script>
<style lang="scss">
.account {
    .el-form-item__label {
        width: 230px;
    }

    .dialog {
        .text {
            font-size: 14px;
        }

        .item {
            margin-bottom: 18px;

            span {
                color: red;
            }
        }

        .clearfix:before,
        .clearfix:after {
            display: flex;
            justify-content: space-between;
            content: "";
        }

        .clearfix:after {
            clear: both
        }

        .box-card {
            width: 50%;
        }

        .el-dialog--center .el-dialog__body {
            display: flex;
        }

        .clearfix {
            text-align: center;
        }
    }
}

</style>
