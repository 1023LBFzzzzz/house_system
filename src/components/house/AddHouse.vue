<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 房屋</el-breadcrumb-item>
                <el-breadcrumb-item>增加房屋</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div>
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 房屋</el-breadcrumb-item>
                        <el-breadcrumb-item>增加房屋</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="container">
                    <div class="form-box">
                        <el-form  label-width="100px"  :model="form" :rules="rules" ref="form">
                            <el-form-item label="单元名称"  prop="unit_name">
                                <el-input  v-model="form.unit_name" placeholder="请输入单元名称"></el-input>
                            </el-form-item>
                            <el-form-item label="门牌号" prop="house_number">
                                <el-input  v-model="form.house_number" placeholder="请输入门牌号（4位数字）"></el-input>
                            </el-form-item>
                            <el-form-item label="户型"  prop="house_type">
                                <el-input v-model="form.house_type" style="width:40%;" placeholder="请输入户型"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋用途" prop="house_purpose">
                                <el-input v-model="form.house_purpose" placeholder="请输入户型"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋初价" prop="house_initalprice">
                                <el-input v-model="form.house_initalprice" placeholder="请输入数值型数据"></el-input>
                                元/晚
                            </el-form-item>
                            <el-form-item label="房屋面积" prop="house_area">
                                <el-input v-model="form.house_area" placeholder="请输入房屋面积"></el-input>
                                m²
                            </el-form-item>
                            <el-form-item label="阳台面积" prop="balcony_area">
                                <el-input v-model="form.balcony_area"  placeholder="请输入阳台面积"></el-input>
                                m²
                            </el-form-item>
                            <el-form-item label="所属楼层" prop="house_floor">
                                <el-input v-model="form.house_floor" placeholder="请输入楼层"></el-input>层
                            </el-form-item>
                            <el-form-item label="房高" prop="house_height">
                                <el-input v-model="form.house_height" placeholder="请输入房高"></el-input>
                                m
                            </el-form-item>
                            <el-form-item label="装修状况" prop="decoration_condition">
                                <el-input v-model="form.decoration_condition" placeholder="请输入装修状况"></el-input>
                            </el-form-item>
                            <el-form-item label="上架日期" prop="finish_date">
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.finish_date"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="房屋朝向" prop="house_toward">
                                <el-input v-model="form.house_toward" placeholder="请输入房屋朝向"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋特色" prop="building_structure">
                                <el-input v-model="form.building_structure" placeholder="请输入房屋特色"></el-input>
                            </el-form-item>
                            <el-form-item label="公用分摊建筑面积" prop="public_area">
                                <el-input v-model="form.public_area" placeholder="请输入公用分摊建筑面积"></el-input>m²
                            </el-form-item>
                            <el-form-item label="备注" prop="house_remark">
                                <el-input v-model="form.house_remark" placeholder="请输入备注"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋图片" prop="cropImg">
                                <div class="crop-demo" >
                                    <img :src="cropImg" class="pre-img">
                                    <div class="crop-demo-btn">选择图片
                                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                                    </div>
                                </div>

                                <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                                    <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="cancelCrop">取 消</el-button>
                                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                                     </span>
                                </el-dialog>
                            </el-form-item>
                            <el-form-item label="户型图" prop="cropImg1">
                                <div class="crop-demo" >
                                    <img :src="cropImg1" class="pre-img">
                                    <div class="crop-demo-btn">选择图片
                                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage1"/>
                                    </div>
                                </div>

                                <el-dialog title="裁剪图片" :visible.sync="dialogVisible1" width="30%">
                                    <vue-cropper ref='cropper1' :src="imgSrc1" :ready="cropImage1" :zoom="cropImage1" :cropmove="cropImage1" style="width:100%;height:300px;"></vue-cropper>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="cancelCrop1">取 消</el-button>
                                        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
                                     </span>
                                </el-dialog>
                            </el-form-item >
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">表单提交</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <el-card shadow="hover" style="height:403px;">
                <div slot="header" class="clearfix">
                    <span>日志信息</span>
                </div>
                <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                    <el-table-column width="40">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.status"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="60">
                        <template slot-scope="scope">
                            <i class="el-icon-edit"></i>
                            <i class="el-icon-delete"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor';
    import VueCropper  from 'vue-cropperjs';
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: 'baseform',
        components: {
            VueCropper,mavonEditor
        },
        data: function(){
            var validateDouble = (rule, value, callback) => {
                var reg =  /^\d+(?=\.{0,1}\d+$|$)/;
                if (value===''|| !reg.test(value)) {
                    callback(new Error('请检查输入数据格式是否正确（数值类型）'));

                } else {
                    callback();
                }
            };
            var validateNULL = (rule, value, callback) => {
                if (value==='') {
                    callback(new Error('请输入数据'));

                } else {
                    callback();
                }
            };
            var validateNumber = (rule, value, callback) => {
                if ( !/\d{4}/.test(value)||value==='') {
                    callback(new Error('请输入合法数据（4位数字）'));

                } else {
                    callback();
                }
            };
            var validateFloor = (rule, value, callback) => {
                if (value===''|| !/^[1-9]\d*$/.test(value)||value>=15) {
                    callback(new Error('请输入合法数据（小于15的正整数）'));

                } else {
                    callback();
                }
            };
            return {
                position:[],
                defaultSrc: '',
                defaultSrc1: '',
                dialogVisible1:false,
                fileList: [],
                imgSrc: '',
                cropImg: '',
                imgSrc1: '',
                cropImg1: '',
                open_date:'',
                open_time:'',
                status:'',
                dialogVisible: false,
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
                rules: {
                    unit_name:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    house_number:[
                        { validator: validateNumber, trigger: 'blur' }
                    ],
                    house_toward:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    house_type:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    house_area:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    balcony_area:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    house_purpose:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    house_floor:[
                        { validator: validateFloor, trigger: 'blur' }
                    ],
                    house_height:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    decoration_condition:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    finish_date:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    building_structure:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    public_area:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    house_remark:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    cropImg:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    cropImg1:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    house_initalprice: [
                        { validator: validateDouble, trigger: 'blur' }
                    ]
                },
                premise_id:'',
                user: '',
                todoList: [{
                    title: '今天要修复100个bug',
                    status: false,
                },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: false,
                    }, {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要修复100个bug',
                        status: false,
                    },
                    {
                        title: '今天要写100行代码加几个bug吧',
                        status: false,
                    }
                ],
            }
        },
        methods: {
            onSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var d = new Date(this.form.finish_date)
                        var year = d.getFullYear()
                        var month = ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))
                        var date = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
                        this.form.finish_date = year + '-' + month + '-' + date
                        var params = {
                            form:this.form,
                            user:this.user,
                            cropImg:this.cropImg,
                            cropImg1:this.cropImg1,
                            premise_id:this.premise_id
                        }
                        this.$http.post('/neusoft/user/house/addHouse', params).then(response => {
                            var resBody = response.body
                            if (resBody.isSuccess === 0) {
                              alert("增加房屋信息成功！")
                            } else {
                                console.log("失败")
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            setImage1(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible1 = true;
                    this.imgSrc1 = event.target.result;
                    this.$refs.cropper1 && this.$refs.cropper1.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cropImage1 () {
                this.cropImg1 = this.$refs.cropper1.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            cancelCrop1(){
                this.dialogVisible1 = false;
                this.cropImg1 = this.defaultSrc1;
            },
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            },
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
                console.log(formdata)
                // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
                this.$axios({
                    url: '/common/upload',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    this.$refs.md.$img2Url(pos, url);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.html = render;
            },


        },
        mounted () {
            var user = sessionStorage.getItem('user')
            if (user) {
                user = JSON.parse(user)
                this.user = user.user
                this.premise_id=this.$route.params.id
                console.log(this.$route.params.id)
            } else {
                this.$router.push({path: '/login'})
            }

        },
        created(){

        }

    }
</script>
<style scoped>
    .el-input {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 60%;
    }

    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>
