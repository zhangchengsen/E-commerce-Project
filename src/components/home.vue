<template>
    <div>
        <el-button type = "info" @click = "exit">退出登录</el-button>
    </div>
</template>
<script>
    export default{
        data() {
            return {

            }
        },
        methods: {
            exit:function() {
                window.sessionStorage.clear()
                this.$router.push('/login')
                
            }

        }
    }
</script>

<style>

</style>