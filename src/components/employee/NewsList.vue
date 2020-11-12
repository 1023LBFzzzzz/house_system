<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 房东的故事</el-breadcrumb-item>
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
                <el-table-column prop="news_id" label="编号" width="100">
                </el-table-column>
                <el-table-column prop="photo"  label="故事图片" scope.row type="hidden" width="200">
                    <template  slot-scope="scope">
                        <img :src="scope.row.news_picpath"  width="180">
                    </template>
                </el-table-column>
                <el-table-column prop="news_title" label="房东故事标题" width="220">
                </el-table-column>
                <el-table-column prop="news_position" label="故事地点" width="100">
                </el-table-column>
                <el-table-column prop="news_type" label="故事类型"width="100">
                </el-table-column>
                <el-table-column prop="news_source" label="故事来源" width="100">
                </el-table-column>
                <el-table-column prop="news_createdate" label="发生时间" sortable sortable width="110">
                </el-table-column>
                <el-table-column prop="news_state" label="故事状态" :formatter="dealStatus" width="120">
                </el-table-column>
                <el-table-column prop="news_summary" label="房东故事概要" :formatter="dealSummary" sortable width="180">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="user.roleId===4||scope.row.news_state!==2||user.roleId===1||user.roleId===2" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="((user.roleId===1||user.roleId===4)&&scope.row.news_state!==2)&&user.roleId!==2" type="text" icon="el-icon-edit" @click="handleExamine(scope.$index, scope.row)">审核</el-button>
                        <el-button v-if="(scope.row.news_state!==2||user.roleId===4||user.roleId===1)&&user.roleId!==2" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                    news_id: '',
                    news_title: '',
                    news_position: '',
                    news_type: '',
                    news_source:'',
                    news_content:'',
                    news_promulgator: '',
                    news_createdate: '',
                    news_picpath: '',
                    news_summary: '',
                    news_state: '',
                },
                idx: -1,
                news_id: '',
                user: {},
                news_title: ''
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
                    let status = '';
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.news_title === this.del_list[i].news_title) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if(d.news_state === 1){
                            status = "待审核"
                        }else if(d.news_state === 2){
                            status= "审核成功"
                        }else{
                            status= "审核失败"
                        }
                        if (status.indexOf(this.select_cate) > -1 &&
                            (d.news_title.indexOf(this.select_word) > -1 ||
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
            handleExamine(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    news_id: item.news_id,
                    news_title: item.news_title,
                    news_position: item.news_position,
                    news_type: item.news_type,
                    news_source:item.news_source,
                    news_content:item.news_content,
                    news_promulgator: item.news_promulgator,
                    news_createdate: item.news_createdate,
                    news_picpath: item.news_picpath,
                    news_summary: item.news_summary,
                    news_state: item.news_state,
                }
                var params={
                    form:this.form,
                    user:this.user
                }
                this.$http.post('/neusoft/user/updateState.htm', params).then(response => {
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
                if(row.news_state === 1){
                    return "待审核"
                }else if(row.news_state ===2 ){
                    return "审核成功"
                }else{
                    return "审核失败"
                }
            },
            dealSummary(row, column){
                return row.news_summary.substring(0,10)+'...'

            },
            search() {
                this.is_search = true;
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                var params = {
                    pageIndex:this.cur_page,
                    pageSize:this.pageSize,
                    select_cate:this.select_cate
                }
                this.$http.post('/neusoft/user/getNews.htm', params).then(response => {
                    var resBody = response.body
                    console.log(resBody)
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
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    news_id: item.news_id,
                    news_title: item.news_title,
                    news_position: item.news_position,
                    news_type: item.news_type,
                    news_source:item.news_source,
                    news_content:item.news_content,
                    news_promulgator: item.news_promulgator,
                    news_createdate: item.news_createdate,
                    news_picpath: item.news_picpath,
                    news_summary: item.news_summary,
                    news_state: item.news_state,
                }

                this.$router.push({name:'NewsDetail',params:{id:this.form.news_id}})
            },
            handleDelete(index, row) {
                this.news_id = row.news_id
                this.news_title = row.news_title
                this.idx = index;
                this.delVisible = true;
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
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
                /*     var params = {
                         form : form
                     }
                     this.$http.post('/neusoft/user/user/updateEmployee.htm', params).then(response => {
                         var resBody = response.body
                         if (resBody.isSuccess === 0) {

                         } else {

                         }
                     })*/
            },
            // 确定删除
            deleteRow(){
                var params = {
                    user: this.user,
                    news_id : this.news_id,
                    news_title : this.news_title
                }
                this.$http.post('/neusoft/user/deleteNews', params).then(response => {
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
