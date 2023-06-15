<template>
    <div>
        <el-steps :active="active" finish-status="success">
            <el-step title="客户资料"></el-step>
            <el-step title="乙方资料"></el-step>
            <el-step title="服务内容"></el-step>
            <el-step title="项目工期"></el-step>
            <el-step title="折扣"></el-step>
        </el-steps>
        <el-form
            label-width="150px"
            style="width: 90%; margin: 50px auto">
            <div v-if="active === 0" class="custom-form">
                <el-form
                    ref="partAInfo"
                    :model="partAInfo"
                    label-width="150px"
                    :rules="rules"
                    style="width: 50%; margin: 50px auto">
                    <el-form-item label="甲方名称" prop="custom_name">
                        <el-input v-model="partAInfo.custom_name" placeholder="请输入甲方名称"></el-input>
                    </el-form-item>
                    <el-form-item label="甲方联系人" prop="custom_contact">
                        <el-input v-model="partAInfo.custom_contact" placeholder="请输入甲方联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="甲方联系方式" prop="custom_phone">
                        <el-input v-model="partAInfo.custom_phone" placeholder="请输入甲方联系方式"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="one_next_step" class="btn-custom-info">下一步</el-button>
            </div>
            <div v-if="active === 1">
                <el-form
                    :inline="true"
                    ref="partAInfo"
                    :model="partAInfo"
                    class="demo-form-inline"
                    style="width: 80%; margin: 50px auto"
                >
                    <el-form-item label="查找乙方经理">
                        <el-select
                            v-model="partAInfo.id"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="remoteMethod"
                            @change="onPartBSelected"
                            :loading="loading">
                            <el-option
                                v-for="item in managerB"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="乙方客户经理">
                        <el-input v-model="this.partAInfo.bidder_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="乙方联系方式">
                        <el-input v-model="this.partAInfo.bidder_phone" disabled></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="active === 2">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    row-key="key"
                    :default-expand-all="false"
                    fit
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column
                        prop="name"
                        label="内容名称"
                        width="180"
                        header-align="center"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="单价"
                        width="150"
                        header-align="center"
                        align="center">
                        <template v-slot="scope">
                            <el-input placeholder=""
                                      v-model="scope.row.price"
                                      @input="handleChange(scope)"
                                      v-if="scope.row.price">
                                <template slot="prepend">￥</template>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量"
                        width="220"
                        header-align="center"
                        align="center">
                        <template v-slot="scope">
                            <el-input-number v-model="scope.row.num"
                                             @change="handleChange(scope)"
                                             :min="0"
                                             v-if="!scope.row.children"
                                             label="数量">
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="unit"
                        label="单位"
                        header-align="center"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="total"
                        label="总价"
                        width="150"
                        header-align="center"
                        align="center">
                        <template v-slot="scope">
                            <el-input placeholder="" v-model="scope.row.total" v-if="scope.row.price" disabled>
                                <template slot="prepend">￥</template>
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-if="active === 3">
                <div class="block" style="width: 50%; margin: 50px auto">
                    <el-date-picker
                        @change="dateSelected()"
                        v-model="dateInfo.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="timestamp">
                    </el-date-picker>
                    <div v-if="dateInfo.dayRange" class="dateRangeText">
                        项目工期为： {{ this.dateInfo.dayRange }} 天
                    </div>
                </div>
            </div>
            <div v-if="active === 4">
                <el-descriptions :column="3" border>
                    <el-descriptions-item
                        v-for="(item,index) in itemCost"
                        :key="index"
                        :label="item.name"
                        label-style="width:100px">
                        ￥{{ item.cost }}
                    </el-descriptions-item>
                </el-descriptions>
                <!--                2-->
                <el-form
                    ref="form"
                    :model="discountInfo"
                    label-width="102px"
                    :inline="true"
                    style="margin-top: 20px">
                    <el-form-item
                        v-for="(item,index) in this.RebateDate"
                        :label="item.name+'折扣'"
                        :key="index">
                        <el-input-number
                            v-model="item.discount"
                            class="discount"
                            :step="5"
                            :min="0"
                            :max="100"
                            :key="index">
                            <template slot="append">%</template>
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="总价折扣">
                        <el-input-number
                            v-model="discountInfo.discount"
                            class="discount"
                            :step="5">
                            <template slot="append">%</template>
                        </el-input-number>
                    </el-form-item>
                </el-form>
                <!--3-->
                <el-form
                    ref="form"
                    :model="discountInfo"
                    label-width="102px">
                    <el-form-item label="参加活动">
                        <el-checkbox-group v-model="discountInfo.type">
                            <el-tooltip
                                v-for="(item,index) in chosenActivities"
                                class="row-item"
                                effect="dark"
                                :content="'优惠金额：￥'+item.amount"
                                placement="top"
                                :key="index">
                                <el-checkbox
                                    :label="item.id"
                                    name="type"
                                    :key="index"
                                    @change="activitiesChanged($event, item)">
                                    {{ item.name }}
                                </el-checkbox>
                            </el-tooltip>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="discountInfo.remark"></el-input>
                    </el-form-item>
                </el-form>
                <!--                总价-->
                <el-row>
                    <el-col :span="8" :offset="16" class="afterTaxCostContainer">
                        <div>
                            税后总价：
                            <span class="afterTaxCost">￥{{ afterTaxCost }}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button class="left" v-if="active > 0" @click="pre">上一步</el-button>
        <el-button class="center" v-if="active < 4 && active > 0" @click="next">下一步</el-button>
        <el-button class="right" v-if="active=== 4" type="primary" @click="onSubmit">提交报价</el-button>
        </span>
    </div>
