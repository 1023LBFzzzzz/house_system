<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 前台用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="cus_id" label="客户编号" width="83" align="center">
                </el-table-column>
                <el-table-column prop="cus_photo"  label="客户头像" scope.row type="hidden" width="160" align="center">
                    <template  slot-scope="scope">
                        <img :src="scope.row.cus_photo"  width="120">
                    </template>
                </el-table-column>
                <el-table-column prop="cus_name" label="客户昵称" width="110" align="center">
                </el-table-column>
                <el-table-column prop="telphone" label="客户电话" width="110" align="center">
                </el-table-column>
                <el-table-column prop="address" label="地址"width="110" align="center">
                </el-table-column>
                <el-table-column prop="cus_class" label="等级" width="80" align="center">
                </el-table-column>
                <el-table-column prop="cus_point" label="积分" sortable sortable width="110" align="center">
                </el-table-column>
                <el-table-column prop="register_date" label="注册时间" width="100" align="center">
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status!==2" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :total="total"  :current-page="cur_page" :page-size="pageSize" >
                </el-pagination>
            </div>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                list: [],
                total:0,
                pageSize: 8,
                multipleSelection: [],
                select_cate: '',
                roleList:[],
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    cus_id: '',
                    cus_name: '',
                    cus_pwd: '',
                    telphone: '',
                    cus_photo:'',
                    address:'',
                    cus_class: '',
                    cus_point: '',
                    register_date: ''
                },
                idx: -1,
                cus_id: '',
                user: {},
                cus_name: ''
            }
        },
        mounted () {
            var user = sessionStorage.getItem('user')
            if (user) {
                user = JSON.parse(user)
                this.user = user.user
                this.getData();
            } else {
                this.$router.push({path: '/login'})
            }
        },
        computed: {
            data() {

                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.cus_name === this.del_list[i].cus_name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (status.indexOf(this.select_cate) > -1 &&
                            (d.cus_name.indexOf(this.select_word) > -1 ||
                                status.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val){
                this.cur_page = val;
                this.tableData = []
                this.getData();
            },
            getValue : function(value){
                this.select_cate=value
                this.tableData = []
                this.getData();
            },
            search() {
                this.is_search = true;
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                var params = {
                    pageIndex:this.cur_page,
                    pageSize:this.pageSize,
                }
                this.$http.post('/neusoft/user/before/getBefore.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.total =resBody.result.totalElements
                        this.list = []
                        this.list = resBody.result.content
                        this.tableData = []
                        this.tableData = this.list
                    } else {
                        console.log("查询成功")
                    }
                })
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleDelete(index, row) {
                this.cus_id = row.cus_id
                this.cus_name = row.cus_name
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                var params = {
                    user: this.user,
                    cus_id : this.cus_id,
                    cus_name : this.cus_name
                }
                this.$http.post('/neusoft/user/before/deleteBefore', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.tableData.splice(this.idx, 1);
                        this.$message.success('删除成功');
                        this.delVisible = false;
                    } else {
                        this.$message.success('删除失败');
                        this.delVisible = false;
                    }
                })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .el-input__inner{
        height: 60px;
        line-height: 60px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
