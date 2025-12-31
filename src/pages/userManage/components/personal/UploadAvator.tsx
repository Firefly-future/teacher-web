import React, { useState } from 'react'
import { Upload, message, Avatar, Spin } from 'antd'
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'

interface Props {
  userId: string
  currentAvatar?: string
  token: string
}

const AvatarUpload: React.FC<Props> = ({ userId, currentAvatar, token }) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | undefined>(currentAvatar)
  const handleUpload = async (file: File) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('http://39.96.210.90:8002/upload/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const uploadResult = await uploadRes.json()

      if (uploadResult.code === 200) {
        const newUrl = uploadResult.data.url
        const updateRes = await fetch('http://39.96.210.90:8002/user/update', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: userId,
            avatar: newUrl,
          }),
        })

        const updateResult = await updateRes.json()

        if (updateResult.code === 200) {
          setImageUrl(newUrl)
          message.success('头像更新成功')
        } else {
          throw new Error(updateResult.msg || '更新用户信息失败')
        }
      } else {
        throw new Error(uploadResult.msg || '图片上传失败')
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ].includes(file.type)
    if (!isJpgOrPng) {
      message.error('只支持 JPG/PNG/GIF/WebP 格式!')
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('图片必须小于 5MB!')
    }

    if (isJpgOrPng && isLt5M) {
      handleUpload(file)
    }
    return false
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Upload
        name='avatar'
        listType='picture-card'
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt='avatar'
            style={{ width: '100%', borderRadius: '8px' }}
          />
        ) : (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传头像</div>
          </div>
        )}
      </Upload>

      <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
        支持 jpg/png/gif，小于 5MB
      </p>
    </div>
  )
}

export default AvatarUpload
