# Copilot Instructions for Love App

## Project Overview

"App Tình Iu" là ứng dụng tình yêu dành cho các cặp đôi Việt Nam, được xây dựng với React + Vite, tích hợp Firebase realtime và hỗ trợ PWA. Ứng dụng bao gồm 5 module chính theo bản thiết kế:

1. **LOVE COUNTER** - Đếm ngày yêu, nhắc nhở kỷ niệm ✅
2. **WISHLIST** - Danh sách mong muốn với tính năng random 🔄
3. **OUR MEMORIES** - Kho ảnh chung và check-in hàng ngày ⏳
4. **LOVE LETTER** - Thư tình với tính năng hẹn giờ ⏳
5. **LOVE VOUCHER** - Voucher thưởng phạt tùy chỉnh ⏳

## Architecture & Current State

### Implemented Components

- **[LoveCounter](src/components/LoveCounter.jsx)** ✅ - Tính ngày yêu, nhận prop `startDate` format 'YYYY-MM-DD'
- **[Wishlist](src/components/Wishlist.jsx)** 🔄 - Firebase realtime với random picker, cần hoàn thiện surprise mode

### Planned Components (Chưa implement)

- **OurMemories** - Photo gallery + daily check-in với random ảnh cũ
- **LoveLetter** - Viết thư hẹn giờ, tags cảm xúc (BUỒN/VUI/ĐỘNG VIÊN)
- **LoveVoucher** - Tạo voucher có HSD, liên kết database wishlist

### Firebase Setup

⚠️ **Critical Issue**: File [firebase.js](src/firebase.js) thiếu Firestore export:

```javascript
// Add these imports and export to firebase.js
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);
```

## Development Workflows

### Commands

- `npm run dev` - Vite dev server với HMR
- `npm run build` - Production build cho PWA
- `npm run lint` - ESLint code checking
- `npm run preview` - Preview build trước khi deploy

### Firebase Collections Structure

- **`wishlist`** - `{ name: string, status: "pending", createdAt: Date }`
- **`memories`** (planned) - `{ imageUrl: string, date: Date, caption: string }`
- **`letters`** (planned) - `{ content: string, deliveryDate: Date, tag: string, isRead: boolean }`
- **`vouchers`** (planned) - `{ title: string, expiryDate: Date, isUsed: boolean, linkedWishlistId?: string }`

### Key Development Patterns

- Real-time listeners với `onSnapshot()` cho UI sync tự động
- Component state quản lý bằng React hooks
- Firebase operations luôn có error handling

## Code Conventions & Patterns

### 🎨 Styling System

- **Inline styles objects** - Không dùng CSS classes, tất cả styles định nghĩa trong JS
- **Love theme colors**: `#ff9a9e`, `#fecfef`, `#ff7eb3` (pink gradients)
- **Card design**: Border-radius 15-30px, soft shadows, gradient backgrounds
- **Responsive**: Mobile-first design vì couple thường dùng điện thoại

### 📝 Component Template

```jsx
const ComponentName = ({ props }) => {
  const [state, setState] = useState(initial);

  useEffect(() => {
    // Firebase realtime listeners hoặc calculations
  }, []);

  return <div style={styles.container}>...</div>;
};

const styles = {
  // Styles object luôn ở cuối component
  container: {
    /* love theme gradient */
  },
};
```

### 🌏 Vietnamese Context

- **UI text**: 100% tiếng Việt, ngôn từ tình cảm, cute
- **Comments**: Mix Vietnamese/English, ưu tiên Vietnamese cho business logic
- **Date format**: DD/MM/YYYY theo chuẩn Việt Nam
- **Special occasions**: Tết, Valentine, anniversaries quan trọng

## Feature Implementation Roadmap

### 🎯 Next Priority Features

1. **Surprise Mode cho Wishlist** - Toggle ẩn/hiện items để tạo surprise
2. **OurMemories Module** - Photo gallery + daily mood check-in
3. **LoveLetter với scheduled delivery** - Viết thư hẹn giờ gửi
4. **LoveVoucher system** - Tạo voucher rewards có thể redeem

### 📱 PWA Configuration

- **App name**: "App Tình Iu"
- **Theme color**: `#ff69b4` (pink)
- **Missing icons**: Cần `love-app-icon-192x192.png` và `love-app-icon-512x512.png` trong `/public`
- **Auto-update**: Service worker tự động cập nhật

### 🔒 Security & Performance

- **Firebase rules**: Production config exposed, cần implement Firestore security rules
- **Image optimization**: Khi thêm memories, cần compress images
- **Offline support**: PWA cần cache strategy cho romantic moments không mất mạng

## Critical Development Notes

- **[App.jsx](src/App.jsx)**: Hiện chỉ render LoveCounter với hardcode `startDate="2026-01-16"`
- **Missing Firebase export**: Phải fix trước khi code Wishlist features
- **Component pattern**: Mọi tính năng mới follow template trên với love theme colors
- **Data structure**: Thiết kế collections Firebase theo planned structure để support tất cả 5 modules
