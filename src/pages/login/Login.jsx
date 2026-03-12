import React from "react";
import { Form, Input, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";
import "../../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import Quenmatkhau from "../../components/modal/auth/Quenmatkhau";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { loginApi } from "../../services/authService";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [openForgot, setOpenForgot] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // LOGIN
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const res = await loginApi(values);

      const data = res.data.data;

      if (data.failCount > 0) {
        toast.warning(`Bạn đã nhập sai ${data.failCount} lần`);
      }
      // lưu token + role
      login(data.role, data.token, { username: data.username });

      toast.success("Đăng nhập thành công!");

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else if (data.role === "TEACHER") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Không thể kết nối server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* LEFT LOGIN */}
        <div className="login-box">
          <div className="login-header">
            <div className="logo-container">
              <img src={logo} alt="VTI Academy" className="logo" />
            </div>

            <h1>Chào mừng trở lại</h1>
            <p>Đăng nhập vào hệ thống quản lý</p>
          </div>

          <Form layout="vertical" className="login-form" onFinish={onFinish}>
            <Form.Item
              label="Email hoặc Username"
              name="emailOrUsername"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email hoặc username",
                },
              ]}
            >
              <Input
                prefix={<FontAwesomeIcon icon={faUser} />}
                placeholder="Email hoặc username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                prefix={<FontAwesomeIcon icon={faLock} />}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>
            <div className="form-options">
              <a
                className="forgot-password"
                onClick={() => setOpenForgot(true)}
              >
                Quên mật khẩu?
              </a>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Đăng nhập
            </Button>
          </Form>

          <div className="login-footer">
            <p>© 2026 VTI Academy. All rights reserved.</p>
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="info-side">
          <div className="info-content">
            <h2>Hệ thống Quiz</h2>
            <p>Quản lý kỳ thi và kết quả học tập một cách chuyên nghiệp</p>
          </div>
        </div>
      </div>
      {/* MODAL QUÊN MẬT KHẨU */}
      <Quenmatkhau open={openForgot} onClose={() => setOpenForgot(false)} />
    </div>
  );
};

export default Login;
