<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>位置配置</span>
            </div>
            <el-tooltip content="新增" placement="top">
                <el-button type="primary"
                           icon="el-icon-plus"
                           v-if="auth('/system/attributes/place/add')"
                           @click=add>
                </el-button>
            </el-tooltip>
            <el-table
                max-height="660px"
                v-loading="loading"
                fit
                :data="tableData">
                <el-table-column prop="id" label="编号" fixed width="150">
                </el-table-column>
                <el-table-column prop="name" label="位置" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-tooltip content="编辑" placement="top">
                                <el-button
                                    v-if="auth('/system/attributes/place/edit')"
                                    type="primary"
                                    @click="editCateDia(scope.row)"
                                    size="mini" icon="el-icon-edit"
                                ></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageInfo.page"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageInfo.pageSize"
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
                <el-form-item label="位置名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary"
                           v-if="auth('/system/attributes/place/update')"
                           @click="submitForm('ruleForm')">确 定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

import {addPlaceApi, detailPlaceApi, placeListApi} from "@/http/place";

export default {
    props: {},
    data() {
        return {
            name: '新增位置配置',
            loading: false,
            centerDialogVisible: false,
            tableData: [],
            pageInfo: {
                page: 1,
                pageSize: 10
            },
            ruleForm: {
                name: '',
                id: 0
            },
            rules: {
                name: [
                    {required: true, message: '请输入位置名称', trigger: 'blur'},
                ],
            },
            total: 0
        }
    },
    created() {
        this.placeList()
    },
    methods: {
        add() {
            this.centerDialogVisible = true
            this.name = '新增位置配置'
        },
        placeList() {
            this.loading = true
            placeListApi(this.pageInfo).then(res => {
                this.tableData = res.content.data
                this.total = res.content.total
                this.loading = false
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addPlaceApi(this.ruleForm).then(res => {
                    })
                    if (this.ruleForm.id === 0) {
                        this.$message({message: '添加成功', type: 'success'});
                        this.placeList()
                    } else {
                        this.$message({message: '更新成功', type: 'success'});
                        this.placeList()
                    }
                    this.ruleForm.name = ""
                    this.ruleForm.id = 0
                    this.centerDialogVisible = false
                } else {
                    return false;
                }
            });
        },
        // 分页
        handleSizeChange(val) {
            this.pageInfo.pageSize = val;
            this.pageInfo.page = 1
            this.placeList();
        },
        handleCurrentChange(val) {
            this.pageInfo.page = val;
            this.placeList();
        },
        handleClose() {
            this.ruleForm = {
                id: 0,
                name: '',
            }
            this.centerDialogVisible = false
        },
        // 编辑
        editCateDia(val) {
            this.name = '编辑位置配置'
            this.centerDialogVisible = !this.centerDialogVisible
            detailPlaceApi({id: val.id}).then(res => {
                this.ruleForm = res.content[0]
            })
        }
    },
}
</script>
<style lang="scss" scoped>
</style>
