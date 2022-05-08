package web.ui;

import web.components.Component

@Import(Upload = "element-ui/packages/upload")
@Define(slot, trigger)
@Define(slot, tip)
@Define(slot, 'default')
@Embed('element-ui/lib/theme-chalk/upload.css')

declare final class Upload extends Component{
    //必选参数，上传的地址
    action:string
    //设置上传的请求头部
    headers:object
    //是否支持多选文件
    multiple:boolean
    //上传时附带的额外参数
    @Alias(data)
    dataset:object
    //上传的文件字段名
    name:string='file'
    //支持发送 cookie 凭证信息
    withCredentials:boolean=false
    //是否显示已上传文件列表
    showFileList:boolean=true
    //是否启用拖拽上传
    drag:boolean=false
    //接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    accept:string
    //点击文件列表中已上传的文件时的钩子
    onPreview:(file:UploadInternalFileDetail)=>void
    //文件列表移除文件时的钩子
    onRemove:(file:UploadInternalFileDetail, fileList:UploadInternalFileDetail[])=>void
    //文件上传成功时的钩子
    onSuccess:(response, file?:UploadInternalFileDetail, fileList?:UploadInternalFileDetail[])=>void
    //文件上传失败时的钩子
    onError:(err, file:UploadInternalFileDetail, fileList:UploadInternalFileDetail[])=>void
    //文件上传时的钩子
    onProgress:(event, file:UploadInternalFileDetail, fileList:UploadInternalFileDetail[])=>void
    //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange:(file:UploadInternalFileDetail, fileList:UploadInternalFileDetail[])=>void
    //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload:(file:UploadInternalFileDetail)=>boolean | Promise<any | boolean>
    //删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    beforeRemove:(file:UploadInternalFileDetail, fileList:UploadInternalFileDetail[])=>boolean | Promise<any | boolean>
    //文件列表的类型
    listType:'text' | 'picture' | 'picture-card'='text'
    //	是否在选取文件后立即进行上传
    autoUpload:boolean=true
    //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
    fileList:({name:string, url:string,status?: FileUploadStatus})[]
    //覆盖默认的上传行为，可以自定义上传的实现
    httpRequest:()=>void
    //是否禁用
    disabled:boolean = false
    //最大允许上传个数
    limit:number
    //文件超出个数限制时的钩子
    onExceed:(files, fileList)=>void
    //清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    clearFiles():void
    //取消上传请求 （ file: fileList 中的 file 对象 ）
    abort():void
    //手动上传文件列表
    submit():void
}

declare interface UploadInternalFileDetail {
  status: FileUploadStatus,
  name: string,
  size: number,
  percentage: number,
  uid: number,
  raw: any,
  url?: string
}

declare type FileUploadStatus = 'ready' | 'uploading' | 'success' | 'fail'