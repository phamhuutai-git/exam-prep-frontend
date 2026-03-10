// modal Quên mật khẩu
import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Quenmatkhau = ({ open, onClose }) => {
  const navigate = useNavigate();
  const handleForgotPassword = (values) => {
    console.log("Email:", values.email)
    localStorage.setItem('resetEmail', values.email);
    setTimeout(() => {
      toast.success("OTP đã được gửi tới email!");
      onClose();
      // chuyển sang trang reset password
      navigate("/reset-password");
    }, 1000);
  };
  return (
    <Modal
      title="Quên mật khẩu"
      open={open}
      footer={null}
      onCancel={onClose}
        style={{ top: 220 }}
    >
      <Form layout="vertical" onFinish={handleForgotPassword}>
        
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <Input
            prefix={<FontAwesomeIcon icon={faEnvelope} />}
            placeholder="Nhập email của bạn"
            size="large"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
        >
          Gửi OTP
        </Button>

      </Form>
    </Modal>
  );
};

export default Quenmatkhau;