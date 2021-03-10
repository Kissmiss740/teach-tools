import request from '@/utils/axios'
//注册
export const Register = (data) => {
  return request({
    url: '/users/signup',
    method: 'post',
    data: data
  })
}
//发送邮件
export const SendMail = (data) => {
  return request({
    url: '/users/verify',
    method: 'post',
    data: data
  })
}
//登录
export const Login = (data) => {
  return request({
    url: '/users/signin',
    method: 'post',
    data: data
  })
}
//获取用户信息
export const GetUserInfo = () => {
  return request({
    url: '/users/getUserInfo'
  })
}

//退出登录
export const Logout = () => {
  return request({
    url: '/users/logout'
  })
}

//获取用户的点赞、收藏的帖子
export const GetStarAndLike = () => {
  return request({
    url: '/users/getUserStarLikePost'
  })
}
//
export const GetFileList = (username) => {
  return request({
    url: '/file/getFileList',
    params: {
      username
    }
  })
}
//
export const CreateOneFile = (data) => {
  return request({
    url: '/file/addFile',
    method: 'post',
    data: data
  })
}

//
export const GetOneFile = (id) => {
  return request({
    url: '/file/getFile',
    params: {
      id
    }
  })
}
//修改某一模块
export const UpdateModule = (data) => {
  return request({
    url: '/file/updateFile',
    method: 'post',
    data: data
  })
}

//另存为模板/教案
export const ChangeFileType = ({
  id,
  type
}) => {
  return request({
    url: '/file/changeType',
    params: {
      id,
      type
    }
  })
}

//重命名文件名
export const RenameFile = (data) => {
  return request({
    url: '/file/renameFile',
    method: 'post',
    data: data
  })
}

//分享文件
export const ShareFile = (data) => {
  return request({
    url: '/file/share',
    method: 'post',
    data: data
  })
}
//
export const UploadFiles = ({
  fileData,
  id
}) => {
  return request({
    url: '/file/upload',
    method: 'post',
    data: fileData,
    params: {
      id
    }
  })
}

//
export const GetEvalFileList = (id) => {
  return request({
    url: '/file/getEvalFiles',
    params: {
      id
    }
  })
}

//
export const CreateNewPost = (data) => {
  return request({
    url: '/post/createNewPost',
    method: 'post',
    data: data
  })
}
//
export const GetAllPosts = () => {
  return request({
    url: '/post/getAllPosts',
  })
}
//
export const LikeOnePost = (postId) => {
  return request({
    url: '/post/likeOnePost',
    params: {
      postId
    }
  })
}
//
export const CollectOnePost = (data) => {
  return request({
    url: '/post/collectOnePost',
    method: 'post',
    data: data
  })
}

//
export const AddOneComment = (data) => {
  return request({
    url: '/post/addOneComment',
    method: 'post',
    data: data
  })
}
//
export const StarOrLikePost = ({
  username,
  postId,
  fileId,
  type,
  status
}) => {
  return request({
    url: '/post/starOrLikePost',
    params: {
      username,
      postId,
      fileId,
      type,
      status
    }
  })
}