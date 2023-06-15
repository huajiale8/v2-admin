<template>
    <div class="menu">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-tooltip content="新增" placement="top">
                    <el-button type="primary"
                               icon="el-icon-plus"
                               v-if="auth('/system/menu/add')"
                               @click=add>
                    </el-button>
                </el-tooltip>
            </div>
            <el-table lazy
                      v-loading="loading"
                      :load="load"
                      :data="tableData" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      style="width: 100%" fit height="calc(100vh - 260px)">
                <el-table-column prop="title" label="菜单名称" sortable width="250" fixed="left">
                </el-table-column>
                <el-table-column prop="url" label="URL" sortable >
                </el-table-column>
                <el-table-column prop="icon" label="ICON" >
                </el-table-column>
                <el-table-column align="center" prop="is_show" label="状态" >
                    <template slot-scope="scope">
                        <div>
                            <el-tag v-if="scope.row.is_show===0" type="success">显示</el-tag>
                            <el-tag v-else type="info">隐藏</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="sort" label="排序" >
                </el-table-column>
                <el-table-column align="center" prop="address" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip content="编辑" placement="top">
                                <el-button v-if="auth('/system/menu/edit')" type="warning"
                                           @click="editCateDia(scope.row)" size="mini" icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button v-if="auth('/system/menu/del')" type="danger"
                                           @click="del(scope.row)" size="mini" icon="el-icon-delete">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="添加子菜单" placement="top" v-if="scope.row.level < 3">
                                <el-button type="primary" v-if="scope.row.is_show === 0 ||
                                            (scope.row.children !== undefined && scope.row.children.length > 0)"
                                           @click="editCateDia(scope.row)" size="mini"
                                           icon="el-icon-circle-plus-outline">
                                </el-button>
                            </el-tooltip>
                        </el-button-group
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :before-close="handleClose" v-if="centerDialogVisible"
                   :title=name :visible.sync="centerDialogVisible" width="50%" center>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="父级菜单" prop="selectOptions">
                    <el-cascader
                        v-model="selectOptions"
                        :options="roleDate"
                        filterable
                        :props="{value:'id',label:'title', checkStrictly: true}"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="菜单名称" prop="title">
                    <el-input placeholder="菜单名称" v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="URL地址" prop="url">
                    <el-input placeholder="URL地址" v-model="ruleForm.url"></el-input>
                </el-form-item>
                <el-form-item label="ICON图标">
                    <el-input placeholder="ICON图标" v-model="ruleForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="权限菜单">
                    <el-radio v-model="ruleForm.is_show" :label=0>显示</el-radio>
                    <el-radio v-model="ruleForm.is_show" :label=1>隐藏</el-radio>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="ruleForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="页面提示">
                    <el-input placeholder="页面提示" type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary"
                               v-if="auth('/system/menu/update')"
                               @click="submitForm('ruleForm')">提 交
                    </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {MenuApi, MenuDeletelApi, MenudetailApi, MenuListApi, MenuRoleNodeApi} from '@/http/systemMenu'

export default {
    props: {},
    data() {
        return {
            name:'新增菜单',
            loading: false,
            centerDialogVisible: false,
            tableData: [],
            ruleForm: {
                name: '',
                title: "",
                value: [],
                id: '',
                sort: 50,
                desc: '',
                url: '',
                is_show: 0,
                icon: '',
                pid: 0,
            },
            rules: {
                selectOptions: [
                    {required: true, message: '请选择父级菜单', trigger: 'change'},

                ],
                url: [
                    {required: true, message: '请输入URL地址', trigger: 'change'},
                    {
                        validator: function (rule, value, callback) {
                            let urlReg = /^\/{1}[a-z|\/]*$/
                            if (urlReg.test(value) === false) {
                                callback(new Error("URL地址格式不正确(如:/dashboard)"));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ],
                title: [
                    {required: true, message: '请输入菜单名称', trigger: 'change'}
                ],
                sort: [
                    {required: true, message: '请输入排序', trigger: 'change'},
                    {
                        validator: function (rule, value, callback) {
                            if (isNaN(Number(value))) {
                                callback(new Error("必须是数字"));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ],
            },
            roleDate: [],
            selectOptions: []
        }
    },
    created() {
        this.getList()
        this.getMenuRoleNode()
    },
    methods: {
        add(){
          this.centerDialogVisible = true
          this.name = '新增菜单'
        },
        load(tree, treeNode, resolve) {
            resolve(tree.children2)
        },
        // 删除子菜单
        deleteChildren(array) {
            if (array.children) {
                array.hasChildren = true
                array.children.forEach(i => {
                    this.deleteChildren(i)
                })
                array.children2 = JSON.parse(JSON.stringify(array.children))
                Reflect.deleteProperty(array, 'children')
            }
        },
        // 获取菜单列表
        getList() {
            MenuListApi().then(res => {
                this.loading = true
                this.tableData = JSON.parse(JSON.stringify(res.content.lists))
                this.tableData.forEach(i => {
                    this.deleteChildren(i)
                    this.loading = false
                })
            })
        },
        // 获取权限节点
        getMenuRoleNode() {
            MenuRoleNodeApi().then(res => {
                let arr = {
                    id: 0,
                    is_show: 0,
                    leaf: true,
                    level: 1,
                    order: "1",
                    pid: 0,
                    sort: 1,
                    status: 0,
                    tips: null,
                    title: "顶层菜单"
                }
                this.roleDate = res.content
                this.roleDate.unshift(arr)
            })
        },
        // 新增
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    MenuApi({
                        icon: this.ruleForm.icon,
                        pid: this.ruleForm.pid,
                        title: this.ruleForm.title,
                        url: this.ruleForm.url,
                        sort: this.ruleForm.sort,
                        id: this.ruleForm.id
                    }).then(res => {
                        if (res.code === 0) {
                            this.centerDialogVisible = false
                            this.$message({
                                message: '数据提交成功',
                                type: 'success',
                                onClose: () => {
                                    this.getList()
                                }
                            });
                        }
                    })
                }
            });
        },
        // 弹出框关闭时
        handleClose() {
            this.ruleForm = {
                name: '',
                title: "",
                value: [],
                id: '',
                sort: 50,
                desc: '',
                url: '',
                is_show: 0,
                icon: '',
                pid: 0,
            }
            this.selectOptions = []
            this.centerDialogVisible = false
        },
        handleChange(options) {
            let arr = options.length - 1
            this.ruleForm.pid = options[arr]
        },
        // 编辑
        editCateDia(val) {
            this.name = '编辑菜单'
            MenudetailApi({id: val.id}).then(res => {
                console.log(res)
                this.ruleForm = res.content.info
                this.selectOptions = res.content.selectedOptions
                this.centerDialogVisible = true;
            })

        },
        // 删除
        del(val) {
            let id = val.id
            this.$confirm("是否要删除, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const res = await MenuDeletelApi({id});
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
    },
}
</script>
<style lang="scss" scoped>

</style>
