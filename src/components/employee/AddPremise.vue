<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 房屋</el-breadcrumb-item>
                <el-breadcrumb-item>增加房屋信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div>
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 房屋</el-breadcrumb-item>
                        <el-breadcrumb-item>增加房屋信息</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="container">
                    <div class="form-box">
                        <el-form  label-width="100px" :model="form" :rules="rules" ref="form">
                            <el-form-item label="房屋名称" prop="premises_name">
                                <el-input  v-model="form.premises_name" placeholder="请输入房屋名称"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋位置" prop="position">
                                <el-input  v-model="form.position" placeholder="请输入房屋位置"></el-input>
                            </el-form-item>
                            <el-form-item label="住宿价格" prop="premises_avgprice">
                                <el-input v-model="form.premises_avgprice" placeholder="请输入住宿价格"></el-input>
                                元/晚
                            </el-form-item>
                            <el-form-item label="车位数量" prop="parking_space">
                                <el-input v-model="form.parking_space" placeholder="请输入车位数量"></el-input>
                                个
                            </el-form-item>
                            <el-form-item label="住宿电话" prop="premises_tel">
                                <el-input v-model="form.premises_tel" placeholder="请输入住宿电话"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋类型" prop="premises_type">
                                <el-input v-model="form.premises_type" placeholder="请输入房屋类型"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋特色" prop="premises_feature">
                                <el-input v-model="form.premises_feature" placeholder="请输入房屋特色"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋户型" prop="house_type">
                                <el-input v-model="form.house_type" placeholder="请输入房屋户型"></el-input>
                            </el-form-item>
                            <el-form-item label="房屋备注" prop="descriptions">
                               <!-- <quill-editor ref="myTextEditor" v-model="form.descriptions" ></quill-editor>-->
                                <mavon-editor v-model="form.descriptions" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px" placeholder="请输入房屋备注"/>
                            </el-form-item>
                            <el-form-item label="租房一览图" prop="photo">
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
            var validateInt = (rule, value, callback) => {
                var reg =  /^[0-9]*[1-9][0-9]*$/;
                if (value===''|| !reg.test(value)) {
                    callback(new Error('请检查输入数据格式是否正确（正整数）'));

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
                if ( !/\d{4}/.test(value)||value===''|| value.length!==4) {
                    callback(new Error('请输入合法数据（4位数字）'));

                } else {
                    callback();
                }
            };
            var validateTel = (rule, value, callback) => {
                if (value===''|| !/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
                    callback(new Error('请输入合法手机号'));

                } else {
                    callback();
                }
            };
            return {
                position:[],
                defaultSrc: '',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                open_date:'',
                open_time:'',
                open: '',
                status:'',
                dialogVisible: false,
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
                rules: {
                    premises_name:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    position:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    open:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    all_area:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    build_area:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    road_area:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    green_area:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],

                    premises_avgprice:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    premises_price:[
                        { validator: validateDouble, trigger: 'blur' }
                    ],
                    floor_count:[
                        { validator: validateInt, trigger: 'blur' }
                    ],
                    parking_space:[
                        { validator: validateInt, trigger: 'blur' }
                    ],
                    premises_tel:[
                        { validator: validateTel, trigger: 'blur' }
                    ],
                    premises_type:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    premises_feature:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    house_type:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    sale_address:[
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    developer: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],

                    descriptions: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    photo: [
                        { validator: validateNULL, trigger: 'blur' }
                    ]
                },
                premise_id:'',
                user: '',
                todoList:[]
            }
        },
        methods: {
            onSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var d = new Date(this.open_date)
                        var year = d.getFullYear()
                        var month = ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))
                        var date = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
                        d = new Date(this.open_time)
                        var hour = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours())
                        var minute = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
                        var second = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
                        this.form.open_time = year + '-' + month + '-' + date+" "+hour + ':' + minute + ':' + second

                        var t = new Date(this.form.open_date)
                        year = t.getFullYear()
                        month = ((t.getMonth() + 1) < 10 ? '0' + (t.getMonth() + 1) : (t.getMonth() + 1))
                        date = (t.getDate() < 10 ? '0' + t.getDate() : t.getDate())
                        this.form.open_date = year + '-' + month + '-' + date
                        var params = {
                            form:this.form,
                            user:this.user,
                            cropImg:this.cropImg
                        }
                        this.$http.post('/neusoft/user/premises/addPremise', params).then(response => {
                            console.log(response)
                            var resBody = response.body
                            if (resBody.isSuccess === 0) {
                                this.$message.success('提交成功！');
                            } else {
                                this.$message.error('提交失败！');
                            }
                        })
                    } else {
                        this.$message.error('提交失败！');
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
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
                this.form.photo = this.cropImg
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
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
            }
        },
        mounted () {
            var user = sessionStorage.getItem('user')
            if (user) {
                user = JSON.parse(user)
                this.user = user.user
                this.premise_id=this.$route.params.id
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
