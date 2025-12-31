import React, { useState, useEffect } from 'react'
import { Upload, message } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import ImgCrop from 'antd-img-crop'
import { API_CODE } from '@/constants/Constants'
import userStore from '@/store/userStore'
// 导入封装好的接口和类型
import { uploadImageFile, updateUserAvatarUrl } from '@/services'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const PictureUp: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const userInfo = userStore((state) => state.userInfo)
  useEffect(() => {
    if (userInfo?.avator) {
      setFileList([
        {
          uid: '-1',
          name: 'current_avatar.png',
          status: 'done',
          url:
            userInfo.avator ||
            'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        },
      ])
    }
  }, [userInfo?.avator])
  const handleAvatarProcess = async (file: File) => {
    try {
      const uploadRes = await uploadImageFile(file)
      if (uploadRes.code !== API_CODE.SUCCESS || !uploadRes.data?.url) {
        throw new Error(uploadRes.msg || '图片上传失败')
      }
      const newAvatarUrl = uploadRes.data.url
      const updateRes = await updateUserAvatarUrl({
        _id: userInfo!._id,
        avatar: newAvatarUrl,
      })
      if (updateRes.code === API_CODE.SUCCESS) {
        message.success('头像更新成功')
        return newAvatarUrl
      } else {
        throw new Error(updateRes.msg || '更新用户信息失败')
      }
    } catch (error: any) {
      console.error('上传更新流程出错:', error)
      message.error(error.message || '操作失败')
      throw error
    }
  }
  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options
    try {
      const url = await handleAvatarProcess(file as File)
      onSuccess?.({ avatarUrl: url })
    } catch (err) {
      onError?.(err as Error)
    }
  }

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src =
        file.response?.url ||
        (await new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(file.originFileObj as FileType)
          reader.onload = () => resolve(reader.result as string)
        }))
    }
    const imgWindow = window.open(src)
    imgWindow?.document.write(`<img src="${src}" style="max-width: 100%" />`)
  }

  return (
    <ImgCrop rotationSlider aspect={1 / 1} showReset>
      <Upload
        listType='picture-card'
        fileList={fileList}
        customRequest={customRequest}
        onChange={onChange}
        onPreview={onPreview}
        maxCount={1}
      >
        {fileList.length < 1 && (
          <div>
            <div style={{ marginTop: 8 }}>+ 上传头像</div>
          </div>
        )}
      </Upload>
    </ImgCrop>
  )
}

export default PictureUp
