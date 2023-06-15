<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>操作日志</span>
            </div>
            <el-table :data="tableData"  v-loading="loading"  max-height="700px">
                <el-table-column label="管理员" prop="name"></el-table-column>
                <el-table-column label="客户端IP" prop="ip" show-overflow-tooltip></el-table-column>
                <el-table-column label="内容" prop="content" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="URL地址" prop="url" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作时间" prop="created_at" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>

import {logListApi,} from "@/http/admin";

export default {
    props: {},
    data() {
        return {
            loading:false,
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
        }
    },
    methods: {
        roleList() {
            this.loading = true
            logListApi({
                page: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                this.total = res.content.total
                this.tableData = res.content.data
                this.loading = false
            })
        },
        handleSizeChange(val) {
            this.currentPage = 1
            this.pageSize = val;
            this.roleList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(this.currentPage)
            this.roleList();
        },
    },
    mounted() {
        this.roleList()
    }
}
</script>
<style lang="scss" scoped>
</style>
