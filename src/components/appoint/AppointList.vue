<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 预约表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select class="handle-select mr10" v-model="select_cate" placeholder="筛选状态" @change="getValue">
                    <el-option key="0" label="待处理" value="0"></el-option>
                    <el-option key="1" label="预订成功" value="1"></el-option>
                    <el-option key="2" label="预订失败" value="2"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="orderId" label="预订编号"  align="center" width="55">
                </el-table-column>
                <el-table-column prop="photo" label="预订房间" align="center" width="220">
                    <template slot-scope="scope">
                        <img :src="'/static/image/images/'+dealPicture(scope.row.photo)" alt="" style="width: 130px;">
                 </template>
                </el-table-column>
                <el-table-column prop="cus_name" label="预订姓名" align="center" width="110">
                </el-table-column>
                <el-table-column prop="telphone" label="手机号" align="center" width="120">
                </el-table-column>
                <el-table-column prop="premises_name" label="预订房间名称" align="center" >
                </el-table-column>
                <el-table-column prop="startTime" label="预订开始时间" align="center">
                </el-table-column>
                <el-table-column prop="endTime" label="预订结束时间"  width="120" align="center" >
                </el-table-column>
                <el-table-column prop="state" label="预定状态" width="120" align="center" :formatter="dealStatus">
                </el-table-column>
                <el-table-column label="操作" width="110" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state == 0" type="text" icon="el-icon-edit" @click="handleSuccess(scope.$index, scope.row)">同意预订</el-button>
                        <el-button v-if="scope.row.state == 0" type="text" icon="el-icon-delete" class="red" @click="handleRefuse(scope.$index, scope.row)">拒绝预订</el-button>
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
            <div class="del-dialog-cnt">是否同意该操作？</div>
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
                editVisible1:false,
                pageSize: 8,
                multipleSelection: [],
                select_cate: '',
                roleList:[],
                select_word: '',
                del_list: [],
                user: '',
                status:'',
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                },
                idx: -1,
                employee:'',
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
                        if (d.premises_name === this.del_list[i].premises_name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if(d.state === 0){
                            status = "待处理"
                        }else if(d.state === 1){
                            status= "预订成功"
                        }else{
                            status= "预订失败"
                        }
                        // if (status.indexOf(this.select_cate) > -1 &&d.app_name.indexOf(this.select_word) > -1 ||  status.indexOf(this.select_word) > -1) {
                        //     return d;
                        // }
                    }
                })
            }
        },
        methods: {
            dealPicture(str){
                if(str !=null){
                var s = str.split('|')
                return s[0]
                }
            },
            // 分页导航
            handleCurrentChange(val){
                this.cur_page = val;
                this.tableData = []
                this.getData();
            },
            dealStatus(row, column){
                if(row.state === 0){
                    return "待处理"
                }else if(row.state ===1 ){
                    return "预订成功"
                }else{
                    return "预订失败"
                }
            },
            getValue : function(value){
                this.select_cate=value
                this.tableData = []
                this.getData();
            },
            search() {
                this.is_search = true;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                var params = {
                    pageIndex:this.cur_page,
                    pageSize:this.pageSize,
                    state: this.select_cate,
                    premises_name: this.select_word
                }
                this.$http.post('/neusoft/user/order/getOrder.htm', params).then(response => {
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


            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                var params={}
                this.$http.post('/neusoft/user/user/getSaleStaff.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        console.log(resBody)
                        this.employee = resBody.result.employee
                    } else {
                        console.log("查询成功")
                    }
                })
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    app_id: item.app_id,
                    app_name: item.app_name,
                    app_phone: item.app_phone,
                    phone: item.phone,
                    app_time:item.app_time,
                    watch_time:item.watch_time,
                    app_premisesid: item.app_premisesid,
                    app_auditorid: item.app_auditorid,
                    audit_state: item.audit_state,
                    app_state:item.app_state,
                    app_workerid:item.app_workerid,
                    service_grade: item.service_grade,
                    service_evaluate: item.service_evaluate
                }
                this.editVisible = true;
            },
            handleEdit1(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    app_id: item.app_id,
                    app_name: item.app_name,
                    app_phone: item.app_phone,
                    phone: item.phone,
                    app_time:item.app_time,
                    watch_time:item.watch_time,
                    app_premisesid: item.app_premisesid,
                    app_auditorid: item.app_auditorid,
                    audit_state: item.audit_state,
                    app_state:item.app_state,
                    app_workerid:item.app_workerid,
                    service_grade: item.service_grade,
                    service_evaluate: item.service_evaluate
                }
                this.editVisible1 = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSuccess(index, row){
                var params = {
                    state : 1,
                    orderId: row.orderId
                }
                this.$http.post('/neusoft/user/order/updateState.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.$message.success("操作成功")
                     //   this.$set(this.tableData, this.idx, this.form);
                        this.getData();
                    } else {
                        this.$message.success("操作成功")
                    }
                })
            },
             handleRefuse(index, row){
                var params = {
                    state : 2,
                    orderId: row.orderId
                }
                this.$http.post('/neusoft/user/order/updateState.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.$message.success("操作成功")
                     //   this.$set(this.tableData, this.idx, this.form);
                        this.getData();
                    } else {
                        this.$message.success("操作成功")
                    }
                })
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].roleName + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(form) {
                var params = {
                    form : form,
                    user: this.user
                }
                this.$http.post('/neusoft/user/appoint/updateAppoint.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.$set(this.tableData, this.idx, this.form);
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx+1} 行成功`);
                        this.getData();
                    } else {
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx+1} 行失败`);
                    }
                })
            },

            deleteRow(){

                this.$message.success('同意成功');
                this.delVisible = false;
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
