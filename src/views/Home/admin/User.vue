<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>管理员管理</span>
            </div>
            <el-tooltip content="新增" placement="top">
                <el-button type="primary"
                           v-if="auth('/system/attributes/category/add')"
                           icon="el-icon-plus" @click="centerDialogVisible = !centerDialogVisible ">
                </el-button>
            </el-tooltip>
            <el-table
                max-height="660px"
                fit
                v-loading="loading"
                :data="tableData">
                <el-table-column prop="id" label="序号"  width="200" fixed="left">
                </el-table-column>
                <el-table-column prop="name" label="名称" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="phone" label="手机号码" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" prop="is_show" label="状态" width="80">
                    <template slot-scope="scope">
                        <div>
                            <el-tag v-if="scope.row.status===0" type="success">显示</el-tag>
                            <el-tag v-else type="info">隐藏</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip content="分配权限" placement="top">
                                <el-button type="warning" @click="power(scope.row)"
                                           size="mini" icon="el-icon-setting">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="编辑" placement="top">
                                <el-button type="primary" @click="editCateDia(scope.row)"
                                           size="mini" icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="启用" placement="top">
                                <el-button type="success" @click="enable(scope.row.id)" v-if="scope.row.status===1"
                                           size="mini" icon="el-icon-success">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="禁用" placement="top">
                                <el-button type="danger" v-if="scope.row.status===0" @click="forbidden(scope.row.id)"
                                           size="mini" icon="el-icon-error">
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="queryInfo.page" :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
        </el-card>
        <!--新增管理员弹框-->
        <el-dialog
            :before-close="handleClose" title="新增管理员" :visible.sync="centerDialogVisible" width="50%" center>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="真实姓名" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-radio v-model="ruleForm.status" :label=0>显示</el-radio>
                    <el-radio v-model="ruleForm.status" :label=1>隐藏</el-radio>
                </el-form-item>
                <div class="foot">
                    <el-button v-if="justify('/system/attributes/category/update')" type="primary"
                               @click="submitForm('ruleForm')">保存
                    </el-button>
                    <el-button @click="handleClose">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!--        权限分配弹框-->
        <el-dialog
            :before-close="handleClose"
            title="权限组分配"
            :visible.sync="DialogVisible"
            width="50%"
            center>
            <el-form ref="form" :model="ruleForm" label-width="80px">
                <el-form-item label="当前用户">
                    <span>{{ ruleForm.name }}</span>
                    <span>{{ ruleForm.phone }}</span>
                </el-form-item>
                <el-form-item label="权限组">
                    <el-checkbox-group v-model="accesses">
                        <el-checkbox
                            v-for="(item,index) in type"
                            :key="item.id"
                            :label="item.id"
                            name="type">{{ item.title }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="preserve">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {auth,} from '@/http/api'
import {
    addUserApi,
    disableUserApi,
    enableUserApi,
    updateUserApi,
    userDetailApi,
    userGroupApi,
    userListApi
} from '@/http/admin'

export default {
    props: {},
    data() {
        return {
            DialogVisible: false,
            disabled: false,
            tableData: [],
            centerDialogVisible: false,
            ruleForm: {
                id: 0,
                name: '',
                phone: '',
                status: 0,
                password: '',
                avatar: '',
            },
            type: [],
            rules: {
                name: [
                    {required: true, message: '请输入名称', trigger: 'blur'},
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
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, message: '登录密码长度不能低于6个字符', trigger: 'blur'},
                ]
            },
            queryInfo: {
                page: 1,
                pageSize: 10,
            },
            total: 0,
            accesses: [],
            loading: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 修改权限
        preserve() {
            updateUserApi({
                uid: this.ruleForm.id,
                rules: this.accesses
            }).then(res => {
                if (res.code === 0) {
                    this.$message({message: res.message, type: 'success'});
                    this.getList()
                    this.DialogVisible = !this.DialogVisible
                    return false
                }
            })
        },
        // 取消
        cancel() {
            this.DialogVisible = false
                this.ruleForm = {
                    id: 0,
                    name: '',
                    phone: '',
                    status: 0,
                    password: '',
                    avatar: '',
                }
        },
        // 获取列表数据
        justify(name) {
            return auth(name)
        },
        // 分配权限
        power(val) {
            this.DialogVisible = !this.DialogVisible
            userGroupApi({id: val.id}).then(res => {
                this.ruleForm = res.content.info
                this.type = res.content.groups
                this.accesses = res.content.accesses
            })
        },
        getList() {
            this.loading = true
            userListApi(this.queryInfo).then(res => {
                this.tableData = res.content.data
                this.total = res.content.total
                this.loading = false
            })
        },
        // 编辑
        editCateDia(index) {
            this.centerDialogVisible = !this.centerDialogVisible
            userDetailApi({id:index.id}).then(res => {
                this.ruleForm = res.content
            })
        },
        // 新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addUserApi(
                        this.ruleForm
                    ).then(res => {
                        if (this.ruleForm.id === 0) {
                            this.$message({message: res.message, type: 'success'});
                            this.getList()
                        } else {
                            this.$message({message: res.message, type: 'success'});
                            this.getList()
                        }
                    })
                    this.centerDialogVisible = false
                    this.ruleForm = {
                        id: 0,
                        name: '',
                        phone: '',
                        status: 0,
                        password: '',
                        avatar: '',
                    }
                } else {
                    return false;
                }
            });
        },
        // 管理员启用enable
        enable(val) {
            this.$confirm('确认启用该管理员？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                enableUserApi({id: val}).then(res => {
                    if (res.code === 0) {
                        this.$message({message: res.message, type: 'success'});
                        this.getList()
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
                disableUserApi({id: val}).then(res => {
                    if (res.code === 0) {
                        this.$message({message: res.message, type: 'success'});
                        this.getList()
                        return false
                    }
                })
            })
        },
        // 分页
        handleSizeChange(val) {
            this.queryInfo.page = 1
            this.queryInfo.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.queryInfo.page = val;
            this.getList();
        },
        // 弹出框关闭
        handleClose() {
            let _this = this
            this.ruleForm = {
                id: 0,
                name: '',
                phone: '',
                status: 0,
                password: '',
                avatar: '',
            }
            this.centerDialogVisible = false
            setTimeout(function () {
                _this.$refs['ruleForm'].clearValidate();//消除校验,这里的setTimeOut不能去掉,去掉之后会不生效
            },30);
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
