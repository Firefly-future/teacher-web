import React, { useState, useEffect } from 'react'
import { Upload, message } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import ImgCrop from 'antd-img-crop'
import { API_CODE } from '@/constants/Constants'
import userStore from '@/store/userStore'
import { uploadImageFile, updateUserAvatarUrl } from '@/services'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const PictureUp: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const userInfo = userStore((state) => state.userInfo)
  useEffect(() => {
    if (userInfo?.avator) {
      setFileList([{ uid: '-1', url: userInfo!.avator || '', name: userInfo.username, status: 'done' }])
    }
  }, [userInfo?._id])
  const handleAvatarProcess = async (file: File) => {
    try {
      const uploadRes = await uploadImageFile(file)
      if (uploadRes.code !== API_CODE.SUCCESS || !uploadRes.data?.url) {
        throw new Error(uploadRes.msg || '图片上传到服务器失败')
      }
      const newAvatarUrl = uploadRes.data.url
      message.success('图片上传成功')
      const updateRes = await updateUserAvatarUrl({
        id: userInfo!._id,
        avatar: newAvatarUrl,
      })
      if (updateRes.code !== API_CODE.SUCCESS) {
        throw new Error(updateRes.msg || '同步用户信息失败')
      }
      userStore.setState({ userInfo: { ...userInfo!, avator: newAvatarUrl } })
      return newAvatarUrl
    } catch (e) {
      console.error('流程中断:', e)
      throw e
    }
  }
  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const url = await handleAvatarProcess(file as File)
      onSuccess?.({ avatarUrl: url })
    } catch (err: any) {
      onError?.(err)
    }
  }
  const onChange: UploadProps['onChange'] = ({ file, fileList: newList }) => {
    const latest = newList.slice(-1).map((item) => {
      if (item.uid === file.uid) {
        return { ...item, url: item.url || (item.response as any)?.avatarUrl }
      }
      return item
    })
    setFileList(latest)
  }
  const onPreview = async (file: UploadFile) => {
    let src = file.url || (file.response as any)?.avatarUrl
    if (!src && file.originFileObj) {
      src = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as FileType)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const imgWindow = window.open(src)
    imgWindow?.document.write(`<img src="${src}" style="max-width:100%" />`)
  }
  return (
    <ImgCrop rotationSlider aspect={1} showReset>
      <Upload
        listType='picture-card'
        fileList={fileList}
        customRequest={customRequest}
        onChange={onChange}
        onPreview={onPreview}
        maxCount={1}
      >
        {fileList.length === 0 && (
          <div style={{ marginTop: 8 }}>+ 上传头像</div>
        )}
      </Upload>
    </ImgCrop>
  )
}

export default PictureUp
