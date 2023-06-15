<template>
    <div class="area">
        <el-card class="box-card" v-loading="loading">
            <div slot="header" class="clearfix">
                <span>区域配置</span>
            </div>
            <el-table
                :expand-row-keys="['0']"
                v-if="visible"
                max-height="730px"
                :data="areaListTow"
                row-key="id"
                lazy
                :load="load"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="name"></el-table-column>
                <el-table-column prop="address">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip
                                v-if="scope.row.id>0  && auth('/system/attributes/area/del')" content="删除"
                                placement="top">
                                <el-button
                                    type="danger"
                                    @click="del(scope.row)"
                                    size="mini" icon="el-icon-delete">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip
                                v-if="scope.row.id>0" content="编辑"
                                placement="top">
                                <el-button
                                    type="warning"
                                    @click="compile(scope.row)"
                                    size="mini" icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="scope.row.add_title" placement="top">
                                <el-button type="primary"
                                           @click="editCateDia(scope.row)" size="mini"
                                           icon="el-icon-circle-plus-outline"
                                           v-if="scope.row.level!==3 && auth('/system/attributes/area/add')">
                                </el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
            :before-close="handleClose"
            title="新增省市区域"
            :visible.sync="centerDialogVisible"
            width="50%"
            center>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="市区名称" prop="name">
                    <el-input ref="mark" v-model="ruleForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :before-close="handleClose"
            title="编辑省市区域"
            :visible.sync="compileDialog"
            width="50%"
            center>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="市区名称" prop="compileName">
                    <el-input ref="mark" v-model="ruleForm.compileName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="compileDialog = false">取 消</el-button>
                    <el-button type="primary" @click="compileSubmitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

import {attributesApi} from '@/http/api'
import {apiUpdateArea, areaDeleteApi} from '@/http/area'

export default {
    props: {},
    data() {
        return {
            compileDialog: false, //编辑页面弹窗
            loading: false,
            level: 1,
            centerDialogVisible: false,
            areaListTow: [],
            ruleForm: {
                name: '',
                compileName:''
            },
            rules: {
                name: [
                    {required: true, message: '请输入市区名称', trigger: 'blur'},
                ],
                compileName: [
                    {required: true, message: '请输入市区名称', trigger: 'blur'},
                ],
            },
            val: {},
            visible: true,
            compileList: {},
            compileData:{
                id:0,
                name:"",
                level:0,
                pid:0
            },
            name:''
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 弹窗关闭
        handleClose() {
            this.val = {}
            this.ruleForm.name = ""
            this.centerDialogVisible = false
        },
        getList() {
            this.loading = true
            this.visible = false
            attributesApi().then(res => {
                this.areaListTow = JSON.parse(JSON.stringify(res.content.area))
                this.areaListTow[0].children.forEach(i => {
                    this.deleteChildren(i)
                })
                this.loading = false
                this.visible = true
            })
        },
        deleteChildren(array) {
            if (array.children) {
                array.hasChildren = true
                array.children.forEach(i => {
                    this.deleteChildren(i)
                })
                array.children2 = JSON.parse(JSON.stringify(array.children))
                Reflect.deleteProperty(array, "children")
            }

        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    apiUpdateArea({
                        name: this.ruleForm.name,
                        level: this.val.level + 1,
                        pid: this.val.id,
                        id: ""
                    }).then(res => {
                        if (res.code === 0) {
                            this.$message({
                                message: res.message,
                                type: 'success',
                            });
                            this.getList()
                        }
                    })
                    this.centerDialogVisible = false
                } else {
                    return false;
                }
            });
        },
        compileSubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    apiUpdateArea({
                        id:this.compileData.id,
                        pid:this.compileData.pid,
                        name:this.ruleForm.compileName,
                        level:this.compileData.level
                    }).then(res => {
                        if (res.code === 0) {
                            this.$message({
                                message: res.message,
                                type: 'success',
                            });
                            this.getList()
                        }
                    })
                    this.compileDialog = false
                } else {
                    return false;
                }
            });
        },
        editCateDia(val) {
            this.centerDialogVisible = true
            this.val = val
            this.ruleForm.name = ""
        },
        load(tree, treeNode, resolve) {
            resolve(tree.children2)
        },
        del(val) {
            let id = val.id
            this.$confirm("是否要删除, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    const res = await areaDeleteApi({id});
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                    this.getList()
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        compile(val) {
            console.log(val)
            this.val = val
            this.ruleForm.compileName = val.name
            this.compileData = {
                id:val.id,
                name:val.name,
                level:val.level,
                pid:val.pid
            }
            this.compileDialog = true
            this.compileList = {}
            // 编辑
        }
    },
}
</script>
<style lang="scss">
</style>
