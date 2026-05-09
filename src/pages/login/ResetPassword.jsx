import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/ResetPassword.css";
import { CloseOutlined } from "@ant-design/icons";
const ResetPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Vui lòng nhập email trước khi xác thực OTP!");
      navigate("/");
    }
  }, [navigate]);
  const onFinish = async (values) => {
    const { otp } = values;
    localStorage.setItem("resetOtp", otp);
    toast.success("OTP đã được xác nhận. Vui lòng nhập mật khẩu mới.");
    navigate("/reset-password/new");
  };
  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container">
        <div className="close-btn" onClick={() => navigate("/")}>
          <CloseOutlined />
        </div>
        <div className="reset-password-header">
          <h2>Xác thực mã OTP</h2>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          className="reset-password-form"
        >
          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập mã OTP" },
              { len: 6, message: "OTP phải gồm 6 ký tự" },
              { pattern: /^\d{6}$/, message: "OTP chỉ gồm chữ số" },
            ]}
          >
            <Input placeholder="Nhập mã OTP 6 chữ số" maxLength={6} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Xác nhận OTP
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default ResetPassword;