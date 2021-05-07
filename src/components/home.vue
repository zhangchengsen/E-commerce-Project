<template>

        <el-container class = "home-container">
            
            <el-header class = "header"><div><img src="../assets/Logo58.png" alt="">电商后台管理系统</div><el-button type = "info" @click = "exit">退出登录</el-button></el-header>
            <el-container>
                <el-aside :width="isCollapse ? '64px' : '200px' " class = "home-container" >
                <div class = "folden" @click = "toCollapse" >
                ||| 
                </div>
                    <el-menu :collapse="isCollapse" unique-opened  :router ="true" background-color="#545c64" text-color="#fff"
      active-text-color="#409EFF"  :collapse-transition = "false">
      <!-- 一级导航 --> 
             <!-----------一级嵌套 ----------> 
            <el-submenu :index="item.id + ''" v-for ="item in menuList" :key = "item.id" @click = "clg(item.id)">
                <template slot="title">
                <i  :class = "icons[item.id]"></i>  <!-- 图标0 --> 
                
                {{item.authName}}
                </template>
               
                 <!-----------二级嵌套 ---------->
                    <el-menu-item class = "el-icon-menu" :index="'/' + subItem.path " v-for = "subItem in item.children" :key = "subItem.id" >
                    <template slot="title"> {{subItem.authName}}</template>

                
                    </el-menu-item>
                <!-----------二级嵌套 ----------> 
                </el-submenu>
            <!-----------一级嵌套 ---------->  
            </el-menu>
            
                </el-aside>

                <el-main class = "main">
                    <router-view/>
                </el-main>

            </el-container>
        </el-container>

        

</template>
<script>
    export default{
        created(){
            this.getMenuList()
        },
        data() {
            return {
                menuList:[],
                icons:{
                    '125':'el-icon-user-solid',
                    '103':'el-icon-set-up',
                    '101':'el-icon-shopping-bag-1',
                    '102':'el-icon-s-management',
                    '145':'el-icon-data-line'

                },
                isCollapse:false
            }
        },
        methods: {
            exit:function() {
                window.sessionStorage.clear()
                this.$router.push('/login')
                
            },
          
            
            getMenuList:async function() {
                const {data : res } = await this.$http.get("menus")
                if(res.meta.status != 200) return this.$message.error(res.meta.msg) 
                this.menuList = res.data;
         
            },
            toCollapse:function() {
                this.isCollapse = !this.isCollapse
            }

        }
    }
</script>

<style lang = "less" scoped >
    .header {
        display: flex;
        justify-content: space-between;
        background-color: #303133;
        align-items: center;
         div{
            height: 100%;
            display:flex;
            align-items: center;
            color: #fff;
            font-size: 20px;
            img {
                height:100%;
            }
        }
    }
    .home-container{
        background-color: #303133;
        height: 100%;

    }
    .main {
        background-color: #fff;
    }
    .iconfont{
        margin-right: 22px;
    }
    .el-menu{
        border-right: none;
        list-style: none;
        position: relative;
        margin: 0;
        padding-left: 0;
        background-color: #FFF;
        
    }
    .folden{
            background-color: #909699;
            font-size: 10px;
            text-align: center;
            line-height: 24px;
            letter-space: 0.2em;
            cursor: pointer;
        }
</style>