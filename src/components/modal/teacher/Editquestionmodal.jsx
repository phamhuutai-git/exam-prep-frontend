// import { useEffect } from "react";
// import { Modal, Form, Input, Select, Row, Col, Checkbox, Space } from "antd";

// const CATEGORIES = ["Java", "Spring", "SQL", "HTML", "JavaScript"];
// const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
// const ANSWER_LABELS = ["A", "B", "C", "D"];

// export default function EditQuestionModal({
//   open,
//   question,
//   onCancel,
//   onSave,
// }) {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (question) {
//       // Flatten answers array thành các field riêng để setFieldsValue
//       const answerFields = {};
//       if (question.answers) {
//         question.answers.forEach(({ label, content, isCorrect }) => {
//           answerFields[`answer_${label}`] = content;
//           answerFields[`correct_${label}`] = isCorrect;
//         });
//       }

//       form.setFieldsValue({
//         content: question.content,
//         difficulty: question.difficulty,
//         category: question.category,
//         ...answerFields,
//       });
//     }
//   }, [question, form]);

//   const handleOk = () => form.submit();

//   const handleFinish = (values) => {
//     const answers = ANSWER_LABELS.map((label) => ({
//       label,
//       content: values[`answer_${label}`] || "",
//       isCorrect: values[`correct_${label}`] || false,
//     }));

//     const payload = {
//       content: values.content,
//       difficulty: values.difficulty,
//       category: values.category,
//       answers,
//     };

//     onSave(payload);
//     form.resetFields();
//   };

//   const handleCancel = () => {
//     form.resetFields();
//     onCancel();
//   };

//   return (
//     <Modal
//       title="Edit Question"
//       open={open}
//       onCancel={handleCancel}
//       onOk={handleOk}
//       okText="Save"
//       destroyOnClose
//       width={600}
//     >
//       <Form form={form} layout="vertical" onFinish={handleFinish}>
//         {/* Nội dung câu hỏi */}
//         <Form.Item
//           label="Question"
//           name="content"
//           rules={[{ required: true, message: "Please enter question content" }]}
//         >
//           <Input.TextArea rows={3} />
//         </Form.Item>

//         {/* Difficulty & Category */}
//         <Row gutter={12}>
//           <Col span={12}>
//             <Form.Item
//               label="Difficulty"
//               name="difficulty"
//               rules={[{ required: true, message: "Please select difficulty" }]}
//             >
//               <Select>
//                 {DIFFICULTIES.map((d) => (
//                   <Select.Option key={d}>{d}</Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               label="Category"
//               name="category"
//               rules={[{ required: true, message: "Please select category" }]}
//             >
//               <Select>
//                 {CATEGORIES.map((c) => (
//                   <Select.Option key={c}>{c}</Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* 4 đáp án */}
//         <Form.Item label="Answers">
//           <Space direction="vertical" style={{ width: "100%" }}>
//             {ANSWER_LABELS.map((label) => (
//               <Row key={label} gutter={8} align="middle">
//                 {/* Checkbox đáp án đúng */}
//                 <Col flex="none">
//                   <Form.Item
//                     name={`correct_${label}`}
//                     valuePropName="checked"
//                     style={{ marginBottom: 0 }}
//                   >
//                     <Checkbox />
//                   </Form.Item>
//                 </Col>

//                 {/* Label A / B / C / D */}
//                 <Col flex="none">
//                   <span style={{ fontWeight: 600, minWidth: 20 }}>
//                     {label}.
//                   </span>
//                 </Col>

//                 {/* Ô nhập nội dung đáp án */}
//                 <Col flex="auto">
//                   <Form.Item
//                     name={`answer_${label}`}
//                     rules={[
//                       {
//                         required: true,
//                         message: `Please enter answer ${label}`,
//                       },
//                     ]}
//                     style={{ marginBottom: 0 }}
//                   >
//                     <Input placeholder={`Answer ${label}`} />
//                   </Form.Item>
//                 </Col>
//               </Row>
//             ))}
//           </Space>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// }
import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Space,
  message,
} from "antd";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const ANSWER_LABELS = ["A", "B", "C", "D"];

export default function EditQuestionModal({
  open,
  question,
  categories,
  onCancel,
  onSave,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (question && categories.length > 0) {
      const answerFields = {};

      if (question.answers) {
        question.answers.forEach((answer, index) => {
          const label = ANSWER_LABELS[index];
          answerFields[`answer_${label}`] = answer.content;
          answerFields[`correct_${label}`] = answer.isCorrect;
        });
      }

      const category = categories.find((c) => c.name === question.category);

      form.setFieldsValue({
        content: question.content,
        difficulty: question.difficulty,
        categoryId: category?.id,
        ...answerFields,
      });
    }
  }, [question, categories, form]);

  const handleOk = () => form.submit();

  const handleFinish = (values) => {
    const answers = ANSWER_LABELS.map((label) => ({
      content: values[`answer_${label}`],
      isCorrect: values[`correct_${label}`] || false,
    }));

    if (!answers.some((a) => a.isCorrect)) {
      message.error("Please select at least one correct answer");
      return;
    }

    const payload = {
      content: values.content,
      difficulty: values.difficulty,
      categoryId: values.categoryId,
      answers,
    };

    onSave(payload);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Question"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Save"
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Question" name="content" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Difficulty"
              name="difficulty"
              rules={[{ required: true }]}
            >
              <Select>
                {DIFFICULTIES.map((d) => (
                  <Select.Option key={d} value={d}>
                    {d}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true }]}
            >
              <Select>
                {categories.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Answers">
          <Space direction="vertical" style={{ width: "100%" }}>
            {ANSWER_LABELS.map((label) => (
              <Row key={label} gutter={8} align="middle">
                <Col flex="none">
                  <Form.Item
                    name={`correct_${label}`}
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Checkbox />
                  </Form.Item>
                </Col>

                <Col flex="none">
                  <span style={{ fontWeight: 600 }}>{label}.</span>
                </Col>

                <Col flex="auto">
                  <Form.Item
                    name={`answer_${label}`}
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder={`Answer ${label}`} />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
