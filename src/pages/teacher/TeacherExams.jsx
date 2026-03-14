import { useState, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  Card,
  message,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ExamPreviewModal from "../../components/modal/teacher/ExamPreviewModal";
import ExamFormModal from "../../components/modal/teacher/ExamFormModal";
import examService from "../../services/teacher/examService";
const { Title, Text } = Typography;
const { Option } = Select;

const CATEGORIES = ["Java", "Spring", "SQL", "HTML", "JavaScript"];

const INITIAL_EXAMS = [
  {
    id: 1,
    code: "EX001",
    title: "Java Basic Test",
    duration: 30,
    category: "Java",
    createdDate: "2024-03-01",
    questionIds: [1, 2],
  },
  {
    id: 2,
    code: "EX002",
    title: "Spring Test",
    duration: 40,
    category: "Spring",
    createdDate: "2024-03-02",
    questionIds: [3],
  },
  {
    id: 3,
    code: "EX003",
    title: "SQL Test",
    duration: 30,
    category: "SQL",
    createdDate: "2024-03-03",
    questionIds: [4],
  },
  {
    id: 4,
    code: "EX004",
    title: "HTML Test",
    duration: 20,
    category: "HTML",
    createdDate: "2024-03-04",
    questionIds: [5],
  },
  {
    id: 5,
    code: "EX005",
    title: "JS Test",
    duration: 25,
    category: "JavaScript",
    createdDate: "2024-03-05",
    questionIds: [],
  },
];

export default function TeacherExamManagement() {
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const filtered = useMemo(() => {
    let d = exams;
    if (search)
      d = d.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.code.toLowerCase().includes(search.toLowerCase()),
      );
    if (catFilter) d = d.filter((e) => e.category === catFilter);
    return d;
  }, [exams, search, catFilter]);

  const handleSave = (form) => {
    if (editTarget && editTarget !== "new") {
      setExams((p) =>
        p.map((e) => (e.id === editTarget.id ? { ...e, ...form } : e)),
      );
      messageApi.success("Đã cập nhật đề thi");
    } else {
      setExams((p) => [
        ...p,
        {
          id: Date.now(),
          ...form,
          creator: "teacher1",
          createdDate: new Date().toISOString().slice(0, 10),
        },
      ]);
      messageApi.success("Đã tạo đề thi mới");
    }
    setEditTarget(null);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa đề thi này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setExams((p) => p.filter((e) => e.id !== id));
        messageApi.success("Đã xóa đề thi");
      },
    });
  };

  const columns = [
    {
      title: "Mã đề",
      dataIndex: "code",
      width: 90,
      render: (v) => (
        <Text code style={{ fontSize: 11 }}>
          {v}
        </Text>
      ),
    },
    {
      title: "Tên đề thi",
      dataIndex: "title",
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 110,
    },
    { title: "Phút", dataIndex: "duration", width: 70, align: "center" },
    {
      title: "Câu hỏi",
      dataIndex: "questionIds",
      width: 80,
      align: "center",
      render: (v) => v.length,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      width: 110,
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      width: 160,
      align: "center",
      render: (_, exam) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setPreviewTarget(exam)}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => setEditTarget(exam)}
          >
            Sửa
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(exam.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      {contextHolder}

      <ExamPreviewModal
        exam={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />
      {editTarget && (
        <ExamFormModal
          exam={editTarget === "new" ? null : editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Quản lý đề thi
            </Title>
            <Text type="secondary">Tạo, chỉnh sửa và quản lý đề thi</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setEditTarget("new")}
          >
            Tạo đề thi
          </Button>
        </div>

        <Card style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm tên, mã đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
            <Select
              value={catFilter}
              onChange={setCatFilter}
              style={{ width: 160 }}
              placeholder="Tất cả danh mục"
              allowClear
            >
              {CATEGORIES.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Space>
        </Card>

        <Card>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            size="small"
            pagination={false}
            footer={() => (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Hiển thị {filtered.length} / {exams.length} đề thi
              </Text>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
// import { useState, useMemo } from "react";
// import { useEffect } from "react";
// import {
//   Table,
//   Button,
//   Input,
//   Select,
//   Tag,
//   Modal,
//   Space,
//   Typography,
//   Statistic,
//   Row,
//   Col,
//   Card,
//   message,
// } from "antd";
// import {
//   PlusOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import ExamPreviewModal from "../../components/modal/teacher/ExamPreviewModal";
// import ExamFormModal from "../../components/modal/teacher/ExamFormModal";
// import examService from "../../services/teacher/examService";
// const { Title, Text } = Typography;
// const { Option } = Select;

// export default function TeacherExamManagement() {
//   const [exams, setExams] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const [search, setSearch] = useState("");
//   const [catFilter, setCatFilter] = useState("");

//   const [editTarget, setEditTarget] = useState(null);
//   const [previewTarget, setPreviewTarget] = useState(null);

//   const [messageApi, contextHolder] = message.useMessage();
//   const fetchExams = async () => {
//     try {
//       const res = await examService.getAllExams();

//       setExams(res.data.data.content);
//     } catch (error) {
//       messageApi.error("Không tải được danh sách đề thi");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await examService.getAllCategory();

//       setCategories(res.data.data);
//     } catch (error) {
//       messageApi.error("Không tải được danh mục");
//     }
//   };
//   useEffect(() => {
//     fetchExams();
//     fetchCategories();
//   }, []);
//   const filtered = useMemo(() => {
//     let d = exams;
//     if (search)
//       d = d.filter(
//         (e) =>
//           e.title.toLowerCase().includes(search.toLowerCase()) ||
//           e.code.toLowerCase().includes(search.toLowerCase()),
//       );
//     if (catFilter) d = d.filter((e) => e.category === catFilter);
//     return d;
//   }, [exams, search, catFilter]);

//   const handleSave = (form) => {
//     if (editTarget && editTarget !== "new") {
//       setExams((p) =>
//         p.map((e) => (e.id === editTarget.id ? { ...e, ...form } : e)),
//       );
//       messageApi.success("Đã cập nhật đề thi");
//     } else {
//       setExams((p) => [
//         ...p,
//         {
//           id: Date.now(),
//           ...form,
//           creator: "teacher1",
//           createdDate: new Date().toISOString().slice(0, 10),
//         },
//       ]);
//       messageApi.success("Đã tạo đề thi mới");
//     }
//     setEditTarget(null);
//   };

//   const handleDelete = (id) => {
//     Modal.confirm({
//       title: "Xác nhận xóa",
//       content: "Bạn có chắc muốn xóa đề thi này?",
//       okText: "Xóa",
//       okType: "danger",
//       cancelText: "Hủy",

//       async onOk() {
//         try {
//           await examService.deleteExam(id);

//           messageApi.success("Đã xóa đề thi");

//           // reload lại danh sách
//           fetchExams();
//         } catch (error) {
//           messageApi.error("Xóa đề thi thất bại");
//         }
//       },
//     });
//   };

//   const columns = [
//     {
//       title: "Mã đề",
//       dataIndex: "code",
//       width: 90,
//     },
//     {
//       title: "Tên đề thi",
//       dataIndex: "title",
//     },
//     {
//       title: "Danh mục",
//       dataIndex: "category",
//       width: 110,
//     },
//     { title: "Phút", dataIndex: "duration", width: 70, align: "center" },
//     {
//       title: "Câu hỏi",
//       dataIndex: "questionIds",
//       width: 80,
//       align: "center",
//       render: (v) => v.length,
//     },
//     {
//       title: "Ngày tạo",
//       dataIndex: "createdDate",
//       width: 110,
//     },
//     {
//       title: "Thao tác",
//       width: 160,
//       align: "center",
//       render: (_, exam) => (
//         <Space size={4}>
//           <Button
//             size="small"
//             icon={<EyeOutlined />}
//             onClick={() => setPreviewTarget(exam)}
//           >
//             Xem
//           </Button>
//           <Button
//             size="small"
//             icon={<EditOutlined />}
//             onClick={() => setEditTarget(exam)}
//           >
//             Sửa
//           </Button>
//           <Button
//             size="small"
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() => handleDelete(exam.id)}
//           >
//             Xóa
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
//       {contextHolder}

//       <ExamPreviewModal
//         exam={previewTarget}
//         onClose={() => setPreviewTarget(null)}
//       />
//       {editTarget && (
//         <ExamFormModal
//           exam={editTarget === "new" ? null : editTarget}
//           onClose={() => setEditTarget(null)}
//           onSave={handleSave}
//         />
//       )}

//       <div style={{ maxWidth: 1100, margin: "0 auto" }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 24,
//           }}
//         >
//           <div>
//             <Title level={4} style={{ margin: 0 }}>
//               Quản lý đề thi
//             </Title>
//             <Text type="secondary">Tạo, chỉnh sửa và quản lý đề thi</Text>
//           </div>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => setEditTarget("new")}
//           >
//             Tạo đề thi
//           </Button>
//         </div>

//         <Card style={{ marginBottom: 16 }}>
//           <Space wrap>
//             <Input
//               prefix={<SearchOutlined />}
//               placeholder="Tìm tên, mã đề..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{ width: 220 }}
//               allowClear
//             />
//             <Select
//               value={catFilter}
//               onChange={setCatFilter}
//               style={{ width: 160 }}
//               placeholder="Tất cả danh mục"
//               allowClear
//             >
//               {categories.map((c) => (
//                 <Option key={c.id} value={c.name}>
//                   {c.name}
//                 </Option>
//               ))}
//             </Select>
//           </Space>
//         </Card>

//         <Card>
//           <Table
//             columns={columns}
//             dataSource={filtered}
//             rowKey="id"
//             size="small"
//             pagination={false}
//             footer={() => (
//               <Text type="secondary" style={{ fontSize: 12 }}>
//                 Hiển thị {filtered.length} / {exams.length} đề thi
//               </Text>
//             )}
//           />
//         </Card>
//       </div>
//     </div>
//   );
// }