</template>

<script>

import {quoteOrderNameApi, quoteOrderSaveApi} from "@/http/quoteOrder";

export default {
    name: "OrderList",
    props: {},
    data() {
        return {

            loading: false,
            active: 0, //状态step
            rules: {
                custom_name: [
                    {required: true, message: '请输入甲方名称', trigger: 'blur'},
                ],
                custom_contact: [
                    {required: true, message: '请输入甲方联系人', trigger: 'blur'}
                ],
                custom_phone: [
                    {required: true, message: '请输入甲方联系方式', trigger: 'blur'}
                ],
            }, //甲方验证规范
            managerB: [],//乙方经理数据
            partAInfo: {
                //甲方数据
                custom_name: '',
                custom_contact: '',
                custom_phone: '',
                // 乙方数据
                bidder_name: "",
                bidder_phone: "",
                id: '',
            },
            list: {
                page: 1,
                pageSize: 8,
                code: '',
                custom_name: '',
                status: 0
            },//获取数据
            tableData: this.$store.state.categories, //存放服务数据
            discountData: [], //存放折扣数据
            dateInfo: {
                dateRange: [],
                dateStart: '',
                dateEnd: '',
                dayRange: '',
            }, //存放时间
            beforeTaxCost: 0,//总价
            // 服务折扣数据
            discountInfo: {
                remark: '', //备注数据
                type: [],
                discount: 0,
                serviceDiscount: [],
            },
            RebateDate: [],
            // 总价
            //服务活动
            chosenActivities: this.$store.state.activity,
            id: 0
        }
    },
    created() {
    },
    methods: {
        // 获取服务内容数据
        // 客户资料的下一步
        one_next_step() {
            this.$refs['partAInfo'].validate((valid) => {
                if (valid) {
                    this.active++
                } else {
                    return false
                }
            });

        },
        // 下一步
        next() {
            this.active++
            if (this.active === 4) {
                this.disList()
            }

        },
        // 上一步
        pre() {
            this.active -= 1

        },

        // 服务内容的计算总价
        handleChange(scope) {
            scope.row.total = scope.row.price * scope.row.num
        },
        // 计算时间
        dateSelected() {
            this.dateInfo.dayRange = (this.dateInfo.dateRange[1] - this.dateInfo.dateRange[0]) / 3600 / 24 / 1000
            this.dateInfo.dateStart = this.dateTransform(this.dateInfo.dateRange[0])
            this.dateInfo.dateEnd = this.dateTransform(this.dateInfo.dateRange[1])
        },
        dateTransform(time) {
            const date = new Date(time)
            const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
            const currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
            return date.getFullYear() + "-" + month + "-" + currentDate;
        },
        // 服务价格获取
        servicePriceList() {
            const servicePriceList = []
            //存放服务数据
            this.beforeTaxCost = 0
            // 总价
            this.tableData.forEach(i => {
                let cost = 0
                i.children.forEach(i => cost += Number(i.total) || 0)
                this.beforeTaxCost += cost
                const serviceItem = {id: i.id, name: i.name, cost}
                servicePriceList.push(serviceItem)
            })
            servicePriceList.push({
                name: '总价',
                cost: this.beforeTaxCost
            })
            return servicePriceList
        },
        disList() {
            this.itemCost.forEach(i => {
                this.discountInfo.serviceDiscount.push({id: i.id, discount: 0, name: i.name})
            })
            this.RebateDate = this.discountInfo.serviceDiscount
            this.RebateDate.splice(this.RebateDate.length - 1)
            this.discountInfo.discount = 0
        },
        //活动价格计算
        activitiesChanged(e, item) {
            if (e) {
                this.itemCost[this.itemCost.length - 1].cost -= Number(item.amount)
                this.chosenActivities.push(item)
            } else {
                let activityIndex = 0
                this.chosenActivities.forEach((i, index) => {
                    if (i.id === item.id) {
                        activityIndex = index
                        this.itemCost[this.itemCost.length - 1].cost += Number(item.amount)
                        this.chosenActivities.splice(activityIndex, 1)
                    }
                })
            }
        },
        // 查询乙方数据
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                this.managerB = []
                quoteOrderNameApi({name: query}).then(res => {
                    this.loading = false;
                    res.content.forEach(i => {
                        const temp = {
                            value: i.id,
                            label: i.contact_name,
                            phone: i.contact_phone,
                        }
                        this.managerB.push(temp)
                    })
                })
            } else {
                this.managerB = [];
            }
        },
        onPartBSelected(value) {
            let obj = this.managerB.find(x => {
                return x.value === value
            })
            this.partAInfo.bidder_name = obj.label
            this.partAInfo.bidder_phone = obj.phone
        },
        // 提交报价
        onSubmit() {
            let obj = {
                id: this.id,
                uid: this.partAInfo.id,
                custom_contact: this.partAInfo.custom_contact, //客户联系人
                custom_name: this.partAInfo.custom_name, // 客户名称
                custom_phone: this.partAInfo.custom_phone, //客户联系方式
                dateStart: this.dateInfo.dateStart, //开始时间
                dateEnd: this.dateInfo.dateEnd,  //结束时间
                remark: this.discountInfo.remark, //备注
                serviceDiscount: this.RebateDate,
                services: this.tableData,
                beforeTaxCost: this.beforeTaxCost,
                afterTaxCost: this.afterTaxCost,
                discount: 5
            }
            quoteOrderSaveApi(obj).then(res => {
                if (res.code === 0) {
                    this.$message({
                        showClose: true,
                        message: res.message,
                        type: 'success'
                    });
                    this.$emit("flag", false)
                }
            })
        },
    }
    , mounted() {
        // 判断当前是否有时间
        if (this.dateInfo.dayRange !== '') {
            this.dateInfo.dateRange[0] = new Date(this.dateInfo.dateStart)
            this.dateInfo.dateRange[1] = new Date(this.dateInfo.dateEnd)
        }
        if (this.$store.state.flag === true) {
            let obj = this.$store.state.allData
            this.partAInfo = {
                custom_name: obj.custom_name,
                custom_contact: obj.custom_contact,
                custom_phone: obj.custom_phone,
                // 乙方数据
                bidder_name: obj.bidder_name,
                bidder_phone: obj.bidder_phone,
                id: obj.uid,
            }
            let categories = this.tableData
            let services = obj.services
            services.forEach(i => {
                categories.forEach(j => {
                    if (j.id === i.cid) {
                        j.discount = i.discount
                        j.children.forEach(item => {
                            i.children.forEach(item2 => {
                                if (item.id === item2.item_id) {
                                    item.total = Number(item2.total)
                                    item.num = item2.num
                                }
                            })
                        })
                    }
                })

                this.tableData = categories
            })
            this.tableData.forEach((item) => {
                item.key = Math.random() * 1000
                item.children.forEach((i) => {
                    i.key = Math.random() * 1000
                })
            })
            this.dateInfo.dateRange = [Date.parse(obj.start_time), Date.parse(obj.end_time)]
            this.dateInfo.dateStart = obj.start_time
            this.dateInfo.dateEnd = obj.end_time
            this.dateInfo.dayRange = (this.dateInfo.dateRange[1] - this.dateInfo.dateRange[0]) / 3600 / 24 / 1000
            this.id = obj.id
        }
    }
    ,
    computed: {
        itemCost() {
            return this.servicePriceList()
        },
        afterTaxCost() {
            let discountBeforeTaxCost = 0
            for (let i = 0; i < this.itemCost.length - 1; i++) {
                this.discountInfo.serviceDiscount.forEach((item) => {
                    if (item.id === this.itemCost[i].id) {
                        discountBeforeTaxCost += this.itemCost[i].cost * (100 - item.discount) / 100
                    }
                })
            }
            this.chosenActivities.forEach(i => {
                discountBeforeTaxCost -= Number(i.amount)
            })
            discountBeforeTaxCost = discountBeforeTaxCost * (100 - this.discountInfo.discount) / 100
            return (discountBeforeTaxCost * 1.06).toFixed(2)
        }

    }
}
</script>

<style lang="scss" scoped>
.custom-form {
    position: relative;

    > .btn-custom-info {
        position: absolute;
        bottom: -50px;
        right: 15px;
    }
}

.dialog-footer {
    .left {
        margin: 20px;
    }

    .right {
        margin: 20px;
    }
}

.discount {
    width: 160px;
}

.afterTaxCostContainer {
    text-align: right;

    .afterTaxCost {
        font-size: 30px;
        font-weight: bold;
    }
}
</style>