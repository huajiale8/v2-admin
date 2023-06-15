<template>
    <div class="account">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>报价单管理</span>
            </div>
            <el-tooltip class="item" effect="dark" content="新增报价" placement="top">
                <el-button type="primary" @click="add" icon="el-icon-plus"></el-button>
            </el-tooltip>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部报价" name="0"></el-tab-pane>
                <el-tab-pane label="待审核" name="2"></el-tab-pane>
                <el-tab-pane label="已拒绝" name="4"></el-tab-pane>
                <el-tab-pane label="审核通过" name="3"></el-tab-pane>
                <el-tab-pane label="已关闭" name="5"></el-tab-pane>
            </el-tabs>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="formInline.code" placeholder="请输入报价编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formInline.user" placeholder="请输入客户名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-tooltip class="item" effect="dark" content="查询" placement="top">
                        <el-button type="primary" @click="onSubmit" icon="el-icon-search"></el-button>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <el-table
                v-loading="loading"
                :data="tableData"
                max-height="545px"
                style="width: 100%">
                <el-table-column
                    fixed
                    prop="code"
                    label="报价编号"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="bidder_name"
                    label="员工姓名"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="custom_name"
                    label="客户名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="total_price"
                    label="金额"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="discount"
                    label="折扣"
                    width="120">
                    <template slot-scope="scope">
                        <el-tag type="warning">{{ scope.row.discount }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    label="报价时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="validate_date"
                    label="有效期"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 1" type="primary">填写中</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="warning">待审核</el-tag>
                        <el-tag v-if="scope.row.status === 3" type="success">审核通过</el-tag>
                        <el-tag v-if="scope.row.status === 4" type="danger">已拒绝</el-tag>
                        <el-tag v-if="scope.row.status === 5" type="info">已关闭</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="feedback"
                    label="反馈"
                    width="120">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.feedback" class="item" effect="dark" :content="scope.row.feedback"
                                    placement="top-end">
                            <el-tag>详情</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="140">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button size="mini" v-if="scope.row.status <= 2" type="primary" @click="edit(scope.row)"
                                       icon="el-icon-edit-outline"
                                       :underline="false">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查询" placement="top">
                            <el-button size="mini" v-if="scope.row.status > 2" type="primary" @click="detail(scope.row)"
                                       icon="el-icon-view"
                                       :underline="false">查看
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="审核" placement="top">
                            <el-button size="mini" v-if="scope.row.status === 2" type="warning"
                                       @click="detailTow(scope.row, 'check')" icon="el-icon-position">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="list.page"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="list.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
            </el-pagination>
            <el-dialog title="报价单详情" :visible.sync="PdfDialogVisible" width="750px" center
                       :close-on-click-modal="false" :close-on-press-escape="false">
                <el-row :gutter="10" style="display: flex; justify-content: center; align-items: center;">
                    <el-col :span="8"><span style="font-weight: bold;font-size: 24px">新看点VR服务报价</span></el-col>
                    <el-col :span="5"><img src="@/assets/logo-version.png" alt=""></el-col>
                    <el-col :span="11" style="font-size: 12px;">
                        <el-row :gutter="10">
                            <el-col :span="24">苏州新看点信息技术有限公司</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">苏州市工业园区金鸡湖大道88号人工智能产业园G1-803</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">电话：4006622360</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="24">网址：www.xkdphoto.com</el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;">
                    <el-col :span="24" style="text-align: right">报价有效期 {{ viewForm.validate_date }}</el-col>
                </el-row>
                <el-row :gutter="10" style="margin: 10px 0 10px 0;">
                    <el-col :span="24" style="font-size: 20px;font-weight: bold;">主体信息</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12" style="line-height: 24px;">
                        <el-row :gutter="10">
                            <el-col :span="10">甲方名称：</el-col>
                            <el-col :span="14">{{ viewForm.custom_name }}</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10">甲方联系人：</el-col>
                            <el-col :span="14">{{ viewForm.custom_contact }}</el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10">甲方联系方式：</el-col>
                            <el-col :span="14">{{ viewForm.custom_phone }}</el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12" style="line-height: 24px;">
                        <el-row :gutter="10">
                            <el-col :span="10">乙方客户经理：</el-col>
                            <el-col :span="14">{{ viewForm.bidder_name }}</el-col>
                        </el-row>
                        <el-row :gutter="10" style="min-height:24px;">
                            <el-col :span="10"></el-col>
                            <el-col :span="14"></el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="10">联系方式：</el-col>
                            <el-col :span="14">{{ viewForm.bidder_phone }}</el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;">
                    <el-col :span="10">项目工期：</el-col>
                    <el-col :span="14">{{ viewForm.duration }}个工作日</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="10">项目起讫时间：</el-col>
                    <el-col :span="14">{{ viewForm.start_time }} - {{ viewForm.end_time }}</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="10">项目地点：</el-col>
                    <el-col :span="14"></el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;font-weight: bold">
                    <el-col :span="8">服务名称</el-col>
                    <el-col :span="4">单价</el-col>
                    <el-col :span="4">单位</el-col>
                    <el-col :span="4">数量</el-col>
                    <el-col :span="4">总价</el-col>
                </el-row>
                <div :gutter="10" v-for="(item, index) in viewForm.services">
                    <el-row :gutter="10" style="margin-top: 5px;">
                        <el-col :span="24">{{ item.name }}</el-col>
                    </el-row>
                    <el-row :gutter="10" v-for="(datum, index) in item.children" style="margin-top: 5px;">
                        <el-col :span="2" style="min-height: 1px;"></el-col>
                        <el-col :span="6">{{ datum.name }}</el-col>
                        <el-col :span="4">{{ datum.price }}</el-col>
                        <el-col :span="4">{{ datum.unit }}</el-col>
                        <el-col :span="4">{{ datum.num }}</el-col>
                        <el-col :span="4">{{ datum.total }}</el-col>
                    </el-row>
                </div>
                <el-row :gutter="10" style="margin-top: 10px;">
                    <el-col :span="8">以上价格小计</el-col>
                    <el-col :span="8">¥{{ viewForm.itemPrice }}</el-col>
                    <el-col :span="8"></el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;font-weight: bold;">
                    <el-col :span="24">活动</el-col>
                </el-row>
                <el-row :gutter="10" v-for="(item, index) in viewForm.activities" style="margin-top: 5px;">
                    <el-col :span="2" style="min-height: 1px;"></el-col>
                    <el-col :span="12">{{ item.name }}</el-col>
                    <el-col :span="10">-{{ item.amount }}</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 10px;font-weight: bold;">
                    <el-col :span="24">折扣</el-col>
                </el-row>
                <el-row :gutter="10" v-for="(item, index) in viewForm.services" style="margin-top: 5px;">
                    <el-col :span="2" style="min-height: 1px;"></el-col>
                    <el-col :span="12">{{ item.name }}</el-col>
                    <el-col :span="10">-{{ item.discount }}%</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="12">整体折扣</el-col>
                    <el-col :span="12">-{{ viewForm.discount }}%</el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 5px;">
                    <el-col :span="24">税金6%</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="4" style="min-height: 1px;"></el-col>
                    <el-col :span="6">以上价格</el-col>
                    <el-col :span="6">¥{{ viewForm.total_price }}</el-col>
                    <el-col :span="8">{{ viewForm.RMB }}</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">备注</el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="2" style="min-height: 1px;"></el-col>
                    <el-col :span="20">{{ viewForm.remark }}</el-col>
                </el-row>
                <el-dialog width="30%" title="驳回理由" :visible.sync="dialogToReject" append-to-body>
                    <el-form>
                        <el-form-item>
                            <el-input type="textarea" :rows="4" v-model="checkForm.reason"
                                      placeholder="驳回理由"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer" style="text-align: right;">
                        <el-button type="danger" @click="reject">驳回</el-button>
                    </div>
                </el-dialog>
                <div slot="footer" class="dialog-footer" style="text-align: right;">
                    <el-button @click="shut">关闭</el-button>
                    <el-button v-if="toCheck" type="success" @click="pass(viewForm.id)">同意</el-button>
                    <el-button v-if="toCheck" type="danger" @click="toReject(viewForm.id)">拒绝</el-button>
                    <el-button v-if="viewForm.status === 4 || viewForm.status === 3" type="warning"
                               @click="closeOrder(viewForm.id)">关闭订单
                    </el-button>
                    <el-button v-if="viewForm.status >= 3" type="primary" @click="download(viewForm.id)">导出
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog
                :before-close="handleClose"
                :title=name
                :visible.sync="centerDialogVisible"
                width="70%"
                center>
                <orderDialog v-if="centerDialogVisible" @flag="sonFnEvent($event)"></orderDialog>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import {
    apiExport,
    quoteOrderCloseApi,
    quoteOrderDetailApi,
    quoteOrderListApi,
    quoteOrderPassApi,
    quoteOrderRedactApi,
    quoteOrderRejectApi
} from "@/http/quoteOrder";
import orderDialog from "@/components/Order/OrderDialog";

export default {
    components: {orderDialog},
    props: {},
    data() {
        return {
            name:'新增报价单',
            toCheck: false, //审核PDF的同意拒绝
            dialogToReject: false,
            PdfDialogVisible: false,//pdf弹框
            loading: false,//表格加载状态
            centerDialogVisible: false,//添加弹框状态
            activeName: 0,// tabs选择
            tableData: [],//表格数据
            list: {
                page: 1,
                pageSize: 10,
                code: '',
                custom_name: '',
                status: 0
            },//搜索
            formInline: {
                user: '',
                code: ''
            },
            total: 0,//总条数
            viewForm: {}, //PDF数据
            checkForm: {
                reason: '', //驳回理由
                id: 0
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        add() {
            this.centerDialogVisible = !this.centerDialogVisible
            this.name = '新增报价单'
        },
        sonFnEvent(data) {
            this.centerDialogVisible = data
            this.getList()
        },
        //点击更换tabs
        handleClick(val) {
            this.loading = true
            this.list.status = parseInt(val.name) //点击更换状态
            this.getList()
            this.loading = false
        },
        // 获取数据列表
        getList() {
            this.loading = true
            quoteOrderListApi(this.list).then(res => {
                this.total = res.content.lists.total
                this.tableData = res.content.lists.data
                this.categories = res.content.categories
                this.activity = res.content.activity
                this.$store.state.categories = res.content.categories
                this.$store.state.activity = res.content.activity
                this.categories.forEach((i) => {
                    i.key = Math.random()
                    i.children &&
                    i.children.forEach((j) => {
                        j.total = 0
                        j.key = Math.random()
                    })
                })
            })
            this.loading = false
        },
        //搜索
        onSubmit() {
            this.list = {
                page: 1,
                pageSize: 10,
                code: this.formInline.code,
                custom_name: this.formInline.user,
                status: this.activeName
            }
            this.getList()
        },
        //分页
        handleSizeChange(val) {
            this.list.page = 1
            this.list.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.list.page = val;
            this.getList();
        },
        // 编辑
        edit(id) {
            this.name = '编辑报价单'
            this.$store.state.flag = true
            quoteOrderRedactApi({id: id, type: ''}).then(res => {
                this.$store.state.allData = res.content
                this.centerDialogVisible = true
            })
        }
        ,//查看
        detail(val) {
            let obj = {
                id: val.id,
                type: ""
            }
            this.PdfDialogVisible = true
            quoteOrderDetailApi(obj).then(res => {
                this.viewForm = res.content
            })
        },//关闭
        // 审核
        detailTow(val) {
            let obj = {
                id: val.id,
                type: ""
            }
            this.PdfDialogVisible = true
            this.toCheck = true
            quoteOrderDetailApi(obj).then(res => {
                this.viewForm = res.content
            })
        },
        //同意
        pass(id) {
            quoteOrderPassApi({id}).then(res => {
                this.PdfDialogVisible = false
                this.$message.success({
                    message: res.message,
                    onClose: () => {
                        this.getList()
                    }
                })
            })
        }
        ,//关闭
        shut() {
            this.PdfDialogVisible = false
            this.viewForm = {}
            this.toCheck = false
        }
        ,//拒绝
        toReject(id) {
            this.checkForm.id = id
            this.dialogToReject = true
        }
        ,//驳回
        reject() {
            let _this = this;
            this.$confirm('确认拒绝该报价单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                quoteOrderRejectApi(this.checkForm).then(res => {
                    if (res.code === 1) {
                        this.$message.error(res.message);
                        return false;
                    }
                    this.PdfDialogVisible = false;
                    this.dialogToReject = false;
                    this.$message.success({
                        message: res.message,
                        onClose: () => {
                            _this.toCheck = false;
                            _this.getList();
                        }
                    });
                }).catch(error => {
                    this.$message.error(error.message);
                    return false;
                });
            }).catch(() => {
                return false;
            });
        },
        //关闭订单
        closeOrder(id) {
            this.$confirm('确认关闭该订单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                quoteOrderCloseApi({id}).then(res => {
                    this.PdfDialogVisible = false;
                    this.$message.success({
                        message: '确认成功!',
                        onClose: () => {
                            this.getList()
                        }
                    });
                }).catch(error => {
                    this.$message.error(error.message);
                    return false;
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消确认'
                });
            });
        },
        // 导出
        download(id) {
            apiExport(id, this.viewForm.code + '报价单详情.pdf')
        }
        ,//审核
        handleClose() {
            this.$store.state.allData = {}
            this.centerDialogVisible = false
            this.$store.state.flag = false
        }
    }
}
</script>
<style lang="scss">

</style>
