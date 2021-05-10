import Vue from 'vue'
import { Button, Form, Input, FormItem, Message, Container, Main, Header, Aside, Menu, MenuItem, Submenu, MenuItemGroup, Breadcrumb, BreadcrumbItem, Col, Row, Card, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Calendar, Tree, Select, Option } from 'element-ui'

Vue.use(Button)
Vue.use(Calendar)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Col)
Vue.use(Row)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)




Vue.prototype.$confirm = MessageBox;
// 挂载之后才能全局使用
Vue.prototype.$message = Message;