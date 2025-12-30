import React, {useEffect, useState, useRef} from 'react'
import { Space, Table, Button, message, Popconfirm,Input, Drawer  } from 'antd'
import type { TableProps, PopconfirmProps } from 'antd'
import {examList, examRemove, examUpdata, examDetail} from '@/services/index'
import type {ExamListResponse, BaseResponse, ExamListItem, ExamDetail, ExamSearch} from '@/services/types'
import {API_CODE} from '@/constants/Constants'
import { useNavigate } from 'react-router-dom'
import style from './ExerciseBank.module.scss'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import Search from './components/search/Search'

const ExerciseBank = () => {
  const [query, setQuery] = useState({
    page: 1,
    pagesize: 5
  })
  const [data,setData] = useState<BaseResponse<ExamListResponse>>()
  const [id,setId] = useState('')
  const navigate = useNavigate()
  const [editRowId, setEditRowId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [examDeta,setExamDeta] = useState<ExamDetail>()
  const examRef = useRef<HTMLDivElement>(null)
  const option = ['A', 'B', 'C', 'D']
  const singleChoice = (examDeta?.questions || []).filter(v=>v?.type === '1')
  const multipleChoice = (examDeta?.questions || []).filter(v=>v?.type === '2')
  const estimate = (examDeta?.questions || []).filter(v=>v?.type === '3')
  const [list,setList] = useState<ExamSearch>()
  // 试卷列表
  const getExamList = async ()=> {
    try{
      const res = await examList({...query, ...list})
      console.log(res)
      setData(res)
    }catch(e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    getExamList()
  },[query, list])

  const columns: TableProps<ExamListItem>['columns'] = [
    {
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'start',
      align: 'center',
      render: (_,record) => (
        editRowId === record._id ? <Input value={editName} size="small" onChange={e=>setEditName(e.target.value)} /> : record.name
      )
    },
    {
      title: '科目类型',
      dataIndex: 'classify',
      key: 'classify',
      align: 'center',
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (_,record) => new Date(record.createdAt).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'end',
      render: (_, record) => (
        editRowId !== record._id ? <Space size = 'small'>
          <Button size = 'small' type='primary' onClick = {()=>handleEdit(record)}>编辑</Button>
          <Popconfirm
            title = '删除用户'
            description = {`确定删除用户${record.name}吗?`}
            onConfirm = {confirm}
            onCancel = {cancel}
            okText = '确定'
            cancelText = '取消'
          >
            <Button size = 'small' type='primary' danger onClick = {()=>setId(record._id)}>删除</Button>
          </Popconfirm>
          <Button size = 'small' onClick={()=>{
            showDrawer()
            ExamDetail(record._id)
          }}>预览试卷</Button>
        </Space> : 
          <Space>
            <Button color='primary' variant='text' size='small' onClick={()=>ExamEdit(record._id)}>确认修改</Button>
            <Button color='danger' variant='text' size='small' onClick={()=>setEditRowId(null)}>取消</Button>
          </Space>
      ),
    },
  ]
  // 试卷删除
  const ExamRemove = async (id:string)=> {
    try{
      const res = await examRemove(id)
      console.log(res)
      if(res.code === API_CODE.SUCCESS){
        message.success('试卷删除成功')
        getExamList()
      }else{
        message.error(res.msg)
      }
    }catch(e){
      console.log(e)
    }
  }

  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    ExamRemove(id)
  }

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    message.error('取消删除')
  }

  const handleEdit = (record: ExamListItem) => {
    setEditRowId(record._id)
    setEditName(record.name)
  }
  // 试卷修改
  const ExamEdit = async (id:string) => {
    try{
      const res = await examUpdata({
        id: id,
        name: editName
      })
      if(res.code === API_CODE.SUCCESS){
        message.success('修改成功')
        setEditRowId(null)
        getExamList()
      }else{
        message.error(res.msg)
      }
    }catch(e){
      console.log(e)
    }
  }

  const showDrawer = () => {
    setOpen(true)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const onClose = () => {
    setOpen(false)
  }

  // 试卷详情
  const ExamDetail = async (id:string) => {
    try{
      const res = await examDetail(id)
      console.log(res)
      if(res.code == API_CODE.SUCCESS){
        setExamDeta(res.data)
      }else{
        message.error(res.msg)
      }
    }catch(e){
      console.log(e)
    }
  }

  // 导出PDF
  const exportPDF = async () => {
    if (!examRef.current) return
    
    try {
      message.loading('正在生成PDF...', 0)
      
      // 使用html2canvas将DOM转换为canvas
      const canvas = await html2canvas(examRef.current, {
        scale: 2, // 提高清晰度
        useCORS: true, // 允许跨域图片
        logging: false
      })
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210 // A4宽度
      const pageHeight = 297 // A4高度
      const imgHeight = canvas.height * imgWidth / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      // 添加图片到PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      )
      
      heightLeft -= pageHeight
      
      // 处理多页情况
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        )
        heightLeft -= pageHeight
      }
      
      // 保存PDF
      pdf.save(`${examDeta?.name || '试卷'}.pdf`)
      message.success('PDF导出成功')
    } catch (error) {
      console.error('导出PDF失败:', error)
      message.error('PDF导出失败')
    } finally {
      message.destroy()
    }
  }

  // 导出Excel
  const exportExcel = async () => {
    try {
      message.loading('正在导出Excel...', 0)
      
      // 获取所有数据（不分页）
      const res = await examList({ page: 1, pagesize: 9999 })
      const examData = res?.data?.list || []
      
      if (examData.length === 0) {
        message.error('没有数据可以导出')
        return
      }
      
      // 准备Excel数据
      const excelData = examData.map(exam => ({
        '试卷名称': exam.name,
        '科目': exam.classify,
        '总分': exam.totalScore,
        '创建人': exam.creator,
        '创建时间': new Date(exam.createdAt).toLocaleString()
      }))
      
      // 创建工作表
      const worksheet = XLSX.utils.json_to_sheet(excelData)
      
      // 创建工作簿
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '试卷列表')
      
      // 导出Excel文件
      XLSX.writeFile(workbook, '试卷列表.xlsx')
      
      message.success('Excel导出成功')
    } catch (error) {
      console.error('导出Excel失败:', error)
      message.error('Excel导出失败')
    } finally {
      message.destroy()
    }
  }

  const filterSearch = (list: ExamSearch) => {
    setList(list)
    setQuery({
      ...query,
      page: 1
    })
  }

  return (
    <div>
      <Search 
        onFilterSearch = {filterSearch}
      />
      <Space style={{marginBottom: '10px'}}>
        <Button onClick={()=>navigate('/paper/create-paper')} type="primary">创建试卷</Button>
        <Button color="primary" variant="outlined" onClick={exportExcel}>导出excel</Button>
      </Space>
      <Table<ExamListItem>
        columns={columns} 
        dataSource={data?.data?.list || []} 
        rowKey={row => row._id}
        scroll={{ x: 1200 }}
        size="small"
        pagination = {{
          current: query.page,
          pageSize: query.pagesize,
          total: data?.data.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`,
          pageSizeOptions: [5, 10, 15, 20],
          onChange: (page, pagesize) => {
            setQuery({
              page,
              pagesize
            })
          },
          locale: {
            jump_to: '跳至', // 前缀文字
            page: '页',       // 输入框后缀文字
            items_per_page: '条/页'
          }
        }}
      />
      <Drawer
        title="试卷预览"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
        size="large"
        loading={loading}
        style = {{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        extra = {
          <Space>
            <Button color="primary" variant="outlined" onClick={exportPDF}>导出PDF</Button>
            <Button type="primary" onClick={()=>onClose()}>OK</Button>
          </Space>
        }
      >
        <div className={style.exam} ref={examRef}>
          <h2>{examDeta?.name}</h2>
          <p className={style.classify}>科目: {examDeta?.classify}</p>
          {singleChoice.length > 0 && <div className={style.singleChoice}>
            <p className={style.single}>单选题</p>
            {singleChoice.map((v,i)=>
              <div className={style.singleChoice_item} key={v?._id}>
                <p className={style.topic}>{i + 1}. {v?.question}</p>
                <p className={style.options}>
                  {v?.options.map((item, idx)=>
                    <span key={idx}>{option[idx]}. {item}</span>
                  )}
                </p>
              </div>
            )}
          </div>}
          {multipleChoice.length > 0 && <div className={style.singleChoice}>
            <p className={style.single}>多选题</p>
            {multipleChoice.map((v,i)=>
              <div className={style.singleChoice_item} key={v?._id}>
                <p className={style.topic}>{i + 1}. {v?.question}</p>
                <p className={style.options}>
                  {v?.options.map((item, idx)=>
                    <span key={idx}>{option[idx]}. {item}</span>
                  )}
                </p>
              </div>
            )}
          </div>}
          {estimate.length > 0 && <div className={style.singleChoice}>
            <p className={style.single}>判断题</p>
            {estimate.map((v,i)=>
              <div className={style.singleChoice_item} key={v?._id}>
                <p className={style.topic}>{i + 1}. {v?.question}</p>
                <p className={style.options}>
                  {v?.options.map((item, idx)=>
                    <span key={idx}>{option[idx]}. {item}</span>
                  )}
                </p>
              </div>
            )}
          </div>}
          {((examDeta?.questions || []).length === 0 || examDeta?.questions.filter(v=>v === null).length === examDeta?.questions.length) && 
            <div className={style.hint}>暂无题目</div>
          }
        </div>
      </Drawer>
    </div>
  )
}

export default ExerciseBank