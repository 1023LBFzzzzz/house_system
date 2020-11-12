<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 房东的故事</el-breadcrumb-item>
                <el-breadcrumb-item>增加故事</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 房东的故事</el-breadcrumb-item>
                        <el-breadcrumb-item>增加故事</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="container">
                    <div class="form-box">
                        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                            <el-form-item label="故事标题" prop="news_title">
                                <el-input  v-model="form.news_title" placeholder="请输入故事标题"></el-input>
                            </el-form-item>
                            <el-form-item label="故事地点" prop="news_position">
                                <el-input  v-model="form.news_position" placeholder="请输入故事标题"></el-input>
                            </el-form-item>
                            <el-form-item label="故事类型" prop="news_type">
                                <el-select class="handle-select mr10" v-model="form.news_type" placeholder="请输入故事类型">
                                    <el-option key="1" label="导购文章" value="导购文章"></el-option>
                                    <el-option key="2" label="新闻资讯" value="新闻资讯"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="故事来源" prop="news_source">
                                <el-input  v-model="form.news_source" placeholder="请输入故事来源"></el-input>
                            </el-form-item>
                            <el-form-item label="故事内容" prop="news_content">
                               <!-- <quill-editor ref="myTextEditor" v-model="form.news_content" ></quill-editor>-->
                                <mavon-editor v-model="form.news_content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px" placeholder="请输入故事内容"/>
                            </el-form-item>
                            <el-form-item label="故事概要" prop="news_summary">
                                <el-input type="textarea" rows="5" v-model="form.news_summary" placeholder="请输入故事标题"></el-input>
                            </el-form-item>
                            <el-form-item label="故事图片" prop="news_picpath">
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
            var validateNULL = (rule, value, callback) => {
                if (value==='') {
                    callback(new Error('请输入数据'));

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
                dialogVisible: false,
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
                    news_state: ''
                },
                user: '',
                todoList:[],
                content:'',
                html:'',
                configs: {
                },
                rules: {
                    news_title: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    news_position: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    news_type: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    news_source: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    news_content: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    news_summary: [
                        { validator: validateNULL, trigger: 'blur' }
                    ],
                    cropImg: [
                        { validator: validateNULL, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            onSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var params = {
                            form:this.form,
                            user:this.user,
                            cropImg:this.cropImg
                        }
                        this.$http.post('/neusoft/user/addNews', params).then(response => {
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
                this.form.news_picpath=this.cropImg
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
            },

        },
        mounted () {
            var user = sessionStorage.getItem('user')
            if (user) {
                user = JSON.parse(user)
                this.user = user.user

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
