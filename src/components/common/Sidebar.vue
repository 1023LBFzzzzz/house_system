<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                subs:[],
                user:'',
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-people',
                        index: 'dashboard',
                        title: '租客管理',
                        subs: [
                            {
                                index: 'BeforeList',
                                title: '租客信息'
                            }
                        ],
                    },
                    {
                        icon: 'el-icon-lx-present',
                        index: '2',
                        title: '租房管理',
                        subs: [
                            {
                                index: 'PremiseList',
                                title: '房屋信息'
                            },
                            {
                                index: 'AddPremise',
                                title: '增加信息'
                            }
                            ],

                    },
                    {
                        icon: 'el-icon-lx-hot',
                        index: '4',
                        title: '故事管理',
                        subs: [
                            {
                                index: 'NewsList',
                                title: '房东的故事'
                            },
                            {
                                index: 'AddNews',
                                title: '增加故事'
                            }
                        ],

                    },
                    {
                        icon: 'el-icon-lx-message',
                        index: '5',
                        title: '动态管理',
                        subs: [
                            {
                                index: 'DynamicList',
                                title: '房屋动态'
                            }
                        ],

                    },
                    {
                        icon: 'el-icon-lx-shop',
                        index: 'HouseList',
                        title: '房屋内部'
                    },
                    {
                        icon: 'el-icon-lx-service',
                        index: 'AppointList',
                        title: '预约管理'
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            select(){
                var params={
                    roleId:this.user.roleId
                }
                this.$http.post('/neusoft/user/user/select.htm', params).then(response => {
                    var resBody = response.body
                    if (resBody.isSuccess === 0) {
                        this.list = resBody.result
                        if(this.list!==null){
                            for (var i=0;i<this.list.length;i++){
                                if(this.list[i].list.length===0){
                                    this.items.push({icon:this.list[i].icon,index:this.list[i].functionUrl,title:this.list[i].functionName})
                                }else{
                                    this.subs = []
                                    for(var j=0;j<this.list[i].list.length;j++){
                                        this.subs.push({index:this.list[i].list[j].functionUrl,title:this.list[i].list[j].functionName})
                                        console.log(this.subs)
                                    }
                                    this.items.push({icon:this.list[i].icon,index:i+'',title:this.list[i].functionName,subs:this.subs})
                                }
                            }
                        }


                    } else {
                        console.log("查询失败")
                    }
                })
            },

        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        mounted(){
            var user = sessionStorage.getItem('user')
            if (user) {
                user = JSON.parse(user)
                this.user = user.user
             //   this.select();
            } else {
                this.$router.push({path: '/login'})
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
