# Bàn Ăn – Ứng dụng quản lý nhà hàng

Bài làm Đề số 4 môn **Phát triển ứng dụng di động đa nền tảng** (HVCNBCVT).
Project được tạo bằng **React Native CLI** (không dùng Expo).

## Chức năng

- **Thực đơn:** nhóm món theo 4 loại, hiển thị giá, bật/tắt còn món, thêm/sửa/xoá món.
- **Kiểm tra dữ liệu:** tên món bắt buộc và không trùng (không phân biệt hoa/thường), giá là bội số của 1.000 đ.
- **Sơ đồ bàn:** 10 bàn dạng lưới, phân biệt bàn trống và bàn có khách.
- **Gọi món:** tăng/giảm số lượng, tạm tính cập nhật ngay, mỗi bàn chỉ có một hoá đơn đang phục vụ.
- **Thanh toán:** chi tiết từng món, tạm tính, VAT 8%, tổng cộng, tiền khách đưa và tiền thừa.
- **Lưu trữ:** thực đơn và hoá đơn được lưu bằng AsyncStorage.

## Công nghệ

- React Native CLI 0.88 (TypeScript)
- React Navigation (native stack)
- AsyncStorage
- Không dùng thư viện UI dựng sẵn

## Chạy ứng dụng

```bash
npm install
npx react-native run-android
```

Nếu đang phát triển, chạy Metro trước:

```bash
npx react-native start
```

Với iOS (macOS):

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## Cấu trúc chính

```
src/
  components/     # Button, Icon, Header, EmptyState, QuantityStepper...
  data/           # Dữ liệu mẫu (12 món, 3 hoá đơn đang phục vụ)
  navigation/     # Khai báo stack và kiểu tham số điều hướng
  screens/        # Menu, DishForm, Tables, Order, Payment
  storage/        # Đọc/ghi AsyncStorage
  store/          # RestaurantContext: state và nghiệp vụ
  theme/          # Màu sắc, chữ, khoảng cách, bóng đổ dùng chung
  utils/          # Định dạng tiền/ngày giờ, tính tiền hoá đơn
```

## Ghi chú

- Lần chạy đầu tiên ứng dụng tự tạo 12 món thuộc đủ 4 loại và 3 hoá đơn đang phục vụ.
- Muốn chạy lại dữ liệu mẫu: gỡ ứng dụng khỏi máy/emulator rồi cài lại (hoặc xoá dữ liệu ứng dụng trong Cài đặt).
- Món đang nằm trong hoá đơn “Đang phục vụ” sẽ không thể xoá cho đến khi thanh toán hoặc bỏ món khỏi hoá đơn.
