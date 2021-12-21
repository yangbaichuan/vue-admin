<template>
  <span class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick" placement="bottom-end">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvatar" style="background-color: #8faafe;" :size="24">
          {{userName.substr(0, 1)}}
        </Avatar>
      </Badge>
      <span class="user-name" v-if="userName">{{userName}}</span>
      <!-- <Icon :size="18" type="ios-arrow-down" /> -->
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <!-- <DropdownItem name="settings">
          <Icon type="ios-settings-outline" />
          <span>个人设置</span>
        </DropdownItem> -->
        <DropdownItem name="logout">
          <Icon type="ios-exit-outline" />
          <span>退出登录</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </span>
</template>

<script>
  import './user.less';
  import { mapActions } from 'vuex';
  export default {
    name: 'User',
    props: {
      userAvatar: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      },
      messageUnreadCount: {
        type: Number,
        default: 0
      }
    },
    methods: {
      ...mapActions([
        'handleLogOut'
      ]),
      logout () {
        this.handleLogOut().then(() => {
          window.location.replace(location.origin + location.pathname + '#/login');
        });
      },
      message () {
        this.$router.push({
          name: 'message_page'
        });
      },
      setting () {
        this.$router.push({
          name: 'account_settings'
        });
      },
      handleClick (name) {
        if (name === 'logout') {
          this.logout();
        } else {
          this.$router.push({
            name: 'account_settings'
          });
        }
      }
    }
  };
</script>
