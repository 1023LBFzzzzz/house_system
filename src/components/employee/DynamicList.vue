<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 楼盘动态</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select class="handle-select mr10" v-model="select_cate" placeholder="筛选状态" @change="getValue">
                    <el-option key="1" label="待审核" value="待审核"></el-option>
                    <el-option key="2" label="审核成功" value="审核成功"></el-option>
                    <el-option key="3" label="审核失败" value="审核失败"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="off_id" label="公告编号" sortable width="110">
                </el-table-column>
                <el-table-column prop="off_title" label="公告标题" width="120">
                </el-table-column>
                <el-table-column prop="off_content" label="公告内容">
                </el-table-column>
                <el-table-column prop="off_state" label="公告状态" :formatter="dealStatus">
                </el-table-column>
                <el-table-column prop="off_employeeid" label="发布人" width="120">
                </el-table-column>
                <el-table-column prop="off_createdate" label="发布时间" width="120" :formatter="dealTime">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="user.roleId===3||scope.row.off_state!==2||user.roleId===1||user.roleId===2" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="((user.roleId===1||user.roleId===3)&&scope.row.off_state!==2)&&user.roleId!==2" type="text" icon="el-icon-edit" @click="handleExamine(scope.$index, scope.row)">审核</el-button>
                        <el-button v-if="(scope.row.off_state!==2||user.roleId===3||user.roleId===1)&&user.roleId!==2" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :total="total"  :current-page="cur_page" :page-size="pageSize" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="60px">
                <el-input v-model="form.off_id" type="hidden"></el-input>
                <el-form-item label="标题">
                    <el-input v-model="form.off_title"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" v-model="form.off_content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit(form)">确 定</el-button>
            </span>
        </el-dialog>

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
                user: '',
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    off_id: '',
                    premise_id: '',
                    off_title: '',
                    off_content: '',
                    off_state:'',
                    off_employeeid: '',
                    off_createdate: ''
                },
                idx: -1
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
                        if (d.off_title === this.del_list[i].off_title) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.off_title.indexOf(this.select_word) > -1) {
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
            handleExamine(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    off_id: item.off_id,
                    premise_id: item.premise_id,
                    off_title: item.off_title,
                    off_content: item.off_content,
                    off_state:item.off_state,
                    off_employeeid:item.off_employeeid,
                    off_createdate: item.off_createdate
                }
                var params={
                    form:this.form,
                    user:this.user
                }
                this.$http.post('/neusoft/user/dynamic/updateState.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.$message.success('审核成功');
                        this.getData();
                    } else {
                        this.$message.error('审核失败');
                        this.getData();
                    }
                })
            },
            dealStatus(row, column){
                if(row.off_state === 1){
                    return "待审核"
                }else if(row.off_state ===2 ){
                    return "审核成功"
                }else{
                    return "审核失败"
                }
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                var params = {
                    pageIndex:this.cur_page,
                    pageSize:this.pageSize,
                    select_cate:this.select_cate
                }
                this.$http.post('/neusoft/user/dynamic/getDynamic.htm', params).then(response => {
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
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    off_id: item.off_id,
                    premise_id: item.premise_id,
                    off_title: item.off_title,
                    off_content: item.off_content,
                    off_state:item.off_state,
                    off_employeeid:item.off_employeeid,
                    off_createdate: item.off_createdate
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.off_id = row.off_id
                this.off_title = row.off_title
                this.idx = index;
                this.delVisible = true;
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
                this.$http.post('/neusoft/user/dynamic/updateDynamic.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.$set(this.tableData, this.idx, this.form);
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx+1} 行成功`);
                    } else {
                        this.editVisible = false;
                        this.$message.success(`修改第 ${this.idx+1} 行失败`);
                    }
                })
            },
            dealTime(row, column){
                var d = new Date(row.off_createdate)
                var year = d.getFullYear()
                var month = ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))
                var date = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
                var hour = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours())
                var minute = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
                var second = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
                return  year + '-' + month + '-' + date+'-----'+hour + ':' + minute + ':' + second
            },
            // 确定删除
            deleteRow(){
                var params = {
                    user: this.user,
                    off_id : this.off_id,
                    off_title : this.off_title
                }
                this.$http.post('/neusoft/user/dynamic/deleteDynamic', params).then(response => {
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
