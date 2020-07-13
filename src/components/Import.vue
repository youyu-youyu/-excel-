<template>
  <div>
    <!--limit:最大上传数 -->
    <el-upload
      class="upload-demo"
      action=""
      :on-change="handleChange"
      :on-remove="handleRemove"
      :limit="limitUpload"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      :auto-upload="false">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <!-- 数据展示 -->

    <el-table :data="da" stripe border style="width:100%" highlight-current-row>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="project" label="项目" align="center" min-width="120"></el-table-column>
      <!--      <el-table-column prop="upValue" label="上限值" align="center" min-width="120"></el-table-column>-->
      <!--      <el-table-column prop="downValue" label="下限值" align="center" min-width="120"></el-table-column>-->
      <el-table-column prop="NO" label="NO." align="center" min-width="120"></el-table-column>
      <el-table-column prop="data" label="日期" align="center" min-width="100"></el-table-column>
      <el-table-column prop="line" label="线体号" align="center" min-width="120"></el-table-column>
      <el-table-column prop="fixture" label="治具号" align="center" min-width="100"></el-table-column>
      <el-table-column prop="mould" label="模号" align="center" min-width="100"></el-table-column>
      <el-table-column prop="class" label="班别" align="center" min-width="100"></el-table-column>
      <el-table-column label="操作" align="center" min-width="300">
        <template slot-scope="scope">
          <!--          <router-link to="/ProjectInfo">-->
          <el-button type="info" @click="toProject">项目详情</el-button>
          <!--          </router-link>-->
          <el-button type="info" @click="modifyUser(scope.row.project)">修改</el-button>
          <el-button type="info" @click="deleteUser(scope.$index)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--修改用户的对话框   -->
    <!-- :visible.sync="addDialogVisible"控制对话框的显示与隐藏   -->
    <!-- 修改用户信息对话框   -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="NO." prop="email">
          <el-input v-model="editForm.NO"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="日期" prop="mobile">
          <el-input v-model="editForm.data"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="线体号" prop="mobile">
          <el-input v-model="editForm.line"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="治具号" prop="mobile">
          <el-input v-model="editForm.fixture"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="模号" prop="mobile">
          <el-input v-model="editForm.mould"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="班别" prop="mobile">
          <el-input v-model="editForm.class"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  //良率=合格数量 / 总数量
  //符合上下限值之间为合格数量，不在为不合格数量
  //OK 和NG分别表示合格数量 和不合格数量
  export default {
    data() {
      return {
        limitUpload: 1,
        fileTemp: null,
        file: null,
        da: [],
        dalen: 0,
        //控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        editForm: {},
      };
    },
    mounted() {
    },
    methods: {
      //项目详情页
      toProject() {
        this.$router.push({path: '/ProjectInfo', query: {projectList: this.da}})
      },

      //删除当前点击数据
      deleteUser(val) {
        console.log(val)
        let that = this
        that.da.splice(val, 1)
      },
      //修改当前点击数据
      modifyUser(id) {
        this.editForm = id
        console.log(id)
        //根据id.NO区分当前所点击的数据
        this.editDialogVisible = true
        console.log("点击修改按钮")
      },

      //监听修改用户对话框的关闭事件
      editDialogClosed() {
        // this.$refs.editFormRef.resetFields();
      },
      handleChange(file, fileList) {
        this.fileTemp = file.raw;
        if (this.fileTemp) {
          if ((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            || (this.fileTemp.type == 'application/vnd.ms-excel')) {
            this.importfxx(this.fileTemp);
          } else {
            this.$message({
              type: 'warning',
              message: '附件格式错误，请删除后重新上传！'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请上传附件！'
          })
        }
      },
      handleRemove(file, fileList) {
        this.fileTemp = null
      },
      importfxx(obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];

        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;

        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function (f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require("xlsx");
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), {
                //手动转化
                type: "base64"
              });
            } else {
              wb = XLSX.read(binary, {
                type: "binary"
              });
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
            console.log('未处理的原始数据如下：');

            console.log(outdata);
            //此处可对数据进行处理

            let arr = [];
            outdata.map(v => {

              this.editForm = v
              // console.log(v.项目)//v是每行的意思
              let obj = {}
              obj.project = v['项目']//定义对象里面的code=每行的code，每行第一列
              obj.upValue = v['上限值']
              obj.downValue = v['下限值']
              obj.NO = v['项目']
              // console.log(obj.NO)//undefined
              obj.data = v['__EMPTY']
              console.log(obj.data)//undefined
              obj.line = v['__EMPTY_1']
              obj.fixture = v['__EMPTY_2']
              obj.mould = v['__EMPTY_3']
              obj.class = v['__EMPTY_4']
              // console.log(obj)
              //onj对象没有数据
              arr.push(obj)
            });

            _this.da = arr;

            console.log(_this.da)
            _this.dalen = arr.length;
            return arr;
          };
          reader.readAsArrayBuffer(f);
        };
        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      }
    }
  }
</script>
