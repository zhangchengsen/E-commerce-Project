<template>
    <div class = "login">
        <img src = "../assets/logo.png"  class = "avatar">
        <el-form label-width="80px" class = "form" :model = "loginForm" :rules = "loginFormRules" ref = "loginFormRef">
            <el-form-item label-width="80px" prop= "username">
                <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
            </el-form-item>

            <el-form-item label-width="80px" prop= "password">
                <el-input prefix-icon="icon-3702mima" type = "password" v-model="loginForm.password"></el-input>
            </el-form-item>

            <el-form-item label-width="80px" class = "btn">
                <el-button type="primary" @click = "load">登录</el-button>
                <el-button type="info" @click = "reloadMes">重置</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
<script>
export default {
    data() {
      return {
        loginForm: {
          username:"",
          password:""
        },
        // 表单验证规则对象
        loginFormRules:{
            username:[
            {required:true,message:"请输入登录名称",trigger:"blur"},
            {min:3,max:10,message:"请输入3-10个字符或者数字",trigger:"blur"}
            ],

            password:[
            {required:true,message:"请输入密码",trigger:"blur"},
            {min:3,max:10,trigger:"blur"}
            ]
        }
      }
    },
    methods: {
      reloadMes:function (){
          this.$refs.loginFormRef.resetFields();
          
      },
      load: function() {
          this.$refs.loginFormRef.validate(async (valid)=>{
              if(!valid) return 
              const {data : res} = await this.$http.post('login',this.loginForm)

              if(res.meta.status != 200) 
              {
                  return this.$message.error({message:"用户名或密码错误",duration:1600})
              }
          
              window.sessionStorage.setItem('token',res.data.token)
              this.$router.push('/home')
          })
      }
    }
  }
</script>

<style lang = "less" scoped>
    .login{
        height:300px;
        width:460px; background-color: #fff;
        text-align: center;
        margin: 120px auto;
        .avatar {
            position: absolute;
            left: 50%;
            transform: translate(-65px,-75px);
            height: 130px;
            width:130px;
            padding: 10px;
            border: 1px solid white;
            box-shadow: 0 0 10px #ddd;
            border-radius: 50%;
            background-color: #eee;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #fff;
            }
        }
    }
    .form{
        width: 500px;
        padding: 0 10px;
        transform:translate(-60px,90px);
        box-sizing: border-box;
    }
    .btn{
        display: flex;
        justify-content: flex-end;
    }
</style>
