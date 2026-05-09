import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../../services/authService";
import { CloseOutlined } from "@ant-design/icons";
import "../../assets/styles/ResetPassword.css";

const ResetPasswordNewPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOtp");
    if (!email || !otp) {
      toast.error("Vui lòng xác thực OTP trước khi nhập mật khẩu mới!");
      navigate("/reset-password");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOtp");

    try {
      const res = await resetPasswordApi({
        email,
        otp,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      toast.success(res.data.message || "Đặt lại mật khẩu thành công!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đặt lại mật khẩu thất bại!");
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container">
        <div className="close-btn" onClick={() => navigate("/")}> 
          <CloseOutlined />
        </div>
        <div className="reset-password-header">
          <h2>Nhập mật khẩu mới</h2>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          className="reset-password-form"
        >
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Lưu mật khẩu mới
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordNewPassword;
