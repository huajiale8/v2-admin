<template>
    <div>
        <el-descriptions :column="3" border>
            <el-descriptions-item
                v-for="(item,index) in itemCost"
                :key="index"
                :label="item.name"
                label-style="width:100px">
                ￥{{ item.cost }}
            </el-descriptions-item>
        </el-descriptions>
        <el-form
            ref="form"
            :model="discountInfo"
            label-width="102px"
            :inline="true"
            style="margin-top: 20px">
            <el-form-item
                v-for="(item,index) in serviceDiscount"
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
        <el-form
            ref="form"
            :model="discountInfo"
            label-width="102px">
            <el-form-item label="参加活动">
                <el-checkbox-group v-model="discountInfo.type">
                    <el-tooltip
                        v-for="(item,index) in activity"
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
                <el-input type="textarea" v-model="discountInfo.notes"></el-input>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="8" :offset="16" class="afterTaxCostContainer">
                <div>
                    税后总价：
                    <span class="afterTaxCost">￥{{ afterTaxCost }}</span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "DiscountAndNotes",
    data() {
        return {
            discountInfo: {},
            serviceDiscount: [],
            activity: [],
            chosenActivities: [],
            beforeTaxCost: 0,
        }
    },

    computed: {
        itemCost() {
            return this.servicePriceList()
        },

        afterTaxCost() {
            let discountBeforeTaxCost = 0
            for (let i = 0; i < this.itemCost.length - 1; i++) {
                this.serviceDiscount.forEach((item) => {
                    console.log(item)
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
    },

    methods: {
        servicePriceList() {
            const servicePriceList = []
            //存放服务数据
            this.beforeTaxCost = 0
            // 总价
            this.$store.state.services.forEach(i => {
                let cost = 0
                i.children.forEach(i => {
                    cost += i.total||0
                })
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
    },

    mounted() {
        this.discountInfo = this.$store.state.discountInfo
        this.serviceDiscount = this.$store.state.discountInfo.serviceDiscount
        this.activity = this.$store.state.activity
        this.beforeTaxCost = this.$store.state.beforeTaxCost
    },
}
</script>

<style lang="scss" scoped>
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