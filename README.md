Mock96_Team1_Frontend

1. Mô tả chung Đây là file để mô tả project. bao gồm:
 - cấu trúc project
 - cách khởi động project
   
2. Cách khởi động project
 - pull code mới nhất từ nhánh dev về máy local
 - Cài đặt dependencies: Chạy lệnh sau để cài thư viện cần thiết: npm install
 - Chạy project ở môi trường local: npm run dev
 - Sau đó mở trình duyệt tại: http://localhost:5173/
   (hoặc port được hiển thị trên terminal)

3. Tài khoản đăng nhập để test tính năng
 - sau khi đăng nhập, sẽ phân quyền người dùng theo role "admin, teacher, sudent"
 - tài khoản đăng nhập cho từng role
   + admin: admin1 / 1234
   + teacher: teacher1 / 1234
   + student: student1 / 1234
 - với tài khoản admin, sẽ có các chức năng như sau:
   + quản lý tài khoản người dùng (xem danh sách, thêm, sửa)
   + quản lý lớp học (xem danh sách, thêm, sửa, xóa, gán giáo viên, học sinh cho lớp)
 - với tài khoản teacher sẽ có các chức năng như sau:
   + quản lý đề thi (xem danh sách, thêm, sửa, xóa, xem chi tiết, gán đề thi cho lớp)
   + quản lý câu hỏi (xem danh sách, thêm, sửa, xóa, xem chi tiết, import, export theo file excel)
   + quản lý điểm của học sinh theo đề thi (xem danh sách, xem chi tiết)
 - với tài khoản student, sẽ có các chức năng như sau:
   + xem danh sách đề thi thật, đề luyện tập theo lớp
   + làm bài thi thật, làm bài luyện tập
   + xem lại lịch sử thi, lịch sử luyện tập
   (chú ý: chỉ tài khoản học sinh có trong lớp học mới có thể đăng nhập vào hệ thống)
