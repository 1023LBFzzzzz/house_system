<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 房屋信息</el-breadcrumb-item>
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
                <el-table-column prop="house_id" label="信息编号"  width="100">
                </el-table-column>
                <el-table-column prop="house_pic"  label="房屋图片" scope.row type="hidden" width="180">
                    <template  slot-scope="scope">
                        <img :src="scope.row.house_pic"  width="160">
                    </template>
                </el-table-column>
                <el-table-column prop="rendings_pic"  label="户型图" scope.row type="hidden" width="170">
                    <template  slot-scope="scope">
                        <img :src="scope.row.rendings_pic"  width="150">
                    </template>
                </el-table-column>
                <el-table-column prop="unit_name" label="单元名称"  width="110">
                </el-table-column>
                <el-table-column prop="house_state" label="状态" :formatter="dealStatus" width="110">
                </el-table-column>
                <el-table-column prop="house_purpose" label="房屋用途" width="110">
                </el-table-column>
                <el-table-column prop="finish_date" label="建成日期" sortable width="120">
                </el-table-column>

                <el-table-column prop="decoration_condition" label="装修状况">
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="user.roleId===3||scope.row.house_state!==2||user.roleId===1||user.roleId===2" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="((user.roleId===1||user.roleId===3)&&scope.row.house_state!==2)&&user.roleId!==2" type="text" icon="el-icon-edit" @click="handleExamine(scope.$index, scope.row)">审核</el-button>
                        <el-button v-if="(scope.row.house_state!==2||user.roleId===3||user.roleId===1)&&user.roleId!==2" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                    house_id: '',
                    premise_id: '',
                    unit_name: '',
                    house_number: '',
                    house_type:'',
                    house_state:'',
                    house_purpose: '',
                    house_initalprice: '',
                    house_area: '',
                    balcony_area: '',
                    house_floor: '',
                    house_height: '',
                    decoration_condition: '',
                    finish_date: '',
                    rendings_pic: '',
                    house_pic: '',
                    house_toward: '',
                    building_structure: '',
                    public_area: '',
                    house_remark: '',
                    input_employid: '',
                    input_date: ''
                },
                idx: -1,
                house_id: '',
                user: {},
                premise_id: '',
                house_number: ''
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
                        if (d.unit_name === this.del_list[i].unit_name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if(d.house_state === 1){
                            status = "待审核"
                        }else if(d.house_state === 2){
                            status= "审核成功"
                        }else{
                            status= "审核失败"
                        }
                        if (status.indexOf(this.select_cate) > -1 &&
                            (d.unit_name.indexOf(this.select_word) > -1 ||
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
            dealStatus(row, column){
                if(row.house_state === 1){
                    return "待审核"
                }else if(row.house_state ===2 ){
                    return "审核成功"
                }else{
                    return "审核失败"
                }
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
                this.$http.post('/neusoft/user/house/getHouse.htm', params).then(response => {
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
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    house_id: item.house_id,
                    premise_id: item.premise_id,
                    unit_name: item.unit_name,
                    house_number: item.house_number,
                    house_type:item.house_type,
                    house_state:item.house_state,
                    house_purpose: item.house_purpose,
                    house_initalprice: item.house_initalprice,
                    house_area: item.house_area,
                    balcony_area: item.balcony_area,
                    house_floor: item.house_floor  ,
                    house_height: item.house_height,
                    decoration_condition: item.decoration_condition,
                    finish_date: item.finish_date,
                    rendings_pic: item.rendings_pic,
                    house_pic: item.house_pic,
                    house_toward: item.house_toward,
                    building_structure: item.building_structure,
                    public_area: item.public_area,
                    house_remark: item.house_remark,
                    input_employid: item.input_employid,
                    input_date:item.input_date
                }

                this.$router.push({name:'HouseDetail',params:{id:this.form.house_id}})
            },
            handleDelete(index, row) {
                this.house_id = row.house_id
                this.house_number = row.house_number
                this.premise_id = row.premise_id
                this.idx = index;
                this.delVisible = true;
            },
            handleExamine(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    house_id: item.house_id,
                    premise_id: item.premise_id,
                    unit_name: item.unit_name,
                    house_number: item.house_number,
                    house_type:item.house_type,
                    house_state:item.house_state,
                    house_purpose: item.house_purpose,
                    house_initalprice: item.house_initalprice,
                    house_area: item.house_area,
                    balcony_area: item.balcony_area,
                    house_floor: item.house_floor  ,
                    house_height: item.house_height,
                    decoration_condition: item.decoration_condition,
                    finish_date: item.finish_date,
                    rendings_pic: item.rendings_pic,
                    house_pic: item.house_pic,
                    house_toward: item.house_toward,
                    building_structure: item.building_structure,
                    public_area: item.public_area,
                    house_remark: item.house_remark,
                    input_employid: item.input_employid,
                    input_date:item.input_date
                }
                var params={
                    form:this.form,
                    user:this.user
                }
                this.$http.post('/neusoft/user/house/updateState.htm', params).then(response => {
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                var params = {
                    user: this.user,
                    house_id : this.house_id,
                    house_number : this.house_number,
                    premise_id : this.premise_id
                }
                this.$http.post('/neusoft/user/house/deleteHouse', params).then(response => {
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
