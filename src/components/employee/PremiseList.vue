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
                <el-table-column prop="premises_id" label="编号"  width="100">
                </el-table-column>
                <el-table-column prop="photo"  label="房屋图片" scope.row type="hidden" width="300">
                    <template  slot-scope="scope">
                        <img :src="'/static/image/images/'+ dealPhoto(scope.row.photo)"  width="300">
                    </template>
                </el-table-column>
                <el-table-column prop="premises_name" label="名称" sortable width="200">
                </el-table-column>
                <el-table-column prop="position" label="位置" sortable width="230">
                </el-table-column>
                <el-table-column prop="premises_avgprice" label="住宿价格" sortable :formatter="dealPrice" width="180">
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="dealStatus" width="150">
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button  v-if="(user.roleId!==3||user.roleId===1)&&user.roleId!==2" type="text" icon="el-icon-edit" @click="handleAdd(scope.$index, scope.row)">添加动态</el-button>
                        <el-button  v-if="(user.roleId!==3||user.roleId===1)&&user.roleId!==2" type="text" icon="el-icon-edit" @click="handleAddHouse(scope.$index, scope.row)">添加房屋</el-button>
                        <el-button v-if="user.roleId===3||scope.row.status!==2||user.roleId===1||user.roleId===2" type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="((user.roleId===1||user.roleId===3)&&scope.row.status!==2)&&user.roleId!==2" type="text" icon="el-icon-edit" @click="handleExamine(scope.$index, scope.row)">审核</el-button>
                        <el-button v-if="(scope.row.status!==2||user.roleId===3||user.roleId===1)&&user.roleId!==2" type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :total="total"  :current-page="cur_page" :page-size="pageSize" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="增加动态" :visible.sync="editVisible" width="30%">
            <el-form ref="formDynamic" :rules="ruleDynamic" :model="formDynamic"  label-width="60px">
                <el-input v-model="form.premises_id" type="hidden"></el-input>
                <el-form-item label="标题" prop="off_title">
                    <el-input v-model="formDynamic.off_title" placeholder="请输入房东的故事标题"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="off_content">
                    <el-input type="textarea" v-model="formDynamic.off_content" placeholder="请输入故事内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit(formDynamic)">确 定</el-button>
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
            var validateNULL = (rule, value, callback) => {
                if (value==='') {
                    callback(new Error('请输入数据'));

                } else {
                    callback();
                }
            };
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
                        premises_id: '',
                        premises_name: '',
                        position: '',
                        all_area: '',
                        build_area:'',
                        road_area:'',
                        green_area: '',
                        open_date: '',
                        premises_avgprice: '',
                        premises_price: '',
                        floor_count: '',
                        parking_space: '',
                        premises_tel: '',
                        premises_type: '',
                        house_type: '',
                        descriptions: '',
                        sale_address: '',
                        developer: '',
                        photo: '',
                        status: '',
                        open_time: '',
                        attention_number: ''
                },

                formDynamic: {
                    off_id: '',
                    premise_id: '',
                    off_title: '',
                    off_content: '',
                    off_state:'',
                    off_employeeid: '',
                    off_createdate: ''
                },
                ruleDynamic:{
                    off_title: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    off_content: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                },
                idx: -1,
                premises_id: '',
                user: {},
                premise_name: ''
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
                        if (d.premises_name === this.del_list[i].premises_name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if(d.status === 1){
                            status = "待审核"
                        }else if(d.status === 2){
                            status= "审核成功"
                        }else{
                            status= "审核失败"
                        }
                        if (status.indexOf(this.select_cate) > -1 &&
                            (d.premises_name.indexOf(this.select_word) > -1 ||
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
            deal(off_id){
                this.formDynamic.off_id = off_id
            },
            dealArea(row, column){
                return row.all_area+"晚"
            },
            dealPrice(row, column){
                return row.premises_avgprice+"元/晚"
            },
            dealPhoto(photo){
                var list = photo.split('|');
                return list[0]
            },
            handleAdd(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.formDynamic={
                    off_id: item.off_id,
                    premise_id: item.premise_id,
                    off_title: item.off_title,
                    off_content: item.off_content,
                    off_state:item.off_state,
                    off_employeeid:item.off_employeeid,
                    off_createdate: item.off_createdate
                }
                this.formDynamic.premise_id = row.premises_id
                this.editVisible = true;
            },
            handleExamine(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    premises_id: item.premises_id,
                    premises_name: item.premises_name,
                    position: item.position,
                    all_area: item.all_area,
                    build_area:item.build_area,
                    road_area:item.road_area,
                    green_area: item.roleName,
                    open_date: item.open_date,
                    premises_avgprice: item.premises_avgprice,
                    premises_price: item.premises_price,
                    floor_count: item.floor_count,
                    parking_space: item.parking_space,
                    premises_tel: item.premises_tel,
                    premises_type: item.premises_type,
                    house_type: item.house_type,
                    descriptions: item.descriptions,
                    sale_address: item.sale_address,
                    developer: item.developer,
                    photo: item.photo,
                    status: item.status,
                    open_time: item.open_time,
                    attention_number:item.attention_number
                }
                var params={
                    form:this.form,
                    user:this.user
                }
                this.$http.post('/neusoft/user/premises/updateState.htm', params).then(response => {
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
            handleAddHouse(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    premises_id: item.premises_id,
                    premises_name: item.premises_name,
                    position: item.position,
                    all_area: item.all_area,
                    build_area:item.build_area,
                    road_area:item.road_area,
                    green_area: item.roleName,
                    open_date: item.open_date,
                    premises_avgprice: item.premises_avgprice,
                    premises_price: item.premises_price,
                    floor_count: item.floor_count,
                    parking_space: item.parking_space,
                    premises_tel: item.premises_tel,
                    premises_type: item.premises_type,
                    house_type: item.house_type,
                    descriptions: item.descriptions,
                    sale_address: item.sale_address,
                    developer: item.developer,
                    photo: item.photo,
                    status: item.status,
                    open_time: item.open_time,
                    attention_number:item.attention_number
                }
                this.$router.push({name:'AddHouse',params:{id:this.form.premises_id}})
            },
            dealStatus(row, column){
                console.log(row.status)
                if(row.status === 1){
                    return "待审核"
                }else if(row.status ===2 ){
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
                    select_cate:this.select_cate
                }
                this.$http.post('/neusoft/user/premises/getPremises.htm', params).then(response => {
                    var resBody = response.body
                    console.log(resBody)
                    if (resBody.isSuccess === 0) {
                        this.total =resBody.result.totalElements
                        this.list = []
                        this.list = resBody.result.content
                        this.tableData = []
                        this.tableData = this.list
                    } else {
                        this.$message.error('查询失败');
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
                    premises_id: item.premises_id,
                    premises_name: item.premises_name,
                    position: item.position,
                    all_area: item.all_area,
                    build_area:item.build_area,
                    road_area:item.road_area,
                    green_area: item.roleName,
                    open_date: item.open_date,
                    premises_avgprice: item.premises_avgprice,
                    premises_price: item.premises_price,
                    floor_count: item.floor_count,
                    parking_space: item.parking_space,
                    premises_tel: item.premises_tel,
                    premises_type: item.premises_type,
                    house_type: item.house_type,
                    descriptions: item.descriptions,
                    sale_address: item.sale_address,
                    developer: item.developer,
                    photo: item.photo,
                    status: item.status,
                    open_time: item.open_time,
                    attention_number:item.attention_number
                }

                this.$router.push({name:'PremiseListDetail',params:{id:this.form.premises_id}})
            },
            handleDelete(index, row) {
                this.premise_id = row.premises_id
                this.premise_name = row.premises_name
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
                this.$refs.formDynamic.validate((valid) => {
                    if (valid) {
                        var params = {
                            formDynamic : form,
                            user: this.user
                        }
                        this.$http.post('/neusoft/user/dynamic/addDynamic', params).then(response => {
                            var resBody = response.body
                            if (resBody.isSuccess === 0) {
                                this.$message.success(`增加房东的故事信息成功`);
                                this.editVisible = false;
                            } else {
                                this.$message.success(`增加房东的故事信息失败`);
                                this.editVisible = false;
                            }
                        })
                    } else {
                        this.$message.error('提交失败！');
                        return false;
                    }
                });

            },
            // 确定删除
            deleteRow(){
                var params = {
                    user: this.user,
                    premise_id : this.premise_id,
                    premise_name : this.premise_name
                }
                this.$http.post('/neusoft/user/premises/deletePremise', params).then(response => {
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
