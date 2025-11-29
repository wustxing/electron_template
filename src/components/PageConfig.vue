<script>
import { onMounted, ref, reactive } from "vue";
import { uuid } from "./tools";
import dataConfig from "./data";
import PagePhone from "./PagePhone.vue";

export default {
  components: {
    PagePhone,
  },
  setup() {
    return {
      pageConfig: ref(dataConfig).value,
      ruleFormRef: ref(),
      rules: reactive({
        page_name: [
          { required: true, message: "必须填写文件名称", trigger: "blur" },
        ],
        page_title: [
          {
            required: true,
            message: "必须填写页面名称",
            trigger: "blur",
          },
        ],
        activity_id: [
          {
            required: true,
            message: "必须填写包名",
            trigger: "blur",
          },
        ],
      }),
    };
  },
  data() {
    return {
      options: [
        { value: "1", label: "一行一个", disabled: false },
        { value: "2", label: "一行两个", disabled: false },
      ],
      options1: [
        { value: "0", label: "无", disabled: false },
        { value: "jump1", label: "不定位跳", disabled: false },
        { value: "jump2", label: "定位跳", disabled: false },
        { value: "jump3", label: "内部跳", disabled: false },
      ],
      editableTabsValue: "",
      curIndex: 0,
      upath: "",
      imgpath: "",
    };
  },
  mounted() {
    console.log(
      `the component is now mounted.`,
      this.pageConfig,
      this.editableTabsValue
    );
    this.pageConfig.img_list.forEach((item, index) => {
      item.id = uuid(6);
      item.title = "行" + (index + 1);
      item.list.forEach((aaitem) => {
        aaitem.id = uuid(6);
      });
    });
    if (this.pageConfig.img_list.length > 0) {
      this.editableTabsValue = this.pageConfig.img_list[0].id;
      this.curIndex = 0;
    }

    console.log("configs.tempPath====", configs.tempPath);
    // const tpath = ref(configs.tempPath);
    this.imgpath = `file:///${configs.tempPath.replace(/\\/g, "/")}`; // 注意使用三个斜杠和斜杠转换
    console.log("000000cpath===", this.imgpath);
  },
  methods: {
    doDraggingNotify(data) {
      console.log("draggingNotify===", data);
      if (data.type == "share") {
        this.pageConfig.share_postion = Object.assign(
          {},
          this.pageConfig.share_postion,
          data
        );
      }
      if (data.type == "rule") {
        this.pageConfig.rule_postion = Object.assign(
          {},
          this.pageConfig.rule_postion,
          data
        );
      }
    },
    handlePanleType() {
      this.pageConfig.img_list.forEach((item, index) => {
        item.list.forEach((aaitem, aaindex) => {
          if (aaindex % 2 === 0) {
            aaitem.jump_type = "0";
          } else {
            aaitem.jump_type = "1";
          }
        });
      });
    },
    async selectPath() {
      //选中文件
      this.upath = await this.$electron.ipcRenderer.invoke(
        "dialog:openDirectory"
      );
      this.pageConfig.upath = this.upath;
      //读取文件夹内容
      this.fullpath = await this.$electron.ipcRenderer.invoke(
        "directory:readFiles",
        this.upath
      );
      console.log("fullpath===", this.fullpath);

      this.fullpath = this.fullpath.filter((item) => {
        return item.indexOf("H5_") > -1;
      });
      let img_list = [];

      if (this.pageConfig.panle_type == 1) {
        //一行一个
        for (let i = 0; i < this.fullpath.length; i++) {
          let obj = {
            id: uuid(6),
            img_name: this.fullpath[i],
            jump_type: "0",
            url: "",
            tjparam: "",
          };
          let obj1 = {
            id: uuid(6),
            title: "行" + (i + 1),
            list: [obj],
          };
          img_list.push(obj1);
        }
      }
      if (this.pageConfig.panle_type == 2) {
        //一行2个
        //this.fullpath 两个 两个的分
        // this.fullpath
        for (let i = 0; i < this.fullpath.length; i += 2) {
          let alist = this.fullpath.slice(i, i + 2);
          let obj = {
            id: uuid(6),
            img_name: alist[0],
            jump_type: "0",
            url: "",
            tjparam: "",
          };
          let obj2 = {
            id: uuid(6),
            title: "行" + (i + 1),
            list: [obj],
          };

          let obj1 = {
            id: uuid(6),
            img_name: "",
            jump_type: "0",
            url: "",
            tjparam: "",
          };
          if (alist.length > 1) {
            obj1.img_name = alist[1];
            obj2.list.push(obj1);
          }

          img_list.push(obj2);
        }
      }

      this.pageConfig.img_list = img_list;
      if (img_list.length > 0) {
        this.editableTabsValue = this.pageConfig.img_list[0].id;
      }
      console.log("img_list===", img_list);
    },
    async downloadFile(formEl) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log("submit!", this.pageConfig);
          if (this.pageConfig.address) {
            this.pageConfig.address_arry = this.pageConfig.address.split(",");
          } else {
            this.pageConfig.address_arry = [];
          }
          let obj = JSON.parse(JSON.stringify(this.pageConfig));
          console.log("obj===", obj);
          this.$electron.ipcRenderer.invoke("createZip", obj);
          this.$message.success("打包成功");
        } else {
          console.log("error submit!", fields);
        }
      });
      // window.fileApi.createFileZip();
    },
    async submitForm(formEl) {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log("submit!", this.pageConfig);
          if (this.pageConfig.address) {
            this.pageConfig.address_arry = this.pageConfig.address.split(",");
          } else {
            this.pageConfig.address_arry = [];
          }

          let obj = JSON.parse(JSON.stringify(this.pageConfig));
          console.log("obj===", obj);
          this.$electron.ipcRenderer.invoke("replaceInFiles", obj);
        } else {
          console.log("error submit!", fields);
        }
      });
    },
    resetForm(formEl) {
      if (!formEl) return;
      formEl.resetFields();
    },
    handleDelClick(item, aaindex) {
      item.list.splice(aaindex, 1);
    },
    handleAddClick(item) {
      let obj = {
        id: uuid(6),
        img_name: "",
        jump_type: "0",
        url: "",
        tjparam: "",
      };
      item.list.push(obj);
    },
    handleTabsEdit(targetName, action) {
      console.log("handleTabsEdit===", targetName, action);
      if (action === "add") {
        let newTab = {
          id: uuid(6),
          title: "行" + (this.pageConfig.img_list.length + 1),
          list: [
            {
              id: uuid(6),
              img_name: "",
              jump_type: "0",
              url: "",
              tjparam: "",
            },
          ],
        };
        this.pageConfig.img_list.push(newTab);
        this.editableTabsValue = newTab.id;
      } else if (action === "remove") {
        const tabs = this.pageConfig.img_list;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.id === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.id;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.pageConfig.img_list = tabs.filter((tab) => tab.id !== targetName);
      }
    },
    handleTabsClick(v) {
      console.log(
        "handleTabsClick==1111=",
        v.props.name,
        this.editableTabsValue
      );
      this.pageConfig.img_list.forEach((item, index) => {
        if (item.id == v.props.name) {
          this.curIndex = index;
        }
      });
      console.log(
        "handleTabsClick===",
        this.pageConfig.img_list,
        this.editableTabsValue,
        this.curIndex
      );
    },
  },
};
</script>

