import Vue from 'vue'
import { Button, Form, Input, FormItem, Message, Container, Main, Header, Aside, Menu, MenuItem, Submenu, MenuItemGroup, Breadcrumb, BreadcrumbItem, Col, Row, Card, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Calendar, Tree, Select, Option, Cascader, Tabs, TabPane, Alert, Step, Steps, Checkbox, CheckboxGroup, Upload, Timeline, TimelineItem } from 'element-ui'

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
Vue.use(Alert)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(TabPane)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)




Vue.prototype.$confirm = MessageBox;
// 挂载之后才能全局使用
Vue.prototype.$message = Message;