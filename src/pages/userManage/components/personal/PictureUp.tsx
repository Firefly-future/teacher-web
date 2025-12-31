import React, { useState } from 'react'
import { Upload, message } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import ImgCrop from 'antd-img-crop'
import { API_CODE } from '@/constants/Constants'
import { getToken } from '@/utils'
import userStore from '@/store/userStore'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const PictureUp: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const userInfo = userStore((state) => state.userInfo)

  const handleAvatarChange = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      })
      const result = await response.json()

      if (result.code !== API_CODE.SUCCESS) throw new Error(result.msg)
      const url = result.data.url

      const updateRes = await fetch('/user/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userInfo?._id, avatar: url }),
      })

      if (updateRes.ok) {
        message.success('头像更新成功')
        return url
      }
    } catch (error) {
      message.error('操作失败，请重试')
      throw error
    }
  }

  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const url = await handleAvatarChange(file as File)
      onSuccess?.({ url }, file as any)
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
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as FileType)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  return (
    <ImgCrop rotationSlider aspect={1 / 1}>
      <Upload
        listType='picture-card'
        fileList={fileList}
        customRequest={customRequest}
        onChange={onChange}
        onPreview={onPreview}
        maxCount={1}
      >
        {fileList.length < 1 && '+ 上传'}
      </Upload>
    </ImgCrop>
  )
}

export default PictureUp
