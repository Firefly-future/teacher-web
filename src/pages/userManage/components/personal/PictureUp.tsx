/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react'
import { message, Upload } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import ImgCrop from 'antd-img-crop'
import { updateAvator } from '@/services'
import { API_CODE } from '@/constants/Constants'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

interface PictureUpProps {
  onAvatarChange?: (avatarUrl: string) => void
  initialAvatar?: string // 初始头像地址
}

const PictureUp: React.FC<PictureUpProps> = ({
  onAvatarChange,
  initialAvatar,
}) => {
  // 初始化文件列表，保存初始状态用于失败时回滚
  const initialFileList = initialAvatar
    ? [{ url: initialAvatar, uid: 'initial-avatar', name: 'avatar.png' }]
    : []
  const [fileList, setFileList] = useState<UploadFile[]>(initialFileList)

  // 记录当前正在处理的文件uid，用于精准回滚
  const [processingFileUid, setProcessingFileUid] = useState<string>('')

  const handleChange: UploadProps['onChange'] = async ({
    file,
    fileList: newFileList,
  }) => {
    // 文件开始上传时，记录当前处理的文件uid
    if (file.status === 'uploading') {
      setProcessingFileUid(file.uid)
      setFileList(newFileList)
      return
    }
    // 只有文件上传成功且有返回数据时才调用更新头像接口
    if (file.response) {
      try {
        // 获取上传后的图片地址
        const avatarUrl = file.response.data?.url || file.url
        // 调用更新头像接口
        const res = await updateAvator({
          avatar: avatarUrl,
        })
        console.log('更新头像接口返回:', res)
        // 接口调用成功
        if (res.code === API_CODE.SUCCESS) {
          message.success('头像更新成功')
          // 回调父组件更新头像状态
          onAvatarChange?.(avatarUrl)
        }
        // 接口返回错误码（更新失败）
        else {
          message.error(res.msg)
          // 回滚文件列表到初始状态，移除上传的头像展示
          setFileList([...initialFileList])
        }
      } catch (e) {
        // 接口调用异常（网络错误、超时等）
        console.error('更新头像失败:', e)
        message.error('头像更新失败，请检查网络或重试')
        // 回滚文件列表到初始状态
        setFileList([...initialFileList])
      }
    }
    // 文件上传本身失败时也回滚
    if (file.status === 'error') {
      message.error('图片上传失败，请重试')
      setFileList([...initialFileList])
    }
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

  const uploadButton = (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  )

  return (
    <ImgCrop rotationSlider>
      <Upload
        action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
        listType='picture-card'
        fileList={fileList}
        onChange={handleChange}
        onPreview={onPreview}
        maxCount={1}
      >
        {fileList.length < 1 && uploadButton}
      </Upload>
    </ImgCrop>
  )
}

export default PictureUp