<template>
  <div class="page_content">
    <div class="page_left">
      <div class="page_view">
        <!-- //顺着显示图片 -->
        <PagePhone
          :PageConfig="pageConfig"
          :upath="upath"
          :pindex="0"
          :curIndex="curIndex"
          @draggingNotify="doDraggingNotify"
        ></PagePhone>
      </div>
    </div>
    <div class="page_right">
      <div class="page_info">
        <el-form
          ref="ruleFormRef"
          :model="pageConfig"
          status-icon
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
        >
          <el-form-item label="文件名称" prop="page_name">
            <el-input v-model="pageConfig.page_name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="页面名称" prop="page_title">
            <el-input v-model="pageConfig.page_title" autocomplete="off" />
          </el-form-item>
          <el-form-item label="包名称" prop="activity_id">
            <el-input v-model="pageConfig.activity_id" />
          </el-form-item>
          <el-form-item label="分享title" prop="share_obj.share_title">
            <el-input v-model="pageConfig.share_obj.share_title" />
          </el-form-item>
          <el-form-item label="分享描述" prop="share_obj.share_desc">
            <el-input v-model="pageConfig.share_obj.share_desc" />
          </el-form-item>
          <el-form-item label="规则" prop="pop_desc">
            <el-input autosize type="textarea" v-model="pageConfig.pop_desc" />
          </el-form-item>
          <el-form-item label="定位" prop="address">
            <div>逗号分隔，如：北京市,海淀区。</div>
            <div>
              地址查找 请用该链接 地址查找链接
              https://www.mca.gov.cn/mzsj/xzqh/2020/20201201.html
            </div>
            <el-input v-model="pageConfig.address" />
          </el-form-item>
          <el-form-item label="排版" prop="panle_type">
            <el-select
              v-model="pageConfig.panle_type"
              placeholder="选择排版"
              style="width: 240px"
              @click="handlePanleType"
            >
              <el-option
                v-for="itema in options"
                :key="itema.value"
                :label="itema.label"
                :value="itema.value"
                :disabled="itema.disabled"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="是否有分享" prop="pop_desc">
            <el-switch
              v-model="pageConfig.is_share_btn"
              active-text="有"
              inactive-text="无"
            />
          </el-form-item>
          <el-form-item label="是否有规则" prop="pop_desc">
            <el-switch
              v-model="pageConfig.is_rule_btn"
              active-text="有"
              inactive-text="无"
            />
          </el-form-item>

          <el-form-item label="目标文件夹" prop="pop_desc">
            {{ upath }}
            <el-button type="primary" @click="selectPath">选择</el-button>
          </el-form-item>
          <el-form-item label="图片配置" prop="pop_desc">
            <div class="overview_img_list">
              <el-tabs
                v-model="editableTabsValue"
                type="border-card"
                editable
                class="demo-tabs"
                @tab-click="handleTabsClick"
                @edit="handleTabsEdit"
              >
                <el-tab-pane
                  v-for="item in pageConfig.img_list"
                  :key="item.id"
                  :label="item.title"
                  :name="item.id"
                >
                  <el-card style="max-width: 480px">
                    <template #header>
                      <div class="card_header">
                        <div>图片列表</div>
                        <div>
                          <el-button
                            type="primary"
                            @click="handleAddClick(item)"
                            plain
                            >添加</el-button
                          >
                        </div>
                      </div>
                    </template>

                    <div
                      class="img_list"
                      v-for="(aaitem, aaindex) in item.list"
                      :key="aaitem.id"
                    >
                      <div class="img_btn">
                        <el-button
                          type="danger"
                          :disabled="aaindex == 0"
                          @click="handleDelClick(item, aaindex)"
                          plain
                          >删除</el-button
                        >
                      </div>
                      <el-form-item label="图片名称" prop="pop_desc">
                        <el-input v-model="aaitem.img_name" />
                      </el-form-item>
                      <el-form-item label="图片" prop="img_name">
                        <el-image
                          :src="imgpath + '/images/' + aaitem.img_name"
                          :fit="contain"
                        ></el-image>
                      </el-form-item>

                      <el-form-item label="选择事件" prop="pop_desc">
                        <el-select
                          v-model="aaitem.jump_type"
                          placeholder="选择事件"
                          style="width: 240px"
                        >
                          <el-option
                            v-for="itema in options1"
                            :key="itema.value"
                            :label="itema.label"
                            :value="itema.value"
                            :disabled="itema.disabled"
                          />
                        </el-select>
                      </el-form-item>
                      <template v-if="aaitem.jump_type != '0'">
                        <el-form-item label="跳转地址" prop="pop_desc">
                          <el-input v-model="aaitem.url" />
                        </el-form-item>
                        <el-form-item label="统计参数" prop="pop_desc">
                          <el-input v-model="aaitem.tjparam" />
                        </el-form-item>
                      </template>
                    </div>
                  </el-card>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              保存
            </el-button>
            <el-button type="primary" @click="downloadFile(ruleFormRef)">
              导出
            </el-button>
            <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page_content {
  width: 100%;
  height: 100%;
  display: flex;
  .page_left {
    width: 33%;
    .page_view {
      width: 375px;
      height: 667px;
    }
  }
  .page_right {
    width: 65%;
    overflow: hidden;
    .overview_img_list {
      width: 100%;
    }
  }
  .img_list {
    border: 1px #cccccc solid;
    margin: 10px 10px 10px 10px;
    padding: 10px 10px 10px 10px;
    /deep/ .el-form-item {
      margin-bottom: 18px;
    }
    /deep/ .el-card {
      margin-bottom: 10px !important;
    }
    .img_btn {
      padding: 10px;
      text-align: right;
    }
  }
  .card_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
}
</style>
