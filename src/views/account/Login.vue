<template>
  <div class="login">
    <div class="login-left">
      <img src="../../assets/images/login-bg.png" alt="">
    </div>
    <div class="login-right">
      <div class="login-box">
        <div class="login-title">
          <h3>{{setting.title}}</h3>
        </div>
        <Tabs class="login-type" value="0" @on-click="changeLoginType">
          <TabPane label="手机号登录" name="0"></TabPane>
          <TabPane label="邮箱登录" name="1"></TabPane>
        </Tabs>
        <Alert v-show="errorMsg" type="error" show-icon>{{ errorMsg }}</Alert>
        <div class="login-main">
          <Form ref="loginForm" class="loginForm" :model="param" :rules="rules" @keydown.enter.native="handleSubmit" autocomplete="off" :show-message="false">
            <FormItem prop="email" v-if="param.type === 1">
              <Input prefix="ios-mail" type="email" v-model="param.email" placeholder="请输入登录邮箱" class="login-email" />
            </FormItem>
            <FormItem prop="mobile" v-else>
              <Input prefix="ios-phone-portrait" type="number" v-model="param.mobile" placeholder="请输入手机号码" />
            </FormItem>
            <FormItem prop="password">
              <Input prefix="ios-lock" type="password" size="large" password v-model="param.password" placeholder="请输入账户密码" />
            </FormItem>
            <FormItem prop="captcha" class="login-verify-code">
              <Input prefix="ios-lock" v-model="param.captcha" placeholder="请输入验证码" maxlength="4" />
              <img :src="verifyCode" @click="getVerifyCode" />
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" :loading="loading" long :disabled="isDisabled">{{!loading ? '立&nbsp;&nbsp;即&nbsp;&nbsp;登&nbsp;&nbsp;录' : '登&nbsp;&nbsp;录&nbsp;&nbsp;中'}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class="login-footer">
        <p class="footer-copy">
          CopyRight &copy; 轻松集团版权所有
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    name: 'Login',
    data () {
      return {
        loading: false,
        errorMsg: '',
        param: {
          type: 0
        },
        rules: {
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      setting () {
        return this.$store.state.app.setting;
      },
      verifyCode () {
        return this.$store.state.account.verifyCode;
      },
      isDisabled () {
        if (!this.param.password || !this.param.captcha) {
          return true;
        } else {
          return !this.param.type ? !this.param.mobile : !this.param.email;
        }
      },
      redirectUrl () {
        return this.$route.query.redirect_url;
      }
    },
    created () {
      if (!this.verifyCode) {
        this.getVerifyCode();
      }
    },
    methods: {
      ...mapActions(['handleLogin', 'getUserInfo', 'getVerifyCode']),
      // 切换登录方式
      changeLoginType (data) {
        this.param.type = Number(data);
        if (this.param.type) {
          this.$delete(this.param, 'mobile');
        } else {
          this.$delete(this.param, 'email');
        }
        this.$delete(this.param, 'password');
        this.errorMsg = '';
      },
      // 登录
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (!valid) return;
          this.loading = true;
          this.errorMsg = '';
          const param = { ...this.param };
          if (param.type) {
            if (!param.email) this.errorMsg = '请输入登录邮箱';
          } else {
            if (!param.mobile) this.errorMsg = '请输入手机号码';
          }
          if (!param.password) this.errorMsg = '请输入手机号码';
          if (this.errorMsg) return;
          this.handleLogin(param).then(() => {
            this.loading = false;
            const route = {};
            if (this.redirectUrl && this.redirectUrl !== this.$route.path) {
              route.path = this.redirectUrl;
            } else {
              route.path = '/home';
            }
            this.$router.push(route);
          }).catch(err => {
            this.errorMsg = err;
            this.loading = false;
          });
        });
      }
    }
  };
</script>
<style lang="less">
  .login {
    width: 100%;
    height: 100%;
    min-height: 628px;
    background: #f0f2f5;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-left{
      flex: 1;
      height: 100%;
      text-align: center;
      overflow: hidden;
      background: linear-gradient(92deg, #4480F6 0%, #427FF5 100%, #4380F6 100%);
      position: relative;
      img{
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .login-right{
      width: 34.72222%;
      min-width: 500px;
      height: 100%;
      position: relative;
      background: #FFFFFF;
    }
    .login-box{
      width: 100%;
      max-width: 510px;
      padding: 0 52px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .login-title{
      text-align: center;
      margin-bottom: 40px;
      h3{
        font-size: 44px;
        font-weight: 500;
        color: #4480F6;
      }
    }
    .login-footer{
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      text-align: center;
      .footer-copy{
        color: #999;
      }
    }
    .ivu-form-item{
      margin-bottom: 20px;
      &:last-child{
        margin-top: 30px;
      }
    }
    .login-type{
      width: 100%;
      overflow: hidden;
      margin-bottom: 10px;
      .ivu-tabs-nav{
        width: 100%;
      }
      .ivu-tabs-tab{
        width: 50%;
        text-align: center;
        margin-right: 0;
        font-size: 16px;
        user-select: none;
        color: #a1a6bb;
        padding-bottom: 10px;
        &-active{
          color: #3a405b;
        }
      }
      .ivu-tabs-ink-bar{
        background: #FCB43D;
      }
    }
    .ivu-input{
      height: 45px;
      color: #383B43;
      border-color: #e3e8f0;
      border-radius: 23px;
      padding-left: 45px;
      font-size: 14px;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }
      &:focus, &:hover, &:active{
        box-shadow: none;
        border-color: #e3e8f0;
      }
      &:focus{
        border-color: #FCB43D;
      }
      &-prefix,&-suffix{
        width: 40px;
        .ivu-icon{
          font-size: 20px;
          line-height: 45px;
          color: #b9bfd0;
        }
      }
      &-prefix{
        width: 45px;
        text-align: right;
        padding-right: 6px;
      }
      &-suffix{
        width: 34px;
        text-align: left;
      }
    }
    .login-email{
      .ivu-input-suffix{
        width: 150px;
        line-height: 45px;
        color: #999;
      }
    }
    .login-verify-code{
      .ivu-input-wrapper{
        width: 240px;
      }
      img{
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        margin-left: 30px;
      }
    }
    .ivu-btn{
      height: 50px;
      background: linear-gradient(90deg, #FCB43D 0%, #FB9A26 100%);
      border: none;
      border-radius: 25px;
      font-size: 18px;
      font-weight: bold;
      color: #FFFFFF;
      &:focus{
        box-shadow: none;
      }
      &[disabled]{
        background: linear-gradient(90deg , #f7c572 0%, #fbb869 100%);
        color: #fff;
      }
    }
  }
</style>
