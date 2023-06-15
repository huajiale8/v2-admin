<template>
    <el-form
        label-width="150px"
        style="width: 50%; margin: 50px auto">
        <el-date-picker
            v-model="dateInfo.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            @change="dateSelected()"
            style="width: 100%"
        >
        </el-date-picker>
        <div v-if="dateInfo.dayRange" class="dateRangeText">
            项目工期为： {{ this.dateInfo.dayRange }} 天
        </div>
    </el-form>
</template>

<script>

export default {
    name: "DatePicker",
    props: {},
    data() {
        return {
            dateInfo: {
                dateRange: '',
                dateStart: '',
                dateEnd: '',
                dayRange: '',
            }
        }
    },
    mounted() {
        this.dateInfo = this.$store.state.dateInfo
        if (this.dateInfo.dayRange !== '') {
            this.dateInfo.dateRange[0] = new Date(this.dateInfo.dateStart)
            this.dateInfo.dateRange[1] = new Date(this.dateInfo.dateEnd)
        }
    },
    methods: {
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
    },
    beforeDestroy() {
        this.$store.commit("updateDate",this.dateInfo)
    }
}
</script>
<style lang="scss" scoped>
</style>
